import React from 'react';
import { motion } from 'framer-motion';
import { Video, Users, Clock, UserCheck, Zap } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface PracticeRoom {
  name: string;
  members: number;
  level: string;
  status: 'live' | 'scheduled';
}

interface CommunityRoomCardProps {
  rooms: PracticeRoom[];
}

// Function to get room-specific styling
export const getRoomStyle = (status: string, level: string) => {
  const baseStyles = {
    live: {
      gradient: 'from-green-500 to-emerald-500',
      bgColor: 'bg-green-50/80 dark:bg-green-900/30',
      iconBg: 'bg-gradient-to-br from-green-400 to-emerald-500',
      textColor: 'text-green-700 dark:text-green-300',
      badgeColor: 'bg-gradient-to-r from-green-500 to-emerald-500 text-white border-0 shadow-lg'
    },
    scheduled: {
      gradient: 'from-blue-500 to-cyan-500',
      bgColor: 'bg-blue-50/80 dark:bg-blue-900/30',
      iconBg: 'bg-gradient-to-br from-blue-400 to-cyan-500',
      textColor: 'text-blue-700 dark:text-blue-300',
      badgeColor: 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white border-0 shadow-lg'
    }
  };

  return baseStyles[status as keyof typeof baseStyles] || baseStyles.scheduled;
};

const CommunityRoomCard: React.FC<CommunityRoomCardProps> = ({ rooms }) => {
  return (
    <div className="space-y-3 sm:space-y-4">
      {rooms.map((room, index) => {
        const roomStyle = getRoomStyle(room.status, room.level);

        return (
          <motion.div
            key={room.name}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{
              delay: 0.1 + index * 0.15,
              duration: 0.6,
              type: "spring",
              stiffness: 100
            }}
            whileHover={{
              scale: 1.02,
              y: -4,
              transition: { duration: 0.2 }
            }}
            className="group cursor-pointer"
          >
            <div className="relative overflow-hidden rounded-2xl bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border border-emerald-200/30 dark:border-emerald-700/30 hover:bg-white/90 dark:hover:bg-slate-800/90 transition-all duration-300 hover:shadow-lg hover:border-emerald-300/40 dark:hover:border-emerald-600/40">
              {/* Hover glow effect */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-emerald-400/0 via-teal-400/0 to-cyan-400/0 group-hover:from-emerald-400/10 group-hover:via-teal-400/10 group-hover:to-cyan-400/10 transition-all duration-300 -z-10"></div>

              <div className="p-3 sm:p-4 lg:p-5">
                <div className="flex items-start gap-3 sm:gap-4">
                  {/* Enhanced Icon with status indicator */}
                  <motion.div className="flex flex-col items-center flex-shrink-0">
                    <motion.div
                      className={cn(
                        'w-10 h-10 sm:w-12 sm:h-12 rounded-2xl flex items-center justify-center shadow-lg transition-all duration-300 group-hover:scale-110',
                        roomStyle.iconBg
                      )}
                      whileHover={{
                        rotate: [0, -5, 5, 0],
                        scale: 1.1
                      }}
                      transition={{ duration: 0.4 }}
                    >
                      <Video className="h-4 w-4 sm:h-5 sm:w-5 text-white drop-shadow-sm" />
                    </motion.div>

                    {/* Status indicator */}
                    <motion.div
                      className={cn(
                        'mt-1 sm:mt-2 px-2 py-1 rounded-full text-xs font-medium border',
                        roomStyle.bgColor,
                        roomStyle.textColor,
                        'border-emerald-200/40 dark:border-emerald-700/40'
                      )}
                      whileHover={{ scale: 1.05 }}
                    >
                      <div className={cn("w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full mr-1 inline-block", room.status === 'live' ? 'bg-green-500 animate-pulse' : 'bg-blue-500')}></div>
                      {room.status === 'live' ? 'Live' : 'Soon'}
                    </motion.div>
                  </motion.div>

                  {/* Room content */}
                  <div className="flex-1 min-w-0 space-y-3">
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.2 + index * 0.15 }}
                    >
                      <motion.h4
                        className={cn(
                          'text-base sm:text-lg font-semibold leading-tight mb-2 transition-colors duration-300 group-hover:text-emerald-700 dark:group-hover:text-emerald-300',
                          roomStyle.textColor
                        )}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 + index * 0.15 }}
                      >
                        {room.name}
                      </motion.h4>

                      <div className="flex flex-row items-center gap-2 mb-3 flex-wrap">
                        <motion.div
                          className="flex items-center gap-1 px-2 sm:px-3 py-1 rounded-full bg-emerald-100/80 dark:bg-emerald-900/40 text-xs sm:text-sm font-medium text-emerald-700 dark:text-emerald-300 border border-emerald-200/40 dark:border-emerald-700/40"
                          whileHover={{ scale: 1.05 }}
                        >
                          <Users className="h-3 w-3 sm:h-4 sm:w-4" />
                          <span>{room.members} active</span>
                        </motion.div>

                        <motion.div
                          className="flex items-center gap-1 px-2 sm:px-3 py-1 rounded-full bg-slate-100/80 dark:bg-slate-700/40 text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-300 border border-slate-200/40 dark:border-slate-600/40"
                          whileHover={{ scale: 1.05 }}
                        >
                          <UserCheck className="h-3 w-3 sm:h-4 sm:w-4" />
                          <span>{room.level}</span>
                        </motion.div>

                        <motion.div
                          className={cn(
                            'flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border',
                            room.status === 'live'
                              ? 'bg-green-100/80 dark:bg-green-900/40 text-green-700 dark:text-green-300 border-green-200/40 dark:border-green-700/40'
                              : 'bg-blue-100/80 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 border-blue-200/40 dark:border-blue-700/40'
                          )}
                          whileHover={{ scale: 1.05 }}
                        >
                          <div className={cn("w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full mr-1", room.status === 'live' ? 'bg-green-500 animate-pulse' : 'bg-blue-500')}></div>
                          {room.status === 'live' ? 'Live Now' : 'Scheduled'}
                        </motion.div>
                      </div>

                      {/* Room features */}
                      <div className="flex flex-row items-center gap-2 mt-1 flex-wrap">
                        <motion.div
                          className="flex items-center gap-1 px-2 py-1 rounded-full bg-gradient-to-r from-purple-100/80 to-pink-100/80 dark:from-purple-900/40 dark:to-pink-900/40 text-xs sm:text-sm font-medium text-purple-700 dark:text-purple-300 border border-purple-200/40 dark:border-purple-700/40"
                          whileHover={{ scale: 1.05 }}
                        >
                          <div className="w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full bg-gradient-to-r from-purple-400 to-pink-500"></div>
                          <span>Voice Chat</span>
                        </motion.div>

                        <motion.div
                          className="flex items-center gap-1 px-2 py-1 rounded-full bg-gradient-to-r from-emerald-100/80 to-teal-100/80 dark:from-emerald-900/40 dark:to-teal-900/40 text-xs sm:text-sm font-medium text-emerald-700 dark:text-emerald-300 border border-emerald-200/40 dark:border-emerald-700/40"
                          whileHover={{ scale: 1.05 }}
                        >
                          <Zap className="h-3 w-3" />
                          <span>Real-time</span>
                        </motion.div>
                      </div>
                    </motion.div>
                  </div>

                  {/* Join button */}
                  <motion.div
                    className="flex-shrink-0"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.4 + index * 0.15 }}
                  >
                    <motion.button
                      className={cn(
                        'px-3 sm:px-4 py-2 rounded-xl font-medium text-white shadow-lg transition-all duration-300 hover:shadow-xl text-sm sm:text-base',
                        room.status === 'live'
                          ? 'bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600'
                          : 'bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600'
                      )}
                      whileHover={{ scale: 1.05, y: -1 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {room.status === 'live' ? 'Join Now' : 'Schedule'}
                    </motion.button>
                  </motion.div>
                </div>

                {/* Progress indicator line */}
                <motion.div
                  className="w-full h-0.5 bg-gradient-to-r from-transparent via-emerald-200/50 to-transparent dark:via-emerald-700/30 rounded-full mt-3 sm:mt-4"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ delay: 0.5 + index * 0.15, duration: 0.8 }}
                />

                {/* Subtle decorative elements */}
                <div className="absolute top-2 sm:top-3 right-2 sm:right-3 w-4 h-4 sm:w-6 sm:h-6 rounded-full bg-gradient-to-br from-emerald-200/20 to-teal-200/20 dark:from-emerald-700/10 dark:to-teal-700/10 blur-sm group-hover:scale-150 transition-transform duration-500"></div>
              </div>
            </div>
          </motion.div>
        );
      })}

    </div>
  );
};

export default CommunityRoomCard;
