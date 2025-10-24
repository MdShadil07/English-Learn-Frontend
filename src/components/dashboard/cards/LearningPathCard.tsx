import React from 'react';
import { motion } from 'framer-motion';
import { Play, ArrowRight } from 'lucide-react';
import { CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

interface LearningPath {
  id: string;
  title: string;
  description: string;
  icon: any;
  progress: number;
  totalLessons: number;
  completedLessons: number;
  color: string;
  gradient: string;
}

interface LearningPathCardProps {
  path: LearningPath;
  index: number;
  onContinue?: (pathId: string) => void;
}

const LearningPathCard: React.FC<LearningPathCardProps> = ({ path, index, onContinue }) => {
  // Function to determine progress bar color based on percentage
  const getProgressColor = (progress: number) => {
    if (progress >= 75) {
      return 'bg-gradient-to-r from-green-500 to-emerald-500'; // Excellent - Green
    } else if (progress >= 50) {
      return 'bg-gradient-to-r from-yellow-500 to-amber-500'; // Good - Yellow
    } else if (progress >= 25) {
      return 'bg-gradient-to-r from-orange-500 to-red-500'; // Moderate - Orange to Red
    } else {
      return 'bg-gradient-to-r from-red-500 to-red-600'; // Just starting - Red
    }
  };

  // Function to get progress status color for text
  const getProgressStatusColor = (progress: number) => {
    if (progress >= 75) {
      return 'text-green-600 dark:text-green-400'; // Excellent
    } else if (progress >= 50) {
      return 'text-yellow-600 dark:text-yellow-400'; // Good
    } else if (progress >= 25) {
      return 'text-orange-600 dark:text-orange-400'; // Moderate
    } else {
      return 'text-red-600 dark:text-red-400'; // Needs attention
    }
  };

  // Function to get progress status text
  const getProgressStatusText = (progress: number) => {
    if (progress >= 75) {
      return 'Excellent Progress';
    } else if (progress >= 50) {
      return 'Good Progress';
    } else if (progress >= 25) {
      return 'Making Progress';
    } else {
      return 'Just Started';
    }
  };
  return (
    <motion.div
      key={path.id}
      initial={{ opacity: 0, y: 30, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        delay: 0.5 + index * 0.1,
        duration: 0.6,
        type: "spring",
        stiffness: 100
      }}
      whileHover={{
        y: -8,
        scale: 1.02,
        transition: { duration: 0.2 }
      }}
      className="group cursor-pointer"
    >
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-white/90 via-emerald-50/50 to-teal-50/80 dark:from-slate-800/90 dark:via-emerald-900/30 dark:to-teal-900/40 backdrop-blur-xl border border-emerald-200/30 dark:border-emerald-700/30 shadow-xl hover:shadow-2xl transition-all duration-500">
        {/* Background decorative elements */}
        <div className="absolute -top-10 -right-10 w-24 h-24 rounded-full bg-gradient-to-br from-emerald-300/20 to-teal-300/20 dark:from-emerald-700/20 dark:to-teal-700/20 blur-xl group-hover:scale-150 transition-transform duration-700"></div>
        <div className="absolute -bottom-8 -left-8 w-16 h-16 rounded-full bg-gradient-to-br from-cyan-300/20 to-emerald-300/20 dark:from-cyan-700/20 dark:to-emerald-700/20 blur-lg group-hover:scale-125 transition-transform duration-500"></div>

        {/* Hover glow effect */}
        <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-emerald-400/0 via-teal-400/0 to-cyan-400/0 group-hover:from-emerald-400/10 group-hover:via-teal-400/10 group-hover:to-cyan-400/10 transition-all duration-500 -z-10"></div>

        <CardContent className="relative p-8">
          {/* Enhanced Icon with modern styling */}
          <motion.div
            className={cn(
              'w-16 h-16 rounded-2xl bg-gradient-to-br flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-lg',
              path.gradient
            )}
            whileHover={{
              rotate: [0, -10, 10, 0],
              transition: { duration: 0.5 }
            }}
          >
            <path.icon className="h-8 w-8 text-white drop-shadow-lg" />
          </motion.div>

          {/* Content with enhanced styling */}
          <div className="space-y-6">
            <div className="space-y-3">
              <motion.div
                className="flex items-start justify-between"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 + index * 0.1 }}
              >
                <div className="space-y-2">
                  <motion.h3
                    className="font-bold text-xl text-emerald-900 dark:text-white group-hover:text-emerald-700 dark:group-hover:text-emerald-300 transition-colors"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.7 + index * 0.1 }}
                  >
                    {path.title}
                  </motion.h3>
                  <motion.p
                    className="text-sm text-emerald-600 dark:text-emerald-400 leading-relaxed"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8 + index * 0.1 }}
                  >
                    {path.description}
                  </motion.p>
                </div>
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.9 + index * 0.1 }}
                  whileHover={{ scale: 1.1 }}
                >
                  <Badge className={cn("border-0 shadow-lg px-3 py-1", getProgressColor(path.progress), "text-white")}>
                    {path.completedLessons}/{path.totalLessons}
                  </Badge>
                </motion.div>
              </motion.div>

              {/* Enhanced Progress Section */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
                className="space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-emerald-700 dark:text-emerald-300">Progress</span>
                  <div className="flex items-center gap-2">
                    <span className={`text-sm font-bold ${getProgressStatusColor(path.progress)}`}>
                      {getProgressStatusText(path.progress)}
                    </span>
                    <span className="text-sm font-bold text-emerald-800 dark:text-emerald-200">
                      {Math.round(path.progress)}%
                    </span>
                  </div>
                </div>

                {/* Enhanced percentage display */}
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-emerald-600 dark:text-emerald-400">
                    {path.completedLessons} of {path.totalLessons} lessons completed
                  </span>
                  <motion.span
                    className={`text-lg font-bold ${getProgressStatusColor(path.progress)}`}
                    key={path.progress}
                    initial={{ scale: 1.2 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.4, delay: 0.5 + index * 0.1 }}
                  >
                    {Math.max(0, Math.min(100, Math.round(path.progress)))}%
                  </motion.span>
                </div>

                <div className="relative">
                  {/* Progress background with simple styling */}
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
                    <motion.div
                      className={cn("h-3 rounded-full transition-all duration-500", getProgressColor(path.progress))}
                      style={{ width: `${Math.max(0, Math.min(100, path.progress))}%` }}
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.max(0, Math.min(100, path.progress))}%` }}
                      transition={{
                        duration: 0.8,
                        delay: 0.2 + index * 0.1,
                        ease: "easeOut"
                      }}
                    />
                  </div>

                  {/* Immediate visual feedback - shows progress instantly */}
                  <div
                    className={cn("absolute top-0 left-0 h-3 rounded-full transition-all duration-300", getProgressColor(path.progress))}
                    style={{
                      width: `${Math.max(0, Math.min(100, path.progress))}%`,
                      opacity: 0.7
                    }}
                  />
                </div>

                {/* Progress quality indicator */}
                <div className="flex items-center justify-center gap-1 mt-2">
                  {Array.from({ length: 5 }, (_, i) => {
                    const isActive = i < Math.floor(path.progress / 20);
                    return (
                      <motion.div
                        key={i}
                        className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                          isActive
                            ? getProgressColor(path.progress).includes('green')
                              ? 'bg-green-500 dark:bg-green-400'
                              : getProgressColor(path.progress).includes('yellow')
                              ? 'bg-yellow-500 dark:bg-yellow-400'
                              : getProgressColor(path.progress).includes('orange')
                              ? 'bg-orange-500 dark:bg-orange-400'
                              : 'bg-red-500 dark:bg-red-400'
                            : 'bg-gray-200 dark:bg-gray-700'
                        }`}
                        animate={{
                          scale: isActive ? [1, 1.3, 1] : 1,
                          opacity: isActive ? 1 : 0.3
                        }}
                        transition={{ delay: 0.6 + i * 0.05 + index * 0.1 }}
                      />
                    );
                  })}
                </div>
              </motion.div>
            </div>

            {/* Enhanced Button */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2 + index * 0.1 }}
              className="pt-2"
            >
              <Button
                className={cn(
                  'w-full bg-gradient-to-r text-white font-semibold rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 group-hover:shadow-emerald-500/25 border-0 py-3 hover:scale-[1.02]',
                  path.gradient,
                  'hover:from-opacity-90 hover:to-opacity-90'
                )}
                onClick={() => onContinue?.(path.id)}
              >
                <motion.div
                  className="flex items-center justify-center gap-2"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Play className="h-4 w-4" />
                  Continue Learning
                  <motion.div
                    animate={{ x: [0, 4, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    <ArrowRight className="h-4 w-4" />
                  </motion.div>
                </motion.div>
              </Button>
            </motion.div>
          </div>
        </CardContent>
      </div>
    </motion.div>
  );
};

export default LearningPathCard;
