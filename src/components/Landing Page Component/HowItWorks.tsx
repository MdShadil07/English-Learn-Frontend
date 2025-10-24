import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { MessageSquare, Mic, Users, ArrowRight, BookOpen } from 'lucide-react';

const HowItWorks = () => {
  const steps = [
    {
      icon: MessageSquare,
      iconColor: 'bg-emerald-500',
      title: 'Chat with AI Tutors',
      description: 'Choose from 5 different AI tutors tailored to your learning style and engage in natural conversations.',
      image: '/assets/mockups/chat-screen.png',
      alt: 'AI Chat Interface',
      delay: 0.1
    },
    {
      icon: Mic,
      iconColor: 'bg-blue-500',
      title: 'Practice Speaking',
      description: 'Perfect your pronunciation and fluency with real-time feedback and correction suggestions.',
      image: '/assets/mockups/pronunciation-screen.png',
      alt: 'Pronunciation Practice Interface',
      delay: 0.2
    },
    {
      icon: BookOpen,
      iconColor: 'bg-purple-500',
      title: 'Learn with Modules',
      description: 'Work through expertly crafted lessons on grammar, vocabulary, writing and reading comprehension.',
      image: '/assets/mockups/modules-screen.png',
      alt: 'Learning Modules Interface',
      delay: 0.3
    },
    {
      icon: Users,
      iconColor: 'bg-amber-500',
      title: 'Connect with Community',
      description: 'Create or join practice rooms, participate in discussions, and learn together with peers.',
      image: '/assets/mockups/community-screen.png',
      alt: 'Community Interface',
      delay: 0.4
    }
  ];

  return (
    <section className="py-20 bg-white dark:bg-slate-950 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute -top-[5%] right-[30%] w-[500px] h-[500px] bg-gradient-to-br from-emerald-50/40 to-teal-50/40 rounded-full blur-3xl dark:from-emerald-900/10 dark:to-teal-900/10"></div>
        <div className="absolute bottom-[10%] left-[20%] w-[500px] h-[500px] bg-gradient-to-br from-blue-50/30 to-indigo-50/30 rounded-full blur-3xl dark:from-blue-900/10 dark:to-indigo-900/10"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Section header */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-emerald-800 dark:from-white dark:to-emerald-400">
            How CognitoSpeak Works
          </h2>
          <p className="text-lg text-slate-700 dark:text-slate-300">
            Our intuitive platform makes learning English simple, effective, and engaging.
            Follow these easy steps to begin your journey to fluency.
          </p>
        </div>

        {/* Steps */}
        <div className="space-y-20 md:space-y-28">
          {steps.map((step, index) => {
            const Icon = step.icon;
            const isEven = index % 2 === 0;
            
            return (
              <div 
                key={index} 
                className="grid md:grid-cols-2 gap-8 md:gap-12 items-center"
              >
                {/* Text content */}
                <motion.div 
                  className={`${isEven ? 'md:order-1' : 'md:order-2'}`}
                  initial={{ opacity: 0, x: isEven ? -30 : 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.7, delay: step.delay }}
                  viewport={{ once: true, margin: "-100px" }}
                >
                  <div className="flex items-center mb-6">
                    <div className={`w-12 h-12 rounded-xl ${step.iconColor} flex items-center justify-center text-white shadow-lg mr-4`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-lg font-bold text-slate-500 dark:text-slate-400">Step {index + 1}</span>
                  </div>
                  
                  <h3 className="text-2xl md:text-3xl font-bold mb-4 text-slate-900 dark:text-white">
                    {step.title}
                  </h3>
                  
                  <p className="text-slate-700 dark:text-slate-300 mb-6 text-lg">
                    {step.description}
                  </p>
                  
                  <Button
                    variant="ghost" 
                    className="text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300 p-0 font-medium hover:bg-transparent"
                  >
                    Learn more <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </motion.div>
                
                {/* Image/mockup */}
                <motion.div 
                  className={`${isEven ? 'md:order-2' : 'md:order-1'} relative`}
                  initial={{ opacity: 0, x: isEven ? 30 : -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.7, delay: step.delay }}
                  viewport={{ once: true, margin: "-100px" }}
                >
                  <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-800">
                    {/* Placeholder for actual images */}
                    <div className="aspect-[4/3] bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900 flex items-center justify-center">
                      <div className="text-center p-8">
                        <Icon className={`w-16 h-16 mx-auto mb-4 ${step.iconColor} p-4 rounded-xl text-white`} />
                        <p className="text-slate-500 dark:text-slate-400 mb-2">Image placeholder for</p>
                        <p className="font-bold text-slate-700 dark:text-slate-300">{step.alt}</p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Decorative elements */}
                  <div className="absolute -z-10 w-full h-full bottom-0 left-0 transform translate-x-4 translate-y-4">
                    <div className={`w-full h-full rounded-2xl opacity-20 ${isEven ? 'bg-emerald-200 dark:bg-emerald-800/30' : 'bg-blue-200 dark:bg-blue-800/30'}`}></div>
                  </div>
                  <div className="absolute -z-20 w-full h-full bottom-0 left-0 transform translate-x-8 translate-y-8">
                    <div className={`w-full h-full rounded-2xl opacity-10 ${isEven ? 'bg-teal-200 dark:bg-teal-800/20' : 'bg-indigo-200 dark:bg-indigo-800/20'}`}></div>
                  </div>
                </motion.div>
              </div>
            );
          })}
        </div>
        
        {/* CTA Section */}
        <motion.div 
          className="mt-24 bg-gradient-to-r from-emerald-500 to-teal-600 dark:from-emerald-600 dark:to-teal-700 rounded-3xl p-8 md:p-12 text-white shadow-xl relative overflow-hidden"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true, margin: "-100px" }}
        >
          {/* Background pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-full h-full" style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}></div>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8 items-center relative z-10">
            <div>
              <h3 className="text-3xl font-bold mb-4">Ready to Transform Your English Skills?</h3>
              <p className="text-emerald-50 text-lg mb-6">
                Join thousands of learners who have accelerated their fluency with CognitoSpeak's AI-powered platform. Start your journey today!
              </p>
              <div className="flex flex-wrap gap-4">
                <Button size="lg" className="bg-white text-emerald-600 hover:bg-slate-100">
                  Get Started Free
                </Button>
                <Button size="lg" variant="outline" className="text-white border-white hover:bg-emerald-600/30">
                  Explore Plans
                </Button>
              </div>
            </div>
            <div className="hidden md:flex justify-end">
              <div className="w-48 h-48 rounded-full bg-white/20 flex items-center justify-center">
                <div className="w-36 h-36 rounded-full bg-white/30 flex items-center justify-center">
                  <div className="w-24 h-24 rounded-full bg-white flex items-center justify-center">
                    <div className="text-emerald-600 font-bold text-xl">Start Now</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default HowItWorks;
