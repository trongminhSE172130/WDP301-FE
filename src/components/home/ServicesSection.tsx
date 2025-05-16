import React from "react";
import { motion } from "framer-motion";
import { FaVial, FaCalendarAlt, FaComments } from "react-icons/fa";
import { Link } from "react-router-dom";

const ServiceCard: React.FC<{
  icon: React.ReactNode;
  title: string;
  description: string;
  delay: number;
}> = ({ icon, title, description, delay }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
      className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-all"
    >
      <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mb-6 mx-auto">
        {icon}
      </div>
      <h3 className="text-xl font-semibold mb-3 text-center">{title}</h3>
      <p className="text-gray-600 text-center">{description}</p>
    </motion.div>
  );
};

const ServicesSection: React.FC = () => {
  const services = [
    {
      icon: <FaVial className="h-8 w-8 text-teal-600" />,
      title: "Xét nghiệm STIs",
      description:
        "Dịch vụ xét nghiệm các bệnh lây truyền qua đường tình dục an toàn, bảo mật và chính xác.",
    },
    {
      icon: <FaCalendarAlt className="h-8 w-8 text-teal-600" />,
      title: "Theo dõi chu kỳ",
      description:
        "Công cụ theo dõi chu kỳ kinh nguyệt, thời điểm rụng trứng và nhắc nhở uống thuốc tránh thai.",
    },
    {
      icon: <FaComments className="h-8 w-8 text-teal-600" />,
      title: "Tư vấn trực tuyến",
      description:
        "Dịch vụ tư vấn trực tuyến với các chuyên gia y tế giàu kinh nghiệm về sức khỏe sinh sản.",
    },
  ];

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl font-bold mb-4">Dịch vụ của chúng tôi</h2>
          <div className="w-24 h-1 bg-gradient-to-r from-teal-500 to-blue-500 mx-auto"></div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <ServiceCard
              key={index}
              icon={service.icon}
              title={service.title}
              description={service.description}
              delay={index * 0.2}
            />
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link
            to="/services"
            className="px-6 py-3 bg-teal-600 text-white font-medium rounded-md hover:bg-teal-700 transition-colors"
          >
            Xem tất cả dịch vụ
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
