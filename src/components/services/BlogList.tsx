import React, { useEffect, useState } from 'react';
import { getBlogCategories } from '../../service/api/authApi';

const ServicesList: React.FC = () => {
  const [categories, setCategories] = useState<{_id: string, name: string}[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await getBlogCategories();
        setCategories(res.data.data);
      } catch {
        setError('Không thể tải chuyên mục.');
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  const filteredCategories = categories.filter(cat =>
    cat.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

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

      {/* Categories List */}
      <div className="space-y-4">
        {loading ? (
          <div className="text-gray-500 py-2">Đang tải...</div>
        ) : error ? (
          <div className="text-red-500 py-2">{error}</div>
        ) : filteredCategories.length === 0 ? (
          <div className="text-gray-500 py-2">Không có chuyên mục nào.</div>
        ) : (
          filteredCategories.map((cat) => (
            <div
              key={cat._id}
              className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col sm:flex-row hover:shadow-lg transition-shadow duration-200"
            >
              <div className="flex items-center">
                <img
                  src={'https://via.placeholder.com/120x80?text=Blog'}
                  alt={cat.name}
                  className="w-32 h-20 object-cover rounded-md m-4 bg-gray-100"
                />
                <div className="p-4">
                  <h3 className="text-xl font-semibold mb-2">
                    {cat.name}
                  </h3>
                  <p className="text-gray-500 text-sm">Nội dung...</p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ServicesList; 