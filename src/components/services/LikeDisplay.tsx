import React from 'react';

interface LikeDisplayProps {
  likeCount: number;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

const LikeDisplay: React.FC<LikeDisplayProps> = ({ 
  likeCount, 
  className = '',
  size = 'md'
}) => {
  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'w-3 h-3';
      case 'lg':
        return 'w-6 h-6';
      default:
        return 'w-4 h-4';
    }
  };

  const getTextSize = () => {
    switch (size) {
      case 'sm':
        return 'text-xs';
      case 'lg':
        return 'text-base';
      default:
        return 'text-sm';
    }
  };

  return (
    <span className={`flex items-center space-x-1 text-gray-500 ${className}`}>
      <svg 
        className={getSizeClasses()}
        fill="none" 
        stroke="currentColor" 
        viewBox="0 0 24 24"
      >
        <path 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          strokeWidth={2} 
          d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" 
        />
      </svg>
      <span className={getTextSize()}>
        {likeCount}
      </span>
    </span>
  );
};

export default LikeDisplay;
