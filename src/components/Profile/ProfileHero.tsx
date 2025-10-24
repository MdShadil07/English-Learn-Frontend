import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import {
  User,
  Star,
  Crown,
  Flame,
  Trophy,
  Target
} from 'lucide-react';
import { PremiumIcon, BasicIcon } from '@/components/Icons';
import { UserProfile } from '@/types/user';

interface HeroSectionProps {
  profile: UserProfile;
}

const HeroSection: React.FC<HeroSectionProps> = ({ profile }) => {
  const getSubscriptionBadge = () => {
    switch (profile.subscriptionStatus) {
      case 'premium':
        return (
          <div className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800/50">
            <PremiumIcon size="sm" className="flex-shrink-0" />
            <span className="text-xs font-semibold text-yellow-700 dark:text-yellow-300">Premium</span>
          </div>
        );
      case 'basic':
        return (
          <div className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            <BasicIcon size="sm" className="flex-shrink-0" />
            <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">Basic</span>
          </div>
        );
      default:
        return (
          <div className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">Free</span>
          </div>
        );
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="mt-12"
    >
      <Card className="relative overflow-hidden bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-lg">
        {/* Background decorations */}
        <div className="absolute inset-0 bg-slate-50/50 dark:bg-slate-900/50" />
        <div className="absolute top-0 right-0 w-32 h-32 bg-slate-100/30 dark:bg-slate-800/30 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-slate-100/30 dark:bg-slate-800/30 rounded-full blur-2xl" />

        <CardContent className="relative p-10">
          <div className="flex flex-col lg:flex-row items-start lg:items-center gap-8">
            {/* Left Section - Avatar and Basic Info */}
            <div className="flex flex-col items-center lg:items-start gap-6 flex-shrink-0 ml-8">
              <div className="relative group">
                <div className="absolute inset-0 bg-slate-200 dark:bg-slate-700 rounded-2xl blur opacity-20 group-hover:opacity-30 transition-opacity duration-300" />
                <div className="relative w-24 h-24 bg-white dark:bg-slate-800 rounded-2xl border-2 border-slate-200 dark:border-slate-700 shadow-lg flex items-center justify-center">
                  {profile.avatar_url ? (
                    <Avatar className="w-full h-full rounded-2xl">
                      <AvatarImage
                        src={profile.avatar_url}
                        alt={profile.fullName}
                        className="rounded-2xl object-cover"
                        onError={(e) => {
                          // Hide the image if Firebase URL is invalid
                          (e.target as HTMLImageElement).style.display = 'none';
                        }}
                      />
                      <AvatarFallback className="rounded-2xl bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 text-2xl font-bold">
                        {profile.fullName?.charAt(0) || 'U'}
                      </AvatarFallback>
                    </Avatar>
                  ) : (
                    <User className="h-12 w-12 text-slate-600 dark:text-slate-400" />
                  )}
                </div>
                {profile.subscriptionStatus === 'premium' && (
                  <div className="absolute -top-2 -right-2 bg-gradient-to-r from-yellow-400 to-amber-500 rounded-full p-1.5 shadow-lg">
                    <PremiumIcon size="sm" className="text-white" />
                  </div>
                )}
                {profile.subscriptionStatus === 'basic' && (
                  <div className="absolute -top-2 -right-2 bg-gradient-to-r from-slate-400 to-slate-500 rounded-full p-1.5 shadow-lg">
                    <BasicIcon size="sm" className="text-white" />
                  </div>
                )}
              </div>

              {/* User Info Below Avatar - Centered */}
              <div className="text-center space-y-1">
                <p className="text-xs text-slate-500 dark:text-slate-400 font-normal">{profile.email}</p>
                <div className="flex items-center justify-center gap-1">
                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                  <span className="text-xs font-medium text-green-600 dark:text-green-400">Active</span>
                </div>
              </div>
            </div>

            {/* Center Section - Main Info */}
            <div className="flex-1 space-y-6 ml-6">
              {/* Header Info */}
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                  <div>
                    <h1 className="text-3xl lg:text-4xl font-bold text-slate-900 dark:text-white mb-2">
                      {profile.fullName}
                    </h1>
                    <div className="flex flex-wrap items-center gap-3 mb-4">
                      <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium ${
                        profile.role === 'Student'
                          ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 border border-blue-200 dark:border-blue-800/50'
                          : 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/50'
                      }`}>
                        {profile.role === 'Student' ? (
                          <>
                            <Star className="h-4 w-4" />
                            Student
                          </>
                        ) : (
                          <>
                            <Crown className="h-4 w-4" />
                            Teacher
                          </>
                        )}
                      </div>
                      {getSubscriptionBadge()}
                    </div>
                  </div>
                </div>

                {/* Bio Section - Minimal Design */}
                {profile.bio && (
                  <div className="border-l-4 border-slate-300 dark:border-slate-600 pl-4 max-w-2xl">
                    <p className="text-slate-600 dark:text-slate-400 leading-relaxed">{profile.bio}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Right Section - Quick Stats */}
            <div className="flex-shrink-0">
              <div className="grid grid-cols-2 gap-6">
                <div className="bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-900/30 dark:to-red-900/30 rounded-xl p-4 border border-orange-200/50 dark:border-orange-800/50 shadow-sm hover:shadow-lg hover:-translate-y-1 hover:rotate-1 transition-all duration-300 min-w-[120px]">
                  <div className="flex items-center justify-center mb-2">
                    <Flame className="h-6 w-6 text-orange-500" />
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">12</p>
                    <p className="text-xs text-slate-600 dark:text-slate-400">Day Streak</p>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/30 dark:to-indigo-900/30 rounded-xl p-4 border border-blue-200/50 dark:border-blue-800/50 shadow-sm hover:shadow-lg hover:-translate-y-1 hover:-rotate-1 transition-all duration-300 min-w-[120px]">
                  <div className="flex items-center justify-center mb-2">
                    <Trophy className="h-6 w-6 text-blue-500" />
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">8,750</p>
                    <p className="text-xs text-slate-600 dark:text-slate-400">Total XP</p>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/30 dark:to-pink-900/30 rounded-xl p-4 border border-purple-200/50 dark:border-purple-800/50 shadow-sm hover:shadow-lg hover:-translate-y-1 hover:rotate-1 transition-all duration-300 min-w-[120px]">
                  <div className="flex items-center justify-center mb-2">
                    <Star className="h-6 w-6 text-purple-500" />
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">{profile.level}</p>
                    <p className="text-xs text-slate-600 dark:text-slate-400">Level</p>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-emerald-50 to-green-50 dark:from-emerald-900/30 dark:to-green-900/30 rounded-xl p-4 border border-emerald-200/50 dark:border-emerald-800/50 shadow-sm hover:shadow-lg hover:-translate-y-1 hover:-rotate-1 transition-all duration-300 min-w-[120px]">
                  <div className="flex items-center justify-center mb-2">
                    <Target className="h-6 w-6 text-emerald-500" />
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">87%</p>
                    <p className="text-xs text-slate-600 dark:text-slate-400">Accuracy</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default HeroSection;
