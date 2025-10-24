import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  User as UserIcon,
  Settings,
  Edit3,
  LogOut,
  ChevronDown,
  Menu,
  X,
} from 'lucide-react';
import { PremiumIcon } from '../Icons/SubscriptionIcons';

interface User {
  id: string;
  email: string;
  fullName?: string;
  avatar_url?: string;
  isPremium?: boolean;
}

interface BasicHeaderProps {
  user?: User | null;
  onLogout?: () => void;
  onSidebarToggle?: (open: boolean) => void;
  showSidebarToggle?: boolean;
  sidebarOpen?: boolean;
  className?: string;
  title?: string;
  subtitle?: string;
}

const BasicHeader: React.FC<BasicHeaderProps> = ({
  user = null,
  onLogout = () => {},
  onSidebarToggle,
  showSidebarToggle = false,
  sidebarOpen = false,
  className = '',
  title = 'FluentPro',
  subtitle = 'English Learning',
}) => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogout = () => {
    onLogout();
    toast({
      title: 'Signed out',
      description: 'You have been successfully signed out',
    });
  };

  return (
    <>

      {/* Header */}
      <header className={`fixed top-0 left-0 right-0 z-50 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 shadow-sm ${className}`}>
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Left side - Logo and mobile menu toggle */}
            <div className="flex items-center gap-4">
              {showSidebarToggle && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="w-10 h-10 hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors duration-200"
                  onClick={() => {
                    onSidebarToggle?.(!sidebarOpen);
                  }}
                >
                  {sidebarOpen ? (
                    <X className="h-5 w-5 text-slate-700 dark:text-slate-300" />
                  ) : (
                    <Menu className="h-5 w-5 text-slate-700 dark:text-slate-300" />
                  )}
                </Button>
              )}

              {/* Logo/Brand */}
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-black/90 backdrop-blur-sm rounded-lg flex items-center justify-center shadow-lg border border-white/30">
                  <img
                    src="/logo.svg"
                    alt="FluentPro Logo"
                    className="w-5 h-5"
                  />
                </div>
                <div className="hidden sm:block">
                  <h1 className="text-lg font-bold text-slate-900 dark:text-slate-100">{title}</h1>
                  <p className="text-xs text-slate-600 dark:text-slate-400">{subtitle}</p>
                </div>
              </div>
            </div>

            {/* Right side - User profile and actions */}
            <div className="flex items-center gap-4">
              {/* User Profile Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center gap-2 px-3 py-2 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-slate-600 to-slate-800 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                      {user?.avatar_url ? (
                        <img
                          src={user.avatar_url}
                          alt="Profile"
                          className="w-full h-full rounded-full object-cover"
                        />
                      ) : (
                        <UserIcon className="h-4 w-4" />
                      )}
                    </div>
                    <div className="hidden sm:flex flex-col items-start">
                      <span className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                        {user?.fullName || user?.email?.split('@')[0] || 'User'}
                      </span>
                      <div className="flex items-center gap-1">
                        <span className="text-xs text-slate-600 dark:text-slate-400">
                          {user?.isPremium ? 'Premium Learner' : 'Basic Learner'}
                        </span>
                        {user?.isPremium && <PremiumIcon size="sm" className="flex-shrink-0" />}
                      </div>
                    </div>
                    <ChevronDown className="h-4 w-4 text-slate-600 dark:text-slate-400" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => navigate('/profile')}>
                    <UserIcon className="h-4 w-4 mr-2" />
                    View Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate('/edit-profile')}>
                    <Edit3 className="h-4 w-4 mr-2" />
                    Edit Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate('/settings')}>
                    <Settings className="h-4 w-4 mr-2" />
                    Settings
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="text-red-600 dark:text-red-400">
                    <LogOut className="h-4 w-4 mr-2" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </header>
    </>
  );
};
export default BasicHeader;
