import React from 'react';

const mockConsultations = [
  {
    id: 1,
    doctor: {
      name: 'Steve Stewart',
      avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
      specialty: 'Tư vấn chung'
    },
    date: '25/04/2025',
    time: '09:00 - 10:00',
    status: 'Hoàn thành',
    notes: '2 tháng / 1 lần'
  },
  {
    id: 2,
    doctor: {
      name: 'Lauren Williamson',
      avatar: 'https://randomuser.me/api/portraits/women/45.jpg',
      specialty: 'Sản phụ khoa'
    },
    date: '25/04/2025',
    time: '10:30 - 11:30',
    status: 'Đã hủy',
    notes: '3 tháng / 1 lần'
  },
  {
    id: 3,
    doctor: {
      name: 'Tay Atakora',
      avatar: 'https://randomuser.me/api/portraits/men/22.jpg',
      specialty: 'Nhi khoa'
    },
    date: '25/04/2025',
    time: '13:00 - 14:00',
    status: 'Chờ khám',
    notes: '1 tháng / 1 lần'
  },
  {
    id: 4,
    doctor: {
      name: 'Albert Francis',
      avatar: 'https://randomuser.me/api/portraits/men/55.jpg',
      specialty: 'Tim mạch'
    },
    date: '25/04/2025',
    time: '15:00 - 16:00',
    status: 'Sắp tới',
    notes: '6 tháng / 1 lần'
  }
];

const ConsultationHistoryPage: React.FC = () => {
  return (
    <div className="container mx-auto px-6 py-6 bg-white rounded-4xl border border-gray-300">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-gray-800">Lịch sử tư vấn</h1>
          <div className="flex gap-4">
            <select className="px-6 py-2 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#3B9AB8] font-medium">
              <option>Ngày 25 tháng 4</option>
              <option>Tháng này</option>
              <option>3 tháng gần đây</option>
            </select>
            <button className="px-4 py-2 bg-[#3B9AB8] text-white rounded-2xl hover:bg-[#2d7a94] transition-colors font-medium">
              Cuộc hẹn mới
            </button>
          </div>
        </div>

        {/* Consultation List */}
        <div className="space-y-6">
          {/* Today's Consultations */}
          <div>
            <h2 className="text-lg font-semibold text-gray-700 mb-4">Hôm nay</h2>
            <div className="space-y-4">
              {mockConsultations.map((consultation) => (
                <div 
                  key={consultation.id}
                  className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow border border-gray-300"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <img
                        src={consultation.doctor.avatar}
                        alt={consultation.doctor.name}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                      <div>
                        <h3 className="font-semibold text-gray-800">
                          {consultation.doctor.name}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {consultation.doctor.specialty}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-600">
                        {consultation.date}
                      </p>
                      <p className="text-sm font-medium text-[#3B9AB8]">
                        {consultation.time}
                      </p>
                    </div>
                  </div>
                  <div className="mt-4 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className={`px-3 py-1 rounded-full text-sm ${
                        consultation.status === 'Hoàn thành' ? 'bg-green-100 text-green-800' :
                        consultation.status === 'Đã hủy' ? 'bg-red-100 text-red-800' :
                        consultation.status === 'Chờ khám' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-blue-100 text-blue-800'
                      }`}>
                        {consultation.status}
                      </span>
                      <span className="text-sm text-gray-600">
                        {consultation.notes}
                      </span>
                    </div>
                    <button className="text-[#3B9AB8] hover:text-[#2d7a94] transition-colors border border-[#3B9AB8] rounded-lg px-4 py-2">
                      Chi tiết →
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConsultationHistoryPage; 