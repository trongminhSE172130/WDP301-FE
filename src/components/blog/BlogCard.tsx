import React from 'react';
import { useNavigate } from 'react-router-dom';
import type { Blog } from '../../service/api/blogAPI';
import { getValidImageUrl, stripHtml } from '../../utils/blogUtils';
import LikeDisplay from '../services/LikeDisplay';

interface BlogCardProps {
  blog: Blog;
  className?: string;
}

const BlogCard: React.FC<BlogCardProps> = ({ blog, className = '' }) => {
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`/blog/${blog._id}`);
  };

  const formatDateShort = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div 
      className={`bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 cursor-pointer ${className}`}
      onClick={handleCardClick}
    >
      {/* Blog Image */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={getValidImageUrl(blog.thumbnail_url, blog._id)}
          alt={blog.title}
          className="w-full h-full object-cover"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = `https://picsum.photos/400/250?random=${blog._id}`;
          }}
        />
        <div className="absolute top-4 left-4">
          <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium">
            {blog.category_id?.name || 'Chưa phân loại'}
          </span>
        </div>
      </div>

      {/* Blog Content */}
      <div className="p-6">
        {/* Title */}
        <h3 className="text-xl font-semibold text-gray-900 mb-3 line-clamp-2 hover:text-blue-600 transition-colors">
          {blog.title}
        </h3>

        {/* Excerpt */}
        <p className="text-gray-600 text-sm mb-4 line-clamp-3">
          {blog.excerpt || stripHtml(blog.content).substring(0, 150) + '...'}
        </p>

        {/* Author and Date */}
        <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-2">
              <span className="text-blue-600 font-medium text-xs">
                {blog.author?.charAt(0).toUpperCase() || 'A'}
              </span>
            </div>
            <span>{blog.author || 'Tác giả'}</span>
          </div>
          <span>{formatDateShort(blog.created_at)}</span>
        </div>

        {/* Stats */}
        <div className="flex items-center justify-between text-sm text-gray-500">
          <div className="flex items-center space-x-4">
            <span className="flex items-center">
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              {blog.view_count || 0}
            </span>
            <LikeDisplay 
              likeCount={blog.like_count || 0}
              size="sm"
            />
          </div>
          <a 
            href={`/blog/${blog._id}`}
            className="text-blue-600 hover:text-blue-800 font-medium"
            onClick={(e) => e.stopPropagation()}
          >
            Đọc thêm →
          </a>
        </div>
      </div>
    </div>
  );
};

export default BlogCard;
