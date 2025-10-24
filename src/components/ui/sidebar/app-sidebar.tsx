import * as React from "react";
import {
  BookOpen,
  Bot,
  Brain,
  FileText,
  PenTool,
  BookMarked,
  MessageSquare,
  Users,
  Focus,
  StickyNote,
  Globe,
  GraduationCap,
  Headphones,
  Mic,
  Video,
  Home,
  BarChart3,
  Trophy,
  Flame,
  Coins,
  Sun,
  Moon,
  Settings,
  User,
  LogOut,
  Edit3,
  ChevronDown,
} from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";
import { motion } from "framer-motion";
import { TeamSwitcher } from "@/components/ui/sidebar/team-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
  useSidebar,
} from "@/components/ui/sidebar";

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  activeView: string;
  onViewChange: (view: string) => void;
  userStats?: {
    streak: number;
    coins: number;
    level: number;
  };
}

/**
 * Polished, theme-persistent sidebar component
 * Features:
 * - Light / Dark toggle persisted to localStorage
 * - Soft gradient backgrounds and subtle glow for active item
 * - Collapsible support via useSidebar()
 * - Team avatars + upload area
 * - Accessible and responsive dropdown/profile actions
 */
export function AppSidebar({
  activeView,
  onViewChange,
  userStats,
  ...props
}: AppSidebarProps): JSX.Element {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { state: sidebarState } = useSidebar();
  const isMobile = useIsMobile();
  const isCollapsed = sidebarState === "collapsed";

  // theme state persisted in localStorage
  const [theme, setTheme] = React.useState<"dark" | "light">(() => {
    try {
      const stored = localStorage.getItem("cognito-theme");
      return stored === "dark" ? "dark" : "light";
    } catch {
      return "light";
    }
  });

  React.useEffect(() => {
    // apply theme class to document element
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    try {
      localStorage.setItem("cognito-theme", theme);
    } catch {}
  }, [theme]);

  const toggleTheme = (val?: "dark" | "light") => {
    setTheme((prev) => (val ? val : prev === "dark" ? "light" : "dark"));
  };

  const handleLogout = async () => {
    try {
      await signOut();
      toast({
        title: "Signed out",
        description: "You have been successfully signed out",
      });
      navigate("/");
    } catch (error) {
      console.error("Error during logout:", error);
      toast({
        title: "Error",
        description: "There was an error signing out. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Prepare the data structure (same structure as your original)
  const data = React.useMemo(
    () => ({
      user: {
        name: user?.fullName || "Student",
        email: user?.email || "student@example.com",
        avatar: user?.avatar || "",
      },
      teams: [
        {
          name: "CognitoSpeak",
          plan: "AI-Powered Learning",
        },
      ],
      navMain: [
        {
          title: "Dashboard",
          url: "#",
          icon: Home,
          isActive: activeView === "home",
        },
        {
          title: "Analytics",
          url: "#",
          icon: BarChart3,
          isActive: activeView === "analytics",
        },
      ],
      navSecondary: [
        {
          title: "Core Learning",
          items: [
            {
              title: "Grammar",
              url: "#",
              icon: BookOpen,
              isActive: activeView === "grammar",
            },
            {
              title: "Vocabulary",
              url: "#",
              icon: Brain,
              isActive: activeView === "vocabulary",
            },
            {
              title: "Writing",
              url: "#",
              icon: PenTool,
              isActive: activeView === "writing",
            },
            {
              title: "Reading",
              url: "#",
              icon: FileText,
              isActive: activeView === "reading",
            },
            {
              title: "Listening",
              url: "#",
              icon: Headphones,
              isActive: activeView === "listening",
            },
            {
              title: "Speaking",
              url: "#",
              icon: Mic,
              isActive: activeView === "speaking",
            },
          ],
        },
        {
          title: "AI-Powered",
          items: [
            {
              title: "AI Chat",
              url: "#",
              icon: Bot,
              badge: "New",
              isActive: activeView === "ai-chat",
            },
            {
              title: "AI Practice",
              url: "#",
              icon: MessageSquare,
              isActive: activeView === "ai-practice",
            },
            {
              title: "AI Tutor",
              url: "#",
              icon: GraduationCap,
              badge: "Pro",
              isActive: activeView === "ai-tutor",
            },
          ],
        },
        {
          title: "Practice & Community",
          items: [
            {
              title: "Practice Rooms",
              url: "#",
              icon: Users,
              badge: "Live",
              isActive: activeView === "rooms",
            },
            {
              title: "Voice Rooms",
              url: "#",
              icon: Video,
              isActive: activeView === "voice-rooms",
            },
            {
              title: "Community",
              url: "#",
              icon: Globe,
              isActive: activeView === "community",
            },
          ],
        },
        {
          title: "Tools",
          items: [
            {
              title: "My Notes",
              url: "#",
              icon: StickyNote,
              isActive: activeView === "notes",
            },
            {
              title: "Focus Mode",
              url: "#",
              icon: Focus,
              isActive: activeView === "focus",
            },
            {
              title: "Bookmarks",
              url: "#",
              icon: BookMarked,
              isActive: activeView === "bookmarks",
            },
          ],
        },
      ],
    }),
    [user, activeView]
  );

  const handleNavClick = (view: string) => {
    onViewChange(view);
  };

  const handleProfileNav = (path: string) => {
    navigate(path);
  };

  // small helper for active/glow styles
  const activeBtnClass = "relative overflow-visible";
  const activeInnerClass =
    "z-10 flex items-center justify-center w-full gap-4 px-4 py-3 rounded-xl transition-all duration-200";

  return (
    <Sidebar
      collapsible="icon"
      className={cn(
        "min-h-screen w-72 md:w-64 lg:w-72 rounded-3xl border border-transparent shadow-xl transition-all duration-300",
        // soft glassy background and theme-aware gradients
        theme === "dark"
          ? "bg-gradient-to-b from-slate-900/80 via-slate-900/60 to-slate-800/60 text-slate-200"
          : "bg-gradient-to-b from-white via-slate-50/60 to-slate-100/60 text-slate-900",
        "backdrop-blur-sm"
      )}
      {...props}
    >
      {/* Header */}
      <SidebarHeader className="border-b border-slate-200/50 dark:border-slate-700/40 bg-white/60 dark:bg-slate-900/50 backdrop-blur-md p-4 h-16 flex items-center rounded-t-3xl">
        <div className="flex items-center justify-between gap-3">
          <TeamSwitcher teams={data.teams} />
          {/* small theme toggle in header for quick switch (visible on expanded only) */}
          {!isCollapsed && (
            <div className="flex items-center gap-2">
              <motion.button
                aria-label="Toggle theme"
                className="p-2 rounded-lg hover:bg-slate-100/60 dark:hover:bg-slate-700/40 transition-all duration-300 hover:shadow-md hover:rounded-2xl"
                onClick={() => toggleTheme()}
                whileHover={{ scale: 1.1, width: 'auto' }}
                whileTap={{ scale: 0.9 }}
              >
                {theme === "dark" ? (
                  <Sun className="h-4 w-4 text-amber-400" />
                ) : (
                  <Moon className="h-4 w-4 text-slate-600" />
                )}
              </motion.button>
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent className="px-3 py-4 overflow-hidden">
        <div className="space-y-6 h-full flex flex-col">
          {/* User Profile Card */}
          {!isCollapsed ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                  className="p-4 rounded-2xl bg-gradient-to-br from-emerald-50/80 via-white/60 to-teal-50/80 dark:from-emerald-900/30 dark:via-slate-800/60 dark:to-teal-900/40 border border-emerald-200/40 dark:border-emerald-700/30 shadow-lg cursor-pointer hover:shadow-xl transition-all duration-200"
                >
                  <div className="flex items-center gap-3">
                    <motion.div
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <Avatar className="h-12 w-12 border-2 border-emerald-200/60 dark:border-emerald-600/40 shadow-md">
                        <AvatarImage src={user?.avatar || undefined} alt={user?.fullName || "User"} />
                        <AvatarFallback className="bg-gradient-to-br from-emerald-400 to-teal-500 text-white font-semibold text-lg">
                          {user?.fullName?.charAt(0) || "U"}
                        </AvatarFallback>
                      </Avatar>
                    </motion.div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-sm font-semibold text-emerald-900 dark:text-emerald-100 truncate">
                          {user?.fullName || "Student"}
                        </h3>
                        <div className="w-2 h-2 rounded-full bg-gradient-to-r from-emerald-400 to-teal-500 animate-pulse"></div>
                      </div>
                      <p className="text-xs text-emerald-600 dark:text-emerald-400 truncate mb-1">
                        {user?.email || "student@example.com"}
                      </p>
                      <div className="flex items-center gap-1">
                        <div className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-blue-400 to-cyan-500"></div>
                        <span className="text-xs font-medium text-blue-600 dark:text-blue-400">
                          Student
                        </span>
                      </div>
                    </div>

                    <ChevronDown className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                  </div>

                  {/* Quick stats in user card */}
                  <div className="mt-3 pt-3 border-t border-emerald-200/30 dark:border-emerald-700/30">
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
                        <Flame className="h-3 w-3" />
                        <span className="font-medium">{userStats?.streak || 0} day streak</span>
                      </div>
                      <div className="flex items-center gap-1 text-purple-600 dark:text-purple-400">
                        <Trophy className="h-3 w-3" />
                        <span className="font-medium">Level {userStats?.level || 1}</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-56">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => handleProfileNav('/profile')}>
                  <User className="h-4 w-4 mr-2" />
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleProfileNav('/edit-profile')}>
                  <Edit3 className="h-4 w-4 mr-2" />
                  Edit Profile
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleProfileNav('/settings')}>
                  <Settings className="h-4 w-4 mr-2" />
                  Settings
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                  className="flex justify-center py-2 cursor-pointer"
                >
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <Avatar className="h-10 w-10 border-2 border-emerald-200/60 dark:border-emerald-600/40 shadow-md">
                      <AvatarImage src={user?.avatar || undefined} alt={user?.fullName || "User"} />
                      <AvatarFallback className="bg-gradient-to-br from-emerald-400 to-teal-500 text-white font-semibold">
                        {user?.fullName?.charAt(0) || "U"}
                      </AvatarFallback>
                    </Avatar>
                  </motion.div>
                </motion.div>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-56">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => handleProfileNav('/profile')}>
                  <User className="h-4 w-4 mr-2" />
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleProfileNav('/edit-profile')}>
                  <Edit3 className="h-4 w-4 mr-2" />
                  Edit Profile
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleProfileNav('/settings')}>
                  <Settings className="h-4 w-4 mr-2" />
                  Settings
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}

          {/* Scroll area for nav */}
          <div className="flex-1 overflow-y-auto pr-1 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
            {/* Main Nav */}
            <div className="space-y-2 mb-4">
              <h4
                className={cn(
                  "text-[10px] font-medium text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-3 text-center bg-slate-100/30 dark:bg-slate-800/30 rounded px-2 py-1",
                  isCollapsed && "hidden"
                )}
              >
                Main
              </h4>

              <div className="space-y-2">
                {data.navMain.map((item) => {
                  const Icon = item.icon;
                  const isActive = item.isActive;
                  return (
                    <div
                      key={item.title}
                      className={cn(
                        "flex items-center",
                        isCollapsed ? "justify-center" : "justify-start"
                      )}
                    >
                      <button
                        onClick={() =>
                          handleNavClick(item.title.toLowerCase())
                        }
                        className={cn(
                          activeBtnClass,
                          isActive
                            ? "shadow-lg w-full rounded-2xl"
                            : "hover:shadow-md hover:scale-[1.02] hover:-translate-y-[1px] hover:bg-emerald-50/80 hover:text-emerald-700 hover:w-full hover:rounded-2xl",
                          "w-full transition-all duration-300"
                        )}
                        aria-current={isActive ? "page" : undefined}
                      >
                        {/* active glow background */}
                        {isActive && !isCollapsed && (
                          <motion.span
                            aria-hidden
                            className="absolute -inset-px rounded-2xl bg-gradient-to-r from-emerald-500/50 via-emerald-400/30 to-transparent blur-lg"
                            animate={{
                              scale: [1, 1.05, 1],
                              opacity: [0.5, 0.8, 0.5]
                            }}
                            transition={{
                              duration: 2,
                              repeat: Infinity,
                              ease: "easeInOut"
                            }}
                          />
                        )}

                        <div
                          className={cn(
                            activeInnerClass,
                            isActive
                              ? "bg-gradient-to-r from-emerald-600/80 to-emerald-500/70 text-white border border-emerald-400/20 w-full rounded-2xl"
                              : theme === "dark"
                              ? "bg-slate-900/30 text-slate-200 hover:bg-emerald-900/40 hover:text-emerald-300"
                              : "bg-white/60 text-slate-700 hover:bg-emerald-50/80 hover:text-emerald-700"
                          )}
                        >
                          <div className="flex items-center gap-4">
                            <Icon
                              className={cn(
                                "flex-shrink-0",
                                isCollapsed ? "h-6 w-6" : "h-4 w-4",
                                isActive ? "opacity-100" : "opacity-85"
                              )}
                            />
                            {!isCollapsed && (
                              <span className="text-sm font-medium">
                                {item.title}
                              </span>
                            )}
                          </div>
                        </div>
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>

            <hr className={cn("border-slate-200/50 dark:border-slate-700/50 my-4", isCollapsed && "hidden")} />

            {/* Secondary navigation sections */}
            {data.navSecondary.map((section, index) => (
              <React.Fragment key={section.title}>
                {index > 0 && <hr className={cn("border-slate-200/50 dark:border-slate-700/50 my-2", isCollapsed && "hidden")} />}
                <div className="mb-4">
                  <h4
                    className={cn(
                      "text-[10px] font-medium text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-3 text-center bg-slate-100/30 dark:bg-slate-800/30 rounded px-2 py-1",
                      isCollapsed && "hidden"
                    )}
                  >
                    {section.title}
                  </h4>

                  <div className="space-y-2">
                    {section.items.map((item) => {
                      const Icon = item.icon;
                      const isActive = item.isActive;
                      return (
                        <div
                          key={item.title}
                          className={cn(
                            "flex items-center",
                            isCollapsed ? "justify-center" : "justify-center"
                          )}
                        >
                          <button
                            onClick={() =>
                              handleNavClick(
                                item.title.toLowerCase().replace(" ", "-")
                              )
                            }
                            className={cn(
                              activeBtnClass,
                              isActive
                                ? "shadow-lg w-full rounded-2xl"
                                : "hover:shadow-md hover:scale-[1.02] hover:-translate-y-[1px] hover:w-full hover:rounded-2xl"
                            )}
                          >
                            {isActive && !isCollapsed && (
                              <motion.span
                                aria-hidden
                                className="absolute -inset-px rounded-2xl bg-gradient-to-r from-emerald-500/45 via-emerald-400/25 to-transparent blur-lg"
                                animate={{
                                  scale: [1, 1.05, 1],
                                  opacity: [0.4, 0.7, 0.4]
                                }}
                                transition={{
                                  duration: 2.5,
                                  repeat: Infinity,
                                  ease: "easeInOut",
                                  delay: 0.5
                                }}
                              />
                            )}

                            <div
                              className={cn(
                                activeInnerClass,
                                isActive
                                  ? "bg-gradient-to-r from-emerald-600/80 to-emerald-500/70 text-white border border-emerald-400/20 w-full rounded-2xl"
                                  : theme === "dark"
                                  ? "bg-slate-900/30 text-slate-200 hover:bg-emerald-900/40 hover:text-emerald-300"
                                  : "bg-white/60 text-slate-700 hover:bg-emerald-50/80 hover:text-emerald-700"
                              )}
                            >
                              <div className="flex items-center gap-3">
                                <Icon
                                  className={cn(
                                    "flex-shrink-0",
                                    isCollapsed ? "h-6 w-6" : "h-5 w-5"
                                  )}
                                />
                                {!isCollapsed && (
                                  <span className="text-sm">{item.title}</span>
                                )}
                              </div>

                              {/* badges (pills) */}
                              {!isCollapsed && item.badge && (
                                <Badge
                                  className={cn(
                                    "text-xs font-medium py-0.5 px-2 rounded-full",
                                    item.badge === "New" &&
                                      "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300",
                                    item.badge === "Live" &&
                                      "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300",
                                    item.badge === "Pro" &&
                                      "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300"
                                  )}
                                >
                                  {item.badge}
                                </Badge>
                              )}
                            </div>
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </React.Fragment>
            ))}
          </div>
        </div>
      </SidebarContent>

      <SidebarFooter
        className={cn(
          "border-t border-slate-200/50 dark:border-slate-700/40 p-4 bg-white/60 dark:bg-slate-900/50 backdrop-blur-md",
          isCollapsed ? "p-3" : "p-4"
        )}
      >
        <div className={cn("space-y-4", isCollapsed ? "space-y-2" : "space-y-4")}>
          {/* Prominent Logout Button */}
          <motion.button
            onClick={handleLogout}
            className={cn(
              "flex items-center gap-3 w-full rounded-xl p-3 cursor-pointer transition-all duration-300 text-red-600 dark:text-red-400 hover:bg-red-50/80 dark:hover:bg-red-900/20 hover:shadow-md hover:rounded-2xl",
              isCollapsed ? "justify-center" : "justify-start",
              theme === "dark" ? "bg-slate-800/30" : "bg-white/60"
            )}
            whileHover={{ scale: 1.02, width: '100%' }}
            whileTap={{ scale: 0.98 }}
          >
            <LogOut className={cn("flex-shrink-0", isCollapsed ? "h-6 w-6" : "h-5 w-5")} />
            {!isCollapsed && (
              <span className="text-sm font-medium">Sign Out</span>
            )}
          </motion.button>

          {/* Theme toggle - Only show when collapsed */}
          {isCollapsed && (
            <div className="flex justify-center">
              <motion.button
                aria-label="Toggle theme"
                onClick={() => toggleTheme()}
                className="p-2 rounded-md hover:bg-slate-100/60 dark:hover:bg-slate-700/40 transition-all duration-300 hover:shadow-md hover:rounded-2xl"
                whileHover={{ scale: 1.1, width: 'auto' }}
                whileTap={{ scale: 0.9 }}
              >
                {theme === "dark" ? <Sun className="h-4 w-4 text-amber-400" /> : <Moon className="h-4 w-4 text-slate-600" />}
              </motion.button>
            </div>
          )}
        </div>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
};

export default AppSidebar;
