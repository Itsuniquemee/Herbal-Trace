const xss = require('xss');
const validator = require('validator');
const logger = require('../utils/logger');

/**
 * Enhanced Security Middleware for Herbal Trace
 * Provides comprehensive protection against various security threats
 */

// Simple XSS sanitizer
const sanitizeValue = (value) => {
  if (typeof value === 'string') {
    return xss(value, {
      whiteList: {
        b: [],
        i: [],
        em: [],
        strong: [],
        a: ['href', 'title'],
        p: [],
        br: []
      },
      stripIgnoreTag: true,
      stripIgnoreTagBody: ['script', 'style']
    });
  }
  return value;
};

// XSS Protection Middleware
const xssProtection = (req, res, next) => {
  const sanitizeData = (obj) => {
    if (typeof obj === 'string') {
      return sanitizeValue(obj);
    }
    
    if (Array.isArray(obj)) {
      return obj.map(sanitizeData);
    }
    
    if (obj && typeof obj === 'object') {
      const sanitized = {};
      for (const key of Object.keys(obj)) {
        sanitized[key] = sanitizeData(obj[key]);
      }
      return sanitized;
    }
    
    return obj;
  };

  if (req.body) req.body = sanitizeData(req.body);
  if (req.query) req.query = sanitizeData(req.query);
  if (req.params) req.params = sanitizeData(req.params);
  
  next();
};

// SQL Injection Protection (for any raw query usage)
const sqlInjectionProtection = (req, res, next) => {
  const dangerousKeywords = [
    'select', 'union', 'insert', 'update', 'delete', 'drop', 'create', 'alter',
    'exec', 'execute', 'script', 'declare', 'cursor', 'table', 'database',
    'schema', 'index', 'view', 'trigger', 'procedure', 'function'
  ];
  
  const sqlPatterns = [
    /['"`;]/g, // Basic SQL injection characters
    /(--|\/\*|\*\/)/g, // SQL comments
    /\b(union|select|insert|update|delete|drop|create|alter|exec|execute)\b/gi // SQL keywords
  ];
  
  const checkForSQLInjection = (str) => {
    if (typeof str !== 'string') return false;
    return sqlPatterns.some(pattern => pattern.test(str));
  };
  
  const validateInput = (obj, path = '') => {
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        const currentPath = path ? `${path}.${key}` : key;
        
        if (typeof obj[key] === 'string') {
          if (checkForSQLInjection(obj[key])) {
            logger.warn(`Potential SQL injection attempt detected`, {
              ip: req.ip,
              userAgent: req.get('User-Agent'),
              path: currentPath,
              value: obj[key],
              timestamp: new Date().toISOString()
            });
            
            return res.status(400).json({
              success: false,
              error: 'Invalid input detected',
              code: 'INVALID_INPUT',
              field: currentPath
            });
          }
        } else if (typeof obj[key] === 'object' && obj[key] !== null) {
          const result = validateInput(obj[key], currentPath);
          if (result) return result;
        }
      }
    }
    return null;
  };
  
  // Check request body
  if (req.body) {
    const bodyResult = validateInput(req.body, 'body');
    if (bodyResult) return bodyResult;
  }
  
  // Check query parameters
  if (req.query) {
    const queryResult = validateInput(req.query, 'query');
    if (queryResult) return queryResult;
  }
  
  // Check URL parameters
  if (req.params) {
    const paramsResult = validateInput(req.params, 'params');
    if (paramsResult) return paramsResult;
  }
  
  next();
};

// CSRF Protection Middleware
const csrfProtection = (req, res, next) => {
  // Skip CSRF protection for GET requests and API endpoints with proper authentication
  if (req.method === 'GET' || req.path.startsWith('/api/')) {
    return next();
  }
  
  const token = req.headers['x-csrf-token'] || req.body._csrf;
  const sessionToken = req.session.csrfToken;
  
  if (!token || !sessionToken || token !== sessionToken) {
    logger.warn(`CSRF token mismatch`, {
      ip: req.ip,
      userAgent: req.get('User-Agent'),
      path: req.path,
      method: req.method,
      timestamp: new Date().toISOString()
    });
    
    return res.status(403).json({
      success: false,
      error: 'CSRF token mismatch',
      code: 'CSRF_ERROR'
    });
  }
  
  next();
};

// Input Validation Middleware
const inputValidation = (req, res, next) => {
  // Validate common input patterns
  const patterns = {
    email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    phone: /^[\+]?[1-9][\d]{0,15}$/,
    uuid: /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
    alphanumeric: /^[a-zA-Z0-9]+$/,
    strongPassword: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
  };
  
  const validateFields = (data, validationRules) => {
    const errors = [];
    
    for (const field in validationRules) {
      const rule = validationRules[field];
      const value = data[field];
      
      // Check required fields
      if (rule.required && (!value || value.toString().trim() === '')) {
        errors.push(`${field} is required`);
        continue;
      }
      
      if (value) {
        // Check pattern validation
        if (rule.pattern && !rule.pattern.test(value)) {
          errors.push(`${field} format is invalid`);
        }
        
        // Check length validation
        if (rule.minLength && value.length < rule.minLength) {
          errors.push(`${field} must be at least ${rule.minLength} characters long`);
        }
        
        if (rule.maxLength && value.length > rule.maxLength) {
          errors.push(`${field} must be no more than ${rule.maxLength} characters long`);
        }
        
        // Custom validation functions
        if (rule.custom && typeof rule.custom === 'function') {
          const customResult = rule.custom(value);
          if (customResult !== true) {
            errors.push(customResult);
          }
        }
      }
    }
    
    return errors;
  };
  
  // Store validation function for use in route handlers
  req.validateInput = validateFields;
  
  next();
};

// Security Headers Middleware
const securityHeaders = (req, res, next) => {
  // Additional security headers
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Permissions-Policy', 'geolocation=(), microphone=(), camera=()');
  
  // Remove server information
  res.removeHeader('X-Powered-By');
  
  next();
};

// Request Size Limiting
const requestSizeLimit = (req, res, next) => {
  const maxSize = 10 * 1024 * 1024; // 10MB
  
  if (req.headers['content-length'] && parseInt(req.headers['content-length']) > maxSize) {
    return res.status(413).json({
      success: false,
      error: 'Request entity too large',
      code: 'PAYLOAD_TOO_LARGE',
      maxSize: `${maxSize / 1024 / 1024}MB`
    });
  }
  
  next();
};

// IP Whitelist/Blacklist Middleware
const ipFiltering = (req, res, next) => {
  const clientIp = req.ip || req.connection.remoteAddress;
  
  // Define IP blacklist (you can load this from database or config)
  const blacklistedIPs = process.env.IP_BLACKLIST ? process.env.IP_BLACKLIST.split(',') : [];
  
  if (blacklistedIPs.includes(clientIp)) {
    logger.warn(`Blocked request from blacklisted IP: ${clientIp}`, {
      ip: clientIp,
      userAgent: req.get('User-Agent'),
      path: req.path,
      timestamp: new Date().toISOString()
    });
    
    return res.status(403).json({
      success: false,
      error: 'Access denied',
      code: 'IP_BLOCKED'
    });
  }
  
  next();
};

// Combine all security middlewares
const securityMiddleware = [
  securityHeaders,
  requestSizeLimit,
  ipFiltering,
  xssProtection,
  sqlInjectionProtection,
  inputValidation,
  // csrfProtection // Enable for form-based requests
];

module.exports = {
  securityMiddleware,
  xssProtection,
  sqlInjectionProtection,
  csrfProtection,
  inputValidation,
  securityHeaders,
  requestSizeLimit,
  ipFiltering
};