/**
 * Frontend Accuracy Calculator
 * Analyzes user messages and AI responses to calculate accuracy scores
 */

export interface AccuracyResult {
  overall: number;
  grammar: number;
  vocabulary: number;
  spelling: number;
  fluency: number;
  feedback: string[];
}

export interface MessageAnalysis {
  userMessage: string;
  aiResponse: string;
  timestamp: Date;
  quality: AccuracyResult;
}

/**
 * Frontend Accuracy Calculator
 * Analyzes user messages and AI responses to calculate accuracy scores
 */

export interface AccuracyResult {
  overall: number;
  grammar: number;
  vocabulary: number;
  spelling: number;
  fluency: number;
  feedback: string[];
}

export interface MessageAnalysis {
  userMessage: string;
  aiResponse: string;
  timestamp: Date;
  quality: AccuracyResult;
}

/**
 * Analyzes a user's message for English accuracy using backend API
 * @param userMessage - The user's message
 * @param aiResponse - The AI's response (optional)
 * @returns Accuracy analysis result
 */
export const analyzeMessageAccuracy = async (
  userMessage: string,
  aiResponse?: string
): Promise<AccuracyResult> => {
  try {
    // Try backend API first
    const response = await fetch('http://localhost:5000/api/accuracy/analyze', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userMessage,
        aiResponse: aiResponse || '',
      }),
    });

    if (response.ok) {
      const data = await response.json();
      if (data.success) {
        return {
          overall: data.data.overall,
          grammar: data.data.grammar,
          vocabulary: data.data.vocabulary,
          spelling: data.data.spelling,
          fluency: data.data.fluency,
          feedback: data.data.feedback || [],
        };
      }
    }

    throw new Error('Backend API failed');
  } catch (error) {
    console.log('Backend accuracy analysis failed, using frontend fallback');
    // Fallback to frontend calculation
    return fallbackAnalyzeMessage(userMessage, aiResponse);
  }
};

/**
 * Fallback message analysis (frontend calculation)
 */
const fallbackAnalyzeMessage = (
  userMessage: string,
  aiResponse?: string
): AccuracyResult => {
  const result: AccuracyResult = {
    overall: 0,
    grammar: 0,
    vocabulary: 0,
    spelling: 0,
    fluency: 0,
    feedback: [],
  };

  if (!userMessage || userMessage.trim().length === 0) {
    return result;
  }

  const message = userMessage.toLowerCase().trim();
  const words = message.split(/\s+/);
  const sentences = message.split(/[.!?]+/).filter(s => s.trim().length > 0);

  // Basic grammar analysis
  result.grammar = analyzeGrammar(message, sentences);

  // Vocabulary analysis
  result.vocabulary = analyzeVocabulary(words);

  // Spelling analysis (basic)
  result.spelling = analyzeSpelling(message);

  // Fluency analysis
  result.fluency = analyzeFluency(message, sentences);

  // Overall score
  result.overall = Math.round(
    (result.grammar * 0.3 +
     result.vocabulary * 0.3 +
     result.spelling * 0.2 +
     result.fluency * 0.2)
  );

  // Generate feedback
  result.feedback = generateFeedback(result, message);

  return result;
};

/**
 * Analyze grammar patterns
 */
function analyzeGrammar(message: string, sentences: string[]): number {
  let score = 100;

  // Check for basic sentence structure
  if (sentences.length === 0) return 0;

  sentences.forEach(sentence => {
    const trimmed = sentence.trim();

    // Check for subject-verb agreement (basic)
    if (trimmed.length > 10) {
      // Simple heuristic: longer sentences should have more structure
      if (!trimmed.includes(' ') || trimmed.split(' ').length < 3) {
        score -= 15;
      }
    }

    // Check for common grammar mistakes
    if (trimmed.includes(' i ')) score -= 10; // Should be "I"
    if (trimmed.includes(' dont ')) score -= 5;
    if (trimmed.includes(' cant ')) score -= 5;
    if (trimmed.includes(' wont ')) score -= 5;
  });

  return Math.max(0, score);
}

/**
 * Analyze vocabulary usage
 */
function analyzeVocabulary(words: string[]): number {
  let score = 100;

  if (words.length === 0) return 0;

  const commonWords = new Set([
    'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by',
    'i', 'you', 'he', 'she', 'it', 'we', 'they', 'me', 'him', 'her', 'us', 'them',
    'is', 'am', 'are', 'was', 'were', 'be', 'been', 'being', 'have', 'has', 'had',
    'do', 'does', 'did', 'will', 'would', 'could', 'should', 'may', 'might', 'must',
    'this', 'that', 'these', 'those', 'here', 'there', 'where', 'when', 'why', 'how',
    'what', 'who', 'which', 'where', 'when', 'why', 'how'
  ]);

  const uniqueWords = new Set(words.filter(word =>
    word.length > 2 && !commonWords.has(word.toLowerCase())
  ));

  // Bonus for vocabulary diversity
  const diversityRatio = uniqueWords.size / words.length;
  score += diversityRatio * 50;

  // Penalty for repetition
  const wordCounts = new Map<string, number>();
  words.forEach(word => {
    const cleanWord = word.toLowerCase().replace(/[^a-z]/g, '');
    if (cleanWord.length > 2) {
      wordCounts.set(cleanWord, (wordCounts.get(cleanWord) || 0) + 1);
    }
  });

  const repeatedWords = Array.from(wordCounts.values()).filter(count => count > 3).length;
  score -= repeatedWords * 10;

  return Math.max(0, Math.min(100, score));
}

/**
 * Basic spelling analysis
 */
function analyzeSpelling(message: string): number {
  let score = 100;

  // Common misspellings
  const commonMisspellings: Record<string, string> = {
    'teh': 'the',
    'recieve': 'receive',
    'seperate': 'separate',
    'occured': 'occurred',
    'definately': 'definitely',
    'neccessary': 'necessary',
    'begining': 'beginning',
    'recieve': 'receive',
    'acheive': 'achieve',
    'buisness': 'business'
  };

  Object.keys(commonMisspellings).forEach(misspelling => {
    if (message.toLowerCase().includes(misspelling)) {
      score -= 20;
    }
  });

  // Check for excessive capitalization (might indicate poor spelling awareness)
  const capitalLetters = message.replace(/[^A-Z]/g, '').length;
  const totalLetters = message.replace(/[^a-zA-Z]/g, '').length;

  if (totalLetters > 0) {
    const capitalRatio = capitalLetters / totalLetters;
    if (capitalRatio > 0.3) {
      score -= (capitalRatio - 0.3) * 100;
    }
  }

  return Math.max(0, score);
}

/**
 * Analyze fluency and naturalness
 */
function analyzeFluency(message: string, sentences: string[]): number {
  let score = 100;

  if (sentences.length === 0) return 0;

  // Average sentence length (ideal: 10-20 words)
  const avgSentenceLength = message.split(/\s+/).length / sentences.length;
  if (avgSentenceLength < 5) score -= 20;
  else if (avgSentenceLength > 30) score -= 15;

  // Variety in sentence structure
  const shortSentences = sentences.filter(s => s.trim().split(/\s+/).length < 5).length;
  const longSentences = sentences.filter(s => s.trim().split(/\s+/).length > 20).length;

  if (shortSentences > sentences.length * 0.5) score -= 15;
  if (longSentences > sentences.length * 0.3) score -= 10;

  // Check for filler words overuse
  const fillerWords = ['um', 'uh', 'like', 'you know', 'so', 'actually'];
  fillerWords.forEach(filler => {
    const count = (message.toLowerCase().match(new RegExp(filler, 'g')) || []).length;
    score -= count * 5;
  });

  return Math.max(0, score);
}

/**
 * Generate constructive feedback
 */
function generateFeedback(result: AccuracyResult, message: string): string[] {
  const feedback: string[] = [];

  if (result.grammar < 70) {
    feedback.push("Try to use complete sentences with proper subject-verb agreement.");
  }

  if (result.vocabulary < 70) {
    feedback.push("Try using more varied vocabulary words in your responses.");
  }

  if (result.spelling < 80) {
    feedback.push("Check your spelling carefully before sending messages.");
  }

  if (result.fluency < 70) {
    feedback.push("Try to speak in complete thoughts and avoid filler words.");
  }

  if (result.overall > 85) {
    feedback.push("Great job! Your English is very clear and well-structured.");
  } else if (result.overall > 70) {
    feedback.push("Good effort! Keep practicing to improve your accuracy.");
  } else {
    feedback.push("Keep working on your English skills. Practice makes perfect!");
  }

  return feedback;
}

/**
 * Calculate XP reward based on accuracy
 */
export const calculateAccuracyXP = (accuracy: number, messageLength: number): number => {
  let baseXP = Math.floor(accuracy * 0.1); // 0-10 XP based on accuracy

  // Bonus for longer messages (engagement)
  if (messageLength > 50) baseXP += 5;
  else if (messageLength > 20) baseXP += 2;

  // Bonus for high accuracy
  if (accuracy > 90) baseXP += 5;
  else if (accuracy > 80) baseXP += 2;

  return Math.max(1, baseXP);
};

/**
 * Track message history for progress analysis
 */
class AccuracyTracker {
  private history: MessageAnalysis[] = [];
  private readonly maxHistory = 50;

  addAnalysis(userMessage: string, aiResponse: string, quality: AccuracyResult) {
    const analysis: MessageAnalysis = {
      userMessage,
      aiResponse,
      timestamp: new Date(),
      quality,
    };

    this.history.unshift(analysis);

    // Keep only recent history
    if (this.history.length > this.maxHistory) {
      this.history = this.history.slice(0, this.maxHistory);
    }
  }

  getAverageAccuracy(): number {
    if (this.history.length === 0) return 0;

    const total = this.history.reduce((sum, analysis) => sum + analysis.quality.overall, 0);
    return Math.round(total / this.history.length);
  }

  getRecentTrend(): number {
    if (this.history.length < 5) return 0;

    const recent = this.history.slice(0, 5);
    const older = this.history.slice(5, 10);

    const recentAvg = recent.reduce((sum, a) => sum + a.quality.overall, 0) / recent.length;
    const olderAvg = older.reduce((sum, a) => sum + a.quality.overall, 0) / older.length;

    return recentAvg - olderAvg;
  }

  getSkillBreakdown() {
    if (this.history.length === 0) {
      return { grammar: 0, vocabulary: 0, spelling: 0, fluency: 0 };
    }

    const skills = this.history.reduce(
      (acc, analysis) => ({
        grammar: acc.grammar + analysis.quality.grammar,
        vocabulary: acc.vocabulary + analysis.quality.vocabulary,
        spelling: acc.spelling + analysis.quality.spelling,
        fluency: acc.fluency + analysis.quality.fluency,
      }),
      { grammar: 0, vocabulary: 0, spelling: 0, fluency: 0 }
    );

    const count = this.history.length;
    return {
      grammar: Math.round(skills.grammar / count),
      vocabulary: Math.round(skills.vocabulary / count),
      spelling: Math.round(skills.spelling / count),
      fluency: Math.round(skills.fluency / count),
    };
  }
}

export const accuracyTracker = new AccuracyTracker();
