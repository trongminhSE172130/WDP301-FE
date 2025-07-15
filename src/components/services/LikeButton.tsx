import React, { useState } from 'react';
import { likeBlog } from '../../service/api/blogAPI';

interface LikeButtonProps {
  blogId: string;
  initialLikeCount: number;
  onLikeUpdate?: (newLikeCount: number) => void;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

const LikeButton: React.FC<LikeButtonProps> = ({ 
  blogId, 
  initialLikeCount, 
  onLikeUpdate,
  className = '',
  size = 'md'
}) => {
  const [likeCount, setLikeCount] = useState(initialLikeCount);
  const [isLiked, setIsLiked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleLike = async (e: React.MouseEvent) => {
    // Ngăn không cho event bubble up (để không trigger navigation)
    e.stopPropagation();
    
    if (isLoading) return;

    try {
      setIsLoading(true);
      const action = isLiked ? 'unlike' : 'like';
      const response = await likeBlog(blogId, action);
      
      if (response.success && response.data) {
        const newLikeCount = response.data.like_count;
        setLikeCount(newLikeCount);
        setIsLiked(!isLiked);
        
        // Callback để update parent component nếu cần
        if (onLikeUpdate) {
          onLikeUpdate(newLikeCount);
        }
      }
    } catch (error) {
      console.error('Error liking blog:', error);
      // Có thể thêm toast notification ở đây
    } finally {
      setIsLoading(false);
    }
  };

  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'w-4 h-4';
      case 'lg':
        return 'w-8 h-8';
      default:
        return 'w-6 h-6';
    }
  };

  const getButtonSize = () => {
    switch (size) {
      case 'sm':
        return 'px-3 py-1.5 text-sm';
      case 'lg':
        return 'px-6 py-3 text-lg';
      default:
        return 'px-4 py-2 text-base';
    }
  };

  return (
    <button
      onClick={handleLike}
      disabled={isLoading}
      className={`flex items-center space-x-2 rounded-full border transition-all duration-300 ${
        isLiked 
          ? 'bg-red-50 border-red-300 text-red-600 hover:bg-red-100' 
          : 'bg-white border-gray-300 text-gray-600 hover:bg-gray-50 hover:border-gray-400'
      } ${isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-md'} ${getButtonSize()} ${className}`}
    >
      <svg 
        className={`${getSizeClasses()} ${isLoading ? 'animate-pulse' : ''} transition-colors duration-300`}
        fill={isLiked ? 'currentColor' : 'none'} 
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
      <span className="font-medium">
        {isLiked ? 'Đã thích' : 'Thích'} ({likeCount})
      </span>
    </button>
  );
};

export default LikeButton;
