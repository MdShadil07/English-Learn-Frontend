import React from 'react';
import { cn } from '@/lib/utils';

interface IconProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

const sizeClasses = {
  xs: 'w-3 h-3',
  sm: 'w-4 h-4',
  md: 'w-5 h-5',
  lg: 'w-6 h-6',
  xl: 'w-8 h-8',
};

export const FreeIcon: React.FC<IconProps> = ({ size = 'md', className }) => (
  <svg
    className={cn(sizeClasses[size], className)}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2Z"
      fill="currentColor"
      fillOpacity="0.3"
    />
    <path
      d="M12 8C13.1 8 14 8.9 14 10C14 11.1 13.1 12 12 12C10.9 12 10 11.1 10 10C10 8.9 10.9 8 12 8Z"
      fill="currentColor"
      fillOpacity="0.3"
    />
    <path
      d="M12 14C13.1 14 14 14.9 14 16C14 17.1 13.1 18 12 18C10.9 18 10 17.1 10 16C10 14.9 10.9 14 12 14Z"
      fill="currentColor"
      fillOpacity="0.3"
    />
  </svg>
);

export const BasicIcon: React.FC<IconProps> = ({ size = 'md', className }) => (
  <svg
    className={cn(sizeClasses[size], className)}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M12 2L13.09 8.26L20 9L13.09 9.74L12 16L10.91 9.74L4 9L10.91 8.26L12 2Z"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="currentColor"
      fillOpacity="0.2"
    />
    <circle
      cx="12"
      cy="12"
      r="8"
      stroke="currentColor"
      strokeWidth="1.5"
      fill="none"
    />
  </svg>
);

export const PremiumIcon: React.FC<IconProps> = ({ size = 'md', className }) => (
  <svg
    className={cn(sizeClasses[size], className)}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M12 2L15.09 8.26L22 9L15.09 9.74L12 16L8.91 9.74L2 9L8.91 8.26L12 2Z"
      fill="currentColor"
    />
    <path
      d="M12 16L15.09 9.74L22 9L15.09 8.26L12 2L8.91 8.26L2 9L8.91 9.74L12 16Z"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />
    <circle
      cx="12"
      cy="12"
      r="3"
      stroke="currentColor"
      strokeWidth="1.5"
      fill="currentColor"
    />
  </svg>
);

export const CrownIcon: React.FC<IconProps> = ({ size = 'md', className }) => (
  <svg
    className={cn(sizeClasses[size], className)}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M12 2L15.09 8.26L22 9L15.09 9.74L12 16L8.91 9.74L2 9L8.91 8.26L12 2Z"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M5 16L7 20H17L19 16"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <circle
      cx="12"
      cy="12"
      r="2"
      fill="currentColor"
    />
  </svg>
);

export const StarIcon: React.FC<IconProps> = ({ size = 'md', className }) => (
  <svg
    className={cn(sizeClasses[size], className)}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M12 2L15.09 8.26L22 9L15.09 9.74L12 16L8.91 9.74L2 9L8.91 8.26L12 2Z"
      fill="currentColor"
    />
    <circle
      cx="12"
      cy="12"
      r="1.5"
      fill="white"
    />
  </svg>
);

export const ShieldIcon: React.FC<IconProps> = ({ size = 'md', className }) => (
  <svg
    className={cn(sizeClasses[size], className)}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M12 2L20 6V10C20 16 16 20.5 12 22C8 20.5 4 16 4 10V6L12 2Z"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="currentColor"
      fillOpacity="0.1"
    />
    <path
      d="M9 12L11 14L15 10"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />
  </svg>
);

export const DiamondIcon: React.FC<IconProps> = ({ size = 'md', className }) => (
  <svg
    className={cn(sizeClasses[size], className)}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M12 2L20 12L12 22L4 12L12 2Z"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="currentColor"
      fillOpacity="0.2"
    />
    <path
      d="M12 2L20 12L12 22L4 12L12 2Z"
      stroke="currentColor"
      strokeWidth="1"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />
    <circle
      cx="12"
      cy="12"
      r="2"
      fill="currentColor"
    />
  </svg>
);

// Main export component for backward compatibility
interface SubscriptionIconsProps {
  type: 'free' | 'basic' | 'premium' | 'crown' | 'star' | 'shield' | 'diamond';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export const SubscriptionIcon: React.FC<SubscriptionIconsProps> = ({
  type,
  size = 'md',
  className
}) => {
  const iconProps = { size, className };

  switch (type) {
    case 'free':
      return <FreeIcon {...iconProps} />;
    case 'basic':
      return <BasicIcon {...iconProps} />;
    case 'premium':
      return <PremiumIcon {...iconProps} />;
    case 'crown':
      return <CrownIcon {...iconProps} />;
    case 'star':
      return <StarIcon {...iconProps} />;
    case 'shield':
      return <ShieldIcon {...iconProps} />;
    case 'diamond':
      return <DiamondIcon {...iconProps} />;
    default:
      return <FreeIcon {...iconProps} />;
  }
};
