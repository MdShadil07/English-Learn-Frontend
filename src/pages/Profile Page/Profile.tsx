
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts';
import { ProfileSidebar } from '../../components/Profile/ProfileSidebar';
import { AchievementCard, LearningGoalCard, ActivityCard } from '../../components/Profile/ProfileComponents';
import ProfileStats from '../../components/Profile/ProfileStats';
import ProfileSettings from '../../components/Profile/ProfileSettings';
import ProfilePhotoUpload from '../../components/Profile/ProfilePhotoUpload';
import { BasicPlanCard } from '../../components/Profile/BasicPlanCard';
import { PremiumPlanCard } from '../../components/Profile/PremiumPlanCard';
import { PremiumIcon, BasicIcon, LinkedinIcon, TwitterIcon, GithubIcon, InstagramIcon, FacebookIcon } from '../../components/Icons/index';
import BasicHeader from '../../components/layout/BasicHeader';
import Footer from '../../components/Landing Page Component/Footer';
import { Button } from '@/components/ui/button';
import { Trophy, Star, Flame, Clock, Target, Lightbulb, Settings, Activity, Crown, Menu, GraduationCap, Briefcase, User, BookOpen, X } from 'lucide-react';
import { UserProfile } from '@/types/user';

const Profile: React.FC = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, isLoading } = useAuth();

  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);
  const [showSidebar, setShowSidebar] = useState(true);
  const [currentPhotoUrl, setCurrentPhotoUrl] = useState<string>('');
  const [activeView, setActiveView] = useState<'overview' | 'achievements' | 'settings' | 'activity' | 'subscription'>('overview');
  const [sidebarActiveView, setSidebarActiveView] = useState<'overview' | 'achievements' | 'settings' | 'activity' | 'subscription'>('overview');

  // Load profile data
  useEffect(() => {
    if (isAuthenticated && user?.id) {
      loadProfileData();
    }
  }, [isAuthenticated, user?.id]);

  const loadProfileData = async () => {
    setIsLoadingProfile(true);
    try {
      // Mock data (replace with API)
      const mockProfile: UserProfile = {
        id: user?.id || '1',
        fullName: 'Alex Johnson',
        email: user?.email || 'alex@example.com',
        avatar_url: null,
        level: 15,
        isPremium: true,
        subscriptionStatus: 'premium', // Example: set to 'premium' for demo
        role: 'Student',
        bio: 'Passionate English learner with a focus on business communication and pronunciation.',
        location: 'New York, USA',
        address: '123 Main Street, New York, NY 10001',
        phone: '+1 (555) 123-4567',
        educationalQualifications: [
          {
            id: '1',
            degree: 'High School Diploma',
            fieldOfStudy: 'General Education',
            institution: 'Lincoln High School',
            graduationYear: 2019,
            startYear: 2015,
            location: 'New York, USA',
            gpa: '3.7',
            achievements: ['Valedictorian', 'Science Fair Winner']
          },
          {
            id: '2',
            degree: 'Bachelor of Science',
            fieldOfStudy: 'Computer Science',
            institution: 'New York University',
            graduationYear: 2023,
            startYear: 2019,
            location: 'New York, USA',
            gpa: '3.8',
            achievements: ['Dean\'s List', 'CS Honor Society', 'Hackathon Winner']
          },
          {
            id: '3',
            degree: 'Master of Science',
            fieldOfStudy: 'Artificial Intelligence',
            institution: 'Stanford University',
            graduationYear: 2025,
            startYear: 2023,
            location: 'California, USA',
            description: 'Currently pursuing advanced studies in AI and Machine Learning',
            achievements: ['Research Assistant', 'Published Paper on NLP']
          }
        ],
        joinedDate: '2024-01-15',
        lastActive: new Date().toISOString(),
        totalStudyTime: 12750,
        weeklyGoal: 300,
        achievements: [
          { id: '1', title: 'Week Warrior', description: 'Completed 7 consecutive days of study', icon: '🏆', category: 'streak', rarity: 'common', unlockedAt: '2024-10-01T10:00:00Z' },
          { id: '2', title: 'Grammar Master', description: 'Achieved 95% accuracy in grammar exercises', icon: '📝', category: 'skill', rarity: 'rare', unlockedAt: '2024-09-25T14:30:00Z' }
        ],
        stats: {
          currentStreak: 12,
          longestStreak: 28,
          totalSessions: 156,
          totalXP: 8750,
          accuracy: 87,
          vocabulary: 92,
          grammar: 89,
          pronunciation: 85,
          fluency: 83,
          completedLessons: 45,
          certificates: 3,
          studyTimeThisWeek: 245,
          averageSessionLength: 18
        },
        preferences: {
          theme: 'auto',
          language: 'en',
          notifications: true,
          soundEffects: true,
          voiceOutput: false,
          autoplay: false,
          studyReminders: true,
          weeklyReports: true,
          privacyMode: false,
          dataCollection: true,
          marketingEmails: false
        },
        recentActivity: [
          { id: '1', type: 'lesson', title: 'Completed Business English - Email Writing', description: 'Advanced email composition practice', timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), xpGained: 150, icon: '📚' }
        ],
        learningGoals: [
          { id: '1', title: 'IELTS Speaking Score', description: 'Achieve band 7.5 in IELTS Speaking', category: 'certification', targetValue: 7.5, currentValue: 6.5, unit: 'band', deadline: '2024-12-31', isCompleted: false }
        ],
        skills: [
          { skill: 'Grammar', current: 89, target: 95, improvement: 12, icon: '📝' }
        ],
        certificates: [
          { id: '1', name: 'IELTS Academic', issuer: 'British Council', date: '2024-03-15', credentialId: 'IELTS-2024-001234', verificationUrl: 'https://ielts.org/verify/001234' }
        ],
        professionalInfo: { company: 'Global English Institute', position: 'Senior English Instructor', experienceYears: 8, industry: 'Education', specializations: ['Business English', 'IELTS Preparation', 'Pronunciation Coaching'] },
        socialHandles: {
          linkedin: 'https://linkedin.com/in/alexjohnson',
          twitter: 'https://twitter.com/alexjohnson',
          github: 'https://github.com/alexjohnson',
          website: 'https://alexjohnson.dev'
        }
      };
      setProfile(mockProfile);
    } catch (error) {
      console.error('Error loading profile:', error);
    } finally {
      setIsLoadingProfile(false);
    }
  };

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  const handleViewChange = (view: 'overview' | 'achievements' | 'settings' | 'activity' | 'subscription') => {
    setActiveView(view);
  };

  if (isLoading || isLoadingProfile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading your profile...</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-slate-600 dark:text-slate-400">Unable to load profile data</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50/20 to-blue-50/30 dark:from-slate-900 dark:via-slate-900 dark:to-slate-900 transition-all duration-500 overflow-x-hidden">
      {/* Header */}
      <BasicHeader
        user={{
          id: user?.id || '1',
          email: user?.email || 'user@example.com',
          fullName: user?.email?.split('@')[0]?.replace(/[^a-zA-Z0-9]/g, ' ') || 'Alex Johnson',
          avatar_url: profile?.avatar_url,
          isPremium: profile?.isPremium,
        }}
        onLogout={() => {
          // Handle logout logic here
        }}
        showSidebarToggle={true}
        onSidebarToggle={setShowSidebar}
        title="FluentPro"
        subtitle="English Learning"
      />

      {/* Main Layout Container */}
      <div className="flex min-h-[calc(100vh-4rem)]">
        {/* Sidebar */}
        <ProfileSidebar
          showSidebar={showSidebar}
          setShowSidebar={setShowSidebar}
          profile={{
            avatar_url: profile.avatar_url,
            fullName: profile.fullName,
            level: profile.level,
            stats: { currentStreak: profile.stats.currentStreak, totalXP: profile.stats.totalXP },
            isPremium: profile.isPremium,
            subscriptionStatus: profile.subscriptionStatus,
            preferences: profile.preferences,
          }}
          activeView={sidebarActiveView}
          onViewChange={setSidebarActiveView}
        />

        {/* Backdrop Overlay - Only behind sidebar */}
        {showSidebar && (
          <div
            className="fixed top-16 left-0 w-80 sm:w-96 h-[calc(100vh-4rem)] bg-black/5 dark:bg-black/10 z-30"
          />
        )}

        {/* Clickable Backdrop - For closing sidebar */}
        {showSidebar && (
          <div
            className="fixed top-16 left-80 sm:left-96 right-0 h-[calc(100vh-4rem)] bg-transparent z-35"
            onClick={() => setShowSidebar(false)}
          />
        )}

        {/* Main Content */}
        <div className={`flex-1 p-4 sm:p-6 lg:p-8 space-y-8 transition-all duration-300 pt-20 ${
          showSidebar ? 'lg:ml-80 xl:ml-96' : 'ml-0'
        }`}>

        {/* ================================================================== */}
        {/* START OF LAYOUT AS REQUESTED                                       */}
        {/* ================================================================== */}

        {/* ROW 1: Hero / Header - Always visible (Full Width) */}
        <div className="bg-white/95 dark:bg-slate-800/95 backdrop-blur-xl rounded-2xl p-8 shadow-lg border border-indigo-100 dark:border-slate-700 relative overflow-hidden mt-12">
          {/* Background decoration */}
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6 sm:gap-8 pt-6 sm:pt-8">
            {/* User Avatar Section - Left Hand Side */}
            <div className="flex flex-col items-center gap-3 sm:gap-4">
              <div className="relative">
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900/30 dark:to-purple-900/30 rounded-xl sm:rounded-2xl flex items-center justify-center border-2 border-indigo-200/50 dark:border-indigo-800/50 shadow-lg">
                  <User className="h-8 w-8 sm:h-10 sm:w-10 text-indigo-600 dark:text-indigo-400" />
                </div>
                {profile.subscriptionStatus === 'premium' && (
                  <PremiumIcon size="sm" className="absolute -top-2 -right-2" />
                )}
                {profile.subscriptionStatus === 'basic' && (
                  <BasicIcon size="sm" className="absolute -top-2 -right-2" />
                )}
              </div>
              <div className="text-center">
                <p className="text-xs sm:text-sm font-medium text-slate-900 dark:text-slate-100">{profile.fullName}</p>
                <p className="text-xs text-slate-600 dark:text-slate-400 hidden sm:block">{profile.email}</p>
                <div className="flex items-center justify-center gap-1 mt-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-xs text-green-600 dark:text-green-400">Active</span>
                </div>
              </div>
            </div>

            {/* User Info Section - Center/Right */}
            <div className="flex-1 text-center lg:text-left">
              {/* Welcome Message */}
              <div className="mb-6">
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-900 dark:text-white mb-2">
                  {profile.fullName}
                </h1>
                <div className="flex flex-wrap justify-center lg:justify-start items-center gap-2 sm:gap-3 mb-3">
                  <div className={`flex items-center gap-1 px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium ${
                    profile.role === 'Student'
                      ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'
                      : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300'
                  }`}>
                    {profile.role}
                  </div>
                  <div className={`flex items-center gap-1 px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium ${
                    profile.subscriptionStatus === 'premium'
                      ? 'bg-gradient-to-r from-yellow-100 to-amber-100 text-yellow-800 dark:from-yellow-900/30 dark:text-yellow-300'
                      : profile.subscriptionStatus === 'basic'
                      ? 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                      : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                  }`}>
                    {profile.subscriptionStatus === 'premium' ? (
                      <>
                        <PremiumIcon size="sm" className="flex-shrink-0" />
                        Premium
                      </>
                    ) : profile.subscriptionStatus === 'basic' ? (
                      <>
                        <BasicIcon size="sm" className="flex-shrink-0" />
                        Basic
                      </>
                    ) : (
                      'No Subscription'
                    )}
                  </div>
                </div>

                {/* About Section */}
                {profile.bio && (
                  <div className="bg-slate-50/50 dark:bg-slate-800/50 rounded-lg p-3 sm:p-4 border border-slate-200/50 dark:border-slate-700/50 max-w-lg mx-auto lg:mx-0">
                    <h3 className="text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">About</h3>
                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{profile.bio}</p>
                  </div>
                )}
              </div>

              {/* Quick Actions Row */}
              <div className="flex flex-wrap justify-center lg:justify-start gap-2 sm:gap-3">
                <Button size="sm" className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-200">
                  <Target className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
                  Start Learning
                </Button>
                <Button variant="outline" size="sm" className="border-indigo-200 dark:border-indigo-700 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 transition-all duration-200">
                  <Trophy className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
                  View Achievements
                </Button>
              </div>
            </div>
          </div>
        </div>


        {/* Personal Information */}
        <div className="bg-white/95 dark:bg-slate-800/95 backdrop-blur-xl rounded-2xl p-6 shadow-xl border border-indigo-100/50 dark:border-slate-700/50 relative overflow-hidden">
          {/* Background decoration */}
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/30 to-purple-50/30 dark:from-indigo-950/20 dark:to-purple-950/20"></div>
          <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-indigo-200/20 to-purple-200/20 dark:from-indigo-800/20 dark:to-purple-800/20 rounded-full blur-2xl"></div>

          <div className="relative">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <User className="h-5 w-5 text-white" />
              </div>
              Personal Information
            </h3>

            {/* Personal Details Grid */}
            <div className="grid grid-cols-1 gap-4 mb-6">
              <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm rounded-xl p-4 border border-slate-200/50 dark:border-slate-700/50 hover:bg-white/80 dark:hover:bg-slate-800/80 transition-all duration-200">
                <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-2 block">Full Name</label>
                <p className="text-lg font-semibold text-slate-900 dark:text-slate-100">{profile.fullName}</p>
              </div>
              <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm rounded-xl p-4 border border-slate-200/50 dark:border-slate-700/50 hover:bg-white/80 dark:hover:bg-slate-800/80 transition-all duration-200">
                <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-2 block">Email Address</label>
                <p className="text-slate-700 dark:text-slate-300">{profile.email}</p>
              </div>
              {profile.phone && (
                <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm rounded-xl p-4 border border-slate-200/50 dark:border-slate-700/50 hover:bg-white/80 dark:hover:bg-slate-800/80 transition-all duration-200">
                  <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-2 block">Phone Number</label>
                  <p className="text-slate-700 dark:text-slate-300">{profile.phone}</p>
                </div>
              )}
              <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm rounded-xl p-4 border border-slate-200/50 dark:border-slate-700/50 hover:bg-white/80 dark:hover:bg-slate-800/80 transition-all duration-200">
                <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-2 block">Role</label>
                <p className="text-lg font-semibold text-slate-900 dark:text-slate-100 capitalize">{profile.role}</p>
              </div>
              {profile.location && (
                <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm rounded-xl p-4 border border-slate-200/50 dark:border-slate-700/50 hover:bg-white/80 dark:hover:bg-slate-800/80 transition-all duration-200">
                  <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-2 block">Location</label>
                  <p className="text-slate-700 dark:text-slate-300">{profile.location}</p>
                </div>
              )}
              {profile.address && (
                <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm rounded-xl p-4 border border-slate-200/50 dark:border-slate-700/50 hover:bg-white/80 dark:hover:bg-slate-800/80 transition-all duration-200">
                  <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-2 block">Address</label>
                  <p className="text-slate-700 dark:text-slate-300">{profile.address}</p>
                </div>
              )}
            </div>

            {/* Social Media Handles */}
            {profile.socialHandles && Object.keys(profile.socialHandles).some(key => profile.socialHandles?.[key as keyof typeof profile.socialHandles]) && (
              <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm rounded-xl p-4 border border-slate-200/50 dark:border-slate-700/50">
                <h4 className="text-sm font-semibold text-slate-600 dark:text-slate-400 mb-4">Connect With Me</h4>
                <div className="grid grid-cols-2 gap-3">
                  {profile.socialHandles.linkedin && (
                    <a
                      href={profile.socialHandles.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 p-3 bg-blue-50 dark:bg-blue-900/30 rounded-lg border border-blue-200/50 dark:border-blue-800/50 hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-all duration-200 group"
                    >
                      <LinkedinIcon className="h-5 w-5 text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform" />
                      <span className="text-sm font-medium text-slate-700 dark:text-slate-300">LinkedIn</span>
                    </a>
                  )}
                  {profile.socialHandles.twitter && (
                    <a
                      href={profile.socialHandles.twitter}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 p-3 bg-sky-50 dark:bg-sky-900/30 rounded-lg border border-sky-200/50 dark:border-sky-800/50 hover:bg-sky-100 dark:hover:bg-sky-900/50 transition-all duration-200 group"
                    >
                      <TwitterIcon className="h-5 w-5 text-sky-500 dark:text-sky-400 group-hover:scale-110 transition-transform" />
                      <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Twitter</span>
                    </a>
                  )}
                  {profile.socialHandles.github && (
                    <a
                      href={profile.socialHandles.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-900/30 rounded-lg border border-gray-200/50 dark:border-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-900/50 transition-all duration-200 group"
                    >
                      <GithubIcon className="h-5 w-5 text-gray-700 dark:text-gray-300 group-hover:scale-110 transition-transform" />
                      <span className="text-sm font-medium text-slate-700 dark:text-slate-300">GitHub</span>
                    </a>
                  )}
                  {profile.socialHandles.facebook && (
                    <a
                      href={profile.socialHandles.facebook}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 p-3 bg-blue-50 dark:bg-blue-900/30 rounded-lg border border-blue-200/50 dark:border-blue-800/50 hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-all duration-200 group"
                    >
                      <FacebookIcon className="h-5 w-5 text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform" />
                      <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Facebook</span>
                    </a>
                  )}
                  {profile.socialHandles.instagram && (
                    <a
                      href={profile.socialHandles.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 p-3 bg-pink-50 dark:bg-pink-900/30 rounded-lg border border-pink-200/50 dark:border-pink-800/50 hover:bg-pink-100 dark:hover:bg-pink-900/50 transition-all duration-200 group"
                    >
                      <InstagramIcon className="h-5 w-5 text-pink-600 dark:text-pink-400 group-hover:scale-110 transition-transform" />
                      <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Instagram</span>
                    </a>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Badges & Achievements */}
        <div className="bg-white/95 dark:bg-slate-800/95 backdrop-blur-xl rounded-2xl p-6 shadow-xl border border-indigo-100/50 dark:border-slate-700/50 relative overflow-hidden">
          {/* Background decoration */}
          <div className="absolute inset-0 bg-gradient-to-br from-yellow-50/30 to-orange-50/30 dark:from-yellow-900/10 dark:to-orange-900/10"></div>
          <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-yellow-200/20 to-orange-200/20 dark:from-yellow-800/10 dark:to-orange-800/10 rounded-full blur-2xl"></div>

          <div className="relative">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl flex items-center justify-center shadow-lg">
                <Trophy className="h-5 w-5 text-white" />
              </div>
              Badges & Achievements
            </h3>
            <div className="space-y-4">
              {profile.achievements && profile.achievements.length > 0 ? (
                profile.achievements.slice(0, 4).map(achievement => (
                  <div key={achievement.id} className="bg-gradient-to-r from-white/80 to-yellow-50/80 dark:from-slate-800/80 dark:to-slate-700/80 rounded-xl p-4 border border-yellow-200/50 dark:border-yellow-800/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]">
                    <div className="flex items-center gap-4">
                      <div className="text-3xl p-2 bg-gradient-to-br from-yellow-100 to-orange-100 dark:from-yellow-900/30 dark:to-orange-900/30 rounded-xl border border-yellow-200/50 dark:border-yellow-800/50">
                        {achievement.icon}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-bold text-slate-900 dark:text-slate-100 text-base mb-1">{achievement.title}</h4>
                        <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">{achievement.description}</p>
                        <div className="flex items-center gap-3">
                          <span className={`text-xs px-3 py-1 rounded-full font-semibold ${
                            achievement.rarity === 'legendary' ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white' :
                            achievement.rarity === 'epic' ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white' :
                            achievement.rarity === 'rare' ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white' :
                            'bg-gradient-to-r from-gray-500 to-slate-500 text-white'
                          }`}>
                            {achievement.rarity}
                          </span>
                          <span className="text-xs text-slate-500 dark:text-slate-500 font-medium">
                            {new Date(achievement.unlockedAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-800 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                    <Trophy className="h-8 w-8 text-slate-400" />
                  </div>
                  <p className="text-slate-600 dark:text-slate-400 text-base font-medium mb-2">No achievements yet</p>
                  <p className="text-sm text-slate-500 dark:text-slate-500">Complete lessons to earn badges!</p>
                </div>
              )}
              {profile.achievements && profile.achievements.length > 4 && (
                <Button variant="outline" className="w-full text-sm bg-white/80 dark:bg-slate-800/80 border-indigo-200 dark:border-slate-600 hover:bg-indigo-50 dark:hover:bg-slate-700 transition-all duration-300">
                  View All Achievements
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* ROW 3: Educational Qualification Timeline */}
        <div className="bg-white/95 dark:bg-slate-800/95 backdrop-blur-xl rounded-2xl p-6 shadow-xl border border-indigo-100/50 dark:border-slate-700/50 relative overflow-hidden">
          {/* Background decoration */}
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-50/30 to-teal-50/30 dark:from-emerald-900/10 dark:to-teal-900/10"></div>
          <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-emerald-200/20 to-teal-200/20 dark:from-emerald-800/10 dark:to-teal-800/10 rounded-full blur-2xl"></div>

          <div className="relative">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center shadow-lg">
                <GraduationCap className="h-5 w-5 text-white" />
              </div>
              Educational Journey
            </h3>

            {/* Timeline Container */}
            <div className="relative">
              {/* Timeline Line */}
              <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-indigo-200 via-purple-200 to-pink-200 dark:from-indigo-800 dark:via-purple-800 dark:to-pink-800"></div>

              {profile.educationalQualifications && profile.educationalQualifications.length > 0 ? (
                <div className="space-y-8">
                  {profile.educationalQualifications.map((education, index) => (
                    <div key={education.id} className="relative flex items-start gap-6">
                      {/* Timeline Node */}
                      <div className={`relative z-10 w-12 h-12 rounded-full border-4 border-white dark:border-slate-800 shadow-lg flex items-center justify-center ${
                        index === 0 ? 'bg-gradient-to-br from-blue-500 to-indigo-600' :
                        index === profile.educationalQualifications!.length - 1 ? 'bg-gradient-to-br from-emerald-500 to-teal-600' :
                        'bg-gradient-to-br from-purple-500 to-pink-600'
                      }`}>
                        {index === 0 ? (
                          <BookOpen className="h-6 w-6 text-white" />
                        ) : index === profile.educationalQualifications!.length - 1 ? (
                          <Trophy className="h-6 w-6 text-white" />
                        ) : (
                          <GraduationCap className="h-6 w-6 text-white" />
                        )}
                      </div>

                      {/* Education Card */}
                      <div className="flex-1 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-xl p-6 border border-slate-200/50 dark:border-slate-700/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]">
                        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h4 className="text-lg font-bold text-slate-900 dark:text-white">{education.degree}</h4>
                              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                education.graduationYear >= new Date().getFullYear()
                                  ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'
                                  : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300'
                              }`}>
                                {education.graduationYear >= new Date().getFullYear() ? 'In Progress' : 'Completed'}
                              </span>
                            </div>

                            <p className="text-slate-600 dark:text-slate-400 mb-2">
                              {education.fieldOfStudy} • {education.institution}
                            </p>

                            {education.location && (
                              <p className="text-sm text-slate-500 dark:text-slate-500 mb-2">
                                📍 {education.location}
                              </p>
                            )}

                            <div className="flex flex-wrap gap-4 text-sm text-slate-600 dark:text-slate-400">
                              <span>📅 {education.startYear || education.graduationYear - 4} - {education.graduationYear}</span>
                              {education.gpa && <span>🎓 GPA: {education.gpa}</span>}
                            </div>

                            {education.description && (
                              <p className="text-sm text-slate-600 dark:text-slate-400 mt-3 italic">
                                "{education.description}"
                              </p>
                            )}

                            {education.achievements && education.achievements.length > 0 && (
                              <div className="mt-3">
                                <p className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">🏆 Achievements:</p>
                                <div className="flex flex-wrap gap-2">
                                  {education.achievements.map((achievement, i) => (
                                    <span key={i} className="px-2 py-1 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 rounded-full text-xs">
                                      {achievement}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>

                          {/* Journey Path Indicator */}
                          <div className="hidden lg:flex flex-col items-center gap-2">
                            <div className={`w-3 h-3 rounded-full ${
                              index === 0 ? 'bg-blue-500' :
                              index === profile.educationalQualifications!.length - 1 ? 'bg-emerald-500' :
                              'bg-purple-500'
                            }`}></div>
                            {index < profile.educationalQualifications!.length - 1 && (
                              <div className="w-0.5 h-8 bg-gradient-to-b from-purple-300 to-purple-400 dark:from-purple-700 dark:to-purple-600"></div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-800 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                    <GraduationCap className="h-8 w-8 text-slate-400" />
                  </div>
                  <p className="text-slate-600 dark:text-slate-400 text-base font-medium mb-2">No educational qualifications added</p>
                  <p className="text-sm text-slate-500 dark:text-slate-500">Add your educational journey to showcase your academic progress!</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ROW 4: Certificates */}
        {profile.certificates && profile.certificates.length > 0 && (
          <div className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl rounded-2xl p-4 sm:p-6 shadow-lg border border-white/20 dark:border-slate-700/50">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">📜 Certificates</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {profile.certificates.map(cert => (
                <div key={cert.id} className="bg-slate-50/70 dark:bg-slate-800/70 rounded-lg p-4 border border-slate-200/50 dark:border-slate-700/50 hover:shadow-lg transition-all duration-200">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="font-semibold text-slate-900 dark:text-slate-100">{cert.name}</h4>
                      <p className="text-sm text-slate-600 dark:text-slate-400">{cert.issuer}</p>
                    </div>
                    <span className="text-xs text-slate-500 dark:text-slate-500">
                      {new Date(cert.date).toLocaleDateString()}
                    </span>
                  </div>
                  {cert.credentialId && (
                    <p className="text-xs text-slate-500 dark:text-slate-500">Credential ID: {cert.credentialId}</p>
                  )}
                  {cert.verificationUrl && (
                    <a
                      href={cert.verificationUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-blue-600 dark:text-blue-400 hover:underline mt-1 inline-block"
                    >
                      Verify Certificate →
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ================================================================== */}
        {/* END OF REQUESTED LAYOUT. OTHER COMPONENTS FOLLOW.                */}
        {/* ================================================================== */}


        {/* Profile Stats */}
        <ProfileStats stats={{
          totalSessions: profile.stats.totalSessions,
          totalXP: profile.stats.totalXP,
          currentStreak: profile.stats.currentStreak,
          accuracy: profile.stats.accuracy,
          vocabulary: profile.stats.vocabulary,
          grammar: profile.stats.grammar,
          pronunciation: profile.stats.pronunciation,
          fluency: profile.stats.fluency,
          completedLessons: profile.stats.completedLessons,
          totalStudyTime: profile.stats.studyTimeThisWeek,
          averageSessionLength: profile.stats.averageSessionLength
        }} />

        {/* Quick Actions & Progress Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Daily Progress */}
          <div className="bg-gradient-to-br from-emerald-50/90 via-green-50/90 to-teal-50/90 dark:from-emerald-900/20 dark:via-green-900/20 dark:to-teal-900/20 backdrop-blur-xl rounded-2xl p-6 shadow-xl border border-emerald-100/50 dark:border-emerald-800/50 relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-100/20 to-green-100/20 dark:from-emerald-800/10 dark:to-green-800/10"></div>
            <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-emerald-200/30 to-green-200/30 dark:from-emerald-700/20 dark:to-green-700/20 rounded-full blur-xl"></div>

            <div className="relative">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-green-600 rounded-xl flex items-center justify-center shadow-lg">
                  <Target className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">Daily Progress</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Today's learning streak</p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-600 dark:text-slate-400">Study Time</span>
                  <span className="font-semibold text-slate-900 dark:text-white">{formatTime(profile.stats.studyTimeThisWeek)}</span>
                </div>
                <div className="w-full bg-slate-200/60 dark:bg-slate-700/60 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-emerald-500 to-green-500 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${Math.min((profile.stats.studyTimeThisWeek / 60) * 100, 100)}%` }}
                  ></div>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-600 dark:text-slate-400">Weekly Goal</span>
                  <span className="font-semibold text-slate-900 dark:text-white">{profile.weeklyGoal} min</span>
                </div>
              </div>
            </div>
          </div>

          {/* Skill Overview */}
          <div className="bg-gradient-to-br from-blue-50/90 via-indigo-50/90 to-purple-50/90 dark:from-blue-900/20 dark:via-indigo-900/20 dark:to-purple-900/20 backdrop-blur-xl rounded-2xl p-6 shadow-xl border border-blue-100/50 dark:border-blue-800/50 relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-100/20 to-indigo-100/20 dark:from-blue-800/10 dark:to-indigo-800/10"></div>
            <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-blue-200/30 to-indigo-200/30 dark:from-blue-700/20 dark:to-indigo-700/20 rounded-full blur-xl"></div>

            <div className="relative">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                  <BookOpen className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">Skill Overview</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Current proficiency levels</p>
                </div>
              </div>

              <div className="space-y-3">
                {[
                  { skill: 'Vocabulary', level: profile.stats.vocabulary, color: 'from-blue-500 to-indigo-500' },
                  { skill: 'Grammar', level: profile.stats.grammar, color: 'from-indigo-500 to-purple-500' },
                  { skill: 'Pronunciation', level: profile.stats.pronunciation, color: 'from-purple-500 to-pink-500' },
                ].map((item) => (
                  <div key={item.skill} className="space-y-1">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-slate-600 dark:text-slate-400">{item.skill}</span>
                      <span className="font-semibold text-slate-900 dark:text-white">{item.level}%</span>
                    </div>
                    <div className="w-full bg-slate-200/60 dark:bg-slate-700/60 rounded-full h-1.5">
                      <div
                        className={`bg-gradient-to-r ${item.color} h-1.5 rounded-full transition-all duration-500`}
                        style={{ width: `${item.level}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Recent Activity Summary */}
          <div className="bg-gradient-to-br from-orange-50/90 via-amber-50/90 to-yellow-50/90 dark:from-orange-900/20 dark:via-amber-900/20 dark:to-yellow-900/20 backdrop-blur-xl rounded-2xl p-6 shadow-xl border border-orange-100/50 dark:border-orange-800/50 relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute inset-0 bg-gradient-to-br from-orange-100/20 to-amber-100/20 dark:from-orange-800/10 dark:to-amber-800/10"></div>
            <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-orange-200/30 to-amber-200/30 dark:from-orange-700/20 dark:to-amber-700/20 rounded-full blur-xl"></div>

            <div className="relative">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-amber-600 rounded-xl flex items-center justify-center shadow-lg">
                  <Activity className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">Recent Activity</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Latest learning sessions</p>
                </div>
              </div>

              <div className="space-y-3">
                {profile.recentActivity && profile.recentActivity.slice(0, 3).map((activity, index) => (
                  <div key={activity.id} className="flex items-center gap-3 p-2 bg-white/60 dark:bg-slate-800/60 rounded-lg border border-orange-200/30 dark:border-orange-800/30">
                    <div className="w-8 h-8 bg-gradient-to-br from-orange-100 to-amber-100 dark:from-orange-900/30 dark:to-amber-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                      <span className="text-sm">{activity.icon}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-900 dark:text-slate-100 truncate">{activity.title}</p>
                      <p className="text-xs text-slate-600 dark:text-slate-400">{activity.description}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-medium text-orange-600 dark:text-orange-400">+{activity.xpGained} XP</p>
                      <p className="text-xs text-slate-500 dark:text-slate-500">
                        {new Date(activity.timestamp).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Subscription Plans */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <BasicPlanCard />
          {profile.isPremium !== undefined && profile.isPremium && <PremiumPlanCard isPremium={profile.isPremium} />}
        </div>

        {/* Learning Recommendations */}
        <div className="bg-gradient-to-br from-violet-50/90 via-purple-50/90 to-fuchsia-50/90 dark:from-violet-900/20 dark:via-purple-900/20 dark:to-fuchsia-900/20 backdrop-blur-xl rounded-2xl p-6 shadow-xl border border-violet-100/50 dark:border-violet-800/50 relative overflow-hidden">
          {/* Background decoration */}
          <div className="absolute inset-0 bg-gradient-to-br from-violet-100/20 to-purple-100/20 dark:from-violet-800/10 dark:to-purple-800/10"></div>
          <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-violet-200/30 to-fuchsia-200/30 dark:from-violet-700/20 dark:to-fuchsia-700/20 rounded-full blur-xl"></div>

          <div className="relative">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-violet-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <Lightbulb className="h-5 w-5 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">Learning Recommendations</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">Personalized suggestions for your progress</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm rounded-xl p-4 border border-violet-200/40 dark:border-violet-800/40">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-900/30 dark:to-orange-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Target className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-900 dark:text-slate-100 text-sm mb-1">Focus on Pronunciation</h4>
                    <p className="text-xs text-slate-600 dark:text-slate-400 mb-2">Your pronunciation accuracy is 85%. Try our interactive pronunciation exercises.</p>
                    <Button size="sm" variant="outline" className="text-xs bg-violet-50 dark:bg-violet-900/30 border-violet-200 dark:border-violet-700 hover:bg-violet-100 dark:hover:bg-violet-800/50">
                      Start Practice
                    </Button>
                  </div>
                </div>
              </div>

              <div className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm rounded-xl p-4 border border-violet-200/40 dark:border-violet-800/40">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-emerald-100 to-green-100 dark:from-emerald-900/30 dark:to-green-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Trophy className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-900 dark:text-slate-100 text-sm mb-1">Grammar Challenge</h4>
                    <p className="text-xs text-slate-600 dark:text-slate-400 mb-2">You're close to mastering advanced grammar. Complete 3 more exercises!</p>
                    <Button size="sm" variant="outline" className="text-xs bg-violet-50 dark:bg-violet-900/30 border-violet-200 dark:border-violet-700 hover:bg-violet-100 dark:hover:bg-violet-800/50">
                      Take Challenge
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Learning Goals & Achievements */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl rounded-2xl p-4 sm:p-6 shadow-lg border border-white/20 dark:border-slate-700/50">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">🎯 Learning Goals</h3>
            <div className="space-y-4">
              {profile.learningGoals.map(goal => <LearningGoalCard key={goal.id} goal={goal} />)}
            </div>
          </div>
          <div className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl rounded-2xl p-4 sm:p-6 shadow-lg border border-white/20 dark:border-slate-700/50">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">🏆 Recent Achievements</h3>
            <div className="space-y-4">
              {profile.achievements && profile.achievements.map(ach => <AchievementCard key={ach.id} achievement={ach} />)}
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl rounded-2xl p-4 sm:p-6 shadow-lg border border-white/20 dark:border-slate-700/50">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">📈 Recent Activity</h3>
          <div className="space-y-3 sm:space-y-4">
            {profile.recentActivity && profile.recentActivity.slice(0, 5).map(activity => <ActivityCard key={activity.id} activity={activity} />)}
          </div>
        </div>

        {/* Profile Statistics Cards - Moved from Hero Section */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
          {/* Current Streak */}
          <div className="bg-gradient-to-br from-orange-50/90 to-red-50/90 dark:from-orange-900/40 dark:to-red-900/40 backdrop-blur-sm rounded-lg sm:rounded-xl p-4 sm:p-6 border border-orange-200/50 dark:border-orange-800/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 flex flex-col items-center justify-center min-h-[120px]">
            <Flame className="h-8 w-8 sm:h-10 sm:w-10 text-orange-500 mb-2 sm:mb-3" />
            <div className="text-center">
              <p className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100">{profile.stats.currentStreak}</p>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">Streak</p>
            </div>
          </div>

          {/* Total XP */}
          <div className="bg-gradient-to-br from-blue-50/90 to-indigo-50/90 dark:from-blue-900/40 dark:to-indigo-900/40 backdrop-blur-sm rounded-lg sm:rounded-xl p-4 sm:p-6 border border-blue-200/50 dark:border-blue-800/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 flex flex-col items-center justify-center min-h-[120px]">
            <Trophy className="h-8 w-8 sm:h-10 sm:w-10 text-blue-500 mb-2 sm:mb-3" />
            <div className="text-center">
              <p className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100">{profile.stats.totalXP.toLocaleString()}</p>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">XP</p>
            </div>
          </div>

          {/* Level */}
          <div className="bg-gradient-to-br from-purple-50/90 to-pink-50/90 dark:from-purple-900/40 dark:to-pink-900/40 backdrop-blur-sm rounded-lg sm:rounded-xl p-4 sm:p-6 border border-purple-200/50 dark:border-purple-800/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 flex flex-col items-center justify-center min-h-[120px]">
            <Star className="h-8 w-8 sm:h-10 sm:w-10 text-purple-500 mb-2 sm:mb-3" />
            <div className="text-center">
              <p className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100">{profile.level}</p>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">Level</p>
            </div>
          </div>

          {/* Accuracy */}
          <div className="bg-gradient-to-br from-emerald-50/90 to-green-50/90 dark:from-emerald-900/40 dark:to-green-900/40 backdrop-blur-sm rounded-lg sm:rounded-xl p-4 sm:p-6 border border-emerald-200/50 dark:border-emerald-800/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 flex flex-col items-center justify-center min-h-[120px]">
            <Target className="h-8 w-8 sm:h-10 sm:w-10 text-emerald-500 mb-2 sm:mb-3" />
            <div className="text-center">
              <p className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100">{profile.stats.accuracy}%</p>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">Accuracy</p>
            </div>
          </div>
        </div>

        </div>

        {/* Footer */}
        <Footer />
      </div>
    </div>
  );
};

export default Profile;
