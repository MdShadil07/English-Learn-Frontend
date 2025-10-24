import React from 'react';
import { Button } from '@/components/ui/button';
import { Check, Star, Crown } from 'lucide-react';

interface BasicPlanCardProps {
  isPremium?: boolean;
}

const BasicPlanCard: React.FC<BasicPlanCardProps> = ({ isPremium = false }) => {
  const features = [
    'Basic lessons access',
    'Progress tracking',
    'Weekly reports',
    'Community forums'
  ];

  return (
    <div className="bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-800 dark:to-blue-900/30 rounded-xl p-6 border border-slate-200 dark:border-slate-700">
      <div className="text-center mb-6">
        <div className="w-12 h-12 bg-gradient-to-br from-slate-500 to-blue-600 rounded-xl flex items-center justify-center mx-auto mb-4">
          <Star className="h-6 w-6 text-white" />
        </div>
        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Basic Plan</h3>
        <p className="text-slate-600 dark:text-slate-400 text-sm mb-4">Perfect for getting started</p>
        <div className="text-3xl font-bold text-slate-900 dark:text-white">$9<span className="text-lg text-slate-500">/month</span></div>
      </div>

      <div className="space-y-3 mb-6">
        {features.map((feature, index) => (
          <div key={index} className="flex items-center gap-3">
            <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
            <span className="text-sm text-slate-700 dark:text-slate-300">{feature}</span>
          </div>
        ))}
      </div>

      <Button
        className={`w-full ${isPremium ? 'bg-slate-100 text-slate-600' : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white'}`}
        disabled={isPremium}
      >
        {isPremium ? 'Current Plan' : 'Choose Basic'}
      </Button>
    </div>
  );
};

export { BasicPlanCard };
