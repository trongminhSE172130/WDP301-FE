import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { getBlogs } from '../../service/api/authApi';
import type { Blog } from '../../service/api/blogAPI';



const BlogSection: React.FC = () => {
  const navigate = useNavigate();
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        setLoading(true);
        const res = await getBlogs();
        if (res.data && res.data.data) {
          const sortedBlogs = res.data.data
            .filter((blog: Blog) => blog.status === 'published')
            .sort((a: Blog, b: Blog) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
            .slice(0, 6);
          setBlogs(sortedBlogs);
        }
      } catch (err) {
        setError('Không thể tải bài viết');
      } finally {
        setLoading(false);
      }
    };
    fetchBlogs();
  }, []);

  return (
    <section className="py-20">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl font-bold mb-4">Blog & Kiến thức</h2>
          <div className="w-24 h-1 bg-gradient-to-r from-teal-500 to-blue-500 mx-auto"></div>
          <p className="text-gray-600 mt-4 max-w-2xl mx-auto">
            Khám phá kiến thức và thông tin hữu ích về sức khỏe sinh sản và giáo dục giới tính
          </p>
        </motion.div>
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500"></div>
            <span className="ml-3 text-gray-600">Đang tải bài viết...</span>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <div className="text-red-500 mb-4">{error}</div>
            <p className="text-gray-600">Vui lòng thử lại sau</p>
          </div>
        ) : blogs.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-500 mb-4">Chưa có bài viết nào</div>
            <p className="text-gray-400">Hãy quay lại sau để xem các bài viết mới nhất</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {blogs.map((blog, index) => (
                <motion.div
                  key={blog._id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col cursor-pointer hover:shadow-lg transition-shadow"
                  onClick={() => navigate(`/blog/${blog._id}`)}
                >
                  <div className="h-48 overflow-hidden">
                    <img
                      src={blog.thumbnail_url}
                      alt={blog.title}
                      className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = "https://images.unsplash.com/photo-1576091160550-2173dba999ef?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60";
                      }}
                    />
                  </div>
                  <div className="p-6 flex flex-col flex-1 min-h-[200px]">
                    <div className="mb-3 h-[3.6em] overflow-hidden">
                      <h3 className="text-xl font-semibold line-clamp-2 h-full">{blog.title}</h3>
                    </div>
                    <div className="mb-4 flex-1 min-h-[4.5em]">
                      <p className="text-gray-600 line-clamp-3">{blog.excerpt}</p>
                    </div>
                    <a className="text-teal-600 font-medium hover:text-teal-700 inline-flex items-center mt-auto" onClick={e => {e.stopPropagation();navigate(`/blog/${blog._id}`);}}>
                      Đọc thêm
                      <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                      </svg>
                    </a>
                  </div>
                </motion.div>
              ))}
            </div>
            <div className="text-center mt-12">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/blog')}
                className="border-2 border-teal-600 text-teal-600 px-6 py-3 rounded-md font-medium hover:bg-teal-600 hover:text-white transition-all"
              >
                Xem thêm bài viết
              </motion.button>
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default BlogSection;
