import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { User, Profile } from '../models/index';

interface AuthRequest extends Request {
  user?: any;
}

export class ProfileController {

  /**
   * Get user profile
   */
  async getProfile(req: AuthRequest, res: Response) {
    try {
      const userId = req.user.userId;

      const user = await User.findById(userId).select('-password');
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found',
        });
      }

      // Get or create profile
      let profile = await Profile.findOne({ userId });
      if (!profile) {
        profile = new Profile({
          userId,
          full_name: user.getFullName(),
          field: 'student',
          role: 'student',
        });
        await profile.save();
      }

      return res.json({
        success: true,
        data: {
          user: {
            _id: user._id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            username: user.username,
            avatar: user.avatar,
            dateOfBirth: user.dateOfBirth,
            country: user.country,
            nativeLanguage: user.nativeLanguage,
            targetLanguage: user.targetLanguage,
            proficiencyLevel: user.proficiencyLevel,
            isEmailVerified: user.isEmailVerified,
            isActive: user.isActive,
            lastLoginAt: user.lastLoginAt,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
          },
          profile: {
            _id: profile._id,
            full_name: profile.full_name,
            field: profile.field,
            role: profile.role,
            createdAt: profile.createdAt,
            updatedAt: profile.updatedAt,
          }
        },
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
      const userId = req.user.userId;
      const updateData = req.body;

      // Remove fields that shouldn't be updated directly
      delete updateData.password;
      delete updateData.email;
      delete updateData.isEmailVerified;
      delete updateData.isActive;

      const user = await User.findByIdAndUpdate(
        userId,
        updateData,
        { new: true, runValidators: true }
      ).select('-password');

      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found',
        });
      }

      // Update profile if profile-specific fields are provided
      if (updateData.full_name || updateData.field || updateData.role) {
        const profileUpdate: any = {};
        if (updateData.full_name) profileUpdate.full_name = updateData.full_name;
        if (updateData.field) profileUpdate.field = updateData.field;
        if (updateData.role) profileUpdate.role = updateData.role;

        await Profile.findOneAndUpdate(
          { userId },
          profileUpdate,
          { new: true, runValidators: true, upsert: true }
        );
      }

      return res.json({
        success: true,
        message: 'Profile updated successfully',
        data: {
          user: {
            _id: user._id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            username: user.username,
            avatar: user.avatar,
            dateOfBirth: user.dateOfBirth,
            country: user.country,
            nativeLanguage: user.nativeLanguage,
            targetLanguage: user.targetLanguage,
            proficiencyLevel: user.proficiencyLevel,
            isEmailVerified: user.isEmailVerified,
            isActive: user.isActive,
            lastLoginAt: user.lastLoginAt,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
          }
        },
      });

    } catch (error) {
      console.error('Update profile error:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to update profile',
      });
    }
  }

  /**
   * Change user password
   */
  async changePassword(req: AuthRequest, res: Response) {
    try {
      const userId = req.user.userId;
      const { currentPassword, newPassword } = req.body;

      const user = await User.findById(userId).select('+password');
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found',
        });
      }

      // Verify current password
      const isCurrentPasswordValid = await user.comparePassword(currentPassword);
      if (!isCurrentPasswordValid) {
        return res.status(400).json({
          success: false,
          message: 'Current password is incorrect',
        });
      }

      // Hash new password
      const saltRounds = 12;
      const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

      // Update password
      user.password = hashedPassword;
      await user.save();

      return res.json({
        success: true,
        message: 'Password changed successfully',
      });

    } catch (error) {
      console.error('Change password error:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to change password',
      });
    }
  }
}

export const profileController = new ProfileController();
