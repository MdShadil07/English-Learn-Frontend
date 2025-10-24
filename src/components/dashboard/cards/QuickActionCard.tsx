import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface QuickAction {
  id: string;
  title: string;
  description: string;
  icon: any;
  color: string;
  href: string;
  badge?: string;
}

interface QuickActionCardProps {
  action: QuickAction;
  index: number;
  onActionClick?: (actionId: string) => void;
}

const QuickActionCard: React.FC<QuickActionCardProps> = ({ action, index, onActionClick }) => {
  return (
    <motion.div
      key={action.id}
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

        <CardContent className="relative p-8">
          {/* Icon with enhanced styling */}
          <motion.div
            className={cn(
              'w-16 h-16 rounded-2xl bg-gradient-to-br flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-lg',
              action.color
            )}
            whileHover={{
              rotate: [0, -10, 10, 0],
              transition: { duration: 0.5 }
            }}
          >
            <action.icon className="h-8 w-8 text-white drop-shadow-lg" />
          </motion.div>

          {/* Content */}
          <div className="space-y-4">
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <motion.h3
                  className="font-bold text-xl text-emerald-900 dark:text-white group-hover:text-emerald-700 dark:group-hover:text-emerald-300 transition-colors"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6 + index * 0.1 }}
                >
                  {action.title}
                </motion.h3>
                <motion.p
                  className="text-sm text-emerald-600 dark:text-emerald-400 leading-relaxed"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.7 + index * 0.1 }}
                >
                  {action.description}
                </motion.p>
              </div>
              {action.badge && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.8 + index * 0.1 }}
                  whileHover={{ scale: 1.1 }}
                >
                  <Badge className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white border-0 shadow-lg px-3 py-1">
                    {action.badge}
                  </Badge>
                </motion.div>
              )}
            </div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 + index * 0.1 }}
              className="pt-2"
            >
              <Button
                className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-semibold rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 group-hover:shadow-emerald-500/25 border-0 py-3"
                onClick={() => onActionClick?.(action.id)}
              >
                <motion.span
                  className="flex items-center justify-center gap-2"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Get Started
                  <motion.div
                    animate={{ x: [0, 4, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    <ArrowRight className="h-4 w-4" />
                  </motion.div>
                </motion.span>
              </Button>
            </motion.div>
          </div>

          {/* Hover glow effect */}
          <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-emerald-400/0 via-teal-400/0 to-cyan-400/0 group-hover:from-emerald-400/10 group-hover:via-teal-400/10 group-hover:to-cyan-400/10 transition-all duration-500 -z-10"></div>
        </CardContent>
      </div>
    </motion.div>
  );
};

export default QuickActionCard;
