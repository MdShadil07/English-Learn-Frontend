import { analyzeMessageAccuracy } from '../utils/accuracy/accuracyCalculator';

export interface AccuracyResult {
  overall: number;
  grammar: number;
  vocabulary: number;
  spelling: number;
  fluency: number;
  feedback: string[];
  timestamp?: string;
}

export interface MessageAnalysis {
  userMessage: string;
  aiResponse: string;
  timestamp: Date;
  quality: AccuracyResult;
}

export interface AccuracyState {
  currentAccuracy: number;
  messageQualityScores: number[];
  allHistoricalScores: number[];
  totalMessages: number;
  qualityMessages: number;
}

export interface XPGainResult {
  xpGained: number;
  newTotalXP: number;
  levelInfo: {
    level: number;
    currentXP: number;
    xpToNextLevel: number;
    progressPercentage: number;
  };
  leveledUp: boolean;
  oldLevel: number;
  newLevel: number;
}

/**
 * Frontend Accuracy Service
 * Handles accuracy analysis and integrates with backend
 */
export class FrontendAccuracyService {
  private state: AccuracyState = {
    currentAccuracy: 0,
    messageQualityScores: [],
    allHistoricalScores: [],
    totalMessages: 0,
    qualityMessages: 0,
  };

  private allHistoricalScores: number[] = [];

  /**
   * Analyze message accuracy using backend API
   */
  async analyzeMessage(userMessage: string, aiResponse?: string): Promise<AccuracyResult> {
    try {
      // Use frontend calculation for now
      const analysis = await analyzeMessageAccuracy(userMessage, aiResponse);

      console.log(`📊 Frontend accuracy analysis: ${analysis.overall}%`);
      return analysis;
    } catch (error) {
      console.error('Accuracy analysis failed:', error);
      throw error;
    }
  }

  /**
   * Fallback message analysis (frontend calculation)
   */
  private fallbackAnalyzeMessage(userMessage: string, aiResponse?: string): AccuracyResult {
    const analysis = analyzeMessage(userMessage, aiResponse);

    console.log(`📊 Frontend accuracy analysis (fallback): ${analysis.overall}%`);
    return analysis;
  }

  /**
   * Process message exchange and update accuracy
   */
  async processMessageExchange(
    userMessage: string,
    aiResponse: string,
    userId: string
  ): Promise<{ accuracy: AccuracyResult; xpGained: number }> {
    try {
      // Analyze accuracy
      const accuracyResult = await this.analyzeMessage(userMessage, aiResponse);

      // Update accuracy in progress service
      await this.updateAccuracy(userId, accuracyResult.overall);

      // Calculate XP gain based on accuracy
      const xpGained = this.calculateXPGain(accuracyResult.overall, userMessage.length);

      console.log(`✅ Message processed: ${accuracyResult.overall}% accuracy, +${xpGained} XP`);

      return {
        accuracy: accuracyResult,
        xpGained,
      };
    } catch (error) {
      console.error('Failed to process message exchange:', error);
      throw error;
    }
  }

  /**
   * Update accuracy and sync with backend
   */
  async updateAccuracy(userId: string, qualityScore: number): Promise<number> {
    // Update local state
    this.allHistoricalScores.push(qualityScore);
    const newScores = [...this.state.messageQualityScores, qualityScore].slice(-20);
    this.state.messageQualityScores = newScores;

    // Calculate cumulative accuracy from local scores
    const cumulativeAccuracy = this.allHistoricalScores.length > 0
      ? Math.round(this.allHistoricalScores.reduce((sum, score) => sum + score, 0) / this.allHistoricalScores.length)
      : qualityScore;

    this.state.currentAccuracy = cumulativeAccuracy;
    this.state.totalMessages = this.allHistoricalScores.length;
    this.state.qualityMessages = this.allHistoricalScores.filter(s => s >= 80).length;

    console.log(`📊 Frontend accuracy updated: ${cumulativeAccuracy}% (Based on ${this.allHistoricalScores.length} total messages)`);
    return cumulativeAccuracy;
  }

  /**
   * Calculate XP gain based on accuracy and message length
   */
  private calculateXPGain(accuracy: number, messageLength: number): number {
    let baseXP = Math.floor(accuracy * 0.1); // 0-10 XP based on accuracy

    // Bonus for longer messages (engagement)
    if (messageLength > 50) baseXP += 5;
    else if (messageLength > 20) baseXP += 2;

    // Bonus for high accuracy
    if (accuracy > 90) baseXP += 5;
    else if (accuracy > 80) baseXP += 2;

    return Math.max(1, baseXP);
  }

  /**
   * Get current accuracy state
   */
  getState(): AccuracyState {
    return { ...this.state };
  }

  /**
   * Reset accuracy state
   */
  reset(): void {
    this.state = {
      currentAccuracy: 0,
      messageQualityScores: [],
      allHistoricalScores: [],
      totalMessages: 0,
      qualityMessages: 0,
    };
  }
}

// Export singleton instance
export const accuracyService = new FrontendAccuracyService();
