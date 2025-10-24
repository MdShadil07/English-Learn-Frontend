import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IProgress extends Document {
  _id: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  totalXP: number;
  currentLevel: number;
  currentLevelXP: number;
  xpToNextLevel: number;
  progressPercentage: number;
  levelProgress: number;
  skills: {
    accuracy: number;
    vocabulary: number;
    grammar: number;
    pronunciation: number;
    fluency: number;
    comprehension: number;
  };
  achievements: mongoose.Types.ObjectId[];
  streak: {
    current: number;
    longest: number;
    lastActivityDate: Date;
  };
  stats: {
    totalSessions: number;
    totalTimeSpent: number; // in minutes
    averageSessionTime: number; // in minutes
    lessonsCompleted: number;
    exercisesCompleted: number;
  };
  createdAt: Date;
  updatedAt: Date;
}

const progressSchema = new Schema<IProgress>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
      unique: true,
      index: true,
    },
    totalXP: {
      type: Number,
      default: 0,
      min: [0, 'Total XP cannot be negative'],
    },
    currentLevel: {
      type: Number,
      default: 1,
      min: [1, 'Level must be at least 1'],
    },
    currentLevelXP: {
      type: Number,
      default: 0,
      min: [0, 'Current level XP cannot be negative'],
    },
    xpToNextLevel: {
      type: Number,
      default: 500,
      min: [0, 'XP to next level cannot be negative'],
    },
    progressPercentage: {
      type: Number,
      default: 0,
      min: [0, 'Progress percentage cannot be negative'],
      max: [100, 'Progress percentage cannot exceed 100'],
    },
    skills: {
      accuracy: { type: Number, default: 0, min: 0, max: 100 },
      vocabulary: { type: Number, default: 0, min: 0, max: 100 },
      grammar: { type: Number, default: 0, min: 0, max: 100 },
      pronunciation: { type: Number, default: 0, min: 0, max: 100 },
      fluency: { type: Number, default: 0, min: 0, max: 100 },
      comprehension: { type: Number, default: 0, min: 0, max: 100 },
    },
    achievements: [{
      type: Schema.Types.ObjectId,
      ref: 'Achievement',
    }],
    streak: {
      current: { type: Number, default: 0, min: 0 },
      longest: { type: Number, default: 0, min: 0 },
      lastActivityDate: { type: Date, default: null },
    },
    stats: {
      totalSessions: { type: Number, default: 0, min: 0 },
      totalTimeSpent: { type: Number, default: 0, min: 0 }, // in minutes
      averageSessionTime: { type: Number, default: 0, min: 0 }, // in minutes
      lessonsCompleted: { type: Number, default: 0, min: 0 },
      exercisesCompleted: { type: Number, default: 0, min: 0 },
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for better performance
progressSchema.index({ totalXP: -1 });
progressSchema.index({ currentLevel: -1 });
progressSchema.index({ 'streak.current': -1 });

// Virtual for level progress percentage
progressSchema.virtual('levelProgress').get(function (this: IProgress) {
  if (this.xpToNextLevel === 0) return 100;
  return (this.currentLevelXP / (this.currentLevelXP + this.xpToNextLevel)) * 100;
});

// Pre-save middleware to calculate progress percentage
progressSchema.pre('save', function (next) {
  this.progressPercentage = Math.round(this.levelProgress);
  next();
});

const Progress: Model<IProgress> = mongoose.model<IProgress>('Progress', progressSchema);

export default Progress;
