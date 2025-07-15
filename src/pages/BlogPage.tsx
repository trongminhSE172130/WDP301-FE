import React, { useEffect, useState } from 'react';
import HeroSection from '../components/home/HeroSection';
import BlogList from '../components/services/BlogList';
import { getBlogCategories, getBlogs } from '../service/api/blogAPI';
import type { Blog, BlogCategory } from '../service/api/blogAPI';

const BlogPage: React.FC = () => {
  const [categories, setCategories] = useState<BlogCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Featured blogs
  const [featuredBlogs, setFeaturedBlogs] = useState<Blog[]>([]);
  const [loadingBlogs, setLoadingBlogs] = useState(true);
  const [errorBlogs, setErrorBlogs] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await getBlogCategories();
        if (res.success && res.data) {
          setCategories(res.data);
        } else {
          setError('Không thể tải chuyên mục.');
        }
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
        setLoadingBlogs(true);
        const res = await getBlogs(1, 10, undefined, undefined, undefined, 'published');
        if (res.success && res.data) {
          const sorted = res.data.sort((a: Blog, b: Blog) => 
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
          );
          setFeaturedBlogs(sorted.slice(0, 5));
        } else {
          setErrorBlogs('Không thể tải tin nổi bật.');
        }
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
          {/* Main Content - Services List (8 columns) */}
          <div className="lg:w-2/3">
            <BlogList />
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
                    <li key={blog._id} className="border-b border-gray-100 last:border-b-0 pb-4 last:pb-0">
                      <div className="flex gap-3">
                        <img
                          src={blog.thumbnail_url || `https://picsum.photos/80/60?random=${blog._id}`}
                          alt={blog.title}
                          className="w-16 h-12 object-cover rounded"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = `https://picsum.photos/80/60?random=${blog._id}`;
                          }}
                        />
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-800 text-sm leading-tight mb-1">
                            <a 
                              href={`/blog/${blog._id}`}
                              className="hover:text-blue-600 transition-colors"
                            >
                              {blog.title}
                            </a>
                          </h4>
                          <div className="flex items-center justify-between text-xs text-gray-500">
                            <span>{new Date(blog.created_at).toLocaleDateString('vi-VN')}</span>
                            <span>{blog.view_count || 0} lượt xem</span>
                          </div>
                        </div>
                      </div>
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