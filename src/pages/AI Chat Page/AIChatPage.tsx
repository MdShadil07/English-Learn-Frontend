import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

import { Card, CardContent } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { accuracyService } from '@/services/AI Chat/accuracyService';
import { geminiService } from '@/services/AI Chat/geminiService';
import AIChatSidebar from '@/components/AI Chat/AIChatSidebar';
import AIChatHeader from '@/components/AI Chat/AIChatHeader';
import AIChatSettingsPanel from '@/components/AI Chat/AIChatSettingsPanel';
import ChatMessageList from '@/components/AI Chat/ChatMessageList';
import ChatInputArea from '@/components/AI Chat/ChatInputArea';
import VoiceRecordingBubble from '@/components/AI Chat/VoiceRecordingBubble';
import { AI_PERSONALITIES, LANGUAGES } from '@/components/AI Chat/constants';
import {
  AIPersonality,
  Conversation,
  Message,
  ChatStats,
  UserSettings
} from '@/components/AI Chat/types';


declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

interface SpeechRecognition extends EventTarget {
  lang: string;
  maxResults: number;
  interimResults: boolean;
  continuous: boolean;
  onresult: ((this: SpeechRecognition, ev: SpeechRecognitionEvent) => any) | null;
  onerror: ((this: SpeechRecognition, ev: SpeechRecognitionErrorEvent) => any) | null;
  onend: ((this: SpeechRecognition, ev: Event) => any) | null;
  onstart: ((this: SpeechRecognition, ev: Event) => any) | null;
  onsoundstart: ((this: SpeechRecognition, ev: Event) => any) | null;
  onsoundend: ((this: SpeechRecognition, ev: Event) => any) | null;
  onaudioend: ((this: SpeechRecognition, ev: Event) => any) | null;
  onnomatch: ((this: SpeechRecognition, ev: Event) => any) | null;
  start(): void;
  stop(): void;
  abort(): void;
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string;
  message?: string;
}

interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
  resultIndex: number;
  resultsLength: number;
  interimResults: boolean;
  interpretation: string;
}

interface SpeechRecognitionResultList {
  length: number;
  item(index: number): SpeechRecognitionResult;
}

interface SpeechRecognitionResult {
  length: number;
  item(index: number): SpeechRecognitionAlternative;
  isConfident: boolean;
  isFinal: boolean;
  isInterim: boolean;
}

interface SpeechRecognitionAlternative {
  transcript: string;
  confidence: number;
}

const AIChatPage: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();

  // State management
  const [selectedPersonality, setSelectedPersonality] = useState<AIPersonality>(AI_PERSONALITIES[0]);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversation, setActiveConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [chatStats, setChatStats] = useState<ChatStats>({
    currentAccuracy: 0,
    totalMessages: 0,
    totalXP: 0,
    currentLevel: 1,
    xpToNextLevel: 100,
    weeklyProgress: 0,
    streak: 0
  });

  // Settings state
  const [settings, setSettings] = useState<UserSettings>({
    voiceEnabled: true,
    language: 'en',
    personality: AI_PERSONALITIES[0].id,
    showAccuracy: true,
    autoTranslate: false,
    theme: 'auto'
  });

  // UI state
  const [showSettings, setShowSettings] = useState(false);
  const [showPersonalitySelector, setShowPersonalitySelector] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Refs
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  // Scroll to bottom when new messages arrive
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  // Initialize conversation
  useEffect(() => {
    if (!activeConversation) {
      startNewConversation();
    }
  }, [activeConversation]);

  // Available personalities based on subscription
  const availablePersonalities = useMemo(() => {
    if (!user) return [AI_PERSONALITIES[0]];

    const subscriptionTier = (user as any).subscriptionStatus || 'free';
    const tierOrder = { free: 0, pro: 1, premium: 2 };
    const userTierLevel = tierOrder[subscriptionTier as keyof typeof tierOrder] || 0;

    return AI_PERSONALITIES.filter(personality => {
      const personalityTierLevel = tierOrder[personality.tier as keyof typeof tierOrder];
      return personalityTierLevel <= userTierLevel;
    });
  }, [user]);

  // Start new conversation
  const startNewConversation = useCallback(() => {
    const newConversation: Conversation = {
      id: `conv_${Date.now()}`,
      title: `Chat with ${selectedPersonality.name}`,
      personalityId: selectedPersonality.id,
      messages: [{
        id: `msg_${Date.now()}`,
        role: 'assistant',
        content: getWelcomeMessage(selectedPersonality),
        timestamp: new Date()
      }],
      createdAt: new Date(),
      lastUpdated: new Date(),
      totalAccuracy: 0,
      totalXP: 0,
      messageCount: 1
    };

    setActiveConversation(newConversation);
    setMessages(newConversation.messages);
    setConversations(prev => [newConversation, ...prev.slice(0, 49)]); // Keep max 50 conversations
  }, [selectedPersonality]);

  // Get welcome message based on personality
  const getWelcomeMessage = (personality: AIPersonality): string => {
    const messages = {
      'basic-tutor': "Hello! I'm your Basic English Tutor. I'll help you learn English step by step. What would you like to practice today?",
      'conversation-coach': "Hi there! I'm your Conversation Coach. Let's practice real English conversations together. How's your day going?",
      'grammar-expert': "Greetings! I'm your Grammar Expert. I'll help you master English grammar rules and structures. What grammar topic would you like to explore?",
      'business-mentor': "Hello! I'm your Business English Mentor. I'll help you develop professional communication skills. What's your professional goal?",
      'cultural-guide': "Welcome! I'm your Cultural Guide. I'll help you learn English with cultural context and insights. What's your favorite culture to learn about?"
    };
    return messages[personality.id as keyof typeof messages] || "Hello! How can I help you learn English today?";
  };

  // Send message to AI
  const sendMessage = useCallback(async () => {
    if (!input.trim() || !activeConversation) return;

    const userMessage: Message = {
      id: `msg_${Date.now()}`,
      role: 'user',
      content: input.trim(),
      timestamp: new Date()
    };

    // Add user message
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput('');
    setLoading(true);

    try {
      // Analyze accuracy
      const accuracyResult = await accuracyService.analyzeMessage(userMessage.content);
      userMessage.accuracy = accuracyResult;
      userMessage.xpGained = Math.floor(accuracyResult.overall * 0.5);

      // Update stats
      setChatStats(prev => ({
        ...prev,
        currentAccuracy: accuracyResult.overall,
        totalMessages: prev.totalMessages + 1,
        totalXP: prev.totalXP + (userMessage.xpGained || 0),
        currentLevel: Math.floor((prev.totalXP + (userMessage.xpGained || 0)) / 100) + 1,
        xpToNextLevel: 100 - ((prev.totalXP + (userMessage.xpGained || 0)) % 100)
      }));

      // Get AI response (mock for now - replace with actual Gemini API)
      const aiResponse = await getAIResponse(userMessage.content, selectedPersonality);

      const assistantMessage: Message = {
        id: `msg_${Date.now() + 1}`,
        role: 'assistant',
        content: aiResponse,
        timestamp: new Date(),
        personalityId: selectedPersonality.id
      };

      // Update conversation
      const updatedMessages = [...newMessages, assistantMessage];
      setMessages(updatedMessages);

      // Update conversation in list
      setConversations(prev => prev.map(conv =>
        conv.id === activeConversation.id
          ? {
              ...conv,
              messages: updatedMessages,
              lastUpdated: new Date(),
              totalAccuracy: updatedMessages.reduce((sum, msg) =>
                sum + (msg.accuracy?.overall || 0), 0) / updatedMessages.filter(msg => msg.accuracy).length || 0,
              totalXP: updatedMessages.reduce((sum, msg) => sum + (msg.xpGained || 0), 0),
              messageCount: updatedMessages.length,
              title: updatedMessages.length > 2 ? `Chat with ${selectedPersonality.name}` : conv.title
            }
          : conv
      ));

      // Update active conversation
      setActiveConversation(prev =>
        prev ? {
          ...prev,
          messages: updatedMessages,
          lastUpdated: new Date(),
          totalAccuracy: updatedMessages.reduce((sum, msg) =>
            sum + (msg.accuracy?.overall || 0), 0) / updatedMessages.filter(msg => msg.accuracy).length || 0,
          totalXP: updatedMessages.reduce((sum, msg) => sum + (msg.xpGained || 0), 0),
          messageCount: updatedMessages.length
        } : null
      );

      // Show accuracy feedback
      if (accuracyResult.feedback.length > 0) {
        toast({
          title: `Accuracy: ${accuracyResult.overall}%`,
          description: accuracyResult.feedback[0],
          duration: 3000
        });
      }

    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: 'Error',
        description: 'Failed to get AI response. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  }, [input, messages, activeConversation, selectedPersonality, toast]);

  // Mock AI response (replace with actual Gemini API integration)
  const getAIResponse = async (userMessage: string, personality: AIPersonality): Promise<string> => {
    try {
      // Use Gemini API for response generation
      const response = await geminiService.generateResponse(
        userMessage,
        personality,
        [], // conversation history - can be enhanced later
        settings.language
      );

      return response;
    } catch (error) {
      console.error('Gemini API error:', error);

      // Fallback responses based on personality
      const fallbackResponses = {
        'basic-tutor': [
          "I understand you're learning English! That's great. Could you tell me more about what you'd like to practice?",
          "Let's work on that together! Can you try saying it in a different way?",
          "Good effort! Remember to focus on the basic sentence structure.",
          "That's a good start! Let's break it down and practice each part.",
          "Keep practicing! You're making progress every day."
        ],
        'conversation-coach': [
          "That's an interesting point! In conversations, we often say it like this...",
          "I like how you're thinking about this! Native speakers might respond differently.",
          "Great conversational skills! Let's practice this in context.",
          "That's a natural way to express that idea! Well done.",
          "Let's try this conversation scenario together."
        ],
        'grammar-expert': [
          "From a grammatical perspective, let's analyze this structure...",
          "The grammar rule here is important to understand. Let me explain...",
          "This is a perfect example of how grammar works in practice.",
          "Let's look at the grammatical elements in your sentence.",
          "Understanding this grammar point will help you a lot!"
        ],
        'business-mentor': [
          "In a professional context, we would typically say...",
          "That's a good business communication approach!",
          "For professional emails or meetings, consider this phrasing...",
          "This demonstrates excellent professional language skills.",
          "Let's practice this in a business scenario."
        ],
        'cultural-guide': [
          "That's interesting! Different cultures express this differently...",
          "This reminds me of similar expressions in other cultures.",
          "Cultural context is so important in language learning!",
          "That's a great cultural observation you've made.",
          "Language and culture are deeply connected, as you can see here."
        ]
      };

      const personalityResponses = fallbackResponses[personality.id as keyof typeof fallbackResponses] || fallbackResponses['basic-tutor'];
      return personalityResponses[Math.floor(Math.random() * personalityResponses.length)];
    }
  };

  // Handle key press in input
  const handleKeyPress = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  }, [sendMessage]);

  // Voice recording functionality
  const startVoiceRecording = useCallback(() => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      toast({
        title: 'Voice Recognition Not Supported',
        description: 'Your browser does not support voice recognition.',
        variant: 'destructive'
      });
      return;
    }

    try {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = settings.language;

      recognitionRef.current.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInput(transcript);
      };

      recognitionRef.current.onerror = (event: SpeechRecognitionErrorEvent) => {
        console.error('Speech recognition error:', event.error);
        toast({
          title: 'Voice Recognition Error',
          description: 'Failed to recognize speech. Please try again.',
          variant: 'destructive'
        });
        setIsRecording(false);
      };

      recognitionRef.current.onend = () => {
        setIsRecording(false);
      };

      recognitionRef.current.start();
      setIsRecording(true);
    } catch (error) {
      console.error('Error starting voice recognition:', error);
      toast({
        title: 'Voice Recognition Error',
        description: 'Failed to start voice recognition. Please try again.',
        variant: 'destructive'
      });
    }
  }, [settings.language, toast]);

  const stopVoiceRecording = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    setIsRecording(false);
  }, []);

  const handleRecordingToggle = useCallback(
    (checked: boolean) => {
      if (checked) {
        startVoiceRecording();
      } else {
        stopVoiceRecording();
      }
    },
    [startVoiceRecording, stopVoiceRecording]
  );

  const handleRecordingClick = useCallback(() => {
    if (isRecording) {
      stopVoiceRecording();
    } else {
      startVoiceRecording();
    }
  }, [isRecording, startVoiceRecording, stopVoiceRecording]);

  const toggleSidebar = useCallback(() => {
    setSidebarOpen((prev) => !prev);
  }, []);

  const toggleSettingsPanel = useCallback(() => {
    setShowSettings((prev) => !prev);
  }, []);

  const loadingBubble = useMemo(
    () => <VoiceRecordingBubble personality={selectedPersonality} />,
    [selectedPersonality]
  );

  // Personality selection
  const handlePersonalityChange = useCallback((personality: AIPersonality) => {
    if (!availablePersonalities.some(p => p.id === personality.id)) {
      toast({
        title: 'Subscription Required',
        description: `${personality.name} is available for ${personality.tier} subscribers.`,
        variant: 'destructive'
      });
      return;
    }

    setSelectedPersonality(personality);
    setSettings(prev => ({ ...prev, personality: personality.id }));

    if (activeConversation) {
      startNewConversation();
    }
  }, [availablePersonalities, toast, activeConversation, startNewConversation]);

                    {/* Text Input */}
                    <div className="flex-1 relative">
                      <Textarea
                        ref={inputRef}
                        value={input}
                        onChange={(e) => setInput(e.target.value)}

      // Personality selection
      const handlePersonalityChange = useCallback((personality: AIPersonality) => {
        if (!availablePersonalities.some(p => p.id === personality.id)) {
          toast({
            title: 'Subscription Required',
            description: `${personality.name} is available for ${personality.tier} subscribers.`,
            variant: 'destructive'
          });
          return;
        }

        setSelectedPersonality(personality);
        setSettings(prev => ({ ...prev, personality: personality.id }));

        if (activeConversation) {
          startNewConversation();
        }
      }, [availablePersonalities, toast, activeConversation, startNewConversation]);

      <div className="mb-6">
        <AIChatHeader
          selectedPersonality={selectedPersonality}
          availablePersonalities={availablePersonalities}
          onSelectPersonality={handlePersonalityChange}
          showSettings={showSettings}
          onToggleSettings={toggleSettingsPanel}
          sidebarOpen={sidebarOpen}
          onToggleSidebar={toggleSidebar}
        />
      </div>

      <Card>
        <CardContent>
          <div className="flex flex-col h-full">
            <div className="flex-1 overflow-y-auto">
              {/* ... */}
            </div>
            <div className="flex items-center gap-2 mt-4">
              {/* Text Input */}
              <div className="flex-1 relative">
                <Textarea
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder={`Message ${selectedPersonality.name}...`}
                  disabled={loading}
                  className="min-h-[44px] max-h-32 resize-none bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border-emerald-200/30 dark:border-emerald-700/30 focus:border-emerald-400 dark:focus:border-emerald-600 pr-12"
                  rows={1}
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400 dark:text-gray-500">
                  {input.length}/500
                </div>
              </div>

              {/* Send Button */}
              <Button
                onClick={sendMessage}
                disabled={loading || !input.trim()}
                className={cn(
                  "flex-shrink-0 bg-gradient-to-r transition-all duration-200",
                  `from-${selectedPersonality.color}-500 to-${selectedPersonality.color}-600 hover:from-${selectedPersonality.color}-600 hover:to-${selectedPersonality.color}-700 text-white shadow-lg shadow-${selectedPersonality.color}-200/50 dark:shadow-${selectedPersonality.color}-900/20`
                )}
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>

            {/* Input hints */}
            <div className="flex items-center gap-4 mt-2 text-xs text-gray-500 dark:text-gray-400">
              <span>Press Enter to send, Shift+Enter for new line</span>
              {settings.voiceEnabled && (
                <span className="flex items-center gap-1">
                  <Volume2 className="h-3 w-3" />
                  Voice responses enabled
                </span>
              )}
              {isRecording && (
                <span className="flex items-center gap-1 text-red-500">
                  <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                  Recording...
                </span>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </TooltipProvider>
  );
};

export default AIChatPage;
