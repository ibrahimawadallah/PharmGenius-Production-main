import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { body, validationResult } from 'express-validator';
import User from '../models/User.js';
import { sendPasswordResetEmail, sendWelcomeEmail } from '../services/emailService.js';
import logger from '../utils/logger.js';
import { rateLimit } from 'express-rate-limit';

const router = express.Router();

// Rate limiting for auth endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 5, // limit each IP to 5 requests per window
  message: 'Too many authentication attempts, please try again later.',
  standardHeaders: 'draft-8',
  legacyHeaders: false,
});

const registerLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  limit: 3, // limit each IP to 3 registration attempts per hour
  message: 'Too many registration attempts, please try again later.',
  standardHeaders: 'draft-8',
  legacyHeaders: false,
});

// Validation middleware
const validateRegistration = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address'),
  body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
    .withMessage('Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'),
  body('firstName')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('First name must be between 2 and 50 characters'),
  body('lastName')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Last name must be between 2 and 50 characters'),
  body('role')
    .optional()
    .isIn(['basic', 'pro', 'enterprise', 'admin'])
    .withMessage('Invalid role specified'),
];

const validateLogin = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address'),
  body('password')
    .notEmpty()
    .withMessage('Password is required'),
];

const validatePasswordReset = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address'),
];

const validatePasswordChange = [
  body('currentPassword')
    .notEmpty()
    .withMessage('Current password is required'),
  body('newPassword')
    .isLength({ min: 8 })
    .withMessage('New password must be at least 8 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
    .withMessage('Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'),
];

// Helper function to generate tokens
const generateTokens = (userId, role) => {
  const accessToken = jwt.sign(
    { userId, role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '15m' }
  );
  
  const refreshToken = jwt.sign(
    { userId, role },
    process.env.REFRESH_TOKEN_SECRET || process.env.JWT_SECRET,
    { expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN || '7d' }
  );
  
  return { accessToken, refreshToken };
};

// Helper function to send verification email
const sendVerificationEmail = async (user) => {
  try {
    const verificationToken = jwt.sign(
      { userId: user._id, type: 'email_verification' },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );
    
    const verificationUrl = `${process.env.FRONTEND_URL}/verify-email?token=${verificationToken}`;
    
    // Email verification temporarily disabled
    // await sendEmail({
    //   to: user.email,
    //   subject: 'Verify Your Email - PharmGenius',
    //   template: 'email-verification',
    //   context: {
    //     firstName: user.firstName,
    //     verificationUrl,
    //     supportEmail: process.env.SENDGRID_FROM_EMAIL,
    //   },
    // });
    
    // Update user with verification token
    await User.updateOne(
      { _id: user._id },
      { 
        emailVerificationToken: verificationToken,
        emailVerificationExpires: new Date(Date.now() + 24 * 60 * 60 * 1000)
      }
    );
    
    logger.info(`Verification email sent to ${user.email}`);
  } catch (error) {
    logger.error('Failed to send verification email:', error);
  }
};

// Register new user
router.post('/register', registerLimiter, validateRegistration, async (req, res) => {
  try {
    // Check validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array(),
      });
    }

    const { email, password, firstName, lastName, role = 'basic', organizationId } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'User with this email already exists',
      });
    }

    // Hash password
    const saltRounds = parseInt(process.env.BCRYPT_ROUNDS) || 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create user
    const userData = {
      email,
      password: hashedPassword,
      firstName,
      lastName,
      role,
      organizationId,
      emailVerified: false,
      status: 'active',
      permissions: getDefaultPermissions(role),
      lastLogin: new Date(),
      createdAt: new Date(),
    };

    const user = await User.create(userData);

    // Generate tokens
    const { accessToken, refreshToken } = generateTokens(user._id, user.role);

    // Send verification email
    await sendVerificationEmail(user);

    // Remove sensitive data from response
    const userResponse = {
      _id: user._id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
      organizationId: user.organizationId,
      emailVerified: user.emailVerified,
      status: user.status,
      permissions: user.permissions,
      createdAt: user.createdAt,
    };

    logger.info(`New user registered: ${user.email}`);

    res.status(201).json({
      success: true,
      message: 'User registered successfully. Please check your email to verify your account.',
      user: userResponse,
      accessToken,
      refreshToken,
    });
  } catch (error) {
    logger.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error during registration',
    });
  }
});

// Login user
router.post('/login', authLimiter, validateLogin, async (req, res) => {
  try {
    // Check validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array(),
      });
    }

    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    // Check if user is active
    if (user.status !== 'active') {
      return res.status(401).json({
        success: false,
        message: 'Account is deactivated. Please contact support.',
      });
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    // Check if email is verified (optional for basic access)
    if (!user.emailVerified && user.role !== 'basic') {
      return res.status(401).json({
        success: false,
        message: 'Please verify your email before logging in',
      });
    }

    // Generate tokens
    const { accessToken, refreshToken } = generateTokens(user._id, user.role);

    // Update last login
    await User.updateOne(
      { _id: user._id },
      { 
        lastLogin: new Date(),
        loginAttempts: 0,
        lockedUntil: null
      }
    );

    // Remove sensitive data from response
    const userResponse = {
      _id: user._id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
      organizationId: user.organizationId,
      emailVerified: user.emailVerified,
      status: user.status,
      permissions: user.permissions,
      lastLogin: new Date(),
      createdAt: user.createdAt,
    };

    logger.info(`User logged in: ${user.email}`);

    res.json({
      success: true,
      message: 'Login successful',
      user: userResponse,
      accessToken,
      refreshToken,
    });
  } catch (error) {
    logger.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error during login',
    });
  }
});

// Development static admin login (username: admin, password: admin)
router.post('/dev-login', authLimiter, async (req, res) => {
  try {
    const { username, password } = req.body || {};

    if (username === 'admin' && password === 'admin') {
      const fakeUserId = '000000000000000000000000';
      const userResponse = {
        _id: fakeUserId,
        email: 'admin@local',
        firstName: 'Admin',
        lastName: 'User',
        role: 'admin',
        organizationId: null,
        emailVerified: true,
        status: 'active',
        permissions: (typeof getDefaultPermissions === 'function') ? getDefaultPermissions('admin') : ['*'],
        createdAt: new Date(),
      };

      const { accessToken, refreshToken } = generateTokens(fakeUserId, 'admin');

      logger.warn('Static admin dev-login used');

      return res.json({
        success: true,
        message: 'Login successful',
        user: userResponse,
        accessToken,
        refreshToken,
      });
    }

    return res.status(401).json({
      success: false,
      message: 'Invalid username or password',
    });
  } catch (error) {
    logger.error('Dev login error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error during dev login',
    });
  }
});

// Refresh access token
router.post('/refresh', async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({
        success: false,
        message: 'Refresh token is required',
      });
    }

    // Verify refresh token
    const decoded = jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET || process.env.JWT_SECRET
    );

    // Check if user exists and is active
    const user = await User.findById(decoded.userId);
    if (!user || user.status !== 'active') {
      return res.status(401).json({
        success: false,
        message: 'Invalid refresh token',
      });
    }

    // Generate new tokens
    const { accessToken: newAccessToken, refreshToken: newRefreshToken } = generateTokens(
      user._id,
      user.role
    );

    logger.info(`Token refreshed for user: ${user.email}`);

    res.json({
      success: true,
      message: 'Token refreshed successfully',
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    });
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: 'Invalid refresh token',
      });
    }
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Refresh token expired',
      });
    }

    logger.error('Token refresh error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error during token refresh',
    });
  }
});

// Logout user
router.post('/logout', async (req, res) => {
  try {
    // In a more sophisticated system, you might want to blacklist the refresh token
    // For now, we'll just return success
    res.json({
      success: true,
      message: 'Logout successful',
    });
  } catch (error) {
    logger.error('Logout error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error during logout',
    });
  }
});

// Forgot password
router.post('/forgot-password', validatePasswordReset, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array(),
      });
    }

    const { email } = req.body;

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      // Don't reveal if user exists or not
      return res.json({
        success: true,
        message: 'If an account with that email exists, a password reset link has been sent.',
      });
    }

    // Generate reset token
    const resetToken = jwt.sign(
      { userId: user._id, type: 'password_reset' },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    // Update user with reset token
    await User.updateOne(
      { _id: user._id },
      { 
        passwordResetToken: resetToken,
        passwordResetExpires: new Date(Date.now() + 60 * 60 * 1000) // 1 hour
      }
    );

    // Send reset email
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;
    
    // Password reset email temporarily disabled
    // await sendEmail({
    //   to: user.email,
    //   subject: 'Reset Your Password - PharmGenius',
    //   template: 'password-reset',
    //   context: {
    //     firstName: user.firstName,
    //     resetUrl,
    //     supportEmail: process.env.SENDGRID_FROM_EMAIL,
    //   },
    // });

    logger.info(`Password reset email sent to ${user.email}`);

    res.json({
      success: true,
      message: 'If an account with that email exists, a password reset link has been sent.',
    });
  } catch (error) {
    logger.error('Forgot password error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error during password reset request',
    });
  }
});

// Reset password
router.post('/reset-password', async (req, res) => {
  try {
    const { token, password } = req.body;

    if (!token || !password) {
      return res.status(400).json({
        success: false,
        message: 'Token and new password are required',
      });
    }

    // Verify reset token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    if (decoded.type !== 'password_reset') {
      return res.status(400).json({
        success: false,
        message: 'Invalid token type',
      });
    }

    // Find user and check if token is valid and not expired
    const user = await User.findOne({
      _id: decoded.userId,
      passwordResetToken: token,
      passwordResetExpires: { $gt: new Date() }
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired reset token',
      });
    }

    // Hash new password
    const saltRounds = parseInt(process.env.BCRYPT_ROUNDS) || 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Update user password and clear reset token
    await User.updateOne(
      { _id: user._id },
      { 
        password: hashedPassword,
        passwordResetToken: null,
        passwordResetExpires: null,
        passwordChangedAt: new Date()
      }
    );

    // Send confirmation email temporarily disabled
    // await sendEmail({
    //   to: user.email,
    //   subject: 'Password Changed Successfully - PharmGenius',
    //   template: 'password-changed',
    //   context: {
    //     firstName: user.firstName,
    //     supportEmail: process.env.SENDGRID_FROM_EMAIL,
    //   },
    // });

    logger.info(`Password reset successful for user: ${user.email}`);

    res.json({
      success: true,
      message: 'Password has been reset successfully',
    });
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid reset token',
      });
    }
    
    if (error.name === 'TokenExpiredError') {
      return res.status(400).json({
        success: false,
        message: 'Reset token has expired',
      });
    }

    logger.error('Reset password error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error during password reset',
    });
  }
});

// Verify email
router.post('/verify-email', async (req, res) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({
        success: false,
        message: 'Verification token is required',
      });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    if (decoded.type !== 'email_verification') {
      return res.status(400).json({
        success: false,
        message: 'Invalid token type',
      });
    }

    // Find user and check if token is valid
    const user = await User.findOne({
      _id: decoded.userId,
      emailVerificationToken: token,
      emailVerificationExpires: { $gt: new Date() }
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired verification token',
      });
    }

    // Mark email as verified
    await User.updateOne(
      { _id: user._id },
      { 
        emailVerified: true,
        emailVerificationToken: null,
        emailVerificationExpires: null
      }
    );

    logger.info(`Email verified for user: ${user.email}`);

    res.json({
      success: true,
      message: 'Email verified successfully',
    });
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid verification token',
      });
    }
    
    if (error.name === 'TokenExpiredError') {
      return res.status(400).json({
        success: false,
        message: 'Verification token has expired',
      });
    }

    logger.error('Email verification error:', error);
    res.status(500).json({
      success: false,
        message: 'Internal server error during email verification',
    });
  }
});

// Resend verification email
router.post('/resend-verification', async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email is required',
      });
    }

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    if (user.emailVerified) {
      return res.status(400).json({
        success: false,
        message: 'Email is already verified',
      });
    }

    // Send new verification email
    await sendVerificationEmail(user);

    res.json({
      success: true,
      message: 'Verification email sent successfully',
    });
  } catch (error) {
    logger.error('Resend verification error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error while resending verification email',
    });
  }
});

// Change password (authenticated route)
router.post('/change-password', validatePasswordChange, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array(),
      });
    }

    const { currentPassword, newPassword } = req.body;
    const userId = req.user.id; // From auth middleware

    // Find user
    const user = await User.findById(userId).select('+password');
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // Verify current password
    const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password);
    if (!isCurrentPasswordValid) {
      return res.status(400).json({
        success: false,
        message: 'Current password is incorrect',
      });
    }

    // Hash new password
    const saltRounds = parseInt(process.env.BCRYPT_ROUNDS) || 12;
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

    // Update password
    await User.updateOne(
      { _id: user._id },
      { 
        password: hashedPassword,
        passwordChangedAt: new Date()
      }
    );

    // Send confirmation email temporarily disabled
    // await sendEmail({
    //   to: user.email,
    //   subject: 'Password Changed Successfully - PharmGenius',
    //   template: 'password-changed',
    //   context: {
    //     firstName: user.firstName,
    //     supportEmail: process.env.SENDGRID_FROM_EMAIL,
    //   },
    // });

    logger.info(`Password changed for user: ${user.email}`);

    res.json({
      success: true,
      message: 'Password changed successfully',
    });
  } catch (error) {
    logger.error('Change password error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error during password change',
    });
  }
});

// Get user profile
router.get('/profile', async (req, res) => {
  try {
    const userId = req.user.id; // From auth middleware

    const user = await User.findById(userId).select('-password');
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    res.json({
      success: true,
      user,
    });
  } catch (error) {
    logger.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error while fetching profile',
    });
  }
});

// Update user profile
router.put('/profile', async (req, res) => {
  try {
    const userId = req.user.id; // From auth middleware
    const updateData = req.body;

    // Remove sensitive fields that shouldn't be updated via this endpoint
    delete updateData.password;
    delete updateData.role;
    delete updateData.status;
    delete updateData.permissions;

    const user = await User.findByIdAndUpdate(
      userId,
      { ...updateData, updatedAt: new Date() },
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    res.json({
      success: true,
      message: 'Profile updated successfully',
      user,
    });
  } catch (error) {
    logger.error('Update profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error while updating profile',
    });
  }
});

// Helper function to get default permissions based on role
function getDefaultPermissions(role) {
  const permissions = {
    basic: [
      'read:profile',
      'update:profile',
      'read:drugs',
      'search:drugs',
      'read:courses',
      'enroll:courses',
    ],
    pro: [
      'read:profile',
      'update:profile',
      'read:drugs',
      'search:drugs',
      'read:courses',
      'enroll:courses',
      'create:consultations',
      'read:consultations',
      'update:consultations',
      'read:analytics',
    ],
    enterprise: [
      'read:profile',
      'update:profile',
      'read:drugs',
      'search:drugs',
      'read:courses',
      'enroll:courses',
      'create:consultations',
      'read:consultations',
      'update:consultations',
      'read:analytics',
      'manage:users',
      'manage:organizations',
      'read:reports',
    ],
    admin: [
      'read:profile',
      'update:profile',
      'read:drugs',
      'search:drugs',
      'read:courses',
      'enroll:courses',
      'create:consultations',
      'read:consultations',
      'update:consultations',
      'read:analytics',
      'manage:users',
      'manage:organizations',
      'read:reports',
      'manage:system',
      'manage:content',
      'manage:payments',
    ],
  };

  return permissions[role] || permissions.basic;
}

export default router;
