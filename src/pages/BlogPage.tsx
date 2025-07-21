import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import HeroSection from '../components/home/HeroSection';
import ServicesList from '../components/services/BlogList';
import { getBlogCategories, getBlogs } from '../service/api/authApi';

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

const BlogPage: React.FC = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState<{_id: string, name: string}[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // All blogs
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [featuredBlogs, setFeaturedBlogs] = useState<Blog[]>([]);
  const [loadingBlogs, setLoadingBlogs] = useState(true);
  const [errorBlogs, setErrorBlogs] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await getBlogCategories();
        setCategories(res.data.data);
      } catch {
        setError('Không thể tải chuyên mục.');
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const res = await getBlogs();
        const sorted = res.data.data.sort((a: Blog, b: Blog) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        setBlogs(sorted); // Lưu tất cả blogs
        setFeaturedBlogs(sorted.slice(0, 3)); // Lấy 3 blogs mới nhất cho sidebar
      } catch {
        setErrorBlogs('Không thể tải tin nổi bật.');
      } finally {
        setLoadingBlogs(false);
      }
    };
    fetchBlogs();
  }, []);

  return (
    <div>
      <HeroSection />
      <div className="container mx-auto px-4 py-16">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main Content - Blog List (8 columns) */}
          <div className="lg:w-2/3">
            <ServicesList blogs={blogs} loading={loadingBlogs} error={errorBlogs} />
          </div>

          {/* Sidebar (4 columns) */}
          <div className="lg:w-1/3 space-y-8">
            {/* Categories Section */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold mb-4 pb-2 border-b">
                CHUYÊN MỤC
              </h2>
              {loading ? (
                <div className="text-gray-500 py-2">Đang tải...</div>
              ) : error ? (
                <div className="text-red-500 py-2">{error}</div>
              ) : (
                <ul className="space-y-2">
                  {categories.map((category) => (
                    <li key={category._id}>
                      <a 
                        href="#" 
                        className="text-gray-700 hover:text-blue-500 transition-colors duration-200 block py-2"
                      >
                        {category.name}
                      </a>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Featured News Section */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold mb-4 pb-2 border-b">
                TIN NỔI BẬT
              </h2>
              {loadingBlogs ? (
                <div className="text-gray-500 py-2">Đang tải...</div>
              ) : errorBlogs ? (
                <div className="text-red-500 py-2">{errorBlogs}</div>
              ) : featuredBlogs.length === 0 ? (
                <div className="text-gray-500 py-2">Không có tin nổi bật.</div>
              ) : (
                <ul className="space-y-4">
                  {featuredBlogs.map((blog) => (
                    <li 
                      key={blog._id} 
                      className="border-b border-gray-100 last:border-b-0 pb-4 last:pb-0 cursor-pointer hover:bg-gray-50 p-2 rounded transition-colors"
                      onClick={() => navigate(`/blog/${blog._id}`)}
                    >
                      <h3 className="font-medium text-gray-800 hover:text-blue-600 transition-colors">
                        {blog.title}
                      </h3>
                      <p className="text-sm text-gray-500 mt-1">
                        {new Date(blog.created_at).toLocaleDateString('vi-VN')}
                      </p>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogPage;