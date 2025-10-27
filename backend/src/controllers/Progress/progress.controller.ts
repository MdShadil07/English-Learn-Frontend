import { Request, Response } from 'express';
import { calculateXPReward, getLevelInfo, calculateXPForLevel, calculateXPForNextLevel, calculateLevelFromXP, calculateCurrentLevelXP, calculateXPToNextLevel, calculateTotalXPForLevel } from '../../utils/calculators/progressCalculator';

/**
 * Progress Controller
 * Handles XP calculations, level progression, and progress tracking
 */

export class ProgressController {

  /**
   * Calculate XP reward for action
   */
  async calculateXPReward(req: Request, res: Response) {
    try {
      const { action, multiplier = 1.0, customXP } = req.body;

      const reward = calculateXPReward(action, multiplier, customXP);

      res.json({
        success: true,
        data: reward
      });
    } catch (error) {
      console.error('Error calculating XP reward:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to calculate XP reward'
      });
    }
  }

  /**
   * Get level information
   */
  async getLevelInfo(req: Request, res: Response) {
    try {
      const { totalXP } = req.body;

      const levelInfo = getLevelInfo(totalXP);

      res.json({
        success: true,
        data: levelInfo
      });
    } catch (error) {
      console.error('Error getting level info:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to get level info'
      });
    }
  }

  /**
   * Calculate XP for specific level
   */
  async calculateXPForLevel(req: Request, res: Response) {
    try {
      const { level } = req.body;

      const xpRequired = calculateXPForLevel(level);

      res.json({
        success: true,
        data: { level, xpRequired }
      });
    } catch (error) {
      console.error('Error calculating XP for level:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to calculate XP for level'
      });
    }
  }

  /**
   * Calculate XP for next level
   */
  async calculateXPForNextLevel(req: Request, res: Response) {
    try {
      const { currentLevel } = req.body;

      const xpRequired = calculateXPForNextLevel(currentLevel);

      res.json({
        success: true,
        data: { currentLevel, xpRequired }
      });
    } catch (error) {
      console.error('Error calculating XP for next level:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to calculate XP for next level'
      });
    }
  }

  /**
   * Calculate level from total XP
   */
  async calculateLevelFromXP(req: Request, res: Response) {
    try {
      const { totalXP } = req.body;

      const level = calculateLevelFromXP(totalXP);

      res.json({
        success: true,
        data: { totalXP, level }
      });
    } catch (error) {
      console.error('Error calculating level from XP:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to calculate level from XP'
      });
    }
  }

  /**
   * Calculate current level XP
   */
  async calculateCurrentLevelXP(req: Request, res: Response) {
    try {
      const { totalXP, currentLevel } = req.body;

      const currentLevelXP = calculateCurrentLevelXP(totalXP, currentLevel);

      res.json({
        success: true,
        data: { totalXP, currentLevel, currentLevelXP }
      });
    } catch (error) {
      console.error('Error calculating current level XP:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to calculate current level XP'
      });
    }
  }

  /**
   * Calculate XP to next level
   */
  async calculateXPToNextLevel(req: Request, res: Response) {
    try {
      const { totalXP, currentLevel } = req.body;

      const xpToNext = calculateXPToNextLevel(totalXP, currentLevel);

      res.json({
        success: true,
        data: { totalXP, currentLevel, xpToNext }
      });
    } catch (error) {
      console.error('Error calculating XP to next level:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to calculate XP to next level'
      });
    }
  }

  /**
   * Check level up
   */
  async checkLevelUp(req: Request, res: Response) {
    try {
      const { oldXP, newXP } = req.body;

      const leveledUp = calculateLevelFromXP(newXP) > calculateLevelFromXP(oldXP);

      res.json({
        success: true,
        data: { leveledUp }
      });
    } catch (error) {
      console.error('Error checking level up:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to check level up'
      });
    }
  }

  /**
   * Calculate total XP for level
   */
  async calculateTotalXPForLevel(req: Request, res: Response) {
    try {
      const { targetLevel } = req.body;

      const totalXP = calculateTotalXPForLevel(targetLevel);

      res.json({
        success: true,
        data: { targetLevel, totalXP }
      });
    } catch (error) {
      console.error('Error calculating total XP for level:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to calculate total XP for level'
      });
    }
  }

  /**
   * Update user progress
   */
  async updateProgress(req: Request, res: Response) {
    try {
      const { userId } = req.params;
      const { xpAmount, accuracy, skills } = req.body;

      // TODO: Implement UserLevel model integration
      // For now, return success with mock data
      const mockProgress = {
        level: 1,
        currentXP: 0,
        totalXP: xpAmount || 0,
        xpToNextLevel: 500,
        progressPercentage: 0,
        skills: {
          accuracy: accuracy || 0,
          vocabulary: 0,
          grammar: 0,
          pronunciation: 0,
          fluency: 0
        }
      };

      res.json({
        success: true,
        data: mockProgress
      });
    } catch (error) {
      console.error('Error updating progress:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to update progress'
      });
    }
  }
}

export const progressController = new ProgressController();
