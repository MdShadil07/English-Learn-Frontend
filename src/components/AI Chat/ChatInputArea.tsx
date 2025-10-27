import React from 'react';
import { Send, Mic, MicOff, Volume2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';

import { AIPersonality, UserSettings } from './types';

interface ChatInputAreaProps {
  input: string;
  onInputChange: (value: string) => void;
  onSend: () => void;
  loading: boolean;
  isRecording: boolean;
  onToggleRecording: () => void;
  settings: UserSettings;
  selectedPersonality: AIPersonality;
  onKeyPress: (event: React.KeyboardEvent<HTMLTextAreaElement>) => void;
  characterCount?: number;
  maxCharacters?: number;
}

const ChatInputArea: React.FC<ChatInputAreaProps> = ({
  input,
  onInputChange,
  onSend,
  loading,
  isRecording,
  onToggleRecording,
  settings,
  selectedPersonality,
  onKeyPress,
  characterCount = 0,
  maxCharacters = 500
}) => {
  const handleInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    onInputChange(event.target.value);
  };

  return (
    <div className="p-4 border-t border-emerald-200/30 dark:border-emerald-700/30 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm">
      <div className="flex gap-3">
        <Button
          variant="outline"
          size="sm"
          onClick={onToggleRecording}
          disabled={loading}
          className={cn(
            'flex-shrink-0 transition-all duration-200',
            isRecording
              ? 'bg-red-500 hover:bg-red-600 text-white border-red-500'
              : 'text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 dark:text-emerald-400 dark:hover:text-emerald-300 dark:hover:bg-emerald-900/30'
          )}
          aria-pressed={isRecording}
          aria-label={isRecording ? 'Stop voice recording' : 'Start voice recording'}
        >
          {isRecording ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
        </Button>

        <div className="flex-1 relative">
          <Textarea
            value={input}
            onChange={handleInputChange}
            onKeyPress={onKeyPress}
            placeholder={`Message ${selectedPersonality.name}...`}
            disabled={loading}
            className="min-h-[44px] max-h-32 resize-none bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border-emerald-200/30 dark:border-emerald-700/30 focus:border-emerald-400 dark:focus:border-emerald-600 pr-12"
            rows={1}
            aria-label="Message input"
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400 dark:text-gray-500" aria-hidden="true">
            {characterCount}/{maxCharacters}
          </div>
        </div>

        <Button
          onClick={onSend}
          disabled={loading || !input.trim()}
          className={cn(
            'flex-shrink-0 bg-gradient-to-r transition-all duration-200',
            `from-${selectedPersonality.color}-500 to-${selectedPersonality.color}-600 hover:from-${selectedPersonality.color}-600 hover:to-${selectedPersonality.color}-700 text-white shadow-lg shadow-${selectedPersonality.color}-200/50 dark:shadow-${selectedPersonality.color}-900/20`
          )}
          aria-label="Send message"
        >
          <Send className="h-4 w-4" />
        </Button>
      </div>

      <div className="flex items-center gap-4 mt-2 text-xs text-gray-500 dark:text-gray-400">
        <span>Press Enter to send, Shift+Enter for new line</span>
        {settings.voiceEnabled && (
          <span className="flex items-center gap-1">
            <Volume2 className="h-3 w-3" aria-hidden="true" />
            Voice responses enabled
          </span>
        )}
        {isRecording && (
          <span className="flex items-center gap-1 text-red-500">
            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" aria-hidden="true"></div>
            Recording...
          </span>
        )}
      </div>
    </div>
  );
};

export default ChatInputArea;
