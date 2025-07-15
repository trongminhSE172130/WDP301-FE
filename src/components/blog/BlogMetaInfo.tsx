import React from 'react';
import type { Blog } from '../../service/api/blogAPI';
import LikeDisplay from '../services/LikeDisplay';

interface BlogMetaInfoProps {
  blog: Blog;
  formatDate: (dateString: string) => string;
  className?: string;
}

const BlogMetaInfo: React.FC<BlogMetaInfoProps> = ({ 
  blog, 
  formatDate, 
  className = '' 
}) => {
  return (
    <div className={`flex flex-wrap items-center gap-6 text-sm text-gray-500 mb-6 ${className}`}>
      <div className="flex items-center">
        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
          <span className="text-blue-600 font-medium">
            {blog.author?.charAt(0).toUpperCase() || 'A'}
          </span>
        </div>
        <div>
          <div className="font-medium text-gray-900">{blog.author || 'Tác giả'}</div>
          <div>{formatDate(blog.created_at)}</div>
        </div>
      </div>
      
      <div className="flex items-center space-x-4">
        <span className="flex items-center">
          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
          {blog.view_count || 0} lượt xem
        </span>
        <LikeDisplay 
          likeCount={blog.like_count || 0}
          size="md"
          className="text-gray-500"
        />
      </div>
    </div>
  );
};

export default BlogMetaInfo;
