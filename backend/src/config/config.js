const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config();

const config = {
  server: {
    env: process.env.NODE_ENV || 'development',
    port: parseInt(process.env.PORT, 10) || 3001,
    apiVersion: process.env.API_VERSION || 'v1',
    trustProxy: process.env.TRUST_PROXY === 'true'
  },

  security: {
    jwtSecret: process.env.JWT_SECRET || 'your-super-secure-jwt-secret-key-change-this-in-production',
    jwtRefreshSecret: process.env.JWT_REFRESH_SECRET || 'your-super-secure-refresh-secret-key-change-this-in-production',
    jwtExpiry: process.env.JWT_EXPIRY || '15m',
    jwtRefreshExpiry: process.env.JWT_REFRESH_EXPIRY || '7d',
    bcryptSaltRounds: parseInt(process.env.BCRYPT_SALT_ROUNDS, 10) || 12,
    sessionSecret: process.env.SESSION_SECRET || 'your-super-secure-session-secret'
  },

  database: {
    url: process.env.DATABASE_URL || 'postgresql://username:password@localhost:5432/herbaltrace_db'
  },

  redis: {
    url: process.env.REDIS_URL || 'redis://localhost:6379'
  },

  firebase: {
    projectId: process.env.FIREBASE_PROJECT_ID,
    privateKeyId: process.env.FIREBASE_PRIVATE_KEY_ID,
    privateKey: process.env.FIREBASE_PRIVATE_KEY ? process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n') : null,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    clientId: process.env.FIREBASE_CLIENT_ID,
    authUri: process.env.FIREBASE_AUTH_URI,
    tokenUri: process.env.FIREBASE_TOKEN_URI
  },

  fabric: {
    networkEnabled: process.env.FABRIC_NETWORK_ENABLED === 'true',
    networkPath: process.env.FABRIC_NETWORK_PATH || '../network',
    walletPath: process.env.FABRIC_WALLET_PATH || './wallet',
    caUrl: process.env.FABRIC_CA_URL || 'https://localhost:7054',
    peerUrl: process.env.FABRIC_PEER_URL || 'grpc://localhost:7051',
    ordererUrl: process.env.FABRIC_ORDERER_URL || 'grpc://localhost:7050',
    channelName: process.env.FABRIC_CHANNEL_NAME || 'herbaltrace-channel',
    chaincodeName: process.env.FABRIC_CHAINCODE_NAME || 'herbaltrace',
    mspId: process.env.FABRIC_MSP_ID || 'FarmersCoopMSP',
    userId: process.env.FABRIC_USER_ID || 'appUser',
    
    // Connection profiles for different organizations
    organizations: {
      farmers: {
        mspId: 'FarmersCoopMSP',
        caUrl: 'https://localhost:7054',
        peers: ['peer0.farmers.herbaltrace.com', 'peer1.farmers.herbaltrace.com']
      },
      labs: {
        mspId: 'TestingLabsMSP',
        caUrl: 'https://localhost:8054',
        peers: ['peer0.labs.herbaltrace.com', 'peer1.labs.herbaltrace.com']
      },
      processors: {
        mspId: 'ProcessingFacilitiesMSP',
        caUrl: 'https://localhost:9054',
        peers: ['peer0.processors.herbaltrace.com', 'peer1.processors.herbaltrace.com']
      },
      manufacturers: {
        mspId: 'ManufacturersMSP',
        caUrl: 'https://localhost:10054',
        peers: ['peer0.manufacturers.herbaltrace.com', 'peer1.manufacturers.herbaltrace.com']
      }
    }
  },

  ethereum: {
    enabled: process.env.ETHEREUM_ENABLED === 'true',
    rpcUrl: process.env.ETHEREUM_RPC_URL,
    privateKey: process.env.ETHEREUM_PRIVATE_KEY,
    contractAddress: process.env.CONTRACT_ADDRESS,
    gasLimit: process.env.GAS_LIMIT || '300000',
    gasPrice: process.env.GAS_PRICE || '20000000000' // 20 gwei
  },

  email: {
    service: process.env.EMAIL_SERVICE || 'gmail',
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.EMAIL_PORT, 10) || 587,
    secure: process.env.EMAIL_SECURE === 'true',
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  },

  sms: {
    twilio: {
      accountSid: process.env.TWILIO_ACCOUNT_SID,
      authToken: process.env.TWILIO_AUTH_TOKEN,
      phoneNumber: process.env.TWILIO_PHONE_NUMBER
    }
  },

  rateLimiting: {
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS, 10) || 900000, // 15 minutes
    maxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS, 10) || 100,
    apiRateLimit: parseInt(process.env.API_RATE_LIMIT, 10) || 1000,
    apiWindowMs: parseInt(process.env.API_WINDOW_MS, 10) || 3600000 // 1 hour
  },

  cors: {
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000'
  },

  logging: {
    level: process.env.LOG_LEVEL || 'info',
    file: process.env.LOG_FILE || './logs/app.log',
    enableAuditLog: process.env.ENABLE_AUDIT_LOG === 'true',
    auditLogFile: process.env.AUDIT_LOG_FILE || './logs/audit.log'
  },

  upload: {
    maxFileSize: parseInt(process.env.MAX_FILE_SIZE, 10) || 10485760, // 10MB
    uploadPath: process.env.UPLOAD_PATH || './uploads',
    allowedFileTypes: (process.env.ALLOWED_FILE_TYPES || 'pdf,jpg,jpeg,png,doc,docx').split(',')
  },

  cache: {
    ttl: parseInt(process.env.CACHE_TTL, 10) || 3600, // 1 hour
    enabled: process.env.ENABLE_CACHE === 'true'
  },

  features: {
    swagger: process.env.ENABLE_SWAGGER === 'true',
    monitoring: process.env.ENABLE_MONITORING === 'true',
    blockchain: process.env.ENABLE_BLOCKCHAIN !== 'false'
  },

  otp: {
    length: 6,
    expiryMinutes: 10,
    maxAttempts: 3,
    algorithm: 'sha256',
    encoding: 'base32'
  },

  blockchain_networks: {
    hyperledger: {
      enabled: true,
      type: 'hyperledger-fabric'
    },
    ethereum: {
      enabled: process.env.ETHEREUM_ENABLED === 'true',
      type: 'ethereum'
    }
  },

  monitoring: {
    enabled: process.env.ENABLE_MONITORING === 'true',
    metricsPort: parseInt(process.env.METRICS_PORT, 10) || 9090,
    healthCheckInterval: parseInt(process.env.HEALTH_CHECK_INTERVAL, 10) || 30000 // 30 seconds
  }
};

// Validation
const requiredEnvVars = ['JWT_SECRET', 'DATABASE_URL'];

if (config.server.env === 'production') {
  requiredEnvVars.push(
    'JWT_REFRESH_SECRET',
    'SESSION_SECRET',
    'EMAIL_USER',
    'EMAIL_PASS'
  );
}

const missingEnvVars = requiredEnvVars.filter(envVar => !process.env[envVar]);

if (missingEnvVars.length > 0) {
  console.error('Missing required environment variables:', missingEnvVars);
  if (config.server.env === 'production') {
    process.exit(1);
  }
}

module.exports = config;