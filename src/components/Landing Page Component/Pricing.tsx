import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, X, HelpCircle, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Switch } from '@/components/ui/switch';
import { cn } from '@/lib/utils';

const pricingPlans = [
  {
    name: 'Free',
    description: 'Basic access to improve your English',
    price: {
      monthly: 0,
      yearly: 0,
    },
    features: [
      {
        included: true,
        title: 'Basic AI conversation (5 per day)',
        tooltip: 'Practice your English with our AI tutors with a limited daily allowance'
      },
      {
        included: true,
        title: 'Grammar essentials',
        tooltip: 'Access to foundational grammar lessons and exercises'
      },
      {
        included: true,
        title: 'Vocabulary basics',
        tooltip: '500+ essential vocabulary words with examples'
      },
      {
        included: true,
        title: 'Community access',
        tooltip: 'Join discussions and connect with other learners'
      },
      {
        included: false,
        title: 'Pronunciation analysis',
        tooltip: 'Detailed feedback on your pronunciation with improvement suggestions'
      },
      {
        included: false,
        title: 'All AI personalities',
        tooltip: 'Access to all 5 AI tutor personalities with specialized teaching styles'
      },
      {
        included: false,
        title: 'Writing feedback',
        tooltip: 'AI-powered writing assistance and corrections'
      },
      {
        included: false,
        title: 'Private practice rooms',
        tooltip: 'Create private rooms to practice with friends or tutors'
      }
    ],
    callToAction: 'Start for Free',
    color: 'slate'
  },
  {
    name: 'Plus',
    description: 'Everything you need for serious improvement',
    price: {
      monthly: 9.99,
      yearly: 7.99,
    },
    features: [
      {
        included: true,
        title: 'Unlimited AI conversations',
        tooltip: 'Practice your English with our AI tutors as much as you want'
      },
      {
        included: true,
        title: 'Full grammar curriculum',
        tooltip: 'Complete grammar curriculum with in-depth explanations and practice exercises'
      },
      {
        included: true,
        title: 'Expanded vocabulary',
        tooltip: '3,000+ vocabulary words with contextual examples'
      },
      {
        included: true,
        title: 'Community access',
        tooltip: 'Join discussions and connect with other learners'
      },
      {
        included: true,
        title: 'Basic pronunciation analysis',
        tooltip: 'Feedback on your pronunciation with some improvement suggestions'
      },
      {
        included: true,
        title: '3 AI personalities',
        tooltip: 'Access to 3 AI tutor personalities with different teaching styles'
      },
      {
        included: true,
        title: 'Basic writing feedback',
        tooltip: 'AI-powered writing assistance for short texts and sentences'
      },
      {
        included: false,
        title: 'Private practice rooms',
        tooltip: 'Create private rooms to practice with friends or tutors'
      }
    ],
    callToAction: 'Start 7-Day Free Trial',
    color: 'emerald',
    popular: false
  },
  {
    name: 'Premium',
    description: 'The ultimate English learning experience',
    price: {
      monthly: 19.99,
      yearly: 15.99,
    },
    features: [
      {
        included: true,
        title: 'Unlimited AI conversations',
        tooltip: 'Practice your English with our AI tutors as much as you want'
      },
      {
        included: true,
        title: 'Complete curriculum',
        tooltip: 'Access all learning materials including specialized professional English modules'
      },
      {
        included: true,
        title: 'Comprehensive vocabulary',
        tooltip: '10,000+ vocabulary words with contextual examples and usage patterns'
      },
      {
        included: true,
        title: 'Priority community access',
        tooltip: 'Join discussions, get verified badge, and exclusive community events'
      },
      {
        included: true,
        title: 'Advanced pronunciation analysis',
        tooltip: 'Detailed feedback on your pronunciation with specific improvement exercises'
      },
      {
        included: true,
        title: 'All 5 AI personalities',
        tooltip: 'Access to all 5 AI tutor personalities with specialized teaching styles'
      },
      {
        included: true,
        title: 'Advanced writing feedback',
        tooltip: 'Professional-level writing assistance with style and tone recommendations'
      },
      {
        included: true,
        title: 'Private practice rooms',
        tooltip: 'Create unlimited private rooms to practice with friends or tutors'
      }
    ],
    callToAction: 'Start 7-Day Free Trial',
    color: 'blue',
    popular: true
  }
];

const Pricing = () => {
  const [isYearly, setIsYearly] = useState(false);

  const toggleBilling = () => {
    setIsYearly(!isYearly);
  };

  const getButtonStyle = (color: string) => {
    const buttonStyles = {
      'slate': 'bg-slate-600 hover:bg-slate-700 dark:bg-slate-700 dark:hover:bg-slate-600',
      'emerald': 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700',
      'blue': 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700',
    };
    return buttonStyles[color as keyof typeof buttonStyles] || buttonStyles.slate;
  };

  const getCardStyle = (color: string) => {
    const cardStyles = {
      'slate': 'border-slate-200 dark:border-slate-800',
      'emerald': 'border-emerald-200 dark:border-emerald-800',
      'blue': 'border-blue-200 dark:border-blue-800',
    };
    return cardStyles[color as keyof typeof cardStyles] || cardStyles.slate;
  };

  return (
    <section id="pricing" className="py-20 bg-white dark:bg-slate-950 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute -top-[10%] left-[20%] w-[500px] h-[500px] bg-gradient-to-br from-emerald-50/40 to-teal-50/40 rounded-full blur-3xl dark:from-emerald-900/10 dark:to-teal-900/10"></div>
        <div className="absolute -bottom-[10%] right-[20%] w-[500px] h-[500px] bg-gradient-to-br from-blue-50/40 to-indigo-50/40 rounded-full blur-3xl dark:from-blue-900/10 dark:to-indigo-900/10"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Section header */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-emerald-800 dark:from-white dark:to-emerald-400">
            Simple, Transparent Pricing
          </h2>
          <p className="text-lg text-slate-700 dark:text-slate-300 mb-8">
            Choose the perfect plan to accelerate your English learning journey.
            All plans include access to our innovative AI learning platform.
          </p>

          {/* Billing toggle */}
          <div className="flex items-center justify-center">
            <span className={`text-sm font-medium mr-2 ${!isYearly ? 'text-slate-900 dark:text-white' : 'text-slate-500 dark:text-slate-400'}`}>
              Monthly
            </span>
            <Switch
              checked={isYearly}
              onCheckedChange={toggleBilling}
            />
            <span className={`text-sm font-medium ml-2 flex items-center ${isYearly ? 'text-slate-900 dark:text-white' : 'text-slate-500 dark:text-slate-400'}`}>
              Yearly
              <span className="ml-2 px-2 py-0.5 text-xs font-semibold bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-full">
                Save 20%
              </span>
            </span>
          </div>
        </div>

        {/* Pricing cards */}
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {pricingPlans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true, margin: "-100px" }}
              className={cn(
                "rounded-xl border bg-white dark:bg-slate-900 shadow-xl overflow-hidden relative flex flex-col",
                getCardStyle(plan.color),
                plan.popular ? 'ring-2 ring-emerald-500 dark:ring-emerald-400 md:-mt-4 md:mb-4' : ''
              )}
            >
              {/* Popular badge */}
              {plan.popular && (
                <div className="absolute top-0 right-5">
                  <div className="relative">
                    <div className="w-28 h-28 overflow-hidden absolute -top-14 -right-14">
                      <div className="absolute top-0 right-0 h-14 w-36 bg-gradient-to-r from-emerald-500 to-teal-500 transform rotate-45 origin-bottom-left translate-y-8"></div>
                    </div>
                    <span className="absolute top-0 right-0 transform rotate-45 text-xs font-bold text-white mt-2.5 mr-1.5">POPULAR</span>
                  </div>
                </div>
              )}

              {/* Plan header */}
              <div className="p-6 bg-gradient-to-b from-slate-50 to-white dark:from-slate-800 dark:to-slate-900 text-center">
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
                  {plan.name}
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 my-2">
                  {plan.description}
                </p>
                <div className="mt-4 mb-2">
                  <span className="text-4xl font-bold text-slate-900 dark:text-white">
                    ${isYearly ? plan.price.yearly : plan.price.monthly}
                  </span>
                  <span className="text-slate-600 dark:text-slate-400 ml-1">
                    {plan.price.monthly > 0 ? `/month` : ''}
                  </span>
                </div>
                {plan.price.monthly > 0 && (
                  <p className="text-xs text-slate-500 dark:text-slate-500 mb-2">
                    {isYearly ? 'Billed annually' : 'Billed monthly'}
                  </p>
                )}
                <Button
                  className={`mt-4 w-full text-white shadow-lg ${getButtonStyle(plan.color)}`}
                >
                  {plan.price.monthly > 0 && <Sparkles className="mr-2 h-4 w-4" />}
                  {plan.callToAction}
                </Button>
              </div>

              {/* Features list */}
              <div className="p-6 flex-grow">
                <ul className="space-y-4">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start">
                      <div className="flex-shrink-0 mt-1">
                        {feature.included ? (
                          <Check className="h-5 w-5 text-emerald-500" />
                        ) : (
                          <X className="h-5 w-5 text-slate-300 dark:text-slate-600" />
                        )}
                      </div>
                      <div className="ml-3 flex items-center">
                        <span 
                          className={`text-sm ${
                            feature.included 
                              ? 'text-slate-700 dark:text-slate-300' 
                              : 'text-slate-500 dark:text-slate-500'
                          }`}
                        >
                          {feature.title}
                        </span>
                        
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <button className="ml-1.5">
                                <HelpCircle className="h-3.5 w-3.5 text-slate-400 dark:text-slate-600" />
                              </button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p className="max-w-xs text-xs">{feature.tooltip}</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </div>

        {/* FAQ teaser */}
        <div className="mt-16 text-center">
          <p className="text-slate-600 dark:text-slate-400">
            Have questions about our pricing plans?{' '}
            <a href="#faq" className="text-emerald-600 dark:text-emerald-400 font-medium hover:underline">
              View our FAQ
            </a>{' '}
            or{' '}
            <a href="#contact" className="text-emerald-600 dark:text-emerald-400 font-medium hover:underline">
              contact our support team
            </a>.
          </p>
        </div>
      </div>
    </section>
  );
};

export default Pricing;
