import React from 'react';
import { motion } from 'framer-motion';
import { AlertCircle, Target, User as UserIcon } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { cn } from '@/lib/utils';

import { AIPersonality, Message, UserSettings } from './types';

interface ChatMessageItemProps {
  message: Message;
  index: number;
  selectedPersonality: AIPersonality;
  settings: UserSettings;
}

const ChatMessageItem: React.FC<ChatMessageItemProps> = ({ message, index, selectedPersonality, settings }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
      className={cn('flex gap-3', message.role === 'user' ? 'justify-end' : 'justify-start')}
      role="listitem"
      aria-label={`${message.role === 'user' ? 'User' : 'Assistant'} message`}
    >
      {message.role === 'assistant' && (
        <div
          className={cn(
            'w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 bg-gradient-to-br',
            `from-${selectedPersonality.color}-400 to-${selectedPersonality.color}-600`
          )}
          aria-hidden="true"
        >
          <span className="text-lg">{selectedPersonality.avatar}</span>
        </div>
      )}

      <div
        className={cn(
          'max-w-[80%] p-4 rounded-2xl shadow-sm',
          message.role === 'user'
            ? 'bg-gradient-to-br from-emerald-500 to-teal-500 text-white'
            : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-gray-700'
        )}
      >
        <p className="whitespace-pre-wrap text-sm leading-relaxed">
          {message.content}
        </p>

        {message.role === 'user' && message.accuracy && settings.showAccuracy && (
          <div className="mt-3 pt-3 border-t border-emerald-200/30 dark:border-emerald-700/30">
            <div className="flex items-center gap-2 mb-2">
              <Target className="h-4 w-4 text-emerald-600 dark:text-emerald-400" aria-hidden="true" />
              <span className="text-xs font-medium text-emerald-700 dark:text-emerald-300">
                Accuracy: {message.accuracy.overall}%
              </span>
              {message.xpGained && (
                <Badge variant="secondary" className="text-xs">
                  +{message.xpGained} XP
                </Badge>
              )}
            </div>

            <div className="grid grid-cols-4 gap-2 text-xs" role="group" aria-label="Accuracy breakdown">
              <div className="text-center">
                <div className="font-medium text-emerald-600 dark:text-emerald-400">
                  {message.accuracy.grammar}%
                </div>
                <div className="text-gray-500 dark:text-gray-400">Grammar</div>
              </div>
              <div className="text-center">
                <div className="font-medium text-teal-600 dark:text-teal-400">
                  {message.accuracy.vocabulary}%
                </div>
                <div className="text-gray-500 dark:text-gray-400">Vocab</div>
              </div>
              <div className="text-center">
                <div className="font-medium text-cyan-600 dark:text-cyan-400">
                  {message.accuracy.spelling}%
                </div>
                <div className="text-gray-500 dark:text-gray-400">Spelling</div>
              </div>
              <div className="text-center">
                <div className="font-medium text-purple-600 dark:text-purple-400">
                  {message.accuracy.fluency}%
                </div>
                <div className="text-gray-500 dark:text-gray-400">Fluency</div>
              </div>
            </div>

            {message.accuracy.feedback.length > 0 && (
              <Alert className="mt-2 py-2">
                <AlertCircle className="h-4 w-4" aria-hidden="true" />
                <AlertDescription className="text-xs">
                  {message.accuracy.feedback[0]}
                </AlertDescription>
              </Alert>
            )}
          </div>
        )}

        <div className="text-xs text-gray-400 dark:text-gray-500 mt-2" aria-hidden="true">
          {message.timestamp.toLocaleTimeString()}
        </div>
      </div>

      {message.role === 'user' && (
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-400 to-gray-600 flex items-center justify-center flex-shrink-0">
          <UserIcon className="h-5 w-5 text-white" aria-hidden="true" />
        </div>
      )}
    </motion.div>
  );
};

export default ChatMessageItem;
