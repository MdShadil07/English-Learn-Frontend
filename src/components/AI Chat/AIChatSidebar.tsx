import React from 'react';
import { motion } from 'framer-motion';
import { Plus, BarChart3 } from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

import { AIPersonality, ChatStats, Conversation } from './types';

interface AIChatSidebarProps {
  conversations: Conversation[];
  activeConversation: Conversation | null;
  onSelectConversation: (conversation: Conversation) => void;
  onNewConversation: () => void;
  chatStats: ChatStats;
  personalities: AIPersonality[];
}

const AIChatSidebar: React.FC<AIChatSidebarProps> = ({
  conversations,
  activeConversation,
  onSelectConversation,
  onNewConversation,
  chatStats,
  personalities
}) => {
  const getPersonality = (id: string) => personalities.find((personality) => personality.id === id);

  return (
    <div className="w-80 flex flex-col gap-4">
      <Card className="flex-1 bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border-emerald-200/30 dark:border-emerald-700/30 shadow-xl">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-semibold text-emerald-800 dark:text-emerald-300">
              Conversations
            </CardTitle>
            <Button
              size="sm"
              variant="ghost"
              onClick={onNewConversation}
              className="h-8 w-8 p-0 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 dark:text-emerald-400 dark:hover:text-emerald-300 dark:hover:bg-emerald-900/30"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <ScrollArea className="h-[300px]">
            <div className="px-3 pb-3 space-y-2">
              {conversations.map((conversation) => {
                const personality = getPersonality(conversation.personalityId);

                return (
                  <motion.div
                    key={conversation.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={cn(
                      'p-3 rounded-lg cursor-pointer transition-all duration-200 hover:bg-emerald-50/50 dark:hover:bg-emerald-900/20 border border-transparent hover:border-emerald-200/50 dark:hover:border-emerald-700/50',
                      activeConversation?.id === conversation.id &&
                        'bg-emerald-100/50 dark:bg-emerald-900/30 border-emerald-300/50 dark:border-emerald-600/50'
                    )}
                    onClick={() => onSelectConversation(conversation)}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className={cn(
                          'w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium bg-gradient-to-br',
                          personality?.gradient ?? 'from-emerald-400 to-teal-500'
                        )}
                      >
                        {personality?.avatar ?? '🤖'}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                          {conversation.title}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            {conversation.messageCount} messages
                          </span>
                          {conversation.totalAccuracy > 0 && (
                            <Badge variant="secondary" className="text-xs">
                              {Math.round(conversation.totalAccuracy)}% avg
                            </Badge>
                          )}
                        </div>
                        <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                          {conversation.lastUpdated.toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      <Card className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border-emerald-200/30 dark:border-emerald-700/30 shadow-xl">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-semibold text-emerald-800 dark:text-emerald-300 flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Your Progress
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-emerald-700 dark:text-emerald-300">
                Level {chatStats.currentLevel}
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {chatStats.totalXP % 100}/{100} XP
              </span>
            </div>
            <Progress value={chatStats.totalXP % 100} className="h-2" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="text-center p-2 bg-emerald-50/50 dark:bg-emerald-900/20 rounded-lg">
              <div className="text-lg font-bold text-emerald-700 dark:text-emerald-300">
                {chatStats.totalMessages}
              </div>
              <div className="text-xs text-gray-600 dark:text-gray-400">Messages</div>
            </div>
            <div className="text-center p-2 bg-teal-50/50 dark:bg-teal-900/20 rounded-lg">
              <div className="text-lg font-bold text-teal-700 dark:text-teal-300">
                {chatStats.currentAccuracy}%
              </div>
              <div className="text-xs text-gray-600 dark:text-gray-400">Accuracy</div>
            </div>
            <div className="text-center p-2 bg-cyan-50/50 dark:bg-cyan-900/20 rounded-lg">
              <div className="text-lg font-bold text-cyan-700 dark:text-cyan-300">
                {chatStats.totalXP}
              </div>
              <div className="text-xs text-gray-600 dark:text-gray-400">Total XP</div>
            </div>
            <div className="text-center p-2 bg-purple-50/50 dark:bg-purple-900/20 rounded-lg">
              <div className="text-lg font-bold text-purple-700 dark:text-purple-300">
                {chatStats.streak}
              </div>
              <div className="text-xs text-gray-600 dark:text-gray-400">Streak</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AIChatSidebar;
