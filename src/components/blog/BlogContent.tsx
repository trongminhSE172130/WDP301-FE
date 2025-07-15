import React from 'react';
import DOMPurify from 'dompurify';
import type { Blog } from '../../service/api/blogAPI';

interface BlogContentProps {
  blog: Blog;
  className?: string;
}

const BlogContent: React.FC<BlogContentProps> = ({ blog, className = '' }) => {
  // Sanitize HTML content
  const sanitizeHTML = (html: string) => {
    return DOMPurify.sanitize(html, {
      ALLOWED_TAGS: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'br', 'strong', 'em', 'u', 'a', 'img', 'ul', 'ol', 'li', 'blockquote', 'span', 'div'],
      ALLOWED_ATTR: ['href', 'src', 'alt', 'target', 'rel', 'class', 'style'],
      ALLOW_DATA_ATTR: false
    });
  };

  return (
    <div className={`bg-white rounded-lg shadow-lg p-8 ${className}`}>
      {/* Excerpt */}
      {blog.excerpt && (
        <div className="text-lg text-gray-600 italic mb-6 p-4 bg-gray-50 rounded-lg border-l-4 border-blue-500">
          {blog.excerpt}
        </div>
      )}

      {/* HTML Content */}
      <div 
        className="prose prose-lg max-w-none blog-content"
        dangerouslySetInnerHTML={{ 
          __html: sanitizeHTML(blog.content) 
        }}
      />
    </div>
  );
};

export default BlogContent;
