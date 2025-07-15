import React, { useState, useMemo } from 'react';
import { useBlogList } from '../../hooks/useBlogList';

// Components
import SearchSection from '../blog/SearchSection';
import BlogGridSkeleton from '../blog/BlogGridSkeleton';
import BlogGrid from '../blog/BlogGrid';
import EmptyState from '../common/EmptyState';
import ErrorState from '../common/ErrorState';

const BlogList: React.FC = () => {
  const { blogs, loading, error, refetch } = useBlogList();
  const [searchQuery, setSearchQuery] = useState('');

  // Filter blogs based on search query
  const filteredBlogs = useMemo(() => {
    if (!searchQuery.trim()) return blogs;
    
    return blogs.filter(blog =>
      blog.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      blog.excerpt.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [blogs, searchQuery]);

  // Handle search change
  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
  };

  // Loading state
  if (loading) {
    return <BlogGridSkeleton />;
  }

  // Error state
  if (error) {
    return <ErrorState error={error} onRetry={refetch} />;
  }

  return (
    <div>
      {/* Search Section */}
      <SearchSection 
        searchQuery={searchQuery} 
        onSearchChange={handleSearchChange} 
      />

      {/* Blogs Grid */}
      {filteredBlogs.length === 0 ? (
        <EmptyState 
          message={searchQuery ? 'Không tìm thấy bài viết nào.' : 'Không có bài viết nào.'} 
        />
      ) : (
        <BlogGrid blogs={filteredBlogs} />
      )}
    </div>
  );
};

export default BlogList; 