/**
 * Frontend Level Service
 *
 * Frontend-only service for managing user level and XP calculations.
 * All backend operations should go through the API utilities.
 *
 * @module frontendLevelService
 */

import { api } from '../utils/api';


export interface UserLevelData {
  userId: string;
  userName: string;
  userEmail: string;
  level: number;
  currentXP: number;
  totalXP: number;
  xpToNextLevel: number;
  streak: number;
  longestStreak: number;
  totalSessions: number;
  lastSessionDate: string;
  accuracy: number;
  vocabulary: number;
  grammar: number;
  pronunciation: number;
  fluency: number;
  messagesCount: number;
  correctionsReceived: number;
  exercisesCompleted: number;
  achievements: string[];
  badges: string[];
  createdAt: string;
  updatedAt: string;
}

export interface UserStats {
  level: number;
  totalXP: number;
  currentXP: number;
  xpToNextLevel: number;
  progressPercentage: number;
  streak: number;
  longestStreak: number;
  totalSessions: number;
  skills: {
    accuracy: number;
    vocabulary: number;
    grammar: number;
    pronunciation: number;
    fluency: number;
    average: number;
  };
  activity: {
    messagesCount: number;
    correctionsReceived: number;
    exercisesCompleted: number;
  };
  achievements: string[];
  badges: string[];
}

export interface AddXPResponse {
  userLevel: UserLevelData;
  leveledUp: boolean;
  previousLevel: number;
  newLevel: number;
  xpGained: number;
  reason: string;
}

class FrontendLevelService {

  // Initialize user level
  async initializeUserLevel(userId: string, userName: string, userEmail: string): Promise<UserLevelData> {
    try {
      // For frontend, we just update the profile with initial level data
      const response = await api.user.updateProfile({
        level: 1,
        currentXP: 0,
        totalXP: 0,
        xpToNextLevel: 500,
        streak: 0,
        longestStreak: 0,
        totalSessions: 0,
        accuracy: 0,
        vocabulary: 0,
        grammar: 0,
        pronunciation: 0,
        fluency: 0,
      });

      if (response.success) {
        return {
          userId,
          userName,
          userEmail,
          level: 1,
          currentXP: 0,
          totalXP: 0,
          xpToNextLevel: 500,
          streak: 0,
          longestStreak: 0,
          totalSessions: 0,
          lastSessionDate: new Date().toISOString(),
          accuracy: 0,
          vocabulary: 0,
          grammar: 0,
          pronunciation: 0,
          fluency: 0,
          messagesCount: 0,
          correctionsReceived: 0,
          exercisesCompleted: 0,
          achievements: [],
          badges: [],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
      }

      throw new Error('Failed to initialize user level');
    } catch (error: any) {
      console.error('Initialize user level error:', error);
      throw new Error(error.message || 'Failed to initialize user level');
    }
  }

  // Get user level
  async getUserLevel(userId: string): Promise<UserLevelData> {
    try {
      const response = await api.user.getProfile();
      if (response.success && response.data) {
        const userLevel = response.data;
        return {
          userId,
          userName: userLevel.fullName || 'User',
          userEmail: userLevel.email || '',
          level: userLevel.level || 1,
          currentXP: userLevel.currentXP || 0,
          totalXP: userLevel.totalXP || 0,
          xpToNextLevel: userLevel.xpToNextLevel || 500,
          streak: userLevel.streak || 0,
          longestStreak: userLevel.longestStreak || 0,
          totalSessions: userLevel.totalSessions || 0,
          lastSessionDate: userLevel.lastSessionDate || new Date().toISOString(),
          accuracy: userLevel.accuracy || 0,
          vocabulary: userLevel.vocabulary || 0,
          grammar: userLevel.grammar || 0,
          pronunciation: userLevel.pronunciation || 0,
          fluency: userLevel.fluency || 0,
          messagesCount: userLevel.messagesCount || 0,
          correctionsReceived: userLevel.correctionsReceived || 0,
          exercisesCompleted: userLevel.exercisesCompleted || 0,
          achievements: userLevel.achievements || [],
          badges: userLevel.badges || [],
          createdAt: userLevel.createdAt || new Date().toISOString(),
          updatedAt: userLevel.updatedAt || new Date().toISOString(),
        };
      }

      throw new Error('Failed to get user level');
    } catch (error: any) {
      console.error('Get user level error:', error);

      // If user level not found, return null to trigger initialization
      if (error.message?.includes('404') || error.message?.includes('not found')) {
        throw new Error('LEVEL_NOT_FOUND');
      }

      throw new Error(error.message || 'Failed to get user level');
    }
  }

  // Add XP to user
  async addXP(userId: string, xpAmount: number, reason?: string): Promise<AddXPResponse> {
    try {
      const currentLevel = await this.getUserLevel(userId);
      const oldTotalXP = currentLevel.totalXP;
      const newTotalXP = oldTotalXP + xpAmount;

      // Update via API
      const response = await api.user.updateProfile({
        totalXP: newTotalXP,
        level: this.calculateLevelFromXP(newTotalXP),
        currentXP: newTotalXP % 500,
        xpToNextLevel: 500 - (newTotalXP % 500),
      });

      if (response.success) {
        const newLevel = this.calculateLevelFromXP(newTotalXP);
        const leveledUp = newLevel > currentLevel.level;

        return {
          userLevel: {
            ...currentLevel,
            totalXP: newTotalXP,
            level: newLevel,
            currentXP: newTotalXP % 500,
            xpToNextLevel: 500 - (newTotalXP % 500),
          },
          leveledUp,
          previousLevel: currentLevel.level,
          newLevel,
          xpGained: xpAmount,
          reason: reason || 'XP gained',
        };
      }

      throw new Error('Failed to add XP');
    } catch (error: any) {
      console.error('Add XP error:', error);
      throw new Error(error.message || 'Failed to add XP');
    }
  }

  // Update session
  async updateSession(userId: string): Promise<UserLevelData> {
    try {
      const currentLevel = await this.getUserLevel(userId);

      const response = await api.user.updateProfile({
        totalSessions: currentLevel.totalSessions + 1,
        lastSessionDate: new Date().toISOString(),
      });

      if (response.success) {
        return {
          ...currentLevel,
          totalSessions: currentLevel.totalSessions + 1,
          lastSessionDate: new Date().toISOString(),
        };
      }

      throw new Error('Failed to update session');
    } catch (error: any) {
      console.error('Update session error:', error);
      throw new Error(error.message || 'Failed to update session');
    }
  }

  // Update skills
  async updateSkills(
    userId: string,
    skills: {
      accuracy?: number;
      vocabulary?: number;
      grammar?: number;
      pronunciation?: number;
      fluency?: number;
    }
  ): Promise<UserLevelData> {
    try {
      await api.user.updateProfile({ skills });

      // Get updated level data
      const updatedLevel = await this.getUserLevel(userId);
      return updatedLevel;
    } catch (error: any) {
      console.error('Update skills error:', error);
      throw new Error(error.message || 'Failed to update skills');
    }
  }

  // Get user stats
  async getUserStats(userId: string): Promise<UserStats> {
    try {
      const userLevel = await this.getUserLevel(userId);

      return {
        level: userLevel.level,
        totalXP: userLevel.totalXP,
        currentXP: userLevel.currentXP,
        xpToNextLevel: userLevel.xpToNextLevel,
        progressPercentage: Math.round((userLevel.currentXP / userLevel.xpToNextLevel) * 100),
        streak: userLevel.streak,
        longestStreak: userLevel.longestStreak,
        totalSessions: userLevel.totalSessions,
        skills: {
          accuracy: userLevel.accuracy,
          vocabulary: userLevel.vocabulary,
          grammar: userLevel.grammar,
          pronunciation: userLevel.pronunciation,
          fluency: userLevel.fluency,
          average: Math.round((userLevel.accuracy + userLevel.vocabulary + userLevel.grammar + userLevel.pronunciation + userLevel.fluency) / 5),
        },
        activity: {
          messagesCount: userLevel.messagesCount,
          correctionsReceived: userLevel.correctionsReceived,
          exercisesCompleted: userLevel.exercisesCompleted,
        },
        achievements: userLevel.achievements,
        badges: userLevel.badges,
      };
    } catch (error: any) {
      console.error('Get user stats error:', error);
      throw new Error(error.message || 'Failed to get user stats');
    }
  }

  // Calculate XP for different actions
  getXPForAction(action: string): number {
    const xpMap: { [key: string]: number } = {
      'send_message': 5,
      'receive_response': 3,
      'complete_exercise': 20,
      'correct_grammar': 10,
      'learn_vocabulary': 15,
      'practice_pronunciation': 12,
      'daily_login': 10,
      'streak_bonus': 25,
      'perfect_score': 50,
      'help_others': 30
    };

    return xpMap[action] || 5;
  }

  // Helper function to calculate level from XP
  private calculateLevelFromXP(totalXP: number): number {
    return Math.floor(totalXP / 500) + 1;
  }

  // Helper function to calculate current level XP
  private calculateCurrentLevelXP(totalXP: number): number {
    return totalXP % 500;
  }

  // Helper function to calculate XP to next level
  private calculateXPToNextLevel(totalXP: number): number {
    return 500 - this.calculateCurrentLevelXP(totalXP);
  }
}

export const levelService = new FrontendLevelService();
