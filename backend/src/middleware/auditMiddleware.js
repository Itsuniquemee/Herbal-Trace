const logger = require('../utils/logger');

/**
 * Audit Middleware for Security Event Logging
 */
const auditMiddleware = (req, res, next) => {
  const startTime = Date.now();
  
  // Store original res.json to intercept responses
  const originalJson = res.json;
  
  res.json = function(data) {
    const duration = Date.now() - startTime;
    
    // Log API request with audit information
    logger.apiRequest(req, res, duration);
    
    // Audit sensitive operations
    const sensitiveOperations = [
      'POST', 'PUT', 'DELETE', 'PATCH'
    ];
    
    if (sensitiveOperations.includes(req.method)) {
      logger.audit('API_OPERATION', {
        method: req.method,
        path: req.path,
        userId: req.user ? req.user.id : 'anonymous',
        ip: req.ip,
        userAgent: req.get('User-Agent'),
        statusCode: res.statusCode,
        duration: `${duration}ms`,
        success: res.statusCode < 400
      });
    }
    
    // Call original json method
    return originalJson.call(this, data);
  };
  
  next();
};

module.exports = auditMiddleware;