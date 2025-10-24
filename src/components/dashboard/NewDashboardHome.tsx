import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  BookOpen,
  Brain,
  PenTool,
  FileText,
  Headphones,
  Mic,
  Bot,
  Users,
  Target,
  Zap,
  Flame,
  Star,
  CheckCircle,
  Clock,
  Sparkles,
  Play,
  BarChart3,
  Trophy,
  ArrowRight,
  MessageSquare,
  Award,
  TrendingUp
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';
import WordOfTheDay from './WordOfTheDay';
import { LearningPathCard, QuickActionCard, StatsCard, CommunityRoomCard } from './cards';
import { getActivityStyle } from './cards/ActivityCard';

interface LearningPath {
  id: string;
  title: string;
  description: string;
  icon: any;
  progress: number;
  totalLessons: number;
  completedLessons: number;
  color: string;
  gradient: string;
}

interface QuickAction {
  id: string;
  title: string;
  description: string;
  icon: any;
  color: string;
  href: string;
  badge?: string;
}

interface RecentActivity {
  id: string;
  type: string;
  title: string;
  time: string;
  icon: any;
  color: string;
}

const NewDashboardHome = () => {
  const { user } = useAuth();
  const [greeting, setGreeting] = useState('');

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good Morning');
    else if (hour < 18) setGreeting('Good Afternoon');
    else setGreeting('Good Evening');
  }, []);

  const learningPaths: LearningPath[] = [
    {
      id: 'grammar',
      title: 'Grammar Mastery',
      description: 'Master English grammar rules and structures',
      icon: BookOpen,
      progress: Math.round((31 / 48) * 100), // 65%
      totalLessons: 48,
      completedLessons: 31,
      color: 'emerald',
      gradient: 'from-emerald-500 to-teal-500'
    },
    {
      id: 'vocabulary',
      title: 'Vocabulary Builder',
      description: 'Expand your word power systematically',
      icon: Brain,
      progress: Math.round((47 / 60) * 100), // 78%
      totalLessons: 60,
      completedLessons: 47,
      color: 'blue',
      gradient: 'from-blue-500 to-cyan-500'
    },
    {
      id: 'writing',
      title: 'Writing Excellence',
      description: 'Develop professional writing skills',
      icon: PenTool,
      progress: Math.round((15 / 36) * 100), // 42%
      totalLessons: 36,
      completedLessons: 15,
      color: 'purple',
      gradient: 'from-purple-500 to-pink-500'
    },
    {
      id: 'speaking',
      title: 'Fluent Speaking',
      description: 'Improve pronunciation and fluency',
      icon: Mic,
      progress: Math.round((22 / 40) * 100), // 55%
      totalLessons: 40,
      completedLessons: 22,
      color: 'orange',
      gradient: 'from-orange-500 to-amber-500'
    }
  ];

  const quickActions: QuickAction[] = [
    {
      id: 'ai-chat',
      title: 'AI Chat',
      description: 'Practice with AI tutor',
      icon: Bot,
      color: 'from-primary to-accent',
      href: '/dashboard/ai-chat',
      badge: 'New'
    },
    {
      id: 'practice-room',
      title: 'Join Room',
      description: 'Practice with others',
      icon: Users,
      color: 'from-emerald-500 to-teal-500',
      href: '/dashboard/rooms',
      badge: 'Live'
    },
    {
      id: 'daily-challenge',
      title: 'Daily Challenge',
      description: 'Complete today\'s task',
      icon: Target,
      color: 'from-purple-500 to-pink-500',
      href: '/dashboard/challenges'
    },
    {
      id: 'focus-mode',
      title: 'Focus Mode',
      description: 'Distraction-free learning',
      icon: Zap,
      color: 'from-amber-500 to-orange-500',
      href: '/dashboard/focus'
    }
  ];

  const recentActivities: RecentActivity[] = [
    {
      id: '1',
      type: 'lesson',
      title: 'Completed Grammar Lesson: Past Perfect Tense',
      time: '2 hours ago',
      icon: BookOpen,
      color: 'emerald'
    },
    {
      id: '2',
      type: 'practice',
      title: 'AI Conversation Practice Session',
      time: '5 hours ago',
      icon: MessageSquare,
      color: 'blue'
    },
    {
      id: '3',
      type: 'achievement',
      title: 'Earned "Vocabulary Master" Badge',
      time: '1 day ago',
      icon: Award,
      color: 'purple'
    },
    {
      id: '4',
      type: 'room',
      title: 'Joined "Business English" Practice Room',
      time: '2 days ago',
      icon: Users,
      color: 'orange'
    }
  ];

  const practiceRooms = [
    { name: 'Business English Hub', members: 12, level: 'Intermediate', status: 'live' as const },
    { name: 'Pronunciation Practice', members: 8, level: 'All Levels', status: 'live' as const },
    { name: 'Grammar Discussion', members: 15, level: 'Advanced', status: 'scheduled' as const }
  ];

  const stats = [
    { label: 'Current Streak', value: '12', icon: Flame, color: 'text-orange-500', bgColor: 'bg-orange-100 dark:bg-orange-900/20' },
    { label: 'Total XP', value: '3,450', icon: Star, color: 'text-yellow-500', bgColor: 'bg-yellow-100 dark:bg-yellow-900/20' },
    { label: 'Lessons Completed', value: '127', icon: CheckCircle, color: 'text-emerald-500', bgColor: 'bg-emerald-100 dark:bg-emerald-900/20' },
    { label: 'Study Time', value: '48h', icon: Clock, color: 'text-blue-500', bgColor: 'bg-blue-100 dark:bg-blue-900/20' }
  ];

  return (
    <div className="min-h-screen p-4 sm:p-6 space-y-6 sm:space-y-8">
      {/* Advanced Hero Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative"
      >
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-50/90 via-teal-50/90 to-cyan-50/90 dark:from-emerald-900/20 dark:via-teal-900/20 dark:to-cyan-900/20 backdrop-blur-xl shadow-2xl border border-emerald-200/30 dark:border-emerald-700/30">
          {/* Enhanced Background decorative elements */}
          <div className="absolute inset-0 -z-10">
            {/* Large animated gradient orbs */}
            <div className="absolute -top-[50%] -right-[40%] w-[120rem] h-[120rem] rounded-full bg-gradient-to-tr from-emerald-200/30 via-teal-200/30 to-cyan-200/30 blur-3xl dark:from-emerald-800/15 dark:via-teal-800/15 dark:to-cyan-800/15 animate-pulse"></div>
            <div className="absolute -bottom-[40%] -left-[50%] w-[100rem] h-[100rem] rounded-full bg-gradient-to-br from-cyan-200/30 via-emerald-200/30 to-teal-200/30 blur-3xl dark:from-cyan-800/15 dark:via-emerald-800/15 dark:to-teal-800/15 animate-pulse delay-1000"></div>

            {/* Floating geometric shapes */}
            <div className="absolute top-[20%] right-[10%] w-32 h-32 rounded-2xl bg-gradient-to-br from-emerald-300/20 to-teal-300/20 dark:from-emerald-700/20 dark:to-teal-700/20 rotate-45 animate-float"></div>
            <div className="absolute bottom-[30%] left-[5%] w-24 h-24 rounded-full bg-gradient-to-br from-cyan-300/20 to-emerald-300/20 dark:from-cyan-700/20 dark:to-emerald-700/20 animate-float-delayed"></div>
            <div className="absolute top-[60%] right-[30%] w-16 h-16 rounded-xl bg-gradient-to-br from-teal-300/20 to-cyan-300/20 dark:from-teal-700/20 dark:to-cyan-700/20 rotate-12 animate-float"></div>

            {/* Enhanced grid pattern */}
            <div
              className="absolute inset-0 opacity-[0.02] dark:opacity-[0.03]"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Cg fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath opacity='.1' d='M96 95h4v1h-4v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9zm-1 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-9-10h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm9-10v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-9-10h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm9-10v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-9-10h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
              }}
            ></div>
          </div>

          {/* Enhanced decorative shadow layers */}
          <div className="absolute -z-10 w-full h-full -bottom-4 -right-4 sm:-bottom-8 sm:-right-8 bg-gradient-to-br from-emerald-200/50 via-teal-200/50 to-cyan-200/50 dark:from-emerald-800/30 dark:via-teal-800/30 dark:to-cyan-800/30 rounded-3xl backdrop-blur-sm"></div>
          <div className="absolute -z-20 w-full h-full -bottom-8 -right-8 sm:-bottom-16 sm:-right-16 bg-gradient-to-br from-cyan-200/40 via-emerald-200/40 to-teal-200/40 dark:from-cyan-800/25 dark:via-emerald-800/25 dark:to-teal-800/25 rounded-3xl backdrop-blur-sm"></div>

          {/* Enhanced Floating Icons */}
          <motion.div
            className="absolute top-4 left-4 sm:top-6 sm:left-6 text-emerald-500/40 sm:text-emerald-500/50 dark:text-emerald-400/30 dark:sm:text-emerald-400/40 hidden sm:block"
            animate={{
              y: [-8, 8, -8],
              rotate: [0, 5, -5, 0]
            }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          >
            <BookOpen className="h-6 w-6 sm:h-10 sm:w-10 drop-shadow-lg" />
          </motion.div>
          <motion.div
            className="absolute top-6 right-6 sm:top-10 sm:right-10 text-teal-500/40 sm:text-teal-500/50 dark:text-teal-400/30 dark:sm:text-teal-400/40 hidden sm:block"
            animate={{
              y: [8, -8, 8],
              rotate: [0, -3, 3, 0]
            }}
            transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
          >
            <Brain className="h-5 w-5 sm:h-8 sm:w-8 drop-shadow-lg" />
          </motion.div>
          <motion.div
            className="absolute bottom-12 left-8 sm:bottom-20 sm:left-12 text-cyan-500/40 sm:text-cyan-500/50 dark:text-cyan-400/30 dark:sm:text-cyan-400/40 hidden sm:block"
            animate={{
              y: [-6, 6, -6],
              x: [-3, 3, -3],
              rotate: [0, 8, -8, 0]
            }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          >
            <Star className="h-6 w-6 sm:h-9 sm:w-9 drop-shadow-lg" />
          </motion.div>
          <motion.div
            className="absolute bottom-4 right-4 sm:bottom-6 sm:right-6 text-emerald-500/40 sm:text-emerald-500/50 dark:text-emerald-400/30 dark:sm:text-emerald-400/40 hidden sm:block"
            animate={{
              y: [10, -10, 10],
              scale: [1, 1.1, 1]
            }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
          >
            <Sparkles className="h-5 w-5 sm:h-7 sm:w-7 drop-shadow-lg" />
          </motion.div>
          <motion.div
            className="absolute top-1/2 left-2 sm:left-3 text-teal-500/30 sm:text-teal-500/40 dark:text-teal-400/20 dark:sm:text-teal-400/30 hidden md:block"
            animate={{
              x: [-4, 4, -4],
              y: [-2, 2, -2],
              rotate: [0, 10, -10, 0]
            }}
            transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut", delay: 0.8 }}
          >
            <PenTool className="h-6 w-6 sm:h-8 sm:w-8 drop-shadow-lg" />
          </motion.div>
          <motion.div
            className="absolute top-1/3 right-2 sm:right-3 text-cyan-500/30 sm:text-cyan-500/40 dark:text-cyan-400/20 dark:sm:text-cyan-400/30 hidden md:block"
            animate={{
              x: [6, -6, 6],
              y: [4, -4, 4],
              rotate: [0, -6, 6, 0]
            }}
            transition={{ duration: 3.8, repeat: Infinity, ease: "easeInOut", delay: 1.2 }}
          >
            <Mic className="h-6 w-6 sm:h-9 sm:w-9 drop-shadow-lg" />
          </motion.div>

          {/* Content - Landing Page Style */}
          <div className="relative overflow-hidden">
            {/* Hero Background Elements */}
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-50/50 via-transparent to-cyan-50/50 dark:from-emerald-900/10 dark:via-transparent dark:to-cyan-900/10"></div>
            
            {/* Floating Background Orbs */}
            <div className="absolute -top-10 -right-10 sm:-top-20 sm:-right-20 w-48 h-48 sm:w-96 sm:h-96 rounded-full bg-gradient-to-br from-emerald-200/20 to-teal-200/20 dark:from-emerald-800/10 dark:to-teal-800/10 blur-3xl animate-pulse hidden sm:block"></div>
            <div className="absolute -bottom-10 -left-10 sm:-bottom-20 sm:-left-20 w-40 h-40 sm:w-80 sm:h-80 rounded-full bg-gradient-to-tr from-cyan-200/20 to-emerald-200/20 dark:from-cyan-800/10 dark:to-emerald-800/10 blur-3xl animate-pulse delay-1000 hidden sm:block"></div>

            <div className="relative z-10 px-4 py-8 sm:px-6 sm:py-12 md:px-8 md:py-16 lg:px-12 lg:py-24">
              {/* Main Hero Content */}
              <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 xl:gap-16 items-center">
                  {/* Left Side - Hero Text */}
                  <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, type: "spring", stiffness: 100 }}
                    className="space-y-8"
                  >
                    {/* Welcome Badge */}
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                      className="inline-flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-3 rounded-full bg-gradient-to-r from-emerald-100/80 to-teal-100/80 dark:from-emerald-900/40 dark:to-teal-900/40 backdrop-blur-sm border border-emerald-200/30 dark:border-emerald-700/30"
                    >
                      <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-600 dark:text-emerald-400" />
                      <span className="text-sm sm:text-base text-emerald-800 dark:text-emerald-200 font-semibold">Welcome back to CognitoSpeak</span>
                    </motion.div>

                    {/* Main Headline */}
                    <motion.h1 
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3, duration: 0.8 }}
                      className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight"
                    >
                      <span className="block bg-gradient-to-br from-emerald-800 via-teal-700 to-cyan-700 dark:from-emerald-100 dark:via-teal-200 dark:to-cyan-200 bg-clip-text text-transparent">
                        {greeting}
                      </span>
                      <span className="block text-emerald-900 dark:text-white mt-1 sm:mt-2">
                        {user?.fullName || 'Learner'}! 
                      </span>
                    </motion.h1>

                    {/* Subtitle */}
                    <motion.p 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5, duration: 0.6 }}
                      className="text-lg sm:text-xl md:text-2xl text-emerald-700 dark:text-emerald-200 font-medium leading-relaxed max-w-2xl"
                    >
                      Transform your English skills with AI-powered learning
                    </motion.p>

                    {/* Description */}
                    <motion.p 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.6, duration: 0.6 }}
                      className="text-base sm:text-lg text-emerald-600 dark:text-emerald-300 leading-relaxed max-w-xl"
                    >
                      Experience personalized learning with AI-driven lessons, real-time feedback, and interactive practice sessions.
                    </motion.p>

                    {/* Feature Pills */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.7, duration: 0.6 }}
                      className="flex flex-wrap gap-2 sm:gap-4 pt-4"
                    >
                      {[
                        { icon: Bot, text: "AI-Powered Learning", color: "from-blue-500 to-cyan-500" },
                        { icon: Users, text: "Live Practice Rooms", color: "from-purple-500 to-pink-500" },
                        { icon: Target, text: "Personalized Goals", color: "from-emerald-500 to-teal-500" }
                      ].map((feature, index) => (
                        <motion.div
                          key={feature.text}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 0.8 + index * 0.1, type: "spring", stiffness: 200 }}
                          className="group flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2 rounded-full bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border border-emerald-200/40 dark:border-emerald-700/40 hover:bg-white/90 dark:hover:bg-slate-800/90 transition-all duration-300 cursor-pointer"
                        >
                          <div className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-gradient-to-r ${feature.color} group-hover:scale-125 transition-transform duration-300`}></div>
                          <span className="text-xs sm:text-sm font-medium text-emerald-800 dark:text-emerald-200">{feature.text}</span>
                        </motion.div>
                      ))}
                    </motion.div>

                    {/* Action Buttons */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.9, duration: 0.6 }}
                      className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-6"
                    >
                      <motion.button
                        whileHover={{ scale: 1.05, y: -2 }}
                        whileTap={{ scale: 0.95 }}
                        className="group flex items-center justify-center gap-3 px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-semibold rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 text-sm sm:text-base"
                      >
                        <Play className="w-4 h-4 sm:w-5 sm:h-5 group-hover:scale-110 transition-transform" />
                        Start Learning Now
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.05, y: -2 }}
                        whileTap={{ scale: 0.95 }}
                        className="group flex items-center justify-center gap-3 px-6 sm:px-8 py-3 sm:py-4 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm hover:bg-white dark:hover:bg-slate-800 text-emerald-800 dark:text-emerald-200 font-semibold rounded-2xl border border-emerald-200/50 dark:border-emerald-700/50 hover:border-emerald-300 dark:hover:border-emerald-600 transition-all duration-300 text-sm sm:text-base"
                      >
                        <BarChart3 className="w-4 h-4 sm:w-5 sm:h-5 group-hover:scale-110 transition-transform" />
                        View Progress
                      </motion.button>
                    </motion.div>
                  </motion.div>

                  {/* Right Side - User Stats Cards */}
                  <motion.div
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, delay: 0.4, type: "spring", stiffness: 100 }}
                    className="relative flex justify-center lg:justify-end mt-8 lg:mt-0"
                  >
                    <div className="relative space-y-4 sm:space-y-6 max-w-md w-full">
                      {/* Main Streak and Level Card */}
                      <motion.div
                        initial={{ opacity: 0, scale: 0.8, rotate: -10 }}
                        animate={{ opacity: 1, scale: 1, rotate: 0 }}
                        transition={{ delay: 1, duration: 1, type: "spring", stiffness: 100 }}
                        className="group cursor-pointer"
                      >
                        <motion.div whileHover={{ rotate: 2, scale: 1.02 }}>
                          <Card className="p-4 sm:p-6 lg:p-8 rounded-3xl bg-gradient-to-br from-white/90 via-emerald-50/80 to-teal-50/90 dark:from-slate-800/90 dark:via-emerald-900/40 dark:to-teal-900/40 backdrop-blur-xl border border-emerald-200/40 dark:border-emerald-700/40 shadow-2xl hover:shadow-3xl transition-all duration-500 hover:scale-105">
                          <CardContent className="p-0">
                            <div className="flex items-center justify-between mb-4 sm:mb-6">
                              <div className="flex items-center gap-3 sm:gap-4">
                                <motion.div
                                  animate={{ rotate: [0, 10, -10, 0] }}
                                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                                  className="p-3 sm:p-4 rounded-2xl bg-gradient-to-br from-orange-400 to-orange-500 text-white shadow-lg"
                                >
                                  <Flame className="h-6 w-6 sm:h-8 sm:w-8" />
                                </motion.div>
                                <div>
                                  <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-emerald-900 dark:text-white">{stats[0].value}</div>
                                  <div className="text-sm sm:text-base lg:text-lg text-emerald-600 dark:text-emerald-400 font-medium">Day Streak</div>
                                </div>
                              </div>
                              <div className="flex items-center gap-3 sm:gap-4">
                                <motion.div
                                  animate={{ scale: [1, 1.2, 1] }}
                                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                                  className="p-3 sm:p-4 rounded-2xl bg-gradient-to-br from-yellow-400 to-amber-500 text-white shadow-lg"
                                >
                                  <Trophy className="h-6 w-6 sm:h-8 sm:w-8" />
                                </motion.div>
                                <div className="text-right">
                                  <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-emerald-900 dark:text-white">{stats[3].value}</div>
                                  <div className="text-sm sm:text-base lg:text-lg text-emerald-600 dark:text-emerald-400 font-medium">Level</div>
                                </div>
                              </div>
                            </div>
                            <div className="w-full bg-emerald-200 dark:bg-emerald-700 rounded-full h-2 sm:h-3 mb-3 sm:mb-4">
                              <motion.div
                                className="bg-gradient-to-r from-emerald-500 to-teal-500 h-2 sm:h-3 rounded-full"
                                style={{ width: `${Math.min(parseInt(stats[3].value) * 10, 100)}%` }}
                                initial={{ width: 0 }}
                                animate={{ width: `${Math.min(parseInt(stats[3].value) * 10, 100)}%` }}
                                transition={{ duration: 1.5, delay: 1.5 }}
                              ></motion.div>
                            </div>
                            <div className="text-center text-xs sm:text-sm text-emerald-600 dark:text-emerald-400">Keep it up! 🔥</div>
                          </CardContent>
                        </Card>
                        </motion.div>
                      </motion.div>

                      {/* Additional Stats Cards */}
                      <StatsCard stats={stats.slice(1, 3)} />

                      {/* Progress Overview */}
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1.4, duration: 0.6 }}
                        className="p-3 sm:p-4 rounded-2xl bg-gradient-to-br from-cyan-50/80 to-teal-50/80 dark:from-cyan-900/30 dark:to-teal-900/30 backdrop-blur-lg border border-cyan-200/30 dark:border-cyan-700/30"
                      >
                        <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
                          <BarChart3 className="h-4 w-4 sm:h-5 sm:w-5 text-cyan-600 dark:text-cyan-400" />
                          <span className="text-xs sm:text-sm font-semibold text-cyan-800 dark:text-cyan-200">Weekly Progress</span>
                        </div>
                        <div className="space-y-1 sm:space-y-2">
                          <div className="flex justify-between text-xs">
                            <span className="text-cyan-700 dark:text-cyan-300">Lessons</span>
                            <span className="text-cyan-800 dark:text-cyan-200">{stats[2].value}</span>
                          </div>
                          <Progress value={75} className="h-1.5 sm:h-2" />
                          <div className="flex justify-between text-xs">
                            <span className="text-cyan-700 dark:text-cyan-300">Study Time</span>
                            <span className="text-cyan-800 dark:text-cyan-200">{stats[3].value}</span>
                          </div>
                          <Progress value={60} className="h-1.5 sm:h-2" />
                        </div>
                      </motion.div>
                    </div>
                  </motion.div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>


      {/* Quick Actions - Enhanced Design */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <motion.h2
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 dark:from-emerald-400 dark:to-teal-400 bg-clip-text text-transparent"
          >
            Quick Actions
          </motion.h2>
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 }}
            className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400"
          >
            <Zap className="h-4 w-4 sm:h-5 sm:w-5" />
            <span className="text-xs sm:text-sm font-medium">Choose your path</span>
          </motion.div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {quickActions.map((action, index) => (
            <QuickActionCard
              key={action.id}
              action={action}
              index={index}
              onActionClick={(actionId) => {
                // Handle navigation to action
                console.log('Navigate to:', actionId);
              }}
            />
          ))}
        </div>
      </motion.div>

      {/* Word of the Day */}
      <WordOfTheDay />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        <div className="flex items-center justify-between mb-3 sm:mb-4">
          <h2 className="text-xl sm:text-2xl font-bold">Your Learning Paths</h2>
          <motion.button
            whileHover={{ scale: 1.05, width: '100%' }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center justify-center gap-2 px-3 sm:px-4 py-2 rounded-full bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border border-emerald-200/40 dark:border-emerald-700/40 text-emerald-700 dark:text-emerald-300 font-medium hover:bg-white/90 dark:hover:bg-slate-800/90 transition-all duration-300 hover:shadow-md hover:rounded-2xl w-full"
          >
            View All
            <motion.div
              animate={{ x: [0, 3, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              <ArrowRight className="h-3 w-3 sm:h-4 sm:w-4" />
            </motion.div>
          </motion.button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          {learningPaths.map((path, index) => (
            <LearningPathCard
              key={path.id}
              path={path}
              index={index}
              onContinue={(pathId) => {
                // Handle continue learning
                console.log('Continue learning:', pathId);
              }}
            />
          ))}
        </div>
      </motion.div>

      {/* Recent Activity & Community - Modern Integrated Design */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 sm:gap-8">
        {/* Recent Activity - Modern Timeline Design */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.7 }}
          className="space-y-4 sm:space-y-6"
        >
          {/* Activity Header */}
          <div className="flex items-center justify-between">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.8 }}
              className="flex items-center gap-2 sm:gap-3"
            >
              <div className="p-2 sm:p-3 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-500 text-white shadow-lg">
                <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5" />
              </div>
              <div>
                <h2 className="text-lg sm:text-xl lg:text-2xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 dark:from-emerald-400 dark:to-teal-400 bg-clip-text text-transparent">
                  Recent Activity
                </h2>
                <p className="text-xs sm:text-sm text-emerald-600 dark:text-emerald-400">Your latest learning achievements</p>
              </div>
            </motion.div>

            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.9 }}
              whileHover={{ scale: 1.05, width: '100%' }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center justify-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border border-emerald-200/40 dark:border-emerald-700/40 text-emerald-700 dark:text-emerald-300 font-medium hover:bg-white/90 dark:hover:bg-slate-800/90 transition-all duration-300 hover:shadow-md hover:rounded-2xl w-full"
            >
              <span>View All</span>
              <motion.div
                animate={{ x: [0, 3, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <ArrowRight className="h-3 w-3 sm:h-4 sm:w-4" />
              </motion.div>
            </motion.button>
          </div>

          {/* Modern Activity Timeline */}
          <div className="space-y-3 sm:space-y-4">
            {recentActivities.map((activity, index) => {
              const activityStyle = getActivityStyle(activity.type, activity.color);

              return (
                <motion.div
                  key={activity.id}
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1.0 + index * 0.1, duration: 0.5 }}
                  className="group relative"
                >
                  <div className="flex items-start gap-3 sm:gap-4 p-3 sm:p-4 rounded-2xl bg-gradient-to-r from-white/60 via-emerald-50/40 to-teal-50/60 dark:from-slate-800/60 dark:via-emerald-900/30 dark:to-teal-900/40 backdrop-blur-sm border border-emerald-200/30 dark:border-emerald-700/30 hover:bg-gradient-to-r hover:from-white/80 hover:via-emerald-50/60 hover:to-teal-50/80 dark:hover:from-slate-800/80 dark:hover:via-emerald-900/40 dark:hover:to-teal-900/50 hover:shadow-lg transition-all duration-300 hover:scale-[1.02]">

                    {/* Timeline connector */}
                    <div className="flex flex-col items-center flex-shrink-0">
                      <motion.div
                        className={cn("w-10 h-10 sm:w-12 sm:h-12 rounded-2xl flex items-center justify-center shadow-lg transition-all duration-300", activityStyle.iconBg)}
                        whileHover={{
                          scale: 1.1,
                          rotate: [0, -5, 5, 0]
                        }}
                        transition={{ duration: 0.4 }}
                      >
                        <activity.icon className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                      </motion.div>
                      {index < recentActivities.length - 1 && (
                        <motion.div
                          className="w-0.5 h-6 sm:h-8 bg-gradient-to-b from-emerald-300/50 to-transparent dark:from-emerald-600/50 mt-2"
                          initial={{ scaleY: 0 }}
                          animate={{ scaleY: 1 }}
                          transition={{ delay: 1.2 + index * 0.1, duration: 0.6 }}
                        />
                      )}
                    </div>

                    {/* Activity content */}
                    <div className="flex-1 min-w-0">
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1.1 + index * 0.1 }}
                      >
                        <h4 className={cn(
                          'text-sm sm:text-base font-semibold leading-tight mb-2 transition-colors duration-300 group-hover:text-emerald-700 dark:group-hover:text-emerald-300',
                          activityStyle.textColor
                        )}>
                          {activity.title}
                        </h4>

                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 flex-wrap">
                          <motion.div
                            className={cn(
                              'inline-flex items-center gap-1 px-2 sm:px-3 py-1 rounded-full text-xs font-medium border',
                              activityStyle.bgColor,
                              activityStyle.textColor,
                              'border-emerald-200/40 dark:border-emerald-700/40'
                            )}
                            whileHover={{ scale: 1.05 }}
                          >
                            <div className={`w-1.5 h-1.5 rounded-full bg-gradient-to-r ${activityStyle.gradient}`}></div>
                            <span className="capitalize">{activity.type}</span>
                          </motion.div>

                          <motion.div
                            className="flex items-center gap-1 text-xs text-emerald-600 dark:text-emerald-400 px-2 sm:px-3 py-1 rounded-full bg-emerald-100/60 dark:bg-emerald-900/40"
                            whileHover={{ scale: 1.05 }}
                          >
                            <Clock className="h-3 w-3" />
                            <span>{activity.time}</span>
                          </motion.div>
                        </div>
                      </motion.div>
                    </div>

                    {/* Hover indicator */}
                    <motion.div
                      className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 1.2 + index * 0.1 }}
                    >
                      <div className="w-2 h-2 rounded-full bg-gradient-to-r from-emerald-400 to-teal-500 animate-pulse"></div>
                    </motion.div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Community & Rooms - Modern Timeline Design */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.8 }}
          className="space-y-4 sm:space-y-6"
        >
          {/* Community Header */}
          <div className="flex items-center justify-between">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.9 }}
              className="flex items-center gap-2 sm:gap-3"
            >
              <div className="p-2 sm:p-3 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 text-white shadow-lg">
                <Users className="h-5 w-5 sm:h-6 sm:w-6" />
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-400 dark:to-pink-400 bg-clip-text text-transparent">
                  Practice Rooms
                </h2>
                <p className="text-xs sm:text-sm text-purple-600 dark:text-purple-400">Join live practice sessions</p>
              </div>
            </motion.div>

            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.0 }}
              whileHover={{ scale: 1.05, width: '100%' }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center justify-center gap-2 px-3 sm:px-4 py-2 rounded-full bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border border-purple-200/40 dark:border-purple-700/40 text-purple-700 dark:text-purple-300 font-medium hover:bg-white/90 dark:hover:bg-slate-800/90 transition-all duration-300 hover:shadow-md hover:rounded-2xl w-full"
            >
              <span>Browse All</span>
              <motion.div
                animate={{ x: [0, 3, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <ArrowRight className="h-3 w-3 sm:h-4 sm:w-4" />
              </motion.div>
            </motion.button>
          </div>

          {/* Use CommunityRoomCard component instead of redundant inline code */}
          <CommunityRoomCard
            rooms={practiceRooms}
            onBrowseAll={() => {
              // Handle browse all rooms
              console.log('Browse all rooms');
            }}
          />
        </motion.div>
  </div>
</div>
);

};

export default NewDashboardHome;
