import React from 'react';

const mockCycleData = {
  currentCycle: {
    startDate: '2024-03-15',
    predictedEndDate: '2024-03-21',
    day: 5,
    totalDays: 7,
  },
  averageCycle: {
    length: 28,
    period: 5,
  },
  symptoms: [
    { date: '2024-03-15', type: 'Đau bụng', severity: 'Nhẹ' },
    { date: '2024-03-16', type: 'Mệt mỏi', severity: 'Trung bình' },
    { date: '2024-03-17', type: 'Đau đầu', severity: 'Nặng' },
  ],
  nextPeriod: '2024-04-12',
  fertileDays: {
    start: '2024-03-26',
    end: '2024-03-31',
  }
};

const CycleTrackingPage: React.FC = () => {
  return (
    <div className="container mx-auto px-6 py-6 bg-white rounded-4xl border border-gray-300">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Theo dõi chu kỳ kinh nguyệt</h1>
          <p className="text-gray-600">Theo dõi và dự đoán chu kỳ kinh nguyệt của bạn</p>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Current Cycle Status */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Chu kỳ hiện tại</h2>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <p className="text-sm text-gray-600">Ngày bắt đầu</p>
                  <p className="text-lg font-medium text-[#3B9AB8]">{mockCycleData.currentCycle.startDate}</p>
                </div>
                <div className="text-center">
                  <div className="w-20 h-20 rounded-full bg-[#3B9AB8] text-white flex items-center justify-center mb-2">
                    <div>
                      <div className="text-2xl font-bold">{mockCycleData.currentCycle.day}</div>
                      <div className="text-xs">Ngày {mockCycleData.currentCycle.totalDays}</div>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600">Chu kỳ hiện tại</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600">Dự kiến kết thúc</p>
                  <p className="text-lg font-medium text-[#3B9AB8]">{mockCycleData.currentCycle.predictedEndDate}</p>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
                <div 
                  className="bg-[#3B9AB8] h-2.5 rounded-full"
                  style={{ width: `${(mockCycleData.currentCycle.day / mockCycleData.currentCycle.totalDays) * 100}%` }}
                ></div>
              </div>
            </div>

            {/* Calendar Section */}
            <div className="bg-white rounded-lg shadow-md p-6 mt-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Lịch theo dõi</h2>
              {/* Calendar component would go here */}
              <div className="h-64 border border-gray-200 rounded-lg flex items-center justify-center text-gray-500">
                Calendar Component
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Statistics */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Thống kê</h2>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-600">Chu kỳ trung bình</p>
                  <p className="text-lg font-medium">{mockCycleData.averageCycle.length} ngày</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Thời gian kinh nguyệt</p>
                  <p className="text-lg font-medium">{mockCycleData.averageCycle.period} ngày</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Chu kỳ tiếp theo</p>
                  <p className="text-lg font-medium text-[#3B9AB8]">{mockCycleData.nextPeriod}</p>
                </div>
              </div>
            </div>

            {/* Symptoms Tracking */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Triệu chứng gần đây</h2>
              <div className="space-y-3">
                {mockCycleData.symptoms.map((symptom, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-800">{symptom.type}</p>
                      <p className="text-sm text-gray-600">{symptom.date}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm ${
                      symptom.severity === 'Nhẹ' ? 'bg-green-100 text-green-800' :
                      symptom.severity === 'Trung bình' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {symptom.severity}
                    </span>
                  </div>
                ))}
              </div>
              <button className="w-full mt-4 px-4 py-2 bg-[#3B9AB8] text-white rounded-lg hover:bg-[#2d7a94] transition-colors">
                Thêm triệu chứng
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CycleTrackingPage; 