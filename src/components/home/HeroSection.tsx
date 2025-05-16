import React from "react";
import { motion } from "framer-motion";

const HeroSection: React.FC = () => {
  return (
    <section className="bg-gradient-to-r from-teal-600 via-cyan-500 to-blue-500 text-white py-20">
      <div className="container mx-auto px-6 flex flex-col items-center">
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl font-bold mb-6 text-center"
        >
          Chăm sóc sức khỏe sinh sản toàn diện
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-xl mb-8 max-w-2xl text-center"
        >
          Chúng tôi cung cấp dịch vụ chăm sóc sức khỏe giới tính chuyên nghiệp,
          an toàn và riêng tư cho mọi người.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="flex gap-4"
        >
          <button className="bg-white text-teal-600 px-6 py-3 rounded-md font-medium hover:bg-opacity-90 transition-all">
            Đặt lịch ngay
          </button>
          <button className="bg-transparent border-2 border-white px-6 py-3 rounded-md font-medium hover:bg-white hover:bg-opacity-10 transition-all">
            Tìm hiểu thêm
          </button>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
