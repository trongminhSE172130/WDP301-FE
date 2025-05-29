import React, { useState } from 'react';

// Mock data for services
const mockServices = [
  {
    id: 1,
    title: 'Xét nghiệm tổng quát',
    price: '239.000đ',
    description: 'Xét nghiệm sức khỏe tổng quát, kiểm tra các chỉ số cơ bản và đánh giá tình trạng sức khỏe.',
    imageUrl: 'https://login.medlatec.vn//ImagePath/images/20211213/20211213_y-nghia-xet-nghiem-mau-4.jpg'
  },
  {
    id: 2,
    title: 'Xét nghiệm tổng quát',
    price: '239.000đ',
    description: 'Xét nghiệm sức khỏe tổng quát, kiểm tra các chỉ số cơ bản và đánh giá tình trạng sức khỏe.',
    imageUrl: 'https://login.medlatec.vn//ImagePath/images/20211213/20211213_y-nghia-xet-nghiem-mau-4.jpg'
  },
  {
    id: 3,
    title: 'Xét nghiệm tổng quát',
    price: '239.000đ',
    description: 'Xét nghiệm sức khỏe tổng quát, kiểm tra các chỉ số cơ bản và đánh giá tình trạng sức khỏe.',
    imageUrl: 'https://login.medlatec.vn//ImagePath/images/20211213/20211213_y-nghia-xet-nghiem-mau-4.jpg'
  },
  // Add more mock services as needed
];

const ServicesList: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div>
      {/* Search Section */}
      <div className="mb-8">
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Tìm kiếm..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>
        </div>
      </div>

      {/* Services List */}
      <div className="space-y-4">
        {mockServices.map((service) => (
          <div 
            key={service.id}
            className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col sm:flex-row hover:shadow-lg transition-shadow duration-200"
          >
            <div className="sm:w-1/3">
              <img
                className="w-full h-48 sm:h-full object-cover"
                src={service.imageUrl}
                alt={service.title}
              />
            </div>
            <div className="p-6 sm:w-2/3">
              <h3 className="text-xl font-semibold mb-2">
                {service.title}
              </h3>
              <p className="text-xl text-blue-500 font-semibold mb-2">
                Giá chỉ từ {service.price}
              </p>
              <p className="text-gray-600">
                {service.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ServicesList; 