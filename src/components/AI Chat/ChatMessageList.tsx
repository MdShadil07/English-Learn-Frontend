import React from 'react';
import { AnimatePresence } from 'framer-motion';

import { ScrollArea } from '@/components/ui/scroll-area';

import ChatMessageItem from './ChatMessageItem';
import { AIPersonality, Message, UserSettings } from './types';

interface ChatMessageListProps {
  messages: Message[];
  selectedPersonality: AIPersonality;
  settings: UserSettings;
  loading: boolean;
  loadingBubble: React.ReactNode;
  endRef: React.RefObject<HTMLDivElement>;
}

const ChatMessageList: React.FC<ChatMessageListProps> = ({
  messages,
  selectedPersonality,
  settings,
  loading,
  loadingBubble,
  endRef
}) => {
  return (
    <ScrollArea className="flex-1 p-6" role="log" aria-live="polite">
      <div className="space-y-4">
        <AnimatePresence>
          {messages.map((message, index) => (
            <ChatMessageItem
              key={message.id}
              message={message}
              index={index}
              selectedPersonality={selectedPersonality}
              settings={settings}
            />
          ))}
        </AnimatePresence>

        {loading && loadingBubble}

        <div ref={endRef} />
      </div>
    </ScrollArea>
  );
};

export default ChatMessageList;
