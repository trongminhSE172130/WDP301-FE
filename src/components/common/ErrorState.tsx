import React from 'react';
import { useNavigate } from 'react-router-dom';

interface ErrorStateProps {
  error: string;
  onRetry?: () => void;
  className?: string;
}

const ErrorState: React.FC<ErrorStateProps> = ({ 
  error, 
  onRetry,
  className = '' 
}) => {
  const navigate = useNavigate();

  return (
    <div className={`min-h-screen bg-gray-50 flex items-center justify-center ${className}`}>
      <div className="text-center">
        <div className="text-red-600 text-lg font-medium mb-4">{error}</div>
        <div className="space-x-4">
          <button 
            onClick={() => navigate('/blog')}
            className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          >
            Quay lại danh sách
          </button>
          {onRetry && (
            <button 
              onClick={onRetry}
              className="px-6 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
            >
              Thử lại
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ErrorState;
