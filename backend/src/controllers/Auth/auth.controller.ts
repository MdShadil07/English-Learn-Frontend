import { Request, Response } from 'express';
import { User, RefreshToken } from '../../models/index';
import { generateTokens } from '../../middleware/auth';
import authConfig from '../../config/auth';
import { redisCache } from '../../config/redis';

interface AuthRequest extends Request {
  user?: any;
}

export class AuthController {

  /**
   * User registration
   */
  async register(req: Request, res: Response) {
    try {
      let {
        email,
        password,
        firstName,
        lastName,
        fullName,
        username,
        targetLanguage = 'English',
        nativeLanguage,
        country,
        proficiencyLevel = 'beginner',
        role = 'student'
      } = req.body;

      // If fullName is provided, split it into first and last names
      if (fullName && !firstName) {
        const nameParts = fullName.trim().split(' ');
        firstName = nameParts[0] || '';
        lastName = nameParts.slice(1).join(' ') || undefined;
      }

      // Validate required fields
      if (!firstName || firstName.trim().length === 0) {
        return res.status(400).json({
          success: false,
          message: 'First name is required',
          field: 'firstName',
        });
      }

      // Check if user already exists
      const existingUser = await User.findOne({
        $or: [
          { email: email.toLowerCase() },
          ...(username ? [{ username: username.toLowerCase() }] : [])
        ]
      });

      if (existingUser) {
        if (existingUser.email === email.toLowerCase()) {
          return res.status(409).json({
            success: false,
            message: 'User with this email already exists',
            field: 'email',
          });
        }
        if (username && existingUser.username === username.toLowerCase()) {
          return res.status(409).json({
            success: false,
            message: 'Username is already taken',
            field: 'username',
          });
        }
      }

      // Create new user
      const user = new User({
        email: email.toLowerCase(),
        password,
        firstName: firstName.trim(),
        lastName: lastName ? lastName.trim() : undefined,
        username: username ? username.toLowerCase().trim() : undefined,
        targetLanguage,
        nativeLanguage: nativeLanguage?.trim(),
        country: country?.trim(),
        proficiencyLevel,
        role,
      });

      await user.save();

      // Generate tokens
      const { accessToken, refreshToken: refreshTokenValue } = generateTokens(user._id.toString(), user.email, user.role);

      // Save refresh token to database
      const refreshTokenDoc = new RefreshToken({
        userId: user._id,
        token: refreshTokenValue,
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
      });
      await refreshTokenDoc.save();

      // Update last login
      user.lastLoginAt = new Date();
      await user.save();

      // Return success response
      return res.status(201).json({
        success: true,
        message: 'Account created successfully',
        data: {
          user: {
            id: user._id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            username: user.username,
            fullName: user.fullName,
            avatar: user.avatar,
            targetLanguage: user.targetLanguage,
            proficiencyLevel: user.proficiencyLevel,
            role: user.role,
            isEmailVerified: user.isEmailVerified,
            createdAt: user.createdAt,
          },
          tokens: {
            accessToken,
            refreshToken: refreshTokenValue,
          },
        },
      });

    } catch (error) {
      console.error('Registration error:', error);

      if (error && typeof error === 'object' && 'name' in error && error.name === 'ValidationError' && 'errors' in error) {
        const validationErrors = Object.values((error as any).errors).map((err: any) => ({
          field: err.path,
          message: err.message,
        }));

        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: validationErrors,
        });
      }

      return res.status(500).json({
        success: false,
        message: 'Failed to create account',
      });
    }
  }

  /**
   * User login
   */
  async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;

      // Find user by email
      const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'Invalid email or password',
        });
      }

      // Check if account is active
      if (!user.isActive) {
        return res.status(401).json({
          success: false,
          message: 'Account is deactivated. Please contact support.',
        });
      }

      // Verify password
      const isPasswordValid = await user.comparePassword(password);
      if (!isPasswordValid) {
        return res.status(401).json({
          success: false,
          message: 'Invalid email or password',
        });
      }

      // Generate tokens
      const { accessToken, refreshToken: refreshTokenValue } = generateTokens(user._id.toString(), user.email, user.role);

      // Save refresh token to database (replace existing ones)
      await RefreshToken.revokeAllUserTokens(user._id);
      const refreshTokenDoc = new RefreshToken({
        userId: user._id,
        token: refreshTokenValue,
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
      });
      await refreshTokenDoc.save();

      // Update last login
      user.lastLoginAt = new Date();
      await user.save();

      // Return success response
      return res.json({
        success: true,
        message: 'Login successful',
        data: {
          user: {
            id: user._id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            username: user.username,
            fullName: user.fullName,
            avatar: user.avatar,
            targetLanguage: user.targetLanguage,
            proficiencyLevel: user.proficiencyLevel,
            role: user.role,
            isEmailVerified: user.isEmailVerified,
            lastLoginAt: user.lastLoginAt,
            createdAt: user.createdAt,
          },
          tokens: {
            accessToken,
            refreshToken: refreshTokenValue,
          },
        },
      });

    } catch (error) {
      console.error('Login error:', error);
      return res.status(500).json({
        success: false,
        message: 'Login failed',
      });
    }
  }

  /**
   * Refresh access token
   */
  async refreshToken(req: AuthRequest, res: Response) {
    try {
      const { refreshToken: token } = req.body;

      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'Invalid refresh token',
        });
      }

      // Generate new tokens
      const { accessToken, refreshToken: newRefreshToken } = generateTokens(
        req.user._id.toString(),
        req.user.email,
        req.user.role
      );

      // Update refresh token in database
      await RefreshToken.findOneAndUpdate(
        { userId: req.user._id, token },
        {
          token: newRefreshToken,
          expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        }
      );

      return res.json({
        success: true,
        message: 'Token refreshed successfully',
        data: {
          accessToken,
          refreshToken: newRefreshToken,
        },
      });

    } catch (error) {
      console.error('Token refresh error:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to refresh token',
      });
    }
  }

  /**
   * Logout (revoke refresh token)
   */
  async logout(req: AuthRequest, res: Response) {
    try {
      const { refreshToken: token } = req.body;

      if (req.user && token) {
        await RefreshToken.findOneAndUpdate(
          { userId: req.user._id, token },
          { isRevoked: true }
        );
      }

      res.json({
        success: true,
        message: 'Logged out successfully',
      });

    } catch (error) {
      console.error('Logout error:', error);
      res.status(500).json({
        success: false,
        message: 'Logout failed',
      });
    }
  }

  /**
   * Logout from all devices
   */
  async logoutAll(req: AuthRequest, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'Authentication required',
        });
      }

      // Revoke all refresh tokens for this user
      await RefreshToken.revokeAllUserTokens(req.user._id);

      return res.json({
        success: true,
        message: 'Logged out from all devices successfully',
      });

    } catch (error) {
      console.error('Logout all error:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to logout from all devices',
      });
    }
  }

  /**
   * Get current user profile
   */
  async getProfile(req: AuthRequest, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'Authentication required',
        });
      }

      // Check cache first
      const cacheKey = redisCache.getUserCacheKey(req.user._id.toString());
      const cachedProfile = await redisCache.getJSON(cacheKey);

      if (cachedProfile) {
        return res.json({
          success: true,
          data: {
            user: cachedProfile,
          },
          cached: true,
        });
      }

      // If not in cache, return current user data and cache it
      const profileData = {
        user: req.user,
      };

      // Cache for 5 minutes
      await redisCache.setJSON(cacheKey, req.user, 300);

      return res.json({
        success: true,
        data: profileData,
      });

    } catch (error) {
      console.error('Get profile error:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to get profile',
      });
    }
  }

  /**
   * Update user profile
   */
  async updateProfile(req: AuthRequest, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'Authentication required',
        });
      }

      const allowedFields = [
        'firstName',
        'lastName',
        'username',
        'dateOfBirth',
        'country',
        'nativeLanguage',
        'targetLanguage',
        'proficiencyLevel',
      ];

      const updates = Object.keys(req.body).reduce((acc, key) => {
        if (allowedFields.includes(key)) {
          acc[key] = req.body[key];
        }
        return acc;
      }, {} as any);

      // Handle username uniqueness if being updated
      if (updates.username) {
        const existingUser = await User.findOne({
          username: updates.username.toLowerCase(),
          _id: { $ne: req.user._id }
        });

        if (existingUser) {
          return res.status(409).json({
            success: false,
            message: 'Username is already taken',
            field: 'username',
          });
        }

        updates.username = updates.username.toLowerCase();
      }

      // Update user
      const user = await User.findByIdAndUpdate(
        req.user._id,
        updates,
        { new: true, runValidators: true }
      );

      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found',
        });
      }

      return res.json({
        success: true,
        message: 'Profile updated successfully',
        data: {
          user: {
            id: user._id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            username: user.username,
            fullName: user.fullName,
            avatar: user.avatar,
            dateOfBirth: user.dateOfBirth,
            country: user.country,
            nativeLanguage: user.nativeLanguage,
            targetLanguage: user.targetLanguage,
            proficiencyLevel: user.proficiencyLevel,
            isEmailVerified: user.isEmailVerified,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
          },
        },
      });

    } catch (error) {
      console.error('Update profile error:', error);

      if (error && typeof error === 'object' && 'name' in error && error.name === 'ValidationError' && 'errors' in error) {
        const validationErrors = Object.values((error as any).errors).map((err: any) => ({
          field: err.path,
          message: err.message,
        }));

        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: validationErrors,
        });
      }

      return res.status(500).json({
        success: false,
        message: 'Failed to update profile',
      });
    }
  }

  /**
   * Change password
   */
  async changePassword(req: AuthRequest, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'Authentication required',
        });
      }

      const { currentPassword, newPassword } = req.body;

      // Verify current password
      const isCurrentPasswordValid = await req.user.comparePassword(currentPassword);
      if (!isCurrentPasswordValid) {
        return res.status(400).json({
          success: false,
          message: 'Current password is incorrect',
        });
      }

      // Update password
      req.user.password = newPassword;
      await req.user.save();

      // Revoke all refresh tokens for security
      await RefreshToken.revokeAllUserTokens(req.user._id);

      return res.json({
        success: true,
        message: 'Password changed successfully. Please login again.',
      });

    } catch (error) {
      console.error('Change password error:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to change password',
      });
    }
  }

  /**
   * Request password reset
   */
  async requestPasswordReset(req: Request, res: Response) {
    try {
      const { email } = req.body;

      const user = await User.findOne({ email: email.toLowerCase() });
      if (!user) {
        // Don't reveal if email exists or not for security
        return res.json({
          success: true,
          message: 'If the email exists, a password reset link has been sent.',
        });
      }

      // TODO: Implement email sending with reset token
      // For now, just return success message

      return res.json({
        success: true,
        message: 'If the email exists, a password reset link has been sent.',
      });

    } catch (error) {
      console.error('Password reset request error:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to process password reset request',
      });
    }
  }

  /**
   * Reset password with token
   */
  async resetPassword(req: Request, res: Response) {
    try {
      const { token, newPassword } = req.body;

      // TODO: Implement password reset token verification
      // For now, return a placeholder response

      return res.json({
        success: true,
        message: 'Password reset functionality will be implemented soon.',
      });

    } catch (error) {
      console.error('Password reset error:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to reset password',
      });
    }
  }

  /**
   * Verify email (placeholder)
   */
  async verifyEmail(req: Request, res: Response) {
    try {
      const { token } = req.query;

      // TODO: Implement email verification

      return res.json({
        success: true,
        message: 'Email verification functionality will be implemented soon.',
      });

    } catch (error) {
      console.error('Email verification error:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to verify email',
      });
    }
  }
}

export const authController = new AuthController();
