import React from 'react';
import { Button } from '@/components/ui/button';
import { Check, Crown, Zap, Award, Target } from 'lucide-react';

interface PremiumPlanCardProps {
  isPremium: boolean;
}

const PremiumPlanCard: React.FC<PremiumPlanCardProps> = ({ isPremium }) => {
  const features = [
    'All lessons & advanced content',
    'AI-powered pronunciation coach',
    '1-on-1 tutoring sessions',
    'Priority support',
    'Offline downloads',
    'Advanced analytics',
    'Custom learning paths',
    'Certificate generation'
  ];

  return (
    <div className={`relative ${isPremium ? 'ring-2 ring-yellow-400' : ''} bg-gradient-to-br from-yellow-50 via-amber-50 to-orange-50 dark:from-yellow-900/20 dark:via-amber-900/20 dark:to-orange-900/20 rounded-xl p-6 border border-yellow-200 dark:border-yellow-800`}>
      {isPremium && (
        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-4 py-1 rounded-full text-sm font-semibold flex items-center gap-1">
          <Crown className="h-4 w-4" />
          Premium
        </div>
      )}

      <div className="text-center mb-6">
        <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl flex items-center justify-center mx-auto mb-4">
          <Crown className="h-6 w-6 text-white" />
        </div>
        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Premium Plan</h3>
        <p className="text-slate-600 dark:text-slate-400 text-sm mb-4">Unlock your full potential</p>
        <div className="text-3xl font-bold text-slate-900 dark:text-white">$19<span className="text-lg text-slate-500">/month</span></div>
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
        className={`w-full ${isPremium
          ? 'bg-gradient-to-r from-yellow-400 to-orange-500 text-white'
          : 'bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white'
        }`}
        disabled={isPremium}
      >
        {isPremium ? (
          <>
            <Award className="h-4 w-4 mr-2" />
            Premium Active
          </>
        ) : (
          <>
            <Zap className="h-4 w-4 mr-2" />
            Upgrade to Premium
          </>
        )}
      </Button>

      {!isPremium && (
        <p className="text-xs text-center text-slate-500 dark:text-slate-400 mt-3">
          7-day free trial included
        </p>
      )}
    </div>
  );
};

export { PremiumPlanCard };
