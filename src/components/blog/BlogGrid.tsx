import React from 'react';
import type { Blog } from '../../service/api/blogAPI';
import BlogCard from './BlogCard';

interface BlogGridProps {
  blogs: Blog[];
  className?: string;
}

const BlogGrid: React.FC<BlogGridProps> = ({ blogs, className = '' }) => {
  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ${className}`}>
      {blogs.map((blog) => (
        <BlogCard key={blog._id} blog={blog} />
      ))}
    </div>
  );
};

export default BlogGrid;
