import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import {
  X,
  User,
  Trophy,
  Settings,
  Crown,
  Target,
  Activity,
  Award,
  TrendingUp,
  Clock,
  Star,
  Flame,
  Zap,
  Gift,
  Calendar,
  BookOpen,
  MessageSquare,
  Bell,
  Shield,
  CreditCard,
  Download,
  Edit3,
  ChevronDown,
  ChevronUp,
  Plus,
  CheckCircle2
} from 'lucide-react';
import ProfileSettings from './ProfileSettings';
import { BasicPlanCard } from './BasicPlanCard';
import { PremiumPlanCard } from './PremiumPlanCard';
import { PremiumIcon, BasicIcon } from '@/components/Icons';
import { FreeIcon } from '@/components/Icons';

interface ProfileSidebarProps {
  showSidebar: boolean;
  setShowSidebar: (show: boolean) => void;
  profile: {
    avatar_url?: string;
    fullName: string;
    level: number;
    stats: {
      currentStreak: number;
      totalXP: number;
    };
    isPremium: boolean;
    subscriptionStatus: 'none' | 'free' | 'basic' | 'premium';
    preferences: {
      theme: 'light' | 'dark' | 'auto';
      language: string;
      notifications: boolean;
      soundEffects: boolean;
      voiceOutput: boolean;
      autoplay: boolean;
      studyReminders: boolean;
      weeklyReports: boolean;
      privacyMode: boolean;
      dataCollection: boolean;
      marketingEmails: boolean;
    };
  };
  activeView: 'overview' | 'achievements' | 'settings' | 'activity' | 'subscription';
  onViewChange: (view: 'overview' | 'achievements' | 'settings' | 'activity' | 'subscription') => void;
  onEditProfile?: () => void;
}

export const ProfileSidebar: React.FC<ProfileSidebarProps> = ({
  showSidebar,
  setShowSidebar,
  profile,
  activeView,
  onViewChange,
  onEditProfile,
}) => {
  const sidebarViews = [
    { id: 'overview', label: 'Overview', icon: User, color: 'blue' },
    { id: 'achievements', label: 'Achievements', icon: Trophy, color: 'yellow' },
    { id: 'activity', label: 'Activity', icon: Activity, color: 'green' },
    { id: 'subscription', label: 'Subscription', icon: Crown, color: 'purple' },
    { id: 'settings', label: 'Settings', icon: Settings, color: 'slate' },
  ];

  const getIconColor = (color: string) => {
    const colors = {
      blue: 'text-blue-500',
      yellow: 'text-yellow-500',
      green: 'text-green-500',
      purple: 'text-purple-500',
      slate: 'text-slate-500',
    };
    return colors[color as keyof typeof colors] || colors.blue;
  };

  return (
    <>
      <style dangerouslySetInnerHTML={{
        __html: `
          .custom-scrollbar-thin {
            scrollbar-width: thin;
            scrollbar-color: rgba(148, 163, 184, 0.3) transparent;
            scroll-behavior: smooth;
            position: relative;
          }

          .custom-scrollbar-thin::-webkit-scrollbar {
            height: 0.5px;
            background: transparent;
          }

          .custom-scrollbar-thin::-webkit-scrollbar-track {
            background: transparent;
          }

          .custom-scrollbar-thin::-webkit-scrollbar-thumb {
            background: linear-gradient(90deg, rgba(148, 163, 184, 0.4), rgba(148, 163, 184, 0.2));
            border-radius: 0.25px;
            transition: all 0.2s ease;
            cursor: pointer;
            min-height: 0.5px;
          }

          .custom-scrollbar-thin::-webkit-scrollbar-thumb:hover {
            background: linear-gradient(90deg, rgba(99, 102, 241, 0.6), rgba(139, 92, 246, 0.6));
            height: 1px;
          }

          .custom-scrollbar-thin:hover::-webkit-scrollbar-thumb {
            background: linear-gradient(90deg, rgba(79, 70, 229, 0.7), rgba(124, 58, 237, 0.7));
          }

          /* Minimal scroll indicator */
          .scroll-indicator-minimal {
            position: absolute;
            bottom: 0;
            left: 0;
            right: 0;
            height: 0.5px;
            background: linear-gradient(90deg,
              transparent 0%,
              rgba(148, 163, 184, 0.15) 15%,
              rgba(148, 163, 184, 0.3) 50%,
              rgba(148, 163, 184, 0.15) 85%,
              transparent 100%
            );
            opacity: 0;
            transition: opacity 0.3s ease;
          }

          .custom-scrollbar-thin:hover .scroll-indicator-minimal {
            opacity: 1;
          }

          /* Floating animations */
          @keyframes float {
            0%, 100% { transform: translateY(0px) rotate(0deg); }
            50% { transform: translateY(-10px) rotate(5deg); }
          }

          @keyframes float-delayed {
            0%, 100% { transform: translateY(0px) rotate(0deg); }
            50% { transform: translateY(-8px) rotate(-3deg); }
          }

          .animate-float {
            animation: float 3s ease-in-out infinite;
          }

          .nav-button-active {
            background: linear-gradient(to right, #059669, #10b981) !important;
            transition: none !important;
          }

          .nav-button-inactive {
            transition: all 0.15s ease-in-out !important;
          }

          .nav-button-inactive:hover {
            transform: translateY(-1px) scale(1.02) !important;
          }
        `
      }} />
      <AnimatePresence>
      {showSidebar && (
        <motion.div
          initial={{ x: -400, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -400, opacity: 0 }}
          transition={{
            x: {
              type: 'spring',
              stiffness: 300,
              damping: 30,
            },
            opacity: {
              duration: 0.2,
              ease: "easeOut"
            }
          }}
          className="fixed top-16 left-0 z-40 w-80 sm:w-96 h-[calc(100vh-4rem)] bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-700 flex flex-col shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >

          {/* Header with Profile Card */}
          <div className="p-4 border-b border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/50">
            <Card className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-lg hover:shadow-xl transition-all duration-300">
              <CardContent className="p-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className="relative">
                    <Avatar className="w-16 h-16 ring-4 ring-white/50 dark:ring-slate-700/50 shadow-lg">
                      <AvatarImage
                        src={profile.avatar_url}
                        alt="Profile"
                        onError={(e) => {
                          // Hide the image if Firebase URL is invalid
                          (e.target as HTMLImageElement).style.display = 'none';
                        }}
                      />
                      <AvatarFallback className="bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 text-lg font-bold">
                        {profile.fullName?.charAt(0) || 'U'}
                      </AvatarFallback>
                    </Avatar>
                    {profile.subscriptionStatus === 'premium' && (
                      <PremiumIcon size="sm" className="absolute -top-1 -right-1" />
                    )}
                    {profile.subscriptionStatus === 'basic' && (
                      <BasicIcon size="sm" className="absolute -top-1 -right-1" />
                    )}
                    {profile.subscriptionStatus === 'free' && (
                      <FreeIcon size="sm" className="absolute -top-1 -right-1" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-slate-900 dark:text-slate-100 truncate text-base">{profile.fullName}</h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400">Level {profile.level}</p>
                  </div>
                </div>

                {/* Quick Stats with Modern Design */}
                <div className="grid grid-cols-2 gap-2">
                  <div className="relative overflow-hidden bg-gradient-to-br from-orange-50/90 via-red-50/90 to-amber-50/90 dark:from-orange-900/30 dark:via-red-900/30 dark:to-amber-900/30 backdrop-blur-xl p-3 rounded-2xl border border-orange-200/40 dark:border-orange-800/40 shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-105">
                    {/* Background decorative elements */}
                    <div className="absolute inset-0 bg-gradient-to-br from-orange-100/20 to-red-100/20 dark:from-orange-900/10 dark:to-red-900/10 rounded-2xl"></div>
                    <div className="absolute top-1 right-1 w-3 h-3 rounded-full bg-gradient-to-br from-orange-400/60 to-red-400/60 animate-pulse"></div>
                    <div className="absolute bottom-1 left-1 w-2 h-2 rounded-full bg-gradient-to-br from-red-400/40 to-orange-400/40 animate-pulse delay-500"></div>

                    {/* Floating geometric shapes */}
                    <div className="absolute top-2 right-8 w-4 h-4 rounded-lg bg-gradient-to-br from-orange-300/30 to-red-300/30 dark:from-orange-700/30 dark:to-red-700/30 rotate-45 animate-float opacity-60"></div>

                    <div className="relative flex items-center gap-3">
                      <motion.div
                        animate={{
                          rotate: [0, 10, -10, 0],
                          scale: [1, 1.05, 1]
                        }}
                        transition={{
                          duration: 3,
                          repeat: Infinity,
                          ease: "easeInOut"
                        }}
                        className="p-3 rounded-xl bg-gradient-to-br from-orange-500 to-red-500 text-white shadow-lg"
                      >
                        <Flame className="h-5 w-5" />
                      </motion.div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-orange-700 dark:text-orange-300 mb-1">Current Streak</p>
                        <p className="font-extrabold text-2xl text-orange-900 dark:text-orange-100">{profile.stats.currentStreak}</p>
                        <p className="text-xs text-orange-600 dark:text-orange-400">days 🔥</p>
                      </div>
                    </div>
                  </div>
                  <div className="relative overflow-hidden bg-gradient-to-br from-blue-50/90 via-indigo-50/90 to-purple-50/90 dark:from-blue-900/30 dark:via-indigo-900/30 dark:to-purple-900/30 backdrop-blur-xl p-3 rounded-2xl border border-blue-200/40 dark:border-blue-800/40 shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-105">
                    {/* Background decorative elements */}
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-100/20 to-indigo-100/20 dark:from-blue-900/10 dark:to-indigo-900/10 rounded-2xl"></div>
                    <div className="absolute top-1 right-1 w-3 h-3 rounded-full bg-gradient-to-br from-blue-400/60 to-indigo-400/60 animate-pulse"></div>
                    <div className="absolute bottom-1 left-1 w-2 h-2 rounded-full bg-gradient-to-br from-indigo-400/40 to-blue-400/40 animate-pulse delay-500"></div>

                    {/* Floating geometric shapes */}
                    <div className="absolute top-2 right-8 w-4 h-4 rounded-lg bg-gradient-to-br from-blue-300/30 to-indigo-300/30 dark:from-blue-700/30 dark:to-indigo-700/30 rotate-45 animate-float opacity-60"></div>

                    <div className="relative flex items-center gap-3">
                      <motion.div
                        animate={{
                          rotate: [0, 10, -10, 0],
                          scale: [1, 1.05, 1]
                        }}
                        transition={{
                          duration: 3,
                          repeat: Infinity,
                          ease: "easeInOut",
                          delay: 0.5
                        }}
                        className="p-3 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-500 text-white shadow-lg"
                      >
                        <Trophy className="h-5 w-5" />
                      </motion.div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-blue-700 dark:text-blue-300 mb-1">Total XP</p>
                        <p className="font-extrabold text-2xl text-blue-900 dark:text-blue-100">{profile.stats.totalXP.toLocaleString()}</p>
                        <p className="text-xs text-blue-600 dark:text-blue-400">points earned 🏆</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Premium Badge */}
                {profile.subscriptionStatus === 'premium' && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.8, type: "spring", stiffness: 200 }}
                    className="mt-3 relative overflow-hidden bg-gradient-to-br from-yellow-50/90 via-amber-50/90 to-orange-50/90 dark:from-yellow-900/30 dark:via-amber-900/30 dark:to-orange-900/30 backdrop-blur-xl rounded-2xl px-3 py-2 border border-yellow-200/50 dark:border-yellow-800/50 shadow-xl hover:shadow-2xl transition-all duration-500"
                  >
                    {/* Background decorative elements */}
                    <div className="absolute inset-0 bg-gradient-to-br from-yellow-100/30 to-amber-100/30 dark:from-yellow-900/15 dark:to-amber-900/15 rounded-2xl"></div>
                    <div className="absolute top-1 right-1 w-3 h-3 rounded-full bg-gradient-to-br from-yellow-400/60 to-orange-400/60 animate-pulse"></div>
                    <div className="absolute bottom-1 left-1 w-2 h-2 rounded-full bg-gradient-to-br from-orange-400/40 to-yellow-400/40 animate-pulse delay-500"></div>

                    <div className="relative flex items-center gap-3">
                      <motion.div
                        animate={{
                          rotate: [0, 5, -5, 0],
                          scale: [1, 1.1, 1]
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          ease: "easeInOut"
                        }}
                        className="p-2 rounded-xl bg-gradient-to-br from-yellow-400 to-orange-500 text-white shadow-lg"
                      >
                        <PremiumIcon size="md" className="flex-shrink-0" />
                      </motion.div>
                      <div className="flex-1">
                        <p className="text-xs font-semibold text-yellow-800 dark:text-yellow-200 mb-1">Premium Member</p>
                        <p className="text-xs text-yellow-700 dark:text-yellow-300">All Features Unlocked</p>
                      </div>
                    </div>

                    {/* Decorative progress ring */}
                    <div className="absolute top-2 right-8 w-6 h-6 rounded-full border-2 border-yellow-400/30 dark:border-yellow-600/30 animate-pulse"></div>
                  </motion.div>
                )}
                {profile.subscriptionStatus === 'basic' && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.8, type: "spring", stiffness: 200 }}
                    className="mt-3 relative overflow-hidden bg-gradient-to-br from-slate-50/90 via-gray-50/90 to-zinc-50/90 dark:from-slate-800/30 dark:via-gray-800/30 dark:to-zinc-800/30 backdrop-blur-xl rounded-2xl px-3 py-2 border border-slate-200/50 dark:border-slate-700/50 shadow-xl hover:shadow-2xl transition-all duration-500"
                  >
                    {/* Background decorative elements */}
                    <div className="absolute inset-0 bg-gradient-to-br from-slate-100/30 to-gray-100/30 dark:from-slate-800/15 dark:to-gray-800/15 rounded-2xl"></div>
                    <div className="absolute top-1 right-1 w-3 h-3 rounded-full bg-gradient-to-br from-slate-400/60 to-gray-400/60 animate-pulse"></div>
                    <div className="absolute bottom-1 left-1 w-2 h-2 rounded-full bg-gradient-to-br from-gray-400/40 to-slate-400/40 animate-pulse delay-500"></div>

                    <div className="relative flex items-center gap-3">
                      <motion.div
                        animate={{
                          rotate: [0, 5, -5, 0],
                          scale: [1, 1.05, 1]
                        }}
                        transition={{
                          duration: 2.5,
                          repeat: Infinity,
                          ease: "easeInOut"
                        }}
                        className="p-2 rounded-xl bg-gradient-to-br from-slate-500 to-gray-600 text-white shadow-lg"
                      >
                        <BasicIcon size="md" className="flex-shrink-0" />
                      </motion.div>
                      <div className="flex-1">
                        <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 mb-1">Basic Member</p>
                        <p className="text-xs text-slate-600 dark:text-slate-400">Core Features Available</p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Navigation Tabs - Horizontal Scrolling Pagination */}
          <div className="px-4 mt-4 mb-3">
            <div className="relative">
              {/* Horizontal Scrollable Container with Enhanced Scrollbar */}
              <div className="overflow-x-auto custom-scrollbar-thin scrollbar-thin touch-pan-x">
                <div className="flex gap-2 items-center min-w-max px-1 pb-2">
                  {sidebarViews.map((view, index) => {
                    const Icon = view.icon;
                    const isActive = activeView === view.id;

                    return (
                      <motion.button
                        key={view.id}
                        onClick={() => onViewChange(view.id as any)}
                        className={`relative flex-shrink-0 px-3 py-2.5 rounded-lg flex items-center gap-2 min-w-[95px] sm:min-w-[100px] ${isActive ? 'nav-button-active bg-gradient-to-r from-emerald-600 to-emerald-500 text-white shadow-lg border-0' : 'nav-button-inactive bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-emerald-700 dark:hover:text-emerald-300 border border-slate-200 dark:border-slate-700 hover:border-emerald-300 dark:hover:border-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/30 hover:shadow-md'}`}
                        whileHover={isActive ? {} : { scale: 1.02, y: -1 }}
                        whileTap={isActive ? {} : { scale: 0.98 }}
                      >
                        <Icon className={`h-4 w-4 ${isActive ? 'text-white' : getIconColor(view.color)}`} />
                        <span className={`text-xs font-semibold ${isActive ? 'text-white' : ''}`}>
                          {view.label}
                        </span>

                        {/* Active State Pulse Effect - Behind content */}
                        {isActive && (
                          <motion.div
                            className="absolute inset-0 bg-emerald-100 dark:bg-emerald-800 rounded-lg shadow-lg -z-10"
                            animate={{
                              boxShadow: [
                                "0 0 0 0 rgba(5, 150, 105, 0.7)",
                                "0 0 0 4px rgba(5, 150, 105, 0)",
                                "0 0 0 0 rgba(5, 150, 105, 0)"
                              ]
                            }}
                            transition={{
                              duration: 2,
                              repeat: Infinity,
                              ease: "easeInOut",
                              repeatDelay: 1
                            }}
                          />
                        )}
                      </motion.button>
                    );
                  })}
                </div>
              </div>

              {/* Scroll Indicator */}
              <div className="scroll-indicator-minimal"></div>
            </div>
          </div>

          {/* Dynamic Content Area */}
          <div className="flex-1 overflow-hidden">
            <AnimatePresence mode="wait">
              {activeView === 'overview' && (
                <motion.div
                  key="overview"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className="h-full overflow-y-auto p-4 space-y-5 bg-gradient-to-b from-indigo-50/20 via-white/40 to-purple-50/20 dark:from-slate-900/40 dark:via-slate-900/30 dark:to-slate-800/40 scrollbar-hide"
                >
                  <div className="space-y-6">
                    {/* Daily Progress */}
                    <div className="bg-gradient-to-br from-emerald-50/90 via-green-50/90 to-teal-50/90 dark:from-emerald-900/30 dark:via-green-900/30 dark:to-teal-900/30 backdrop-blur-sm rounded-xl p-4 border border-emerald-200/40 dark:border-emerald-800/40 shadow-lg">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-green-600 rounded-lg flex items-center justify-center shadow-md">
                          <Target className="h-4 w-4 text-white" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-slate-900 dark:text-slate-100 text-sm">Daily Progress</h4>
                          <p className="text-xs text-slate-600 dark:text-slate-400">Today's learning streak</p>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between text-xs">
                          <span className="text-slate-600 dark:text-slate-400">Study Time</span>
                          <span className="font-medium text-slate-900 dark:text-slate-100">45m</span>
                        </div>
                        <div className="w-full bg-emerald-200/60 dark:bg-emerald-800/60 rounded-full h-1.5">
                          <div
                            className="bg-gradient-to-r from-emerald-500 to-green-500 h-1.5 rounded-full transition-all duration-500"
                            style={{ width: '75%' }}
                          ></div>
                        </div>
                        <div className="flex justify-between text-xs">
                          <span className="text-slate-600 dark:text-slate-400">Weekly Goal</span>
                          <span className="font-medium text-slate-900 dark:text-slate-100">60 min</span>
                        </div>
                      </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="space-y-4">
                      <div className="flex items-center gap-2">
                        <Zap className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                        <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">Quick Actions</span>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            if (onEditProfile) {
                              onEditProfile();
                              setShowSidebar(false);
                            }
                          }}
                          className="text-xs bg-white/80 dark:bg-slate-800/80 border-indigo-200 dark:border-slate-600 hover:bg-indigo-50 dark:hover:bg-slate-700 transition-all duration-200 h-10"
                        >
                          <Edit3 className="h-3 w-3 mr-2" />
                          Edit Profile
                        </Button>
                        <Button variant="outline" size="sm" className="text-xs bg-white/80 dark:bg-slate-800/80 border-indigo-200 dark:border-slate-600 hover:bg-indigo-50 dark:hover:bg-slate-700 transition-all duration-200 h-10">
                          <Download className="h-3 w-3 mr-2" />
                          Export Data
                        </Button>
                      </div>
                    </div>

                    {/* Current Level Progress */}
                    <div className="bg-gradient-to-br from-blue-50/90 via-indigo-50/90 to-purple-50/90 dark:from-blue-900/30 dark:via-indigo-900/30 dark:to-purple-900/30 backdrop-blur-sm rounded-xl p-4 border border-blue-200/40 dark:border-blue-800/40 shadow-lg">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center shadow-md">
                          <Star className="h-4 w-4 text-white" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-slate-900 dark:text-slate-100 text-sm">Level Progress</h4>
                          <p className="text-xs text-slate-600 dark:text-slate-400">Level {profile.level} • {profile.stats.totalXP.toLocaleString()} XP</p>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between text-xs">
                          <span className="text-slate-600 dark:text-slate-400">Progress to Next Level</span>
                          <span className="font-medium text-slate-900 dark:text-slate-100">75%</span>
                        </div>
                        <div className="w-full bg-blue-200/60 dark:bg-blue-800/60 rounded-full h-2">
                          <div
                            className="bg-gradient-to-r from-blue-500 to-indigo-500 h-2 rounded-full transition-all duration-500"
                            style={{ width: '75%' }}
                          ></div>
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-500">2,500 XP to next level</p>
                      </div>
                    </div>

                    {/* Subscription Status */}
                    <div className="space-y-4">
                      <div className="flex items-center gap-2">
                        <Crown className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                        <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">Subscription</span>
                      </div>
                      <div className="bg-gradient-to-br from-slate-50/90 to-indigo-50/90 dark:from-slate-800/90 dark:to-slate-900/90 rounded-xl p-4 border border-slate-200/60 dark:border-slate-700/60 backdrop-blur-sm">
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-sm text-slate-600 dark:text-slate-400 font-medium">Current Plan</span>
                          <div className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${profile.subscriptionStatus === 'premium' ? 'bg-gradient-to-r from-amber-100 via-yellow-100 to-orange-100 text-amber-800 dark:from-amber-900/30 dark:via-yellow-900/30 dark:to-orange-900/30 dark:text-amber-300' : profile.subscriptionStatus === 'basic' ? 'bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-800 dark:from-blue-900/30 dark:to-indigo-900/30 dark:text-blue-300' : profile.subscriptionStatus === 'free' ? 'bg-gradient-to-r from-gray-100 to-slate-100 text-gray-700 dark:from-gray-900/30 dark:to-slate-900/30 dark:text-gray-300' : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'}`}>
                            {profile.subscriptionStatus === 'premium' ? (
                              <>
                                <PremiumIcon size="md" className="flex-shrink-0" />
                                Premium
                              </>
                            ) : profile.subscriptionStatus === 'basic' ? (
                              <>
                                <BasicIcon size="md" className="flex-shrink-0" />
                                Basic
                              </>
                            ) : profile.subscriptionStatus === 'free' ? (
                              <>
                                <FreeIcon size="md" className="flex-shrink-0" />
                                Free
                              </>
                            ) : (
                              <>
                                <span className="text-slate-600 dark:text-slate-400">No Subscription</span>
                              </>
                            )}
                          </div>
                        </div>
                        {profile.subscriptionStatus === 'none' && (
                          <Button size="sm" className="w-full text-xs bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white border-0 shadow-lg">
                            <Crown className="h-3 w-3 mr-2" />
                            Choose a Plan
                          </Button>
                        )}
                        {profile.subscriptionStatus === 'free' && (
                          <Button size="sm" className="w-full text-xs bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white border-0 shadow-lg">
                            <Crown className="h-3 w-3 mr-2" />
                            Upgrade to Basic
                          </Button>
                        )}
                        {profile.subscriptionStatus === 'basic' && (
                          <Button size="sm" className="w-full text-xs bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white border-0 shadow-lg">
                            <Crown className="h-3 w-3 mr-2" />
                            Upgrade to Premium
                          </Button>
                        )}
                        {profile.subscriptionStatus === 'premium' && (
                          <div className="text-center">
                            <p className="text-xs text-slate-600 dark:text-slate-400 mb-2">Premium Member</p>
                            <div className="flex items-center justify-center gap-1">
                              <PremiumIcon size="md" className="flex-shrink-0" />
                              <span className="text-xs font-medium text-yellow-700 dark:text-yellow-300">All Features Unlocked</span>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Recent Achievements */}
                    <div className="space-y-4">
                      <div className="flex items-center gap-2">
                        <Trophy className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                        <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">Recent Achievements</span>
                      </div>
                      <div className="space-y-2">
                        <div className="bg-gradient-to-r from-amber-50/80 to-orange-50/80 dark:from-amber-900/30 dark:to-orange-900/30 rounded-lg p-3 border border-amber-200/40 dark:border-amber-800/40">
                          <div className="flex items-center gap-3">
                            <div className="text-xl">🏆</div>
                            <div className="flex-1">
                              <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">Week Warrior</p>
                              <p className="text-xs text-slate-600 dark:text-slate-400">7-day streak completed</p>
                            </div>
                          </div>
                        </div>
                        <div className="bg-gradient-to-r from-blue-50/80 to-indigo-50/80 dark:from-blue-900/30 dark:to-indigo-900/30 rounded-lg p-3 border border-blue-200/40 dark:border-blue-800/40">
                          <div className="flex items-center gap-3">
                            <div className="text-xl">📚</div>
                            <div className="flex-1">
                              <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">Grammar Master</p>
                              <p className="text-xs text-slate-600 dark:text-slate-400">95% accuracy achieved</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeView === 'subscription' && (
                <motion.div
                  key="subscription"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className="h-full overflow-y-auto p-4 space-y-5 bg-gradient-to-b from-purple-50/20 via-white/40 to-indigo-50/20 dark:from-slate-900/40 dark:via-slate-900/30 dark:to-slate-800/40 scrollbar-hide"
                >
                  <div className="space-y-4">
                    <BasicPlanCard />
                    <PremiumPlanCard isPremium={profile.isPremium} />
                  </div>
                </motion.div>
              )}

              {activeView === 'settings' && (
                <motion.div
                  key="settings"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className="h-full overflow-y-auto p-4 space-y-5 bg-gradient-to-b from-slate-50/20 via-white/40 to-indigo-50/20 dark:from-slate-900/40 dark:via-slate-900/30 dark:to-slate-800/40 scrollbar-hide"
                >
                  <ProfileSettings
                    preferences={profile.preferences}
                    onUpdatePreferences={(preferences) => {
                      // Update preferences logic here
                      console.log('Preferences updated:', preferences);
                    }}
                  />
                </motion.div>
              )}

              {(activeView === 'achievements' || activeView === 'activity') && (
                <motion.div
                  key={activeView}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className="h-full overflow-y-auto p-4 space-y-5 bg-gradient-to-b from-yellow-50/20 via-white/40 to-orange-50/20 dark:from-slate-900/40 dark:via-slate-900/30 dark:to-slate-800/40 scrollbar-hide"
                >
                  <div className="text-center py-8">
                    <div className={`w-16 h-16 mx-auto mb-4 rounded-2xl flex items-center justify-center shadow-lg ${
                      activeView === 'achievements'
                        ? 'bg-gradient-to-br from-yellow-100 to-orange-100 dark:from-yellow-900/40 dark:to-orange-900/40'
                        : 'bg-gradient-to-br from-green-100 to-emerald-100 dark:from-green-900/40 dark:to-emerald-900/40'
                    }`}>
                      {activeView === 'achievements' ? (
                        <Trophy className="h-8 w-8 text-yellow-600 dark:text-yellow-400" />
                      ) : (
                        <Activity className="h-8 w-8 text-green-600 dark:text-green-400" />
                      )}
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-2">
                      {activeView === 'achievements' ? 'Achievement Gallery' : 'Activity Timeline'}
                    </h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mb-6 leading-relaxed">
                      {activeView === 'achievements'
                        ? 'Track your learning milestones and unlock rewards'
                        : 'View your learning journey and progress over time'
                      }
                    </p>
                    <Button className={`bg-gradient-to-r shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 ${
                      activeView === 'achievements'
                        ? 'from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600'
                        : 'from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600'
                    }`}>
                      <Plus className="h-4 w-4 mr-2" />
                      {activeView === 'achievements' ? 'Browse Achievements' : 'View Full Activity'}
                    </Button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
    </>
  );
};
