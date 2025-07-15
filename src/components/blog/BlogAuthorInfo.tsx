import React from 'react';
import type { Blog } from '../../service/api/blogAPI';
import LikeButton from '../services/LikeButton';

interface BlogAuthorInfoProps {
  blog: Blog;
  formatDate: (dateString: string) => string;
  onLikeUpdate: (newCount: number) => void;
  className?: string;
}

const BlogAuthorInfo: React.FC<BlogAuthorInfoProps> = ({ 
  blog, 
  formatDate, 
  onLikeUpdate,
  className = '' 
}) => {
  return (
    <div className={`mt-12 pt-8 border-t border-gray-200 ${className}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mr-4">
            <span className="text-blue-600 font-bold text-xl">
              {blog.author?.charAt(0).toUpperCase() || 'A'}
            </span>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{blog.author || 'Tác giả'}</h3>
            <p className="text-gray-600">
              Xuất bản ngày {formatDate(blog.created_at)}
            </p>
            {blog.admin_user_id && (
              <p className="text-sm text-gray-500">
                Quản lý bởi: {blog.admin_user_id.full_name}
              </p>
            )}
          </div>
        </div>
        
        {/* Like Button */}
        <LikeButton
          blogId={blog._id}
          initialLikeCount={blog.like_count || 0}
          size="md"
          onLikeUpdate={onLikeUpdate}
        />
      </div>
    </div>
  );
};

export default BlogAuthorInfo;
