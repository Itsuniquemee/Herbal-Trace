console.log('🚀 Starting Herbal Trace Backend...');
console.log('Node version:', process.version);
console.log('Environment:', process.env.NODE_ENV);

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
const session = require('express-session');
const RedisStore = require('connect-redis').default;
const Redis = require('ioredis');
const path = require('path');

// Import configuration and utilities
const config = require('./config/config');
const logger = require('./utils/logger');
const { errorHandler, notFound } = require('./middleware/errorMiddleware');
const securityMiddleware = require('./middleware/securityMiddleware');
const auditMiddleware = require('./middleware/auditMiddleware');

// Import blockchain services
const BlockchainService = require('./services/BlockchainService');
const FabricNetworkService = require('./services/FabricNetworkService');

// Import routes
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const blockchainRoutes = require('./routes/blockchainRoutes');
const collectionRoutes = require('./routes/collectionRoutes');
const qualityRoutes = require('./routes/qualityRoutes');
const processingRoutes = require('./routes/processingRoutes');
const provenanceRoutes = require('./routes/provenanceRoutes');
const analyticsRoutes = require('./routes/analyticsRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const adminRoutes = require('./routes/adminRoutes');

// Initialize Express app
const app = express();

// Initialize Redis for session store and caching
let redis;
try {
  redis = new Redis(config.redis.url);
  redis.on('error', (err) => {
    logger.warn('Redis connection error:', err.message);
  });
  redis.on('connect', () => {
    logger.info('✅ Redis connected successfully');
  });
} catch (error) {
  logger.warn('Redis initialization failed, continuing without Redis:', error.message);
  redis = null;
}

// Trust proxy for rate limiting and security headers
app.set('trust proxy', config.server.trustProxy);

// Security Middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "data:", "https:"],
      scriptSrc: ["'self'"],
      connectSrc: ["'self'", "https://api.twilio.com"],
      frameSrc: ["'none'"],
      objectSrc: ["'none'"]
    }
  },
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true
  }
}));

// CORS Configuration
app.use(cors({
  origin: config.cors.origin,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

// Compression middleware
app.use(compression());

// Body parsing middleware
app.use(express.json({ 
  limit: '10mb',
  verify: (req, res, buf, encoding) => {
    // Store raw body for webhook verification
    req.rawBody = buf;
  }
}));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Data sanitization against NoSQL query injection
app.use(mongoSanitize());

// Request logging
app.use(morgan('combined', {
  stream: {
    write: (message) => logger.info(message.trim())
  }
}));

// Session configuration with Redis store
const sessionConfig = {
  secret: config.session.secret,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: config.server.env === 'production',
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  },
  name: 'herbaltrace.sid'
};

// Only add Redis store if Redis is available
if (redis) {
  sessionConfig.store = new RedisStore({ client: redis });
  logger.info('Session store: Redis');
} else {
  logger.warn('Session store: MemoryStore (not recommended for production)');
}

app.use(session(sessionConfig));

// Rate limiting
const limiter = rateLimit({
  windowMs: config.rateLimiting.windowMs,
  max: config.rateLimiting.maxRequests,
  message: {
    error: 'Too many requests from this IP, please try again later.',
    code: 'RATE_LIMIT_EXCEEDED'
  },
  standardHeaders: true,
  legacyHeaders: false,
  store: new rateLimit.MemoryStore(), // Use Redis store in production
  handler: (req, res) => {
    logger.warn(`Rate limit exceeded for IP: ${req.ip}`, {
      ip: req.ip,
      userAgent: req.get('User-Agent'),
      timestamp: new Date().toISOString()
    });
    res.status(429).json({
      error: 'Too many requests from this IP, please try again later.',
      code: 'RATE_LIMIT_EXCEEDED'
    });
  }
});

app.use('/api/', limiter);

// Custom security middleware
app.use(securityMiddleware);

// Audit logging middleware
app.use(auditMiddleware);

// Static file serving
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: config.server.env,
    version: process.env.npm_package_version || '1.0.0'
  });
});

// Blockchain network status
app.get('/api/blockchain/status', async (req, res) => {
  try {
    const status = await FabricNetworkService.getNetworkStatus();
    res.json({
      success: true,
      blockchain: status
    });
  } catch (error) {
    logger.error('Blockchain status check failed:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get blockchain status'
    });
  }
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/blockchain', blockchainRoutes);
app.use('/api/collections', collectionRoutes);
app.use('/api/quality', qualityRoutes);
app.use('/api/processing', processingRoutes);
app.use('/api/provenance', provenanceRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/admin', adminRoutes);

// Error handling middleware
app.use(notFound);
app.use(errorHandler);

// Initialize blockchain connection
const initializeBlockchain = async () => {
  try {
    logger.info('Initializing blockchain connection...');
    await FabricNetworkService.initializeNetwork();
    logger.info('✅ Blockchain connection initialized successfully');
  } catch (error) {
    logger.error('❌ Failed to initialize blockchain connection:', error);
    // Don't exit the process, just log the error
    // The application can still function with limited capabilities
  }
};

// Graceful shutdown handling
const gracefulShutdown = async (signal) => {
  logger.info(`Received ${signal}, shutting down gracefully...`);
  
  try {
    // Close Redis connection
    if (redis) {
      await redis.quit();
      logger.info('Redis connection closed');
    }
    
    // Close blockchain connections
    await FabricNetworkService.disconnect();
    logger.info('Blockchain connections closed');
    
    // Close HTTP server
    process.exit(0);
  } catch (error) {
    logger.error('Error during shutdown:', error);
    process.exit(1);
  }
};

// Handle shutdown signals
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

// Handle uncaught exceptions and rejections
process.on('uncaughtException', (error) => {
  logger.error('Uncaught Exception:', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

// Start server
const startServer = async () => {
  try {
    // Initialize blockchain connection
    await initializeBlockchain();
    
    const PORT = config.server.port;
    app.listen(PORT, () => {
      logger.info(`🚀 Herbal Trace Backend Server running on port ${PORT}`);
      logger.info(`📊 Environment: ${config.server.env}`);
      logger.info(`🔗 Blockchain: ${config.fabric.networkEnabled ? 'Enabled' : 'Disabled'}`);
      logger.info(`🔒 Security: Enhanced protection active`);
    });
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
};

// Export app for testing
module.exports = app;

// Start the server if this file is run directly
if (require.main === module) {
  startServer();
}