import React from 'react';
import { motion } from 'framer-motion';
import { BookOpen, MessageSquare, Award, Users, Clock, TrendingUp } from 'lucide-react';
import { cn } from '@/lib/utils';

interface RecentActivity {
  id: string;
  type: string;
  title: string;
  time: string;
  icon: any;
  color: string;
}

interface ActivityCardProps {
  activities: RecentActivity[];
  onViewAll?: () => void;
}

// Function to get activity-specific styling
export const getActivityStyle = (type: string, color: string) => {
  const styleMap: Record<string, { gradient: string; bgColor: string; iconBg: string; textColor: string }> = {
    lesson: {
      gradient: 'from-emerald-500 to-teal-500',
      bgColor: 'bg-emerald-50/80 dark:bg-emerald-900/30',
      iconBg: 'bg-gradient-to-br from-emerald-400 to-teal-500',
      textColor: 'text-emerald-700 dark:text-emerald-300'
    },
    practice: {
      gradient: 'from-blue-500 to-cyan-500',
      bgColor: 'bg-blue-50/80 dark:bg-blue-900/30',
      iconBg: 'bg-gradient-to-br from-blue-400 to-cyan-500',
      textColor: 'text-blue-700 dark:text-blue-300'
    },
    achievement: {
      gradient: 'from-purple-500 to-pink-500',
      bgColor: 'bg-purple-50/80 dark:bg-purple-900/30',
      iconBg: 'bg-gradient-to-br from-purple-400 to-pink-500',
      textColor: 'text-purple-700 dark:text-purple-300'
    },
    room: {
      gradient: 'from-orange-500 to-amber-500',
      bgColor: 'bg-orange-50/80 dark:bg-orange-900/30',
      iconBg: 'bg-gradient-to-br from-orange-400 to-amber-500',
      textColor: 'text-orange-700 dark:text-orange-300'
    }
  };

  return styleMap[type] || styleMap.lesson;
};

// Function to get time ago styling
const getTimeStyle = (time: string) => {
  const timeLower = time.toLowerCase();
  if (timeLower.includes('minute') || timeLower.includes('hour')) {
    return 'text-emerald-600 dark:text-emerald-400';
  } else if (timeLower.includes('day') || timeLower.includes('week')) {
    return 'text-slate-500 dark:text-slate-400';
  }
  return 'text-slate-600 dark:text-slate-500';
};

const ActivityCard: React.FC<ActivityCardProps> = ({ activities, onViewAll }) => {
  return (
    <div className="space-y-3">
      {activities.map((activity, index) => {
        const activityStyle = getActivityStyle(activity.type, activity.color);

        return (
          <motion.div
            key={activity.id}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{
              delay: 0.1 + index * 0.1,
              duration: 0.5,
              type: "spring",
              stiffness: 100
            }}
            whileHover={{
              scale: 1.02,
              y: -2,
              transition: { duration: 0.2 }
            }}
            className="group cursor-pointer"
          >
            <div className="relative overflow-hidden rounded-2xl bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border border-emerald-200/30 dark:border-emerald-700/30 hover:bg-white/90 dark:hover:bg-slate-800/90 transition-all duration-300 hover:shadow-lg hover:border-emerald-300/40 dark:hover:border-emerald-600/40">
              {/* Hover glow effect */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-emerald-400/0 via-teal-400/0 to-cyan-400/0 group-hover:from-emerald-400/10 group-hover:via-teal-400/10 group-hover:to-cyan-400/10 transition-all duration-300 -z-10"></div>

              <div className="p-4">
                <div className="flex items-start gap-4">
                  {/* Enhanced Icon */}
                  <motion.div
                    className={cn(
                      'flex-shrink-0 p-3 rounded-2xl shadow-lg transition-all duration-300 group-hover:scale-110',
                      activityStyle.iconBg
                    )}
                    whileHover={{
                      rotate: [0, -5, 5, 0],
                      scale: 1.1
                    }}
                    transition={{ duration: 0.4 }}
                  >
                    <activity.icon className="h-5 w-5 text-white drop-shadow-sm" />
                  </motion.div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <motion.div
                      className="flex items-start justify-between mb-2"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.2 + index * 0.1 }}
                    >
                      <div className="flex-1">
                        <motion.h4
                          className={cn(
                            'text-sm font-semibold leading-tight mb-1 transition-colors duration-300 group-hover:text-emerald-700 dark:group-hover:text-emerald-300',
                            activityStyle.textColor
                          )}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.3 + index * 0.1 }}
                        >
                          {activity.title}
                        </motion.h4>

                        {/* Activity type badge */}
                        <motion.div
                          className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-emerald-100/80 dark:bg-emerald-900/40 text-xs font-medium text-emerald-700 dark:text-emerald-300 border border-emerald-200/40 dark:border-emerald-700/40"
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 0.4 + index * 0.1 }}
                          whileHover={{ scale: 1.05 }}
                        >
                          <div className={`w-1.5 h-1.5 rounded-full bg-gradient-to-r ${activityStyle.gradient}`}></div>
                          <span className="capitalize">{activity.type}</span>
                        </motion.div>
                      </div>

                      {/* Time indicator */}
                      <motion.div
                        className="flex-shrink-0 flex flex-col items-end"
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 + index * 0.1 }}
                      >
                        <div className={cn(
                          'flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full',
                          activityStyle.bgColor,
                          getTimeStyle(activity.time)
                        )}>
                          <Clock className="h-3 w-3" />
                          <span>{activity.time}</span>
                        </div>
                      </motion.div>
                    </motion.div>

                    {/* Progress indicator line */}
                    <motion.div
                      className="w-full h-0.5 bg-gradient-to-r from-transparent via-emerald-200/50 to-transparent dark:via-emerald-700/30 rounded-full"
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: 1 }}
                      transition={{ delay: 0.5 + index * 0.1, duration: 0.8 }}
                    />
                  </div>
                </div>

                {/* Subtle decorative elements */}
                <div className="absolute top-2 right-2 w-8 h-8 rounded-full bg-gradient-to-br from-emerald-200/20 to-teal-200/20 dark:from-emerald-700/10 dark:to-teal-700/10 blur-sm group-hover:scale-150 transition-transform duration-500"></div>
              </div>
            </div>
          </motion.div>
        );
      })}

      {/* View All Button */}
      {onViewAll && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 + activities.length * 0.1 }}
          className="pt-2"
        >
          <motion.button
            onClick={onViewAll}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-2xl bg-gradient-to-r from-emerald-50/80 to-teal-50/80 dark:from-emerald-900/30 dark:to-teal-900/30 border border-emerald-200/40 dark:border-emerald-700/40 text-emerald-700 dark:text-emerald-300 font-medium hover:bg-gradient-to-r hover:from-emerald-100/90 hover:to-teal-100/90 dark:hover:from-emerald-800/40 dark:hover:to-teal-800/40 hover:shadow-md transition-all duration-300 hover:scale-[1.02]"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <TrendingUp className="h-4 w-4" />
            View All Activity
            <motion.div
              animate={{ x: [0, 3, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              <span className="text-emerald-500">→</span>
            </motion.div>
          </motion.button>
        </motion.div>
      )}
    </div>
  );
};

export default ActivityCard;
