import { Request, Response } from 'express';
import { analyzeMessage } from '../utils/accuracyCalculator';

/**
 * Accuracy Controller
 * Handles message analysis and accuracy calculations
 */

export class AccuracyController {

  /**
   * Analyze message accuracy
   */
  async analyzeMessage(req: Request, res: Response) {
    try {
      const { userMessage, aiResponse } = req.body;

      if (!userMessage) {
        return res.status(400).json({
          success: false,
          message: 'User message is required'
        });
      }

      const analysis = analyzeMessage(userMessage, aiResponse);

      return res.json({
        success: true,
        data: {
          overall: analysis.overall,
          grammar: analysis.grammar,
          vocabulary: analysis.vocabulary,
          spelling: analysis.spelling,
          fluency: analysis.fluency,
          feedback: analysis.feedback,
          timestamp: new Date().toISOString()
        }
      });
    } catch (error) {
      console.error('Error analyzing message:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to analyze message'
      });
    }
  }

  /**
   * Get message analysis history (placeholder)
   */
  async getAnalysisHistory(req: Request, res: Response) {
    try {
      // TODO: Implement analysis history from database
      res.json({
        success: true,
        data: []
      });
    } catch (error) {
      console.error('Error getting analysis history:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to get analysis history'
      });
    }
  }
}

export const accuracyController = new AccuracyController();
