import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-800 text-white py-12">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">HealthCare Center</h3>
            <p className="text-gray-400">Chăm sóc sức khỏe sinh sản toàn diện, an toàn và riêng tư.</p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Dịch vụ</h3>
            <ul className="space-y-2 text-gray-400">
              <li><a href="#" className="hover:text-white">Xét nghiệm STIs</a></li>
              <li><a href="#" className="hover:text-white">Theo dõi chu kỳ</a></li>
              <li><a href="#" className="hover:text-white">Tư vấn trực tuyến</a></li>
              <li><a href="#" className="hover:text-white">Đặt câu hỏi</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Liên kết</h3>
            <ul className="space-y-2 text-gray-400">
              <li><a href="#" className="hover:text-white">Trang chủ</a></li>
              <li><a href="#" className="hover:text-white">Về chúng tôi</a></li>
              <li><a href="#" className="hover:text-white">Blog</a></li>
              <li><a href="#" className="hover:text-white">Liên hệ</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Liên hệ</h3>
            <ul className="space-y-2 text-gray-400">
              <li>123 Đường Xyz, Quận ABC</li>
              <li>contact@healthcare.com</li>
              <li>(+84) 123 456 789</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
          <p>© {new Date().getFullYear()} HealthCare Center. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;