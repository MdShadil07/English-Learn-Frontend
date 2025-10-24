import { Router } from 'express';
import { accuracyController } from '../controllers/accuracy.controller';

const router = Router();

/**
 * @route POST /api/accuracy/analyze
 * @desc Analyze message for accuracy
 * @access Public
 */
router.post('/analyze', accuracyController.analyzeMessage);

/**
 * @route GET /api/accuracy/history/:userId
 * @desc Get user's analysis history
 * @access Private
 */
router.get('/history/:userId', accuracyController.getAnalysisHistory);

export default router;
