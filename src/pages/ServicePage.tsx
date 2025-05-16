import React, { useState } from "react";
import { FaSearch } from "react-icons/fa";
import ServiceCard from "../components/services/ServiceCard";
import HeroSection from "../components/home/HeroSection";
import ServicesSection from "../components/home/ServicesSection";

interface Service {
  id: number;
  title: string;
  price: string;
  description: string;
  image: string;
}

const ServicePage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const services: Service[] = [
    {
      id: 1,
      title: "Xét nghiệm tổng quát",
      price: "239.000đ",
      description:
        "Xét nghiệm 27 chỉ số cơ bản trong cơ thể - Xét nghiệm toàn diện về tim, gan, thận, lọc đường...",
      image: "/images/family-health.jpg",
    },
    {
      id: 2,
      title: "Xét nghiệm tổng quát",
      price: "239.000đ",
      description:
        "Xét nghiệm 27 chỉ số cơ bản trong cơ thể - Xét nghiệm toàn diện về tim, gan, thận, lọc đường...",
      image: "/images/family-health.jpg",
    },
    {
      id: 3,
      title: "Xét nghiệm tổng quát",
      price: "239.000đ",
      description:
        "Xét nghiệm 27 chỉ số cơ bản trong cơ thể - Xét nghiệm toàn diện về tim, gan, thận, lọc đường...",
      image: "/images/family-health.jpg",
    },
    {
      id: 4,
      title: "Xét nghiệm tổng quát",
      price: "239.000đ",
      description:
        "Xét nghiệm 27 chỉ số cơ bản trong cơ thể - Xét nghiệm toàn diện về tim, gan, thận, lọc đường...",
      image: "/images/family-health.jpg",
    },
    {
      id: 5,
      title: "Xét nghiệm tổng quát",
      price: "239.000đ",
      description:
        "Xét nghiệm 27 chỉ số cơ bản trong cơ thể - Xét nghiệm toàn diện về tim, gan, thận, lọc đường...",
      image: "/images/family-health.jpg",
    },
    {
      id: 6,
      title: "Xét nghiệm tổng quát",
      price: "239.000đ",
      description:
        "Xét nghiệm 27 chỉ số cơ bản trong cơ thể - Xét nghiệm toàn diện về tim, gan, thận, lọc đường...",
      image: "/images/family-health.jpg",
    },
    {
      id: 7,
      title: "Xét nghiệm tổng quát",
      price: "239.000đ",
      description:
        "Xét nghiệm 27 chỉ số cơ bản trong cơ thể - Xét nghiệm toàn diện về tim, gan, thận, lọc đường...",
      image: "/images/family-health.jpg",
    },
    {
      id: 8,
      title: "Xét nghiệm tổng quát",
      price: "239.000đ",
      description:
        "Xét nghiệm 27 chỉ số cơ bản trong cơ thể - Xét nghiệm toàn diện về tim, gan, thận, lọc đường...",
      image: "/images/family-health.jpg",
    },
    {
      id: 9,
      title: "Xét nghiệm tổng quát",
      price: "239.000đ",
      description:
        "Xét nghiệm 27 chỉ số cơ bản trong cơ thể - Xét nghiệm toàn diện về tim, gan, thận, lọc đường...",
      image: "/images/family-health.jpg",
    },
    {
      id: 10,
      title: "Xét nghiệm tổng quát",
      price: "239.000đ",
      description:
        "Xét nghiệm 27 chỉ số cơ bản trong cơ thể - Xét nghiệm toàn diện về tim, gan, thận, lọc đường...",
      image: "/images/family-health.jpg",
    },
  ];

  const filteredServices = services.filter((service) =>
    service.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Hero Section */}
      <HeroSection />
      {/* Services Section */}
      <ServicesSection />
      {/* Search Bar and Service Cards */}
      <div className="container mx-auto px-6 py-8">
        <div className="max-w-2xl mx-auto mb-12 relative">
          <input
            type="text"
            placeholder="Tìm kiếm..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full py-3 px-4 pr-12 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
          <button className="absolute right-4 top-1/2 transform -translate-y-1/2 text-teal-600">
            <FaSearch />
          </button>
        </div>

        {/* Service Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {filteredServices.map((service) => (
            <ServiceCard key={service.id} service={service} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ServicePage;
