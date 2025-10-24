import { Router } from 'express';
import { authenticate } from '../middleware/auth.js';
import { profileController } from '../controllers/profile.controller.js';
import {
  validateProfileUpdate,
  validateChangePassword
} from '../middleware/validation.js';

const router = Router();

// All profile routes require authentication
router.use(authenticate);

/**
 * @route GET /api/profile
 * @desc Get user profile
 * @access Private
 */
router.get('/', profileController.getProfile);

/**
 * @route PUT /api/profile
 * @desc Update user profile
 * @access Private
 */
router.put('/', validateProfileUpdate, profileController.updateProfile);

/**
 * @route POST /api/profile/change-password
 * @desc Change password
 * @access Private
 */
router.post('/change-password', validateChangePassword, profileController.changePassword);

/**
 * @route POST /api/profile/photo
 * @desc Upload profile photo
 * @access Private
 */
router.post('/photo', async (req, res) => {
  try {
    // TODO: Implement photo upload functionality
    res.json({
      success: true,
      message: 'Profile photo upload functionality will be implemented soon.',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to upload photo',
    });
  }
});

export default router;
