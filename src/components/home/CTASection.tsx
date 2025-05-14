import React from 'react';
import { motion } from 'framer-motion';
import { FaUserPlus, FaHeadset } from 'react-icons/fa';

const CTASection: React.FC = () => {
  return (
    <section className="py-20 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-10">
        <div className="absolute top-0 left-[10%] w-64 h-64 rounded-full bg-white"></div>
        <div className="absolute bottom-0 right-[10%] w-96 h-96 rounded-full bg-white"></div>
      </div>
      
      <div className="container mx-auto px-6 text-center relative z-10">
        <motion.h2 
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-3xl md:text-4xl font-bold mb-6"
        >
          Bắt đầu chăm sóc sức khỏe sinh sản ngay hôm nay
        </motion.h2>
        
        <motion.p 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="text-xl mb-12 max-w-2xl mx-auto"
        >
          Đăng ký tài khoản để sử dụng các dịch vụ theo dõi chu kỳ, đặt lịch tư vấn và xét nghiệm STIs.
        </motion.p>
        
        <div className="flex flex-col md:flex-row justify-center gap-6 max-w-3xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="bg-white bg-opacity-10 backdrop-blur-sm rounded-xl p-8 flex-1"
          >
            <div className="bg-white bg-opacity-20 w-16 h-16 rounded-full flex items-center justify-center mb-6 mx-auto">
              <FaUserPlus className="h-8 w-8" />
            </div>
            <h3 className="text-xl font-semibold mb-4">Đăng ký tài khoản</h3>
            <p className="text-white text-opacity-80 mb-6">
              Tạo tài khoản miễn phí để truy cập đầy đủ các dịch vụ và tính năng theo dõi sức khỏe
            </p>
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-white text-purple-600 px-6 py-3 rounded-md font-medium hover:bg-opacity-90 transition-all w-full"
            >
              Đăng ký ngay
            </motion.button>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.6 }}
            className="bg-white bg-opacity-10 backdrop-blur-sm rounded-xl p-8 flex-1"
          >
            <div className="bg-white bg-opacity-20 w-16 h-16 rounded-full flex items-center justify-center mb-6 mx-auto">
              <FaHeadset className="h-8 w-8" />
            </div>
            <h3 className="text-xl font-semibold mb-4">Liên hệ tư vấn</h3>
            <p className="text-white text-opacity-80 mb-6">
              Đội ngũ tư vấn viên chuyên nghiệp luôn sẵn sàng giải đáp mọi thắc mắc của bạn
            </p>
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-transparent border-2 border-white px-6 py-3 rounded-md font-medium hover:bg-white hover:bg-opacity-10 transition-all w-full"
            >
              Liên hệ ngay
            </motion.button>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;