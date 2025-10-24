import React from 'react';
import { motion } from 'framer-motion';
import { 
  MessageSquare,
  Mic,
  BookOpen,
  FileText,
  Users,
  Bot,
  Activity,
  Award,
  BarChart,
  Globe,
  CheckCircle,
  Star,
  Edit3,
  Eye,
  UserCheck,
  Database
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface FeatureCardProps {
  title: string;
  description: string;
  icon: React.ElementType;
  className?: string;
  iconClassName?: string;
  delay?: number;
}

const FeatureCard = ({ title, description, icon: Icon, className, iconClassName, delay = 0 }: FeatureCardProps) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: delay * 0.1 }}
      viewport={{ once: true, margin: "-100px" }}
      className={cn(
        "group relative p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm transition-all duration-300 hover:shadow-md",
        className
      )}
    >
      <div 
        className={cn(
          "p-3 rounded-xl w-12 h-12 flex items-center justify-center mb-5 text-white shadow-lg bg-gradient-to-br from-emerald-500 to-teal-600 transition-transform duration-300 group-hover:scale-110",
          iconClassName
        )}
      >
        <Icon className="w-5 h-5" />
      </div>
      <h3 className="text-lg font-bold mb-2 text-slate-900 dark:text-slate-100">{title}</h3>
      <p className="text-slate-600 dark:text-slate-400 text-sm">{description}</p>
    </motion.div>
  )
}

const Features = () => {
  return (
    <section id="features" className="py-20 bg-slate-50 dark:bg-slate-950 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 inset-x-0 h-40 bg-gradient-to-b from-white dark:from-slate-900 to-transparent"></div>
      <div className="absolute -top-[10%] -right-[10%] w-[500px] h-[500px] bg-emerald-100/50 dark:bg-emerald-900/10 rounded-full blur-3xl"></div>
      <div className="absolute -bottom-[10%] -left-[10%] w-[500px] h-[500px] bg-teal-100/50 dark:bg-teal-900/10 rounded-full blur-3xl"></div>

      <div className="container px-4 mx-auto relative z-10">
        {/* Section header */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-emerald-800 dark:from-white dark:to-emerald-400">
            Transform Your English Learning Experience
          </h2>
          <p className="text-lg text-slate-700 dark:text-slate-300">
            CognitoSpeak offers a comprehensive suite of AI-powered tools and features 
            designed to make your English learning journey effective and enjoyable.
          </p>
        </div>

        {/* Main features grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          <FeatureCard
            title="AI Conversation Practice"
            description="Engage in natural conversations with our AI tutor that adapts to your learning style and provides real-time feedback."
            icon={MessageSquare}
            delay={0}
            className="md:col-span-2 lg:col-span-1"
            iconClassName="bg-gradient-to-br from-emerald-500 to-green-600"
          />
          
          <FeatureCard
            title="Pronunciation Coach"
            description="Perfect your accent with our AI speech analysis that identifies pronunciation errors and provides targeted improvement suggestions."
            icon={Mic}
            delay={1}
            iconClassName="bg-gradient-to-br from-blue-500 to-indigo-600"
          />
          
          <FeatureCard
            title="Grammar & Vocabulary"
            description="Access professionally developed modules that systematically build your language foundation through interactive lessons."
            icon={BookOpen}
            delay={2}
            iconClassName="bg-gradient-to-br from-purple-500 to-violet-600"
          />
          
          <FeatureCard
            title="Writing Workshop"
            description="Improve your writing skills with AI-powered feedback that helps you refine structure, vocabulary, and style in real-time."
            icon={FileText}
            delay={3}
            iconClassName="bg-gradient-to-br from-amber-500 to-orange-600"
          />
          
          <FeatureCard
            title="Reading Comprehension"
            description="Enhance your reading skills with interactive texts that adapt to your level and provide instant explanation of difficult words."
            icon={Eye}
            delay={4}
            iconClassName="bg-gradient-to-br from-red-500 to-pink-600"
          />
          
          <FeatureCard
            title="Community Connection"
            description="Connect with fellow learners, join study groups, and participate in language exchange with our vibrant community."
            icon={Users}
            delay={5}
            iconClassName="bg-gradient-to-br from-cyan-500 to-sky-600"
          />
        </div>

        {/* Feature highlight section */}
        <div className="grid lg:grid-cols-2 gap-12 items-center my-24">
          <div className="order-2 lg:order-1">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7 }}
              viewport={{ once: true, margin: "-100px" }}
            >
              <h3 className="text-2xl md:text-3xl font-bold mb-6 text-slate-900 dark:text-white">
                Five AI Personalities <span className="text-emerald-600 dark:text-emerald-400">Tailored to Your Learning Style</span>
              </h3>
              <p className="text-slate-700 dark:text-slate-300 mb-8">
                Choose from our diverse set of AI tutors, each with a unique teaching approach to match your preferences and help you achieve your language goals.
              </p>
              
              <div className="space-y-4">
                {[
                  { name: "Professor Palmer", style: "Academic and structured", focus: "Grammar precision and academic vocabulary" },
                  { name: "Coach Taylor", style: "Motivational and practical", focus: "Everyday conversation and confidence building" },
                  { name: "Storyteller Maya", style: "Creative and engaging", focus: "Narrative skills and descriptive language" },
                  { name: "Business Pro Alex", style: "Professional and concise", focus: "Business English and formal communication" },
                  { name: "Explorer Zoe", style: "Casual and cultural", focus: "Travel vocabulary and cultural nuances" },
                ].map((tutor, index) => (
                  <div 
                    key={index} 
                    className="flex items-start p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50"
                  >
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white text-sm font-bold shadow-lg mr-3">
                      {tutor.name.charAt(0)}
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-900 dark:text-white">{tutor.name}</h4>
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        <span className="font-medium">{tutor.style}</span> • {tutor.focus}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <Button 
                className="mt-8 bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg hover:shadow-xl transition-all duration-200"
                size="lg"
              >
                <Bot className="mr-2 h-4 w-4" />
                Try AI Tutors
              </Button>
            </motion.div>
          </div>
          
          <motion.div
            className="order-1 lg:order-2 relative"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true, margin: "-100px" }}
          >
            {/* Tutor showcase mockup */}
            <div className="relative rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-2xl">
              <div className="bg-emerald-600 text-white p-4">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full bg-white/30"></div>
                  <div className="w-3 h-3 rounded-full bg-white/30"></div>
                  <div className="w-3 h-3 rounded-full bg-white/30"></div>
                  <div className="flex-1 text-center text-sm font-medium">CognitoSpeak AI Tutor</div>
                </div>
              </div>
              
              <div className="bg-white dark:bg-slate-900 p-6">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white text-xl font-bold shadow-lg">
                    C
                  </div>
                  <div className="ml-4">
                    <h4 className="font-bold text-slate-900 dark:text-white">Coach Taylor</h4>
                    <p className="text-sm text-slate-600 dark:text-slate-400">Conversation Specialist</p>
                  </div>
                  <div className="ml-auto">
                    <span className="px-3 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-300">
                      Active
                    </span>
                  </div>
                </div>
                
                <div className="space-y-4 mb-6">
                  <div className="flex gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex-shrink-0 flex items-center justify-center text-white text-sm font-bold">
                      C
                    </div>
                    <div className="bg-slate-100 dark:bg-slate-800 p-3 rounded-2xl rounded-tl-none">
                      <p className="text-slate-800 dark:text-slate-200">
                        Let's work on your confidence with job interviews! What's one question you find challenging?
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex gap-3 justify-end">
                    <div className="bg-emerald-100 dark:bg-emerald-900/30 p-3 rounded-2xl rounded-tr-none">
                      <p className="text-emerald-800 dark:text-emerald-300">
                        I get nervous when asked about my weaknesses in interviews.
                      </p>
                    </div>
                    <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 flex-shrink-0 flex items-center justify-center text-slate-600 dark:text-slate-300 text-sm font-bold">
                      U
                    </div>
                  </div>
                  
                  <div className="flex gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex-shrink-0 flex items-center justify-center text-white text-sm font-bold">
                      C
                    </div>
                    <div className="space-y-3">
                      <div className="bg-slate-100 dark:bg-slate-800 p-3 rounded-2xl rounded-tl-none">
                        <p className="text-slate-800 dark:text-slate-200">
                          That's a common concern! Let's practice a strategy: focus on a genuine area for growth, then explain how you're actively improving. Would you like an example?
                        </p>
                      </div>
                      
                      <div className="p-3 rounded-2xl border border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-900/30">
                        <p className="text-sm font-medium text-emerald-800 dark:text-emerald-300 mb-2">
                          Suggested Approach:
                        </p>
                        <ol className="text-sm text-emerald-700 dark:text-emerald-300 space-y-1 list-decimal pl-4">
                          <li>Mention a real but not critical weakness</li>
                          <li>Explain steps you're taking to improve</li>
                          <li>Share an example of progress you've made</li>
                        </ol>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
                  <div className="flex space-x-2">
                    <Button size="sm" variant="outline" className="text-xs">
                      <Mic className="h-3 w-3 mr-1" />
                      Voice Mode
                    </Button>
                    <Button size="sm" variant="outline" className="text-xs">
                      <Activity className="h-3 w-3 mr-1" />
                      Progress
                    </Button>
                  </div>
                  <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Save Lesson
                  </Button>
                </div>
              </div>
            </div>
            
            {/* Decorative elements */}
            <div className="absolute -z-10 w-full h-full -bottom-6 -right-6 bg-gradient-to-br from-emerald-200 to-teal-200 dark:from-emerald-900/30 dark:to-teal-900/30 rounded-2xl"></div>
            <div className="absolute -z-20 w-full h-full -bottom-12 -right-12 bg-gradient-to-br from-emerald-100 to-teal-100 dark:from-emerald-900/20 dark:to-teal-900/20 rounded-2xl"></div>
          </motion.div>
        </div>

        {/* Secondary features */}
        <div className="mt-20">
          <h3 className="text-2xl md:text-3xl font-bold mb-10 text-center text-slate-900 dark:text-white">
            Everything You Need to <span className="text-emerald-600 dark:text-emerald-400">Master English</span>
          </h3>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: Award,
                title: "Achievement System",
                description: "Track progress with badges and level-ups that keep you motivated",
                iconClass: "bg-gradient-to-br from-amber-500 to-yellow-600",
                delay: 0
              },
              {
                icon: BarChart,
                title: "Progress Analytics",
                description: "Visualize your improvement with detailed stats and insights",
                iconClass: "bg-gradient-to-br from-blue-500 to-violet-600",
                delay: 1
              },
              {
                icon: Globe,
                title: "Cultural Context",
                description: "Learn expressions with cultural nuances and real-world usage",
                iconClass: "bg-gradient-to-br from-pink-500 to-rose-600",
                delay: 2
              },
              {
                icon: UserCheck,
                title: "Personalized Path",
                description: "Adaptive learning system that evolves with your progress",
                iconClass: "bg-gradient-to-br from-emerald-500 to-teal-600",
                delay: 3
              },
              {
                icon: Database,
                title: "Extensive Resources",
                description: "Access thousands of exercises, articles, and practice materials",
                iconClass: "bg-gradient-to-br from-indigo-500 to-purple-600",
                delay: 4
              },
              {
                icon: Edit3,
                title: "Writing Assistant",
                description: "Get instant feedback on essays, emails, and other written content",
                iconClass: "bg-gradient-to-br from-orange-500 to-red-600",
                delay: 5
              },
              {
                icon: Star,
                title: "Premium Content",
                description: "Unlock specialized courses designed by language experts",
                iconClass: "bg-gradient-to-br from-cyan-500 to-sky-600",
                delay: 6
              },
              {
                icon: Bot,
                title: "24/7 Support",
                description: "Get help anytime with our always-available AI assistant",
                iconClass: "bg-gradient-to-br from-lime-500 to-green-600",
                delay: 7
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: feature.delay * 0.1 }}
                viewport={{ once: true, margin: "-100px" }}
                className="flex items-start p-4"
              >
                <div className={`p-2 rounded-lg mr-4 ${feature.iconClass} flex items-center justify-center shadow-lg`}>
                  <feature.icon className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h4 className="text-base font-semibold mb-1 text-slate-900 dark:text-white">{feature.title}</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">{feature.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;
