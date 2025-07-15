import React from 'react';

interface EmptyStateProps {
  message: string;
  className?: string;
}

const EmptyState: React.FC<EmptyStateProps> = ({ message, className = '' }) => {
  return (
    <div className={`text-center py-8 ${className}`}>
      <div className="text-gray-600 text-lg">{message}</div>
    </div>
  );
};

export default EmptyState;
