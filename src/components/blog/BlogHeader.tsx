import React from 'react';
import type { Blog } from '../../service/api/blogAPI';

interface BlogHeaderProps {
  blog: Blog;
  getValidImageUrl: (imageUrl: string, fallbackId: string) => string;
  className?: string;
}

const BlogHeader: React.FC<BlogHeaderProps> = ({ 
  blog, 
  getValidImageUrl, 
  className = '' 
}) => {
  return (
    <div className={`mb-8 ${className}`}>
      <img
        src={getValidImageUrl(blog.thumbnail_url, blog._id)}
        alt={blog.title}
        className="w-full h-64 md:h-96 object-cover rounded-lg shadow-lg"
        onError={(e) => {
          const target = e.target as HTMLImageElement;
          target.src = `https://picsum.photos/800/400?random=${blog._id}`;
        }}
      />
    </div>
  );
};

export default BlogHeader;
