const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const speakeasy = require('speakeasy');
const nodemailer = require('nodemailer');
const twilio = require('twilio');
const admin = require('firebase-admin');
const logger = require('../utils/logger');
const config = require('../config/config');
const { createValidator } = require('../middleware/securityMiddleware');

/**
 * Enhanced Authentication Service with OTP verification and security features
 */
class AuthService {
  constructor() {
    this.otpStore = new Map(); // In production, use Redis
    this.failedAttempts = new Map();
    this.blockedIPs = new Set();
    
    // Initialize Firebase Admin SDK
    if (config.firebase.projectId) {
      try {
        admin.initializeApp({
          credential: admin.credential.cert({
            projectId: config.firebase.projectId,
            privateKeyId: config.firebase.privateKeyId,
            privateKey: config.firebase.privateKey,
            clientEmail: config.firebase.clientEmail,
            clientId: config.firebase.clientId,
            authUri: config.firebase.authUri,
            tokenUri: config.firebase.tokenUri
          }),
          projectId: config.firebase.projectId
        });
        logger.info('Firebase Admin SDK initialized successfully');
      } catch (error) {
        logger.warn('Firebase Admin SDK initialization failed:', error.message);
      }
    }

    // Initialize email transporter
    if (config.email.user && config.email.pass) {
      this.emailTransporter = nodemailer.createTransporter({
        service: config.email.service,
        host: config.email.host,
        port: config.email.port,
        secure: config.email.secure,
        auth: {
          user: config.email.user,
          pass: config.email.pass
        }
      });
    }

    // Initialize Twilio client
    if (config.sms.twilio.accountSid && config.sms.twilio.authToken) {
      this.twilioClient = twilio(
        config.sms.twilio.accountSid,
        config.sms.twilio.authToken
      );
    }
  }

  /**
   * Generate secure OTP
   */
  generateOTP(length = config.otp.length) {
    const digits = '0123456789';
    let otp = '';
    
    for (let i = 0; i < length; i++) {
      otp += digits[crypto.randomInt(0, digits.length)];
    }
    
    return otp;
  }

  /**
   * Generate and send email OTP
   */
  async sendEmailOTP(email, purpose = 'authentication') {
    try {
      const validator = createValidator({
        email: { required: true, type: 'email' }
      });
      
      const validation = validator({ email });
      if (!validation.isValid) {
        throw new Error(`Invalid email: ${validation.errors.join(', ')}`);
      }

      const otp = this.generateOTP();
      const otpKey = `email:${email}:${purpose}`;
      
      // Store OTP with expiry
      this.otpStore.set(otpKey, {
        otp,
        expiresAt: Date.now() + (config.otp.expiryMinutes * 60 * 1000),
        attempts: 0,
        purpose
      });

      if (!this.emailTransporter) {
        throw new Error('Email service not configured');
      }

      const mailOptions = {
        from: config.email.user,
        to: email,
        subject: `Herbal Trace ${purpose === 'registration' ? 'Registration' : 'Login'} OTP`,
        html: `
          <div style=\"font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;\">
            <div style=\"background: linear-gradient(135deg, #4CAF50, #2E7D32); padding: 20px; text-align: center;\">
              <h1 style=\"color: white; margin: 0;\">🌿 Herbal Trace</h1>
            </div>
            <div style=\"padding: 30px; background: #f9f9f9;\">
              <h2 style=\"color: #2E7D32;\">Your OTP Code</h2>
              <p>Your one-time password for ${purpose} is:</p>
              <div style=\"background: white; padding: 20px; border-radius: 8px; text-align: center; margin: 20px 0;\">
                <h1 style=\"font-size: 36px; color: #4CAF50; letter-spacing: 8px; margin: 0;\">${otp}</h1>
              </div>
              <p><strong>Important:</strong></p>
              <ul>
                <li>This OTP is valid for ${config.otp.expiryMinutes} minutes</li>
                <li>Do not share this code with anyone</li>
                <li>If you didn't request this code, please ignore this email</li>
              </ul>
              <div style=\"margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; color: #666; font-size: 12px;\">
                <p>This is an automated message from Herbal Trace. Please do not reply to this email.</p>
              </div>
            </div>
          </div>
        `
      };

      await this.emailTransporter.sendMail(mailOptions);
      
      logger.info(`OTP sent to email: ${email}`, { purpose, otpLength: otp.length });
      
      return {
        success: true,
        message: 'OTP sent successfully to your email',
        expiresIn: config.otp.expiryMinutes
      };
    } catch (error) {
      logger.error('Failed to send email OTP:', error);
      throw new Error('Failed to send OTP via email');
    }
  }

  /**
   * Generate and send SMS OTP
   */
  async sendSMSOTP(phoneNumber, purpose = 'authentication') {
    try {
      const validator = createValidator({
        phone: { required: true, type: 'phone' }
      });
      
      const validation = validator({ phone: phoneNumber });
      if (!validation.isValid) {
        throw new Error(`Invalid phone number: ${validation.errors.join(', ')}`);
      }

      const otp = this.generateOTP();
      const otpKey = `sms:${phoneNumber}:${purpose}`;
      
      // Store OTP with expiry
      this.otpStore.set(otpKey, {
        otp,
        expiresAt: Date.now() + (config.otp.expiryMinutes * 60 * 1000),
        attempts: 0,
        purpose
      });

      if (!this.twilioClient) {
        throw new Error('SMS service not configured');
      }

      const message = `🌿 Herbal Trace\n\nYour OTP: ${otp}\n\nValid for ${config.otp.expiryMinutes} minutes.\nDo not share this code.`;

      await this.twilioClient.messages.create({
        body: message,
        from: config.sms.twilio.phoneNumber,
        to: phoneNumber
      });
      
      logger.info(`OTP sent to phone: ${phoneNumber}`, { purpose, otpLength: otp.length });
      
      return {
        success: true,
        message: 'OTP sent successfully to your phone',
        expiresIn: config.otp.expiryMinutes
      };
    } catch (error) {
      logger.error('Failed to send SMS OTP:', error);
      throw new Error('Failed to send OTP via SMS');
    }
  }

  /**
   * Verify OTP
   */
  async verifyOTP(identifier, otp, method = 'email', purpose = 'authentication') {
    try {
      const otpKey = `${method}:${identifier}:${purpose}`;
      const storedOTP = this.otpStore.get(otpKey);

      if (!storedOTP) {
        throw new Error('OTP not found or expired');
      }

      // Check expiry
      if (Date.now() > storedOTP.expiresAt) {
        this.otpStore.delete(otpKey);
        throw new Error('OTP has expired');
      }

      // Check attempts
      if (storedOTP.attempts >= config.otp.maxAttempts) {
        this.otpStore.delete(otpKey);
        throw new Error('Maximum OTP attempts exceeded');
      }

      // Verify OTP
      if (storedOTP.otp !== otp) {
        storedOTP.attempts++;
        this.otpStore.set(otpKey, storedOTP);
        throw new Error('Invalid OTP');
      }

      // OTP verified successfully
      this.otpStore.delete(otpKey);
      
      logger.info(`OTP verified successfully for ${method}: ${identifier}`, { purpose });
      
      return {
        success: true,
        message: 'OTP verified successfully'
      };
    } catch (error) {
      logger.error('OTP verification failed:', error);
      throw error;
    }
  }

  /**
   * Hash password with bcrypt
   */
  async hashPassword(password) {
    try {
      const saltRounds = config.security.bcryptSaltRounds;
      return await bcrypt.hash(password, saltRounds);
    } catch (error) {
      logger.error('Password hashing failed:', error);
      throw new Error('Password processing failed');
    }
  }

  /**
   * Verify password
   */
  async verifyPassword(password, hashedPassword) {
    try {
      return await bcrypt.compare(password, hashedPassword);
    } catch (error) {
      logger.error('Password verification failed:', error);
      return false;
    }
  }

  /**
   * Generate JWT tokens
   */
  generateTokens(user) {
    try {
      const payload = {
        id: user.id,
        email: user.email,
        role: user.role,
        verified: user.verified || false
      };

      const accessToken = jwt.sign(
        payload,
        config.security.jwtSecret,
        { expiresIn: config.security.jwtExpiry }
      );

      const refreshToken = jwt.sign(
        { id: user.id, tokenType: 'refresh' },
        config.security.jwtRefreshSecret,
        { expiresIn: config.security.jwtRefreshExpiry }
      );

      return {
        accessToken,
        refreshToken,
        expiresIn: config.security.jwtExpiry
      };
    } catch (error) {
      logger.error('Token generation failed:', error);
      throw new Error('Token generation failed');
    }
  }

  /**
   * Verify JWT token
   */
  verifyToken(token, isRefreshToken = false) {
    try {
      const secret = isRefreshToken ? config.security.jwtRefreshSecret : config.security.jwtSecret;
      return jwt.verify(token, secret);
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        throw new Error('Token expired');
      } else if (error.name === 'JsonWebTokenError') {
        throw new Error('Invalid token');
      }
      throw new Error('Token verification failed');
    }
  }

  /**
   * Generate secure session ID
   */
  generateSessionId() {
    return crypto.randomBytes(32).toString('hex');
  }

  /**
   * Check rate limiting for authentication attempts
   */
  checkRateLimit(identifier, maxAttempts = 5, windowMs = 15 * 60 * 1000) {
    const key = `attempts:${identifier}`;
    const now = Date.now();
    
    let attempts = this.failedAttempts.get(key) || { count: 0, resetTime: now + windowMs };
    
    if (now > attempts.resetTime) {
      attempts = { count: 0, resetTime: now + windowMs };
    }
    
    if (attempts.count >= maxAttempts) {
      const remaining = Math.ceil((attempts.resetTime - now) / 60000); // minutes
      throw new Error(`Too many attempts. Try again in ${remaining} minutes.`);
    }
    
    return attempts;
  }

  /**
   * Record failed authentication attempt
   */
  recordFailedAttempt(identifier) {
    const key = `attempts:${identifier}`;
    const now = Date.now();
    const windowMs = 15 * 60 * 1000; // 15 minutes
    
    let attempts = this.failedAttempts.get(key) || { count: 0, resetTime: now + windowMs };
    
    if (now > attempts.resetTime) {
      attempts = { count: 1, resetTime: now + windowMs };
    } else {
      attempts.count++;
    }
    
    this.failedAttempts.set(key, attempts);
    
    logger.warn(`Failed authentication attempt for: ${identifier}`, {
      attempts: attempts.count,
      resetTime: new Date(attempts.resetTime).toISOString()
    });
  }

  /**
   * Clear failed attempts on successful authentication
   */
  clearFailedAttempts(identifier) {
    const key = `attempts:${identifier}`;
    this.failedAttempts.delete(key);
  }

  /**
   * Validate password strength
   */
  validatePasswordStrength(password) {
    const errors = [];
    
    if (password.length < 8) {
      errors.push('Password must be at least 8 characters long');
    }
    
    if (!/(?=.*[a-z])/.test(password)) {
      errors.push('Password must contain at least one lowercase letter');
    }
    
    if (!/(?=.*[A-Z])/.test(password)) {
      errors.push('Password must contain at least one uppercase letter');
    }
    
    if (!/(?=.*\\d)/.test(password)) {
      errors.push('Password must contain at least one number');
    }
    
    if (!/(?=.*[@$!%*?&])/.test(password)) {
      errors.push('Password must contain at least one special character (@$!%*?&)');
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Generate TOTP secret for 2FA
   */
  generateTOTPSecret(userEmail) {
    return speakeasy.generateSecret({
      name: `Herbal Trace (${userEmail})`,
      issuer: 'Herbal Trace',
      length: 32
    });
  }

  /**
   * Verify TOTP token
   */
  verifyTOTP(token, secret) {
    return speakeasy.totp.verify({
      secret,
      encoding: 'base32',
      token,
      window: 2
    });
  }

  /**
   * Clean expired OTPs and failed attempts
   */
  cleanupExpiredData() {
    const now = Date.now();
    
    // Clean expired OTPs
    for (const [key, data] of this.otpStore.entries()) {
      if (now > data.expiresAt) {
        this.otpStore.delete(key);
      }
    }
    
    // Clean expired failed attempts
    for (const [key, data] of this.failedAttempts.entries()) {
      if (now > data.resetTime) {
        this.failedAttempts.delete(key);
      }
    }
  }
}

// Create and export singleton instance
const authService = new AuthService();

// Clean expired data every 5 minutes
setInterval(() => {
  authService.cleanupExpiredData();
}, 5 * 60 * 1000);

module.exports = authService;