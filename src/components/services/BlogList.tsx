import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface Blog {
  _id: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  category_id: {
    _id: string;
    name: string;
  };
  thumbnail_url: string;
  view_count: number;
  like_count: number;
  created_at: string;
  updated_at: string;
}

interface Props {
  blogs: Blog[];
  loading: boolean;
  error: string | null;
}

const ServicesList: React.FC<Props> = ({ blogs, loading, error }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const filteredBlogs = blogs.filter(blog =>
    blog.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    blog.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
    blog.category_id.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleBlogClick = (blogId: string) => {
    navigate(`/blog/${blogId}`);
  };

  return (
    <div>
      {/* Search Section */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-4">Danh sách bài viết</h1>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Tìm kiếm bài viết..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>
        </div>
      </div>

      {/* Blog List */}
      <div className="space-y-4">
        {loading ? (
          <div className="text-gray-500 py-2">Đang tải...</div>
        ) : error ? (
          <div className="text-red-500 py-2">{error}</div>
        ) : filteredBlogs.length === 0 ? (
          <div className="text-gray-500 py-2">Không có bài viết nào.</div>
        ) : (
          filteredBlogs.map((blog) => (
            <div
              key={blog._id}
              onClick={() => handleBlogClick(blog._id)}
              className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col sm:flex-row hover:shadow-lg cursor-pointer transform hover:scale-[1.02] transition-all duration-200"
            >
              <div className="flex items-center">
                <img
                  src={blog.thumbnail_url || 'https://via.placeholder.com/120x80?text=Blog'}
                  alt={blog.title}
                  className="w-32 h-20 object-cover rounded-md m-4 bg-gray-100"
                />
                <div className="p-4 flex-1">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-semibold text-gray-800 line-clamp-2 hover:text-blue-600 transition-colors">
                      {blog.title}
                    </h3>
                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full ml-2 flex-shrink-0">
                      {blog.category_id.name}
                    </span>
                  </div>
                  <p className="text-gray-600 text-sm mb-2 line-clamp-2">
                    {blog.excerpt}
                  </p>
                  <div className="flex justify-between items-center text-xs text-gray-500">
                    <span>Tác giả: {blog.author}</span>
                    <div className="flex gap-4">
                      <span>👁️ {blog.view_count}</span>
                      <span>❤️ {blog.like_count}</span>
                      <span>{new Date(blog.created_at).toLocaleDateString('vi-VN')}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ServicesList; 