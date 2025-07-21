import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getBlogById } from '../service/api/authApi';

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
  admin_user_id: {
    _id: string;
    full_name: string;
    email: string;
  };
  status: string;
  view_count: number;
  like_count: number;
  created_at: string;
  updated_at: string;
}

const BlogDetail: React.FC = () => {
  const { blogId } = useParams<{ blogId: string }>();
  const [blog, setBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [blogId]);

  useEffect(() => {
    const fetchBlogDetail = async () => {
      if (!blogId) return;
      
      setLoading(true);
      setError(null);
      
      try {
        const response = await getBlogById(blogId);
        if (response.data.success) {
          setBlog(response.data.data);
        } else {
          setError('Không thể tải thông tin bài viết.');
        }
      } catch (err) {
        setError('Đã xảy ra lỗi khi tải bài viết.');
        console.error('Error fetching blog detail:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogDetail();
  }, [blogId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Đang tải bài viết...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-xl mb-4">❌</div>
          <p className="text-red-600 text-lg">{error}</p>
          <button 
            onClick={() => window.history.back()}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          >
            Quay lại
          </button>
        </div>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 text-lg">Không tìm thấy bài viết.</p>
          <button 
            onClick={() => window.history.back()}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          >
            Quay lại
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Breadcrumb */}
          <nav className="mb-6">
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <a href="/blogs" className="hover:text-blue-500">Blog</a>
              <span>›</span>
              <span className="text-gray-900">{blog.title}</span>
            </div>
          </nav>

          {/* Article Header */}
          <article className="bg-white rounded-lg shadow-md overflow-hidden">
            {/* Thumbnail */}
            {blog.thumbnail_url && (
              <div className="w-full h-64 md:h-96 overflow-hidden">
                <img
                  src={blog.thumbnail_url}
                  alt={blog.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            <div className="p-6 md:p-8">
              {/* Category Badge */}
              <div className="mb-4">
                <span className="inline-block bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full">
                  {blog.category_id.name}
                </span>
              </div>

              {/* Title */}
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 leading-tight">
                {blog.title}
              </h1>

              {/* Meta Information */}
              <div className="flex flex-wrap items-center gap-4 mb-6 text-sm text-gray-600 border-b border-gray-200 pb-4">
                <div className="flex items-center gap-2">
                  <span className="font-medium">Tác giả:</span>
                  <span>{blog.author}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-medium">Ngày đăng:</span>
                  <span>{new Date(blog.created_at).toLocaleDateString('vi-VN')}</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="flex items-center gap-1">
                    👁️ {blog.view_count}
                  </span>
                  <span className="flex items-center gap-1">
                    ❤️ {blog.like_count}
                  </span>
                </div>
              </div>

              {/* Excerpt */}
              <div className="mb-6">
                <p className="text-lg text-gray-700 italic border-l-4 border-blue-500 pl-4 bg-blue-50 p-4 rounded">
                  {blog.excerpt}
                </p>
              </div>

              {/* Content */}
              <div className="prose prose-lg max-w-none">
                <div 
                  className="text-gray-800 leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: blog.content }}
                />
              </div>

              {/* Tags/Actions */}
              <div className="mt-8 pt-6 border-t border-gray-200">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <span>Cập nhật lần cuối:</span>
                    <span>{new Date(blog.updated_at).toLocaleDateString('vi-VN')}</span>
                  </div>
                  
                  <div className="flex gap-2">
                    <button className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors text-sm">
                      ❤️ Thích ({blog.like_count})
                    </button>
                    <button 
                      onClick={() => window.history.back()}
                      className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors text-sm"
                    >
                      ← Quay lại
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </article>
        </div>
      </div>
    </div>
  );
};

export default BlogDetail;
