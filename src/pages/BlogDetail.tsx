import React from 'react';
import { useParams } from 'react-router-dom';
import { useBlogDetail } from '../hooks/useBlogDetail';
import { formatDate, getValidImageUrl } from '../utils/blogUtils';

// Components
import LoadingSkeleton from '../components/common/LoadingSkeleton';
import ErrorState from '../components/common/ErrorState';
import Breadcrumb from '../components/common/Breadcrumb';
import BlogMetaInfo from '../components/blog/BlogMetaInfo';
import BlogHeader from '../components/blog/BlogHeader';
import BlogContent from '../components/blog/BlogContent';
import BlogAuthorInfo from '../components/blog/BlogAuthorInfo';
import BlogNavigation from '../components/blog/BlogNavigation';

const BlogDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { blog, loading, error, setBlog, refetch } = useBlogDetail(id);

  // Handle like count update
  const handleLikeUpdate = (newCount: number) => {
    setBlog(prev => prev ? { ...prev, like_count: newCount } : null);
  };

  // Loading state
  if (loading) {
    return <LoadingSkeleton />;
  }

  // Error state
  if (error || !blog) {
    return <ErrorState error={error || 'Không tìm thấy bài viết'} onRetry={refetch} />;
  }

  // Breadcrumb items
  const breadcrumbItems = [
    { label: 'Trang chủ', href: '/' },
    { label: 'Blog', href: '/blog' },
    { label: blog.title }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-white">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            {/* Breadcrumb */}
            <Breadcrumb items={breadcrumbItems} />

            {/* Category */}
            <div className="mb-4">
              <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                {blog.category_id?.name || 'Chưa phân loại'}
              </span>
            </div>

            {/* Title */}
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 leading-tight">
              {blog.title}
            </h1>

            {/* Meta Info */}
            <BlogMetaInfo blog={blog} formatDate={formatDate} />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Featured Image */}
          <BlogHeader blog={blog} getValidImageUrl={getValidImageUrl} />

          {/* Article Content */}
          <BlogContent blog={blog} />

          {/* Author Info with Like Button */}
          <BlogAuthorInfo 
            blog={blog} 
            formatDate={formatDate} 
            onLikeUpdate={handleLikeUpdate} 
          />

          {/* Navigation */}
          <BlogNavigation />
        </div>
      </div>
    </div>
  );
};

export default BlogDetail;
