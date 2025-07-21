import React, { useState } from 'react';
import { message, Typography } from 'antd';
import AppointmentFilter from '../../components/admin/appointment/AppointmentFilter';
import AppointmentTable from '../../components/admin/appointment/AppointmentTable';
import { appointmentsData } from '../../components/admin/appointment/AppointmentData';

const { Title } = Typography;

const AppointmentPage: React.FC = () => {
  const [searchText, setSearchText] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [appointments, setAppointments] = useState(appointmentsData);

  // Xử lý tìm kiếm
  const handleSearch = () => {
    setLoading(true);
    // Giả lập gọi API tìm kiếm
    setTimeout(() => {
      // Lọc dữ liệu theo searchText nếu có
      const filteredData = searchText.trim() 
        ? appointmentsData.filter(
            item => item.patientName.toLowerCase().includes(searchText.toLowerCase())
          )
        : appointmentsData;
      
      setAppointments(filteredData);
      setLoading(false);
    }, 500);
  };

  // Xử lý đặt lại
  const handleReset = () => {
    setSearchText('');
    setAppointments(appointmentsData);
    message.success('Đã đặt lại bộ lọc');
  };

  // Xử lý thêm mới
  const handleAddNew = () => {
    message.info('Chức năng thêm mới đang được phát triển');
    // Mở form thêm mới hoặc chuyển hướng đến trang thêm mới
  };

  return (
    
    <div className="w-full">
      <Title level={2}>Quản lý cuộc hẹn</Title>
      {/* Thanh tìm kiếm và bộ lọc */}
      <AppointmentFilter 
        searchText={searchText}
        onSearchTextChange={setSearchText}
        onSearch={handleSearch}
        onReset={handleReset}
        onAddNew={handleAddNew}
        loading={loading}
      />
      
      {/* Bảng danh sách cuộc hẹn */}
      <AppointmentTable 
        data={appointments} 
        loading={loading}
        title="Quản lý cuộc hẹn"
      />
    </div>
  );
};

export default AppointmentPage;
