import React from 'react';
import HeroSection from '../components/home/HeroSection';
import ServicesList from '../components/services/ServicesList';

// Featured news data
const featuredNews = [
  {
    title: 'Dự phòng cúm A&B',
    date: '15/05/2025',
  },
  {
    title: 'Dự phòng cúm A&B',
    date: '15/05/2025',
  },
  {
    title: 'Dự phòng cúm A&B',
    date: '15/05/2025',
  }
];

// Categories data
const categories = [
  'Sống vui',
  'Sống vui',
  'Sống vui',
  'Sống vui'
];

const ServicesPage: React.FC = () => {
  return (
    <div>
      <HeroSection />
      
      <div className="container mx-auto px-4 py-16">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main Content - Services List (8 columns) */}
          <div className="lg:w-2/3">
            <ServicesList />
          </div>

          {/* Sidebar (4 columns) */}
          <div className="lg:w-1/3 space-y-8">
            {/* Categories Section */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold mb-4 pb-2 border-b">
                CHUYÊN MỤC
              </h2>
              <ul className="space-y-2">
                {categories.map((category, index) => (
                  <li key={index}>
                    <a 
                      href="#" 
                      className="text-gray-700 hover:text-blue-500 transition-colors duration-200 block py-2"
                    >
                      {category}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Featured News Section */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold mb-4 pb-2 border-b">
                TIN NỔI BẬT
              </h2>
              <ul className="space-y-4">
                {featuredNews.map((news, index) => (
                  <li key={index} className="border-b border-gray-100 last:border-b-0 pb-4 last:pb-0">
                    <a href="#" className="group">
                      <h3 className="font-medium text-gray-800 group-hover:text-blue-500 transition-colors duration-200">
                        {news.title}
                      </h3>
                      <p className="text-sm text-gray-500 mt-1">
                        {news.date}
                      </p>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServicesPage;