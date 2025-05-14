import React from 'react';
import { motion } from 'framer-motion';
import { FaHospital, FaUserMd, FaLock } from 'react-icons/fa';

const AboutSection: React.FC = () => {
  const features = [
    {
      icon: <FaHospital />,
      title: "Cơ sở hiện đại",
      description: "Được trang bị thiết bị y tế hiện đại, đảm bảo chất lượng dịch vụ tốt nhất"
    },
    {
      icon: <FaUserMd />,
      title: "Đội ngũ chuyên môn cao",
      description: "Các bác sĩ và tư vấn viên có nhiều năm kinh nghiệm trong lĩnh vực sức khỏe sinh sản"
    },
    {
      icon: <FaLock />,
      title: "Bảo mật thông tin",
      description: "Cam kết bảo mật thông tin cá nhân và kết quả xét nghiệm của khách hàng"
    }
  ];

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center">
          <motion.div 
            className="md:w-1/2 mb-12 md:mb-0"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <h2 className="text-3xl font-bold mb-6">Về cơ sở y tế của chúng tôi</h2>
            <div className="w-24 h-1 bg-gradient-to-r from-teal-500 to-blue-500 mb-6"></div>
            <p className="text-gray-600 mb-6">
              Cơ sở y tế của chúng tôi chuyên cung cấp dịch vụ chăm sóc sức khỏe giới tính toàn diện, 
              với đội ngũ bác sĩ chuyên khoa giàu kinh nghiệm và cơ sở vật chất hiện đại.
            </p>
            <p className="text-gray-600 mb-8">
              Chúng tôi cam kết mang đến không gian riêng tư, an toàn để khách hàng có thể thoải mái 
              chia sẻ và nhận được tư vấn chuyên nghiệp về sức khỏe sinh sản.
            </p>
            
            <div className="space-y-4">
              {features.map((feature, index) => (
                <motion.div 
                  key={index} 
                  className="flex items-start"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.2 }}
                >
                  <div className="text-teal-600 mt-1 mr-4">
                    {feature.icon}
                  </div>
                  <div>
                    <h3 className="font-semibold">{feature.title}</h3>
                    <p className="text-gray-600 text-sm">{feature.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
            
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="mt-8 bg-teal-600 text-white px-6 py-3 rounded-md font-medium hover:bg-teal-700 transition-colors"
            >
              Tìm hiểu thêm
            </motion.button>
          </motion.div>
          
          <motion.div 
            className="md:w-1/2 flex justify-center"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <div className="relative">
              <div className="w-full max-w-md h-80 bg-teal-100 rounded-lg overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8bWVkaWNhbCUyMGNsaW5pY3xlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=500&q=60" 
                  alt="Healthcare Center"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-blue-100 rounded-lg overflow-hidden shadow-lg hidden md:block">
                <img 
                  src="https://images.unsplash.com/photo-1477332552946-cfb384aeaf1c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTZ8fGRvY3RvcnxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=500&q=60" 
                  alt="Medical Professional"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;