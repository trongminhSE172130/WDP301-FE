import React, { useState, useEffect } from "react";
import { FaSearch } from "react-icons/fa";
import ServiceCard from "../components/services/ServiceCard";
import HeroSection from "../components/home/HeroSection";
import ServicesSection from "../components/home/ServicesSection";
import { getAllServices } from "../service/api/serviceAPI";

interface Service {
  id: string;
  title: string;
  price: string;
  description: string;
  image: string;
  rating: number | undefined;
}

const ServicePage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchServices = async () => {
      setLoading(true);
      try {
        const data = await getAllServices();
        if (data.success && Array.isArray(data.data)) {
          setServices(
            data.data.map((item) => ({
              id: item._id,
              title: item.title,
              price: "",
              description: item.description,
              image: item.image_url ? item.image_url : "",
              rating: item.rating,
            }))
          );
        }
      } finally {
        setLoading(false);
      }
    };
    fetchServices();
  }, []);

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
        {loading ? (
          <div className="text-center py-8">Đang tải dịch vụ...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            {filteredServices.map((service) => (
              <ServiceCard key={service.id} service={service} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ServicePage;
