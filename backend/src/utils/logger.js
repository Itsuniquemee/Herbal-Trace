const winston = require('winston');
const path = require('path');
const config = require('../config/config');

/**
 * Enhanced Winston Logger Configuration for Herbal Trace
 * Provides comprehensive logging with security audit trails
 */

// Create logs directory if it doesn't exist
const fs = require('fs');
const logsDir = path.dirname(config.logging.file);
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

// Custom log format
const logFormat = winston.format.combine(
  winston.format.timestamp({
    format: 'YYYY-MM-DD HH:mm:ss'
  }),
  winston.format.errors({ stack: true }),
  winston.format.json(),
  winston.format.printf(({ level, message, timestamp, ...meta }) => {
    let log = `${timestamp} [${level.toUpperCase()}]: ${message}`;
    
    if (Object.keys(meta).length > 0) {
      log += ` | ${JSON.stringify(meta)}`;
    }
    
    return log;
  })
);

// Security audit format
const auditFormat = winston.format.combine(
  winston.format.timestamp({
    format: 'YYYY-MM-DD HH:mm:ss'
  }),
  winston.format.json(),
  winston.format.printf(({ timestamp, level, message, ...meta }) => {
    return JSON.stringify({
      timestamp,
      level,
      event: message,
      metadata: meta,
      source: 'herbal-trace-backend'
    });
  })
);

// Create logger instance
const logger = winston.createLogger({
  level: config.logging.level,
  format: logFormat,
  defaultMeta: {
    service: 'herbal-trace-backend',
    version: process.env.npm_package_version || '1.0.0'
  },
  transports: [
    // Console transport for development
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple(),
        winston.format.printf(({ level, message, timestamp }) => {
          return `${timestamp} ${level}: ${message}`;
        })
      )
    }),
    
    // File transport for all logs
    new winston.transports.File({
      filename: config.logging.file,
      level: config.logging.level,
      maxsize: 10 * 1024 * 1024, // 10MB
      maxFiles: 5,
      tailable: true
    }),
    
    // Separate file for errors
    new winston.transports.File({
      filename: path.join(path.dirname(config.logging.file), 'error.log'),
      level: 'error',
      maxsize: 10 * 1024 * 1024, // 10MB
      maxFiles: 5,
      tailable: true
    })
  ],
  
  // Handle uncaught exceptions
  exceptionHandlers: [
    new winston.transports.File({
      filename: path.join(path.dirname(config.logging.file), 'exceptions.log'),
      maxsize: 10 * 1024 * 1024, // 10MB
      maxFiles: 3
    })
  ],
  
  // Handle unhandled promise rejections
  rejectionHandlers: [
    new winston.transports.File({
      filename: path.join(path.dirname(config.logging.file), 'rejections.log'),
      maxsize: 10 * 1024 * 1024, // 10MB
      maxFiles: 3
    })
  ]
});

// Create audit logger for security events
const auditLogger = winston.createLogger({
  level: 'info',
  format: auditFormat,
  transports: [
    new winston.transports.File({
      filename: config.logging.auditLogFile || path.join(path.dirname(config.logging.file), 'audit.log'),
      maxsize: 50 * 1024 * 1024, // 50MB
      maxFiles: 10,
      tailable: true
    })
  ]
});

// Enhanced logging methods
const enhancedLogger = {
  ...logger,
  
  // Security audit logging
  audit: (event, metadata = {}) => {
    const auditEvent = {
      event,
      timestamp: new Date().toISOString(),
      severity: 'info',
      ...metadata
    };
    
    auditLogger.info(event, auditEvent);
    
    // Also log to main logger if it's a critical security event
    if (metadata.severity === 'critical' || metadata.severity === 'high') {
      logger.warn(`SECURITY AUDIT: ${event}`, metadata);
    }
  },
  
  // Authentication event logging
  authEvent: (event, user, metadata = {}) => {
    const authMetadata = {
      userId: user.id || user.email || 'unknown',
      userRole: user.role || 'unknown',
      timestamp: new Date().toISOString(),
      ...metadata
    };
    
    enhancedLogger.audit(`AUTH_${event.toUpperCase()}`, authMetadata);
    logger.info(`Authentication: ${event}`, authMetadata);
  },
  
  // Blockchain transaction logging
  blockchain: (event, transactionData = {}) => {
    const blockchainMetadata = {
      transactionId: transactionData.txId || 'unknown',
      blockNumber: transactionData.blockNumber || 'unknown',
      chaincode: transactionData.chaincode || 'herbaltrace',
      timestamp: new Date().toISOString(),
      ...transactionData
    };
    
    logger.info(`Blockchain: ${event}`, blockchainMetadata);
    
    // Audit blockchain events
    if (event.includes('CREATE') || event.includes('UPDATE') || event.includes('DELETE')) {
      enhancedLogger.audit(`BLOCKCHAIN_${event.toUpperCase()}`, blockchainMetadata);
    }
  },
  
  // API request logging
  apiRequest: (req, res, duration) => {
    const requestMetadata = {
      method: req.method,
      url: req.originalUrl,
      userAgent: req.get('User-Agent'),
      ip: req.ip,
      userId: req.user ? req.user.id : 'anonymous',
      statusCode: res.statusCode,
      duration: `${duration}ms`,
      timestamp: new Date().toISOString()
    };
    
    // Log based on status code
    if (res.statusCode >= 400) {
      logger.warn('API Request Failed', requestMetadata);
      
      // Audit failed requests
      if (res.statusCode >= 500) {
        enhancedLogger.audit('API_SERVER_ERROR', requestMetadata);
      } else if (res.statusCode === 401 || res.statusCode === 403) {
        enhancedLogger.audit('API_UNAUTHORIZED_ACCESS', requestMetadata);
      }
    } else {
      logger.info('API Request', requestMetadata);
    }
  },
  
  // Security event logging
  security: (event, metadata = {}) => {
    const securityMetadata = {
      severity: metadata.severity || 'medium',
      timestamp: new Date().toISOString(),
      source: 'security-middleware',
      ...metadata
    };
    
    logger.warn(`SECURITY: ${event}`, securityMetadata);
    enhancedLogger.audit(`SECURITY_${event.toUpperCase()}`, securityMetadata);
  },
  
  // Performance monitoring
  performance: (operation, duration, metadata = {}) => {
    const perfMetadata = {
      operation,
      duration: `${duration}ms`,
      timestamp: new Date().toISOString(),
      ...metadata
    };
    
    // Log slow operations
    if (duration > 1000) { // > 1 second
      logger.warn(`Slow Operation: ${operation}`, perfMetadata);
    } else {
      logger.debug(`Performance: ${operation}`, perfMetadata);
    }
  },
  
  // Business logic events
  business: (event, data = {}) => {
    const businessMetadata = {
      event,
      timestamp: new Date().toISOString(),
      ...data
    };
    
    logger.info(`Business: ${event}`, businessMetadata);
    
    // Audit important business events
    const auditableEvents = ['ORDER_CREATED', 'PAYMENT_PROCESSED', 'USER_REGISTERED', 'PROFILE_UPDATED'];
    if (auditableEvents.includes(event.toUpperCase())) {
      enhancedLogger.audit(`BUSINESS_${event.toUpperCase()}`, businessMetadata);
    }
  }
};

// Add production-specific transports
if (config.server.env === 'production') {
  // Add additional transports for production (e.g., external logging services)
  // logger.add(new winston.transports.Http({
  //   host: 'logs.example.com',
  //   port: 80,
  //   path: '/logs'
  // }));
}

// Export both loggers
module.exports = enhancedLogger;
module.exports.auditLogger = auditLogger;