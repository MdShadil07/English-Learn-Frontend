import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { format, parseISO } from 'date-fns';
import {
  BookOpen,
  MessageSquare,
  Users,
  Mic,
  Brain,
  PenTool,
  FileText,
  Target,
  Award,
  TrendingUp,
  Clock,
  Star,
  Zap,
  Heart,
  Sparkles,
  Bot,
  User,
  GraduationCap,
  Trophy,
  Calendar,
  CheckCircle2,
  Play,
  Plus,
  Flame,
  Coins,
  BookMarked,
  Bell,
  ChevronRight,
  CheckCircle,
  BarChart2,
  Newspaper,
  Lightbulb,
  Headphones,
  Settings,
  ArrowRight,
  CheckIcon
} from 'lucide-react';

import { supabase } from '@/integrations/supabase/client';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from '@/components/ui/tabs';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface Word {
  word: string;
  partOfSpeech: string;
  definition: string;
  examples: string[];
  pronunciation: string;
  difficulty: string;
}

interface LearningPath {
  id: string;
  title: string;
  description: string;
  progress: number;
  totalLessons: number;
  completedLessons: number;
  nextLesson: string;
  image: string;
  estimatedTime: string;
  category: string;
}

interface Note {
  id: string;
  title: string;
  content: string;
  created_at: string;
  updated_at: string;
  tags: string[];
}

interface Task {
  id: string;
  title: string;
  description: string;
  due_date: string;
  status: 'pending' | 'in-progress' | 'completed';
  priority: 'low' | 'medium' | 'high';
}

interface AIConversation {
  id: string;
  title: string;
  preview: string;
  timestamp: string;
  aiAvatar: string;
  aiName: string;
  category: string;
}

interface UserStats {
  streak: number;
  xp: number;
  level: number;
  lessons: number;
  accuracy: number;
  coldCoins: number;
  completedTasks: number;
  notes: number;
  studySessions: number;
  currentStreak: number;
  longestStreak: number;
}

const DashboardHome = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  
  // User data
  const [userName, setUserName] = useState("Student");
  const [userStats, setUserStats] = useState<UserStats>({
    streak: 7,
    xp: 2450,
    level: 12,
    lessons: 45,
    accuracy: 87,
    coldCoins: 240,
    completedTasks: 24,
    notes: 16,
    studySessions: 32,
    currentStreak: 7,
    longestStreak: 14
  });

  // Learning content
  const [wordOfTheDay, setWordOfTheDay] = useState<Word[]>([]);
  const [learningPaths, setLearningPaths] = useState<LearningPath[]>([]);
  const [recentNotes, setRecentNotes] = useState<Note[]>([]);
  const [upcomingTasks, setUpcomingTasks] = useState<Task[]>([]);
  const [recentConversations, setRecentConversations] = useState<AIConversation[]>([]);


  // Fetch dashboard data on component mount
  useEffect(() => {
    const loadDashboardData = async () => {
      setIsLoading(true);
      try {
        await Promise.all([
          fetchUserData(),
          fetchLearningPaths(),
          fetchDailyWords(),
          fetchRecentItems()
        ]);
      } catch (error) {
        console.error('Error loading dashboard data:', error);
        toast({
          title: "Failed to load data",
          description: "There was a problem loading your dashboard data.",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadDashboardData();

    // Mock data for development
    setWordOfTheDay([
      {
        word: 'Ephemeral',
        partOfSpeech: 'Adjective',
        definition: 'Lasting for a very short time',
        examples: [
          'The beauty of cherry blossoms is ephemeral, lasting only a few days.',
          'Social media trends are often ephemeral, disappearing quickly.'
        ],
        pronunciation: '/ɪˈfɛmərəl/',
        difficulty: 'Advanced'
      },
      {
        word: 'Resilient',
        partOfSpeech: 'Adjective',
        definition: 'Able to recover quickly from difficulties',
        examples: [
          'She showed resilient spirit after overcoming many challenges.',
          'The company proved resilient during the economic downturn.'
        ],
        pronunciation: '/rɪˈzɪliənt/',
        difficulty: 'Intermediate'
      },
      {
        word: 'Ambiguous',
        partOfSpeech: 'Adjective',
        definition: 'Open to more than one interpretation',
        examples: [
          'His answer was ambiguous, leaving us uncertain about his intentions.',
          'The painting\'s meaning remains ambiguous to art critics.'
        ],
        pronunciation: '/æmˈbɪɡjuəs/',
        difficulty: 'Advanced'
      }
    ]);
    
    // Set mock learning paths
    setLearningPaths([
      {
        id: 'path1',
        title: 'English Grammar Fundamentals',
        description: 'Master essential grammar concepts for everyday communication',
        progress: 65,
        totalLessons: 24,
        completedLessons: 15,
        nextLesson: 'Perfect Tenses',
        image: '/placeholder.svg',
        estimatedTime: '3 weeks',
        category: 'grammar'
      },
      {
        id: 'path2',
        title: 'Professional Vocabulary Builder',
        description: 'Expand your professional vocabulary for workplace success',
        progress: 42,
        totalLessons: 30,
        completedLessons: 12,
        nextLesson: 'Negotiation Terms',
        image: '/placeholder.svg',
        estimatedTime: '4 weeks',
        category: 'vocabulary'
      },
      {
        id: 'path3',
        title: 'Conversation Fluency',
        description: 'Practice natural conversation skills with interactive scenarios',
        progress: 28,
        totalLessons: 18,
        completedLessons: 5,
        nextLesson: 'Making Small Talk',
        image: '/placeholder.svg',
        estimatedTime: '2 weeks',
        category: 'speaking'
      }
    ]);
  }, [toast]);

  // Fetch user data from Supabase
  const fetchUserData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: profile } = await supabase
        .from("profiles")
        .select("full_name, correction_coins, current_streak, longest_streak")
        .eq("id", user.id)
        .single();

      if (profile) {
        setUserName(profile.full_name || "Student");
        setUserStats(prev => ({
          ...prev,
          coldCoins: profile.correction_coins || 0,
          currentStreak: profile.current_streak || 0,
          longestStreak: profile.longest_streak || 0
        }));
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  // Fetch learning paths
  const fetchLearningPaths = async () => {
    try {
      const { data, error } = await supabase
        .from('learning_paths')
        .select('*')
        .limit(4);
      
      if (error) throw error;
      // We'll use the mock data in useEffect for now
    } catch (error) {
      console.error('Error fetching learning paths:', error);
    }
  };

  // Fetch daily vocabulary words
  const fetchDailyWords = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('fetch-daily-words');
      if (error) throw error;
      // We'll use the mock data in useEffect for now
    } catch (error) {
      console.error('Error fetching daily words:', error);
    }
  };

  // Fetch recent items (notes, tasks, conversations)
  const fetchRecentItems = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Simulate response data for development
      setRecentNotes([
        {
          id: '1',
          title: 'Phrasal Verbs Notes',
          content: 'Common phrasal verbs used in business settings...',
          created_at: '2023-10-21T14:22:00Z',
          updated_at: '2023-10-21T14:22:00Z',
          tags: ['vocabulary', 'business']
        },
        {
          id: '2',
          title: 'Present Perfect Usage',
          content: 'When to use present perfect vs. simple past...',
          created_at: '2023-10-19T09:15:00Z',
          updated_at: '2023-10-19T09:15:00Z',
          tags: ['grammar', 'tenses']
        }
      ]);

      setUpcomingTasks([
        {
          id: '1',
          title: 'Complete grammar quiz',
          description: 'Finish the quiz on conditional tenses',
          due_date: '2023-10-25T18:00:00Z',
          status: 'pending',
          priority: 'high'
        },
        {
          id: '2',
          title: 'Practice pronunciation',
          description: 'Record practice sentences for /th/ sound',
          due_date: '2023-10-26T15:00:00Z',
          status: 'pending',
          priority: 'medium'
        },
        {
          id: '3',
          title: 'Vocabulary review',
          description: 'Review this week\'s new vocabulary words',
          due_date: '2023-10-27T12:00:00Z',
          status: 'pending',
          priority: 'low'
        }
      ]);

      setRecentConversations([
        {
          id: '1',
          title: 'Job Interview Practice',
          preview: 'Let\'s continue practicing common interview questions...',
          timestamp: '2023-10-20T16:45:00Z',
          aiAvatar: '/placeholder.svg',
          aiName: 'Professional Coach',
          category: 'Business English'
        },
        {
          id: '2',
          title: 'Daily Conversation Practice',
          preview: 'We were discussing restaurant recommendations...',
          timestamp: '2023-10-19T10:30:00Z',
          aiAvatar: '/placeholder.svg',
          aiName: 'Conversation Partner',
          category: 'Daily English'
        }
      ]);
    } catch (error) {
      console.error('Error fetching recent items:', error);
    }
  };

  // Dashboard skeleton loading component
  const DashboardSkeleton = () => (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <Skeleton className="h-12 w-[250px]" />
        <div className="flex gap-4">
          <Skeleton className="h-10 w-24" />
          <Skeleton className="h-10 w-24" />
        </div>
      </div>
      
      <div className="grid md:grid-cols-4 gap-4">
        <Skeleton className="h-28 w-full" />
        <Skeleton className="h-28 w-full" />
        <Skeleton className="h-28 w-full" />
        <Skeleton className="h-28 w-full" />
      </div>
      
      <Skeleton className="h-[400px] w-full" />
      
      <div className="grid md:grid-cols-3 gap-6">
        <Skeleton className="h-80 w-full" />
        <Skeleton className="h-80 w-full" />
        <Skeleton className="h-80 w-full" />
      </div>
    </div>
  );
  
  // Format date helper function
  const formatDate = (dateString: string) => {
    try {
      return format(parseISO(dateString), 'MMM d, yyyy');
    } catch (error) {
      return dateString;
    }
  };

    {
      id: 'vocabulary',
      title: 'Vocabulary Builder',
      description: 'Expand your word power systematically',
      icon: Brain,
      color: 'blue',
      progress: 78,
      lessons: 25,
      nextLesson: 'Business Vocabulary'
    },
    {
      id: 'reading',
      title: 'Reading Comprehension',
      description: 'Improve reading skills with diverse content',
      icon: FileText,
      color: 'purple',
      progress: 45,
      lessons: 18,
      nextLesson: 'News Articles'
    },
    {
      id: 'writing',
      title: 'Writing Skills',
      description: 'Enhance writing through guided practice',
      icon: PenTool,
      color: 'orange',
      progress: 32,
      lessons: 15,
      nextLesson: 'Email Writing'
    }
  ];

  const aiPersonalities = [
    {
      id: 'grammar-guru',
      name: 'Grammar Guru',
      description: 'Expert in grammar rules and corrections',
      icon: BookOpen,
      specialty: 'Grammar & Syntax',
      color: 'emerald',
      available: true
    },
    {
      id: 'vocab-master',
      name: 'Vocab Master',
      description: 'Specializes in vocabulary building',
      icon: Brain,
      specialty: 'Vocabulary & Usage',
      color: 'blue',
      available: true
    },
    {
      id: 'pronunciation-pro',
      name: 'Pronunciation Pro',
      description: 'Focuses on perfect pronunciation',
      icon: Mic,
      specialty: 'Pronunciation & Accent',
      color: 'purple',
      available: true
    },
    {
      id: 'conversation-coach',
      name: 'Conversation Coach',
      description: 'Helps with natural conversation flow',
      icon: MessageSquare,
      specialty: 'Speaking & Fluency',
      color: 'orange',
      available: true
    },
    {
      id: 'writing-wizard',
      name: 'Writing Wizard',
      description: 'Guides through writing improvement',
      icon: PenTool,
      specialty: 'Writing & Composition',
      color: 'pink',
      available: false
    }
  ];

  const communityRooms = [
    {
      id: 1,
      name: 'Beginner English Circle',
      members: 12,
      level: 'Beginner',
      topic: 'Daily Conversations',
      isActive: true
    },
    {
      id: 2,
      name: 'Business English Hub',
      members: 8,
      level: 'Intermediate',
      topic: 'Professional Communication',
      isActive: true
    },
    {
      id: 3,
      name: 'Pronunciation Practice',
      members: 15,
      level: 'All Levels',
      topic: 'Phonetics & Sounds',
      isActive: false
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-slate-50/30 to-emerald-50/20 dark:from-slate-950 dark:via-slate-900/50 dark:to-emerald-950/10 p-6">
      {/* Background decorative elements */}
      <div className="fixed inset-0 -z-50 overflow-hidden pointer-events-none">
        {/* Neural network pattern */}
        <div
          className="absolute inset-0 opacity-[0.02] dark:opacity-[0.04]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.3'%3E%3Ccircle cx='7' cy='7' r='1'/%3E%3Ccircle cx='27' cy='7' r='1'/%3E%3Ccircle cx='47' cy='7' r='1'/%3E%3Ccircle cx='7' cy='27' r='1'/%3E%3Ccircle cx='27' cy='27' r='1'/%3E%3Ccircle cx='47' cy='27' r='1'/%3E%3Ccircle cx='7' cy='47' r='1'/%3E%3Ccircle cx='27' cy='47' r='1'/%3E%3Ccircle cx='47' cy='47' r='1'/%3E%3Cpath d='M7 7 L27 7 M27 7 L47 7 M7 27 L27 27 M27 27 L47 27 M7 47 L27 47 M27 47 L47 47 M7 7 L7 27 M7 27 L7 47 M27 7 L27 27 M27 27 L27 47 M47 7 L47 27 M47 27 L47 47' stroke='%23000000' stroke-width='0.5' stroke-opacity='0.1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        ></div>

        {/* Subtle gradient orbs */}
        <div className="absolute top-[10%] right-[10%] w-96 h-96 rounded-full bg-gradient-to-br from-emerald-100/30 to-teal-100/20 blur-3xl dark:from-emerald-900/10 dark:to-teal-900/5"></div>
        <div className="absolute bottom-[20%] left-[5%] w-80 h-80 rounded-full bg-gradient-to-tr from-cyan-100/20 to-emerald-100/30 blur-3xl dark:from-cyan-900/5 dark:to-emerald-900/10"></div>
      </div>

      <div className="max-w-7xl mx-auto space-y-8">
        {/* Hero Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Card className="p-8 bg-gradient-to-br from-primary/10 via-accent/5 to-primary/5 border-primary/20 shadow-strong">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-5xl font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent mb-2">
                  Welcome back, {userName || 'Learner'}! 👋
                </h1>
                <p className="text-lg text-muted-foreground">Continue your journey to English mastery</p>
              </div>
              <div className="flex items-center gap-6">
                <div className="text-center">
                  <div className="flex items-center gap-2 mb-1">
                    <Flame className="h-8 w-8 text-orange-500" />
                    <span className="text-4xl font-bold text-orange-500">{stats.currentStreak}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">Day Streak</p>
                </div>
                <div className="h-16 w-px bg-border"></div>
                <div className="text-center">
                  <div className="flex items-center gap-2 mb-1">
                    <Coins className="h-8 w-8 text-accent" />
                    <span className="text-4xl font-bold text-accent">{stats.coldCoins}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">Cold Coins</p>
                </div>
                <div className="h-16 w-px bg-border"></div>
                <div className="text-center">
                  <div className="flex items-center gap-2 mb-1">
                    <Trophy className="h-8 w-8 text-purple-500" />
                    <span className="text-4xl font-bold text-purple-600 dark:text-purple-400">{userStats.level}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">Level</p>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="grid md:grid-cols-4 gap-4"
        >
          <Button className="h-20 bg-gradient-primary hover:scale-105 transition-transform shadow-medium">
            <div className="flex items-center gap-3">
              <Target className="h-6 w-6" />
              <div className="text-left">
                <p className="font-bold">Daily Goals</p>
                <p className="text-xs opacity-90">Complete today</p>
              </div>
            </div>
          </Button>
          <Button className="h-20 bg-gradient-accent hover:scale-105 transition-transform shadow-medium">
            <div className="flex items-center gap-3">
              <Sparkles className="h-6 w-6" />
              <div className="text-left">
                <p className="font-bold">AI Practice</p>
                <p className="text-xs opacity-90">Chat with AI</p>
              </div>
            </div>
          </Button>
          <Button className="h-20 bg-gradient-success hover:scale-105 transition-transform shadow-medium">
            <div className="flex items-center gap-3">
              <Users className="h-6 w-6" />
              <div className="text-left">
                <p className="font-bold">Voice Rooms</p>
                <p className="text-xs opacity-90">Join community</p>
              </div>
            </div>
          </Button>
          <Button className="h-20 bg-gradient-warning hover:scale-105 transition-transform shadow-medium">
            <div className="flex items-center gap-3">
              <BookOpen className="h-6 w-6" />
              <div className="text-left">
                <p className="font-bold">Study Notes</p>
                <p className="text-xs opacity-90">Review & learn</p>
              </div>
            </div>
          </Button>
        </motion.div>

        {/* Core Learning Features */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Card className="p-6 shadow-strong bg-gradient-to-br from-card to-muted/20 border-primary/10">
            <div className="flex items-center gap-3 mb-6">
              <GraduationCap className="h-6 w-6 text-primary" />
              <h2 className="text-2xl font-bold">🎯 Core Learning Features</h2>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {coreFeatures.map((feature, index) => (
                <motion.div
                  key={feature.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
                >
                  <Card className="p-5 shadow-medium hover:shadow-strong transition-all bg-gradient-to-br from-primary/5 to-accent/5 border-primary/20 hover:border-primary/40">
                    <div className="flex items-center gap-3 mb-4">
                      <div className={`p-2 rounded-lg bg-${feature.color}-100 dark:bg-${feature.color}-900/30`}>
                        <feature.icon className={`h-6 w-6 text-${feature.color}-600 dark:text-${feature.color}-400`} />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-lg">{feature.title}</h3>
                        <p className="text-sm text-muted-foreground">{feature.description}</p>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Progress</span>
                        <span className="text-sm font-bold text-primary">{feature.progress}%</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div
                          className={`bg-gradient-to-r from-${feature.color}-500 to-${feature.color}-600 h-2 rounded-full transition-all`}
                          style={{ width: `${feature.progress}%` }}
                        ></div>
                      </div>

                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">{feature.lessons} lessons</span>
                        <Badge variant="outline" className="text-xs">
                          {feature.nextLesson}
                        </Badge>
                      </div>

                      <Button size="sm" className="w-full bg-gradient-primary hover:scale-105 transition-transform">
                        <Play className="h-4 w-4 mr-1" />
                        Continue
                      </Button>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          </Card>
        </motion.div>

        {/* AI Chat Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <Card className="p-6 shadow-strong bg-gradient-to-br from-card to-muted/20 border-primary/10">
            <div className="flex items-center gap-3 mb-6">
              <Bot className="h-6 w-6 text-primary" />
              <h2 className="text-2xl font-bold">🤖 AI Learning Assistants</h2>
              <Badge className="bg-gradient-primary text-white">5 Personalities</Badge>
            </div>
            <p className="text-muted-foreground mb-6">Choose your AI tutor based on your learning needs</p>

            <div className="grid md:grid-cols-3 lg:grid-cols-5 gap-4">
              {aiPersonalities.map((personality, index) => (
                <motion.div
                  key={personality.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, delay: 0.5 + index * 0.1 }}
                >
                  <Card className={`p-4 shadow-medium hover:shadow-strong transition-all border-2 ${
                    personality.available
                      ? `hover:border-${personality.color}-400 cursor-pointer`
                      : 'opacity-50 cursor-not-allowed'
                  }`}>
                    <div className="text-center">
                      <div className={`p-3 rounded-full bg-${personality.color}-100 dark:bg-${personality.color}-900/30 mx-auto mb-3`}>
                        <personality.icon className={`h-8 w-8 text-${personality.color}-600 dark:text-${personality.color}-400`} />
                      </div>

                      <h3 className="font-bold mb-2">{personality.name}</h3>
                      <p className="text-xs text-muted-foreground mb-3">{personality.specialty}</p>

                      <Badge
                        variant={personality.available ? "default" : "secondary"}
                        className={`text-xs ${personality.available ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' : ''}`}
                      >
                        {personality.available ? 'Available' : 'Coming Soon'}
                      </Badge>

                      {personality.available && (
                        <Button size="sm" className="w-full mt-3 bg-gradient-primary hover:scale-105 transition-transform">
                          <MessageSquare className="h-4 w-4 mr-1" />
                          Chat
                        </Button>
                      )}
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          </Card>
        </motion.div>

        {/* Word of the Day Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <Card className="p-6 shadow-strong bg-gradient-to-br from-card to-muted/20 border-primary/10">
            <div className="flex items-center gap-3 mb-6">
              <BookOpen className="h-6 w-6 text-primary" />
              <h2 className="text-2xl font-bold">📚 Word of the Day</h2>
              <Badge className="bg-gradient-accent">3 New Words</Badge>
            </div>
            <p className="text-muted-foreground mb-6">Expand your vocabulary with carefully selected words and their usage</p>

            <div className="grid md:grid-cols-3 gap-6">
              {wordOfTheDay.map((word, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.7 + index * 0.1 }}
                >
                  <Card className="p-5 shadow-medium hover:shadow-strong transition-all bg-gradient-to-br from-primary/5 to-accent/5 border-primary/20">
                    <div className="mb-4">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                          {word.word}
                        </h3>
                        <Badge variant="outline" className="bg-primary/10 text-primary border-primary">
                          {word.difficulty}
                        </Badge>
                      </div>
                      <Badge variant="outline" className="bg-accent/10 text-accent border-accent">
                        {word.partOfSpeech}
                      </Badge>
                    </div>

                    <p className="text-sm font-semibold mb-4 leading-relaxed">{word.definition}</p>

                    <div className="space-y-2">
                      <p className="text-xs font-bold text-accent uppercase tracking-wide">Examples:</p>
                      {word.examples.map((example, idx) => (
                        <div key={idx} className="p-2 bg-muted/50 rounded text-xs italic leading-relaxed">
                          "{example}"
                        </div>
                      ))}
                    </div>

                    <div className="mt-4 pt-3 border-t border-border">
                      <p className="text-xs text-muted-foreground">
                        <span className="font-medium">Pronunciation:</span> {word.pronunciation}
                      </p>
                    </div>

                    <Button size="sm" className="w-full mt-4 bg-gradient-primary hover:scale-105 transition-transform">
                      <Star className="h-4 w-4 mr-1" />
                      Add to Vocabulary
                    </Button>
                  </Card>
                </motion.div>
              ))}
            </div>
          </Card>
        </motion.div>

        {/* Community & Rooms Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <Card className="p-6 shadow-strong bg-gradient-to-br from-card to-muted/20 border-primary/10">
            <div className="flex items-center gap-3 mb-6">
              <Users className="h-6 w-6 text-primary" />
              <h2 className="text-2xl font-bold">🌐 Community & Practice Rooms</h2>
              <Badge className="bg-gradient-success">Live Sessions</Badge>
            </div>
            <p className="text-muted-foreground mb-6">Join live practice sessions and connect with fellow learners</p>

            <div className="grid md:grid-cols-3 gap-4">
              {communityRooms.map((room, index) => (
                <motion.div
                  key={room.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, delay: 0.9 + index * 0.1 }}
                >
                  <Card className="p-4 shadow-medium hover:shadow-strong transition-all border-primary/20 hover:border-primary/40">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-bold">{room.name}</h3>
                      <Badge
                        variant={room.isActive ? "default" : "secondary"}
                        className={room.isActive ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400" : ""}
                      >
                        {room.isActive ? 'Live' : 'Scheduled'}
                      </Badge>
                    </div>

                    <div className="space-y-2 mb-4">
                      <div className="flex items-center gap-2 text-sm">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        <span>{room.members} members</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Target className="h-4 w-4 text-muted-foreground" />
                        <span>{room.level}</span>
                      </div>
                      <p className="text-xs text-muted-foreground">{room.topic}</p>
                    </div>

                    <Button
                      size="sm"
                      className={`w-full ${
                        room.isActive
                          ? 'bg-gradient-success hover:scale-105 transition-transform'
                          : 'bg-muted cursor-not-allowed'
                      }`}
                      disabled={!room.isActive}
                    >
                      {room.isActive ? (
                        <>
                          <Mic className="h-4 w-4 mr-1" />
                          Join Session
                        </>
                      ) : (
                        <>
                          <Clock className="h-4 w-4 mr-1" />
                          View Schedule
                        </>
                      )}
                    </Button>
                  </Card>
                </motion.div>
              ))}

              {/* Create Room Card */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 1.2 }}
              >
                <Card className="p-4 shadow-medium hover:shadow-strong transition-all border-dashed border-primary/40 hover:border-primary/60 cursor-pointer">
                  <div className="text-center">
                    <div className="p-3 rounded-full bg-primary/10 mx-auto mb-3">
                      <Plus className="h-8 w-8 text-primary" />
                    </div>
                    <h3 className="font-bold mb-2">Create Room</h3>
                    <p className="text-xs text-muted-foreground mb-4">Start your own practice session</p>
                    <Button size="sm" className="w-full bg-gradient-primary hover:scale-105 transition-transform">
                      Create
                    </Button>
                  </div>
                </Card>
              </motion.div>
            </div>
          </Card>
        </motion.div>

        {/* Quick Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.0 }}
          className="grid md:grid-cols-4 gap-6"
        >
          <Card className="p-6 shadow-medium hover:shadow-strong transition-all bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
            <div className="flex items-center gap-3 mb-3">
              <Award className="h-8 w-8 text-primary" />
              <span className="text-4xl font-bold text-primary">{stats.notes}</span>
            </div>
            <p className="text-sm font-medium text-muted-foreground">Notes Created</p>
          </Card>

          <Card className="p-6 shadow-medium hover:shadow-strong transition-all bg-gradient-to-br from-success/5 to-success/10 border-success/20">
            <div className="flex items-center gap-3 mb-3">
              <CheckCircle2 className="h-8 w-8 text-success" />
              <span className="text-4xl font-bold text-success">{stats.completedTasks}</span>
            </div>
            <p className="text-sm font-medium text-muted-foreground">Tasks Completed</p>
          </Card>

          <Card className="p-6 shadow-medium hover:shadow-strong transition-all bg-gradient-to-br from-accent/5 to-accent/10 border-accent/20">
            <div className="flex items-center gap-3 mb-3">
              <Clock className="h-8 w-8 text-accent" />
              <span className="text-4xl font-bold text-accent">{stats.studySessions}</span>
            </div>
            <p className="text-sm font-medium text-muted-foreground">Practice Sessions</p>
          </Card>

          <Card className="p-6 shadow-medium hover:shadow-strong transition-all bg-gradient-to-br from-purple-500/5 to-purple-500/10 border-purple-500/20">
            <div className="flex items-center gap-3 mb-3">
              <Heart className="h-8 w-8 text-purple-500" />
              <span className="text-4xl font-bold text-purple-600 dark:text-purple-400">98%</span>
            </div>
            <p className="text-sm font-medium text-muted-foreground">Engagement Rate</p>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default DashboardHome;
