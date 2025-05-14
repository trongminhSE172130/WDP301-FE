import React from 'react';
import { motion } from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';

const BlogSection: React.FC = () => {
  // Remove duplicate blog posts to avoid repetition
  const blogPosts = [
    {
      title: "Giáo dục giới tính toàn diện",
      excerpt: "Tìm hiểu về tầm quan trọng của giáo dục giới tính và sức khỏe sinh sản trong cuộc sống hiện đại.",
      image: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8c2V4JTIwZWR1Y2F0aW9ufGVufDB8fDB8fHww&auto=format&fit=crop&w=500&q=60",
    },
    {
      title: "Hiểu về các bệnh lây truyền qua đường tình dục",
      excerpt: "Những thông tin quan trọng về các bệnh lây truyền qua đường tình dục và cách phòng ngừa hiệu quả.",
      image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8aGVhbHRoJTIwZWR1Y2F0aW9ufGVufDB8fDB8fHww&auto=format&fit=crop&w=500&q=60",
    },
    {
      title: "Kế hoạch hóa gia đình hiện đại",
      excerpt: "Các phương pháp kế hoạch hóa gia đình an toàn và hiệu quả cho các cặp đôi hiện đại.",
      image: "https://images.unsplash.com/photo-1511895426328-dc8714191300?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8ZmFtaWx5JTIwcGxhbm5pbmd8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=500&q=60",
    },
    {
      title: "Chăm sóc sức khỏe sinh sản cho phụ nữ",
      excerpt: "Hướng dẫn toàn diện về cách chăm sóc sức khỏe sinh sản ở mọi giai đoạn của cuộc đời.",
      image: "https://images.unsplash.com/photo-1593508512255-86ab42a8e620?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8d29tZW4lMjBoZWFsdGh8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=500&q=60",
    },
  ];

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
        
        <Swiper
          modules={[Pagination, Autoplay]}
          spaceBetween={30}
          slidesPerView={1}
          pagination={{ clickable: true }}
          autoplay={{ delay: 5000 }}
          breakpoints={{
            640: {
              slidesPerView: 2,
            },
            1024: {
              slidesPerView: 3,
            },
          }}
          className="blog-swiper"
        >
          {blogPosts.map((post, index) => (
            <SwiperSlide key={index} className="h-auto">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-lg shadow-md overflow-hidden h-full flex flex-col"
              >
                <div className="h-48 overflow-hidden">
                  <img 
                    src={post.image} 
                    alt={post.title} 
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                  />
                </div>
                <div className="p-6 flex flex-col flex-1 min-h-[200px]">
                  <div className="mb-3 h-[3.6em] overflow-hidden">
                    <h3 className="text-xl font-semibold line-clamp-2 h-full">{post.title}</h3>
                  </div>
                  <div className="mb-4 flex-1 min-h-[4.5em]">
                    <p className="text-gray-600 line-clamp-3">{post.excerpt}</p>
                  </div>
                  <a href="#" className="text-teal-600 font-medium hover:text-teal-700 inline-flex items-center mt-auto">
                    Đọc thêm 
                    <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                    </svg>
                  </a>
                </div>
              </motion.div>
            </SwiperSlide>
          ))}
        </Swiper>
        
        <div className="text-center mt-12">
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="border-2 border-teal-600 text-teal-600 px-6 py-3 rounded-md font-medium hover:bg-teal-600 hover:text-white transition-all"
          >
            Xem thêm bài viết
          </motion.button>
        </div>
      </div>
    </section>
  );
};

export default BlogSection;