import React from "react";

const mockServices = [
  {
    id: 1,
    name: "Gói khám sức khỏe tổng quát",
    status: "Đang sử dụng",
    purchaseDate: "2024-03-01",
    expiryDate: "2024-09-01",
    remainingUses: 4,
    totalUses: 6,
    price: "2.390.000đ",
    image:
      "https://login.medlatec.vn//ImagePath/images/20211213/20211213_y-nghia-xet-nghiem-mau-4.jpg",
  },
  {
    id: 2,
    name: "Tư vấn dinh dưỡng",
    status: "Hết hạn",
    purchaseDate: "2023-12-01",
    expiryDate: "2024-03-01",
    remainingUses: 0,
    totalUses: 12,
    price: "1.590.000đ",
    image:
      "https://login.medlatec.vn//ImagePath/images/20211213/20211213_y-nghia-xet-nghiem-mau-4.jpg",
  },
  {
    id: 3,
    name: "Gói theo dõi thai kỳ",
    status: "Sắp hết hạn",
    purchaseDate: "2024-01-15",
    expiryDate: "2024-04-15",
    remainingUses: 2,
    totalUses: 10,
    price: "3.990.000đ",
    image:
      "https://login.medlatec.vn//ImagePath/images/20211213/20211213_y-nghia-xet-nghiem-mau-4.jpg",
  },
];

const PurchasedServicesPage: React.FC = () => {
  return (
    <div className="container mx-auto px-6 py-6 bg-white rounded-4xl border border-gray-300">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 mb-2">
              Dịch vụ đã mua
            </h1>
            <p className="text-gray-600">Quản lý các gói dịch vụ của bạn</p>
          </div>
          <button className="px-4 py-2 bg-[#3B9AB8] text-white rounded-lg hover:bg-[#2d7a94] transition-colors">
            Mua thêm dịch vụ
          </button>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 gap-6">
          {mockServices.map((service) => (
            <div
              key={service.id}
              className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-300"
            >
              <div className="flex flex-col md:flex-row">
                <div className="md:w-1/4">
                  <img
                    src={service.image}
                    alt={service.name}
                    className="w-full h-48 md:h-full object-cover"
                  />
                </div>
                <div className="p-6 md:w-3/4">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-800 mb-2">
                        {service.name}
                      </h3>
                      <span
                        className={`px-3 py-1 rounded-full text-sm ${
                          service.status === "Đang sử dụng"
                            ? "bg-green-100 text-green-800"
                            : service.status === "Hết hạn"
                            ? "bg-red-100 text-red-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {service.status}
                      </span>
                    </div>
                    <p className="text-lg font-semibold text-[#3B9AB8]">
                      {service.price}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    <div>
                      <p className="text-sm text-gray-600">Ngày mua</p>
                      <p className="font-medium">{service.purchaseDate}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Ngày hết hạn</p>
                      <p className="font-medium">{service.expiryDate}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">
                        Lượt sử dụng còn lại
                      </p>
                      <p className="font-medium">
                        {service.remainingUses}/{service.totalUses}
                      </p>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
                    <div
                      className="bg-[#3B9AB8] h-2.5 rounded-full"
                      style={{
                        width: `${
                          (service.remainingUses / service.totalUses) * 100
                        }%`,
                      }}
                    ></div>
                  </div>

                  <div className="flex justify-end gap-4">
                    <button className="px-4 py-2 text-[#3B9AB8] hover:text-[#2d7a94] transition-colors border border-[#3B9AB8] rounded-lg">
                      Chi tiết →
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PurchasedServicesPage;
