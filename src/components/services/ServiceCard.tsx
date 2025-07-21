import React from "react";
import { motion } from "framer-motion";
import { FaStar } from "react-icons/fa";
import { Link } from "react-router-dom";

interface ServiceProps {
  service: {
    id: string;
    title: string;
    price: string;
    description: string;
    image: string;
    rating?: number;
  };
}

const ServiceCard: React.FC<ServiceProps> = ({ service }) => {
  return (
    <Link to={`/services/${service.id}`} className="block h-full">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-all flex cursor-pointer h-[250px]"
      >
        <div className="flex-1 p-6 flex flex-col justify-between">
          <div>
            <h3 className="text-xl font-semibold mb-3">{service.title}</h3>
            {service.rating !== undefined && (
              <div className="flex items-center gap-1 text-yellow-500 font-bold mb-3">
                <FaStar className="inline-block" />
                <span>{service.rating}</span>
              </div>
            )}
            <p className="text-gray-600 text-sm line-clamp-3">
              {service.description}
            </p>
          </div>
        </div>
        <div className="w-1/3 flex-shrink-0">
          <img
            src={service.image}
            alt={service.title}
            className="w-full h-full object-cover"
          />
        </div>
      </motion.div>
    </Link>
  );
};

export default ServiceCard;
