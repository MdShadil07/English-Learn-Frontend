import React from 'react';
import { motion } from 'framer-motion';

import { cn } from '@/lib/utils';
import { AIPersonality } from './types';

interface VoiceRecordingBubbleProps {
  personality: AIPersonality;
}

const VoiceRecordingBubble: React.FC<VoiceRecordingBubbleProps> = ({ personality }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex gap-3"
      role="status"
      aria-live="polite"
    >
      <div
        className={cn(
          'w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 bg-gradient-to-br',
          `from-${personality.color}-400 to-${personality.color}-600`
        )}
        aria-hidden="true"
      >
        <span className="text-lg">{personality.avatar}</span>
      </div>
      <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-2xl border border-gray-200 dark:border-gray-700">
        <div className="flex gap-2">
          <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce" aria-hidden="true"></div>
          <div
            className="w-2 h-2 bg-teal-500 rounded-full animate-bounce"
            style={{ animationDelay: '0.1s' }}
            aria-hidden="true"
          ></div>
          <div
            className="w-2 h-2 bg-cyan-500 rounded-full animate-bounce"
            style={{ animationDelay: '0.2s' }}
            aria-hidden="true"
          ></div>
        </div>
      </div>
    </motion.div>
  );
};

export default VoiceRecordingBubble;
