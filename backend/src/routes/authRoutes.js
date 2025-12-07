const express = require('express');
const { body, validationResult } = require('express-validator');
const rateLimit = require('express-rate-limit');
const authService = require('../services/AuthService');
const fabricNetworkService = require('../services/FabricNetworkService');
const logger = require('../utils/logger');
const { createValidator } = require('../middleware/securityMiddleware');

const router = express.Router();

/**
 * Enhanced Authentication Routes with OTP and Security Features
 */

// Rate limiting for authentication endpoints
const authRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 requests per windowMs
  message: {
    success: false,
    error: 'Too many authentication attempts, please try again later',
    code: 'AUTH_RATE_LIMIT'
  },
  standardHeaders: true,
  legacyHeaders: false
});

const otpRateLimit = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 3, // Limit OTP requests
  message: {
    success: false,
    error: 'Too many OTP requests, please try again later',
    code: 'OTP_RATE_LIMIT'
  }
});

// Validation middleware
const validateRegistration = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Valid email is required'),
  body('password')
    .isLength({ min: 8 })
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]/)
    .withMessage('Password must be at least 8 characters with uppercase, lowercase, number and special character'),
  body('firstName')
    .trim()
    .isLength({ min: 2, max: 50 })
    .matches(/^[a-zA-Z\\s]+$/)
    .withMessage('First name must be 2-50 characters and contain only letters'),
  body('lastName')
    .trim()
    .isLength({ min: 2, max: 50 })
    .matches(/^[a-zA-Z\\s]+$/)
    .withMessage('Last name must be 2-50 characters and contain only letters'),
  body('role')
    .isIn(['farmer', 'processor', 'lab', 'manufacturer', 'consumer'])
    .withMessage('Invalid role specified'),
  body('phone')
    .optional()
    .isMobilePhone()
    .withMessage('Valid phone number is required if provided')
];

const validateLogin = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Valid email is required'),
  body('password')
    .notEmpty()
    .withMessage('Password is required')
];

const validateOTP = [
  body('identifier')
    .notEmpty()
    .withMessage('Email or phone number is required'),
  body('otp')
    .isLength({ min: 6, max: 6 })
    .isNumeric()
    .withMessage('OTP must be 6 digits'),
  body('method')
    .isIn(['email', 'sms'])
    .withMessage('Method must be email or sms')
];

/**
 * @route POST /api/auth/register
 * @desc Register new user with email verification
 * @access Public
 */
router.post('/register', authRateLimit, validateRegistration, async (req, res) => {
  const startTime = Date.now();
  
  try {
    // Check validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      logger.security('REGISTRATION_VALIDATION_FAILED', {
        ip: req.ip,
        userAgent: req.get('User-Agent'),
        errors: errors.array(),
        severity: 'low'
      });
      
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: errors.array()
      });
    }

    const { email, password, firstName, lastName, role, phone } = req.body;

    // Check if user already exists (this would be a database check in real implementation)
    // For now, we'll assume Firebase handles this

    // Validate password strength
    const passwordValidation = authService.validatePasswordStrength(password);
    if (!passwordValidation.isValid) {
      return res.status(400).json({
        success: false,
        error: 'Password does not meet strength requirements',
        details: passwordValidation.errors
      });
    }

    // Hash password
    const hashedPassword = await authService.hashPassword(password);

    // Create user data
    const userData = {
      email,
      password: hashedPassword,
      firstName,
      lastName,
      role,
      phone: phone || '',
      verified: false,
      createdAt: new Date().toISOString()
    };

    // Generate registration OTP
    const otpResult = await authService.sendEmailOTP(email, 'registration');

    // Store user data temporarily (in production, save to database)
    // For now, we'll return success and expect frontend to handle verification

    logger.authEvent('USER_REGISTRATION_INITIATED', userData, {
      ip: req.ip,
      userAgent: req.get('User-Agent')
    });

    logger.performance('user_registration', Date.now() - startTime);

    res.status(201).json({
      success: true,
      message: 'Registration initiated. Please verify your email with the OTP sent.',
      data: {
        email: userData.email,
        otpSent: otpResult.success,
        expiresIn: otpResult.expiresIn,
        nextStep: 'verify-email'
      }
    });

  } catch (error) {
    logger.error('Registration failed:', {
      error: error.message,
      stack: error.stack,
      ip: req.ip,
      userAgent: req.get('User-Agent')
    });

    res.status(500).json({
      success: false,
      error: 'Registration failed',
      message: 'Internal server error'
    });
  }
});

/**
 * @route POST /api/auth/verify-email
 * @desc Verify email with OTP
 * @access Public
 */
router.post('/verify-email', otpRateLimit, validateOTP, async (req, res) => {
  const startTime = Date.now();
  
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: errors.array()
      });
    }

    const { identifier, otp } = req.body;

    // Verify OTP
    await authService.verifyOTP(identifier, otp, 'email', 'registration');

    // In a real implementation, you would:
    // 1. Update user's verified status in database
    // 2. Generate tokens
    // 3. Create blockchain identity if needed

    logger.authEvent('EMAIL_VERIFIED', { email: identifier }, {
      ip: req.ip,
      userAgent: req.get('User-Agent')
    });

    logger.performance('email_verification', Date.now() - startTime);

    res.json({
      success: true,
      message: 'Email verified successfully',
      data: {
        verified: true,
        nextStep: 'login'
      }
    });

  } catch (error) {
    logger.security('EMAIL_VERIFICATION_FAILED', {
      identifier: req.body.identifier,
      error: error.message,
      ip: req.ip,
      userAgent: req.get('User-Agent'),
      severity: 'medium'
    });

    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * @route POST /api/auth/login
 * @desc Login user with email/password
 * @access Public
 */
router.post('/login', authRateLimit, validateLogin, async (req, res) => {
  const startTime = Date.now();
  
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: errors.array()
      });
    }

    const { email, password } = req.body;

    // Check rate limiting
    try {
      authService.checkRateLimit(email);
    } catch (rateLimitError) {
      logger.security('LOGIN_RATE_LIMITED', {
        email,
        ip: req.ip,
        userAgent: req.get('User-Agent'),
        severity: 'medium'
      });
      
      return res.status(429).json({
        success: false,
        error: rateLimitError.message,
        code: 'RATE_LIMITED'
      });
    }

    // In a real implementation, fetch user from database
    // For now, we'll simulate user authentication
    
    // Mock user data (replace with database query)
    const mockUser = {
      id: 'user_123',
      email: email,
      password: await authService.hashPassword('TestPassword123!'), // This would come from DB
      firstName: 'John',
      lastName: 'Doe',
      role: 'farmer',
      verified: true
    };

    // Verify password
    const isValidPassword = await authService.verifyPassword(password, mockUser.password);
    
    if (!isValidPassword) {
      authService.recordFailedAttempt(email);
      
      logger.security('LOGIN_FAILED_INVALID_CREDENTIALS', {
        email,
        ip: req.ip,
        userAgent: req.get('User-Agent'),
        severity: 'medium'
      });

      return res.status(401).json({
        success: false,
        error: 'Invalid credentials',
        code: 'INVALID_CREDENTIALS'
      });
    }

    // Clear failed attempts on successful authentication
    authService.clearFailedAttempts(email);

    // Generate tokens
    const tokens = authService.generateTokens(mockUser);
    
    // Generate session ID
    const sessionId = authService.generateSessionId();

    // Store session (in production, save to Redis/database)
    req.session.userId = mockUser.id;
    req.session.sessionId = sessionId;

    logger.authEvent('USER_LOGIN_SUCCESS', mockUser, {
      ip: req.ip,
      userAgent: req.get('User-Agent'),
      sessionId
    });

    logger.performance('user_login', Date.now() - startTime);

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        user: {
          id: mockUser.id,
          email: mockUser.email,
          firstName: mockUser.firstName,
          lastName: mockUser.lastName,
          role: mockUser.role,
          verified: mockUser.verified
        },
        tokens: {
          accessToken: tokens.accessToken,
          refreshToken: tokens.refreshToken,
          expiresIn: tokens.expiresIn
        },
        sessionId
      }
    });

  } catch (error) {
    logger.error('Login failed:', {
      error: error.message,
      stack: error.stack,
      ip: req.ip,
      userAgent: req.get('User-Agent')
    });

    res.status(500).json({
      success: false,
      error: 'Login failed',
      message: 'Internal server error'
    });
  }
});

/**
 * @route POST /api/auth/send-otp
 * @desc Send OTP via email or SMS
 * @access Public
 */
router.post('/send-otp', otpRateLimit, async (req, res) => {
  try {
    const { identifier, method = 'email', purpose = 'authentication' } = req.body;

    if (!identifier) {
      return res.status(400).json({
        success: false,
        error: 'Identifier (email or phone) is required'
      });
    }

    let result;
    if (method === 'email') {
      result = await authService.sendEmailOTP(identifier, purpose);
    } else if (method === 'sms') {
      result = await authService.sendSMSOTP(identifier, purpose);
    } else {
      return res.status(400).json({
        success: false,
        error: 'Method must be email or sms'
      });
    }

    logger.authEvent('OTP_SENT', { identifier, method, purpose }, {
      ip: req.ip,
      userAgent: req.get('User-Agent')
    });

    res.json({
      success: true,
      message: result.message,
      data: {
        method,
        expiresIn: result.expiresIn
      }
    });

  } catch (error) {
    logger.error('OTP sending failed:', {
      error: error.message,
      identifier: req.body.identifier,
      method: req.body.method,
      ip: req.ip
    });

    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * @route POST /api/auth/verify-otp
 * @desc Verify OTP
 * @access Public
 */
router.post('/verify-otp', validateOTP, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: errors.array()
      });
    }

    const { identifier, otp, method = 'email', purpose = 'authentication' } = req.body;

    const result = await authService.verifyOTP(identifier, otp, method, purpose);

    logger.authEvent('OTP_VERIFIED', { identifier, method, purpose }, {
      ip: req.ip,
      userAgent: req.get('User-Agent')
    });

    res.json({
      success: true,
      message: result.message,
      data: {
        verified: true,
        method,
        purpose
      }
    });

  } catch (error) {
    logger.security('OTP_VERIFICATION_FAILED', {
      identifier: req.body.identifier,
      method: req.body.method,
      error: error.message,
      ip: req.ip,
      userAgent: req.get('User-Agent'),
      severity: 'medium'
    });

    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * @route POST /api/auth/refresh-token
 * @desc Refresh access token
 * @access Private
 */
router.post('/refresh-token', async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({
        success: false,
        error: 'Refresh token is required'
      });
    }

    // Verify refresh token
    const decoded = authService.verifyToken(refreshToken, true);
    
    if (decoded.tokenType !== 'refresh') {
      return res.status(401).json({
        success: false,
        error: 'Invalid refresh token'
      });
    }

    // In production, fetch user from database using decoded.id
    const mockUser = {
      id: decoded.id,
      email: 'user@example.com',
      role: 'farmer',
      verified: true
    };

    // Generate new tokens
    const tokens = authService.generateTokens(mockUser);

    logger.authEvent('TOKEN_REFRESHED', mockUser, {
      ip: req.ip,
      userAgent: req.get('User-Agent')
    });

    res.json({
      success: true,
      message: 'Token refreshed successfully',
      data: {
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
        expiresIn: tokens.expiresIn
      }
    });

  } catch (error) {
    logger.security('TOKEN_REFRESH_FAILED', {
      error: error.message,
      ip: req.ip,
      userAgent: req.get('User-Agent'),
      severity: 'medium'
    });

    res.status(401).json({
      success: false,
      error: 'Token refresh failed',
      message: error.message
    });
  }
});

/**
 * @route POST /api/auth/logout
 * @desc Logout user
 * @access Private
 */
router.post('/logout', async (req, res) => {
  try {
    // In production, invalidate tokens in database/Redis
    // Clear session
    req.session.destroy((err) => {
      if (err) {
        logger.error('Session destruction failed:', err);
      }
    });

    logger.authEvent('USER_LOGOUT', { userId: req.user?.id || 'unknown' }, {
      ip: req.ip,
      userAgent: req.get('User-Agent')
    });

    res.json({
      success: true,
      message: 'Logout successful'
    });

  } catch (error) {
    logger.error('Logout failed:', error);
    
    res.status(500).json({
      success: false,
      error: 'Logout failed'
    });
  }
});

/**
 * @route GET /api/auth/profile
 * @desc Get user profile
 * @access Private
 */
router.get('/profile', async (req, res) => {
  try {
    // This would typically be protected by auth middleware
    // Mock user data
    const user = {
      id: 'user_123',
      email: 'user@example.com',
      firstName: 'John',
      lastName: 'Doe',
      role: 'farmer',
      verified: true,
      createdAt: '2024-01-01T00:00:00.000Z'
    };

    res.json({
      success: true,
      data: { user }
    });

  } catch (error) {
    logger.error('Profile fetch failed:', error);
    
    res.status(500).json({
      success: false,
      error: 'Failed to fetch profile'
    });
  }
});

module.exports = router;