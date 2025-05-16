import React from "react";
import { motion } from "framer-motion";

interface ServiceProps {
  service: {
    id: number;
    title: string;
    price: string;
    description: string;
    image: string;
  };
}

const ServiceCard: React.FC<ServiceProps> = ({ service }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-all flex"
    >
      <div className="flex-1 p-6">
        <h3 className="text-xl font-semibold mb-3">{service.title}</h3>
        <div className="text-teal-600 font-bold mb-3">
          Giá chỉ từ {service.price}
        </div>
        <p className="text-gray-600 text-sm">{service.description}</p>
      </div>
      <div className="w-1/3">
        <img
          src={service.image}
          alt={service.title}
          className="w-full h-full object-cover"
        />
      </div>
    </motion.div>
  );
};

export default ServiceCard;
