import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { MessageSquare, ArrowRight, Globe, Users } from 'lucide-react';

const CTA = () => {
  return (
    <section className="py-20 bg-white dark:bg-slate-950 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 inset-x-0 h-40 bg-gradient-to-b from-slate-50 dark:from-slate-950 to-transparent"></div>
        
        {/* Gradient background */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full h-full max-w-6xl">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-50/80 via-teal-50/80 to-blue-50/80 dark:from-emerald-900/20 dark:via-teal-900/20 dark:to-blue-900/20 rounded-3xl blur-3xl"></div>
        </div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true, margin: "-100px" }}
          className="max-w-5xl mx-auto bg-white dark:bg-slate-900 rounded-3xl shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-800"
        >
          <div className="relative">
            {/* Decorative header */}
            <div className="h-2 bg-gradient-to-r from-emerald-500 via-teal-500 to-blue-500"></div>
            
            {/* Main content */}
            <div className="grid md:grid-cols-2 gap-8 p-8 md:p-12">
              <div>
                <h2 className="text-3xl md:text-4xl font-extrabold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-emerald-800 dark:from-white dark:to-emerald-400 tracking-tight">
                  Ready to Transform Your English Learning Journey?
                </h2>
                <p className="text-lg text-slate-700 dark:text-slate-300 mb-8">
                  Join thousands of learners worldwide who are experiencing faster progress and greater confidence with CognitoSpeak's AI-powered platform.
                </p>
                
                <div className="space-y-4">
                  <Button 
                    size="lg"
                    className="w-full sm:w-auto bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white border-0 shadow-lg"
                    asChild
                  >
                    <Link to="/signup">
                      Get Started for Free <ArrowRight className="ml-2 h-5 w-5" />
                    </Link>
                  </Button>
                  
                  <Button 
                    size="lg"
                    variant="outline"
                    className="w-full sm:w-auto border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800"
                    asChild
                  >
                    <Link to="#demo">
                      <MessageSquare className="mr-2 h-5 w-5" /> Watch Demo
                    </Link>
                  </Button>
                </div>
              </div>
              
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-50/50 to-teal-50/50 dark:from-emerald-900/20 dark:to-teal-900/20 rounded-xl"></div>
                <div className="relative p-6">
                  {/* Stats grid */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow-md border border-slate-200 dark:border-slate-700">
                      <div className="w-10 h-10 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center mb-3">
                        <Globe className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                      </div>
                      <div className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white">130+</div>
                      <div className="text-sm text-slate-600 dark:text-slate-400">Countries with Active Users</div>
                    </div>
                    
                    <div className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow-md border border-slate-200 dark:border-slate-700">
                      <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mb-3">
                        <Users className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white">2M+</div>
                      <div className="text-sm text-slate-600 dark:text-slate-400">Registered Learners</div>
                    </div>
                    
                    <div className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow-md border border-slate-200 dark:border-slate-700 col-span-2">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Average Improvement</span>
                        <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400">+64%</span>
                      </div>
                      <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                        <div className="bg-gradient-to-r from-emerald-500 to-teal-500 h-2 rounded-full" style={{ width: '64%' }}></div>
                      </div>
                      <div className="mt-2 text-xs text-slate-600 dark:text-slate-400">
                        Based on assessment scores after 3 months
                      </div>
                    </div>
                  </div>
                  
                  {/* Testimonial quote */}
                  <div className="mt-4 bg-white dark:bg-slate-800 p-4 rounded-lg shadow-md border border-slate-200 dark:border-slate-700">
                    <div className="flex items-start">
                      <div className="text-4xl text-emerald-200 dark:text-emerald-800">"</div>
                      <div>
                        <p className="text-sm text-slate-700 dark:text-slate-300 italic">
                          CognitoSpeak helped me achieve fluency in just 6 months. The AI tutor feels like talking to a real person!
                        </p>
                        <div className="mt-2 text-xs font-medium text-slate-900 dark:text-white">
                          — Maria C., Business Professional
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Trust badges */}
            <div className="px-8 pb-8 md:px-12 md:pb-12 pt-0">
              <div className="pt-6 border-t border-slate-200 dark:border-slate-800">
                <p className="text-xs text-center text-slate-500 dark:text-slate-500 mb-4">
                  TRUSTED BY LEADING ORGANIZATIONS AND EDUCATIONAL INSTITUTIONS
                </p>
                <div className="flex flex-wrap justify-center gap-x-8 gap-y-4 opacity-70">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="h-8 w-24 bg-slate-200 dark:bg-slate-700 rounded"></div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CTA;
