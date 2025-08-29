import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import logger from '../utils/logger.js';

// Verify JWT token middleware
export const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Access token is required',
      });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Check if user exists and is active
    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User not found',
      });
    }

    if (!user.isActive()) {
      return res.status(401).json({
        success: false,
        message: 'User account is deactivated',
      });
    }

    // Check if password was changed after token was issued
    if (user.passwordChangedAt && decoded.iat < user.passwordChangedAt.getTime() / 1000) {
      return res.status(401).json({
        success: false,
        message: 'Token expired due to password change',
      });
    }

    // Add user info to request
    req.user = {
      id: user._id.toString(),
      email: user.email,
      role: user.role,
      organizationId: user.organizationId,
      permissions: user.permissions,
    };

    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: 'Invalid token',
      });
    }
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token expired',
      });
    }

    logger.error('Token verification error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error during authentication',
    });
  }
};

// Optional authentication middleware (doesn't fail if no token)
export const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return next(); // Continue without authentication
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Check if user exists and is active
    const user = await User.findById(decoded.userId);
    if (user && user.isActive()) {
      // Check if password was changed after token was issued
      if (!user.passwordChangedAt || decoded.iat >= user.passwordChangedAt.getTime() / 1000) {
        req.user = {
          id: user._id.toString(),
          email: user.email,
          role: user.role,
          organizationId: user.organizationId,
          permissions: user.permissions,
        };
      }
    }

    next();
  } catch (error) {
    // Continue without authentication on token errors
    next();
  }
};

// Role-based access control middleware
export const requireRole = (requiredRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required',
      });
    }

    const roles = Array.isArray(requiredRoles) ? requiredRoles : [requiredRoles];
    
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'Insufficient permissions for this role',
        requiredRoles: roles,
        userRole: req.user.role,
      });
    }

    next();
  };
};

// Permission-based access control middleware
export const requirePermission = (requiredPermissions) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required',
      });
    }

    const permissions = Array.isArray(requiredPermissions) ? requiredPermissions : [requiredPermissions];
    
    // Check if user has all required permissions
    const hasAllPermissions = permissions.every(permission => 
      req.user.permissions.includes(permission)
    );

    if (!hasAllPermissions) {
      return res.status(403).json({
        success: false,
        message: 'Insufficient permissions',
        requiredPermissions: permissions,
        userPermissions: req.user.permissions,
      });
    }

    next();
  };
};

// Check if user has any of the required permissions
export const requireAnyPermission = (requiredPermissions) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required',
      });
    }

    const permissions = Array.isArray(requiredPermissions) ? requiredPermissions : [requiredPermissions];
    
    // Check if user has any of the required permissions
    const hasAnyPermission = permissions.some(permission => 
      req.user.permissions.includes(permission)
    );

    if (!hasAnyPermission) {
      return res.status(403).json({
        success: false,
        message: 'Insufficient permissions',
        requiredPermissions: permissions,
        userPermissions: req.user.permissions,
      });
    }

    next();
  };
};

// Organization access control middleware
export const requireOrganizationAccess = (organizationIdParam = 'organizationId') => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required',
      });
    }

    // Admin users can access any organization
    if (req.user.role === 'admin') {
      return next();
    }

    const targetOrganizationId = req.params[organizationIdParam] || req.body[organizationIdParam];
    
    if (!targetOrganizationId) {
      return res.status(400).json({
        success: false,
        message: 'Organization ID is required',
      });
    }

    // Check if user belongs to the target organization
    if (req.user.organizationId?.toString() !== targetOrganizationId.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Access denied to this organization',
      });
    }

    next();
  };
};

// Resource ownership middleware
export const requireOwnership = (resourceModel, resourceIdParam = 'id', userIdField = 'userId') => {
  return async (req, res, next) => {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'Authentication required',
        });
      }

      // Admin users can access any resource
      if (req.user.role === 'admin') {
        return next();
      }

      const resourceId = req.params[resourceIdParam];
      
      if (!resourceId) {
        return res.status(400).json({
          success: false,
          message: 'Resource ID is required',
        });
      }

      // Find the resource
      const resource = await resourceModel.findById(resourceId);
      if (!resource) {
        return res.status(404).json({
          success: false,
          message: 'Resource not found',
        });
      }

      // Check if user owns the resource
      if (resource[userIdField]?.toString() !== req.user.id) {
        return res.status(403).json({
          success: false,
          message: 'Access denied to this resource',
        });
      }

      // Add resource to request for later use
      req.resource = resource;
      next();
    } catch (error) {
      logger.error('Ownership check error:', error);
      return res.status(500).json({
        success: false,
        message: 'Internal server error during ownership verification',
      });
    }
  };
};

// Rate limiting middleware for authenticated users
export const authenticatedRateLimit = (windowMs = 15 * 60 * 1000, max = 100) => {
  const userRequests = new Map();

  return (req, res, next) => {
    if (!req.user) {
      return next();
    }

    const userId = req.user.id;
    const now = Date.now();
    const userData = userRequests.get(userId) || { count: 0, resetTime: now + windowMs };

    if (now > userData.resetTime) {
      userData.count = 1;
      userData.resetTime = now + windowMs;
    } else {
      userData.count++;
    }

    userRequests.set(userId, userData);

    if (userData.count > max) {
      return res.status(429).json({
        success: false,
        message: 'Too many requests, please try again later',
        retryAfter: Math.ceil((userData.resetTime - now) / 1000),
      });
    }

    next();
  };
};

// Subscription plan middleware
export const requireSubscription = (requiredPlan = 'basic') => {
  return async (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required',
      });
    }

    try {
      // Get user with subscription info
      const user = await User.findById(req.user.id);
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found',
        });
      }

      // Check subscription status
      if (!user.subscription || user.subscription.status !== 'active') {
        return res.status(403).json({
          success: false,
          message: 'Active subscription required',
        });
      }

      // Check subscription plan level
      const planHierarchy = {
        basic: 1,
        pro: 2,
        enterprise: 3,
      };

      const userPlanLevel = planHierarchy[user.subscription.plan] || 0;
      const requiredPlanLevel = planHierarchy[requiredPlan] || 0;

      if (userPlanLevel < requiredPlanLevel) {
        return res.status(403).json({
          success: false,
          message: `Subscription plan ${requiredPlan} or higher required`,
          currentPlan: user.subscription.plan,
          requiredPlan,
        });
      }

      next();
    } catch (error) {
      logger.error('Subscription check error:', error);
      return res.status(500).json({
        success: false,
        message: 'Internal server error during subscription verification',
      });
    }
  };
};

// Feature flag middleware
export const requireFeature = (featureName) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required',
      });
    }

    // Check if feature is enabled globally
    const featureEnabled = process.env[`ENABLE_${featureName.toUpperCase()}`];
    if (featureEnabled === 'false') {
      return res.status(403).json({
        success: false,
        message: 'This feature is currently disabled',
      });
    }

    // Check if user has access to the feature based on their plan
    if (req.user.subscription && req.user.subscription.features) {
      const hasFeature = req.user.subscription.features.includes(featureName);
      if (!hasFeature) {
        return res.status(403).json({
          success: false,
          message: 'This feature is not available in your current plan',
        });
      }
    }

    next();
  };
};

// Audit logging middleware
export const auditLog = (action, resourceType) => {
  return (req, res, next) => {
    const originalSend = res.send;
    
    res.send = function(data) {
      // Log the action after response is sent
      if (req.user) {
        logger.info('Audit log', {
          userId: req.user.id,
          email: req.user.email,
          role: req.user.role,
          action,
          resourceType,
          resourceId: req.params.id || req.body.id,
          method: req.method,
          path: req.path,
          ip: req.ip,
          userAgent: req.get('User-Agent'),
          timestamp: new Date().toISOString(),
          statusCode: res.statusCode,
        });
      }
      
      originalSend.call(this, data);
    };
    
    next();
  };
};

// Export all middleware functions
export default {
  authenticateToken,
  optionalAuth,
  requireRole,
  requirePermission,
  requireAnyPermission,
  requireOrganizationAccess,
  requireOwnership,
  authenticatedRateLimit,
  requireSubscription,
  requireFeature,
  auditLog,
};
