import React, { useState, useEffect } from 'react';
import { Typography, message } from 'antd';
import BookingTable from '../../components/admin/booking/BookingTable';
import type { Booking } from '../../components/admin/booking/BookingTypes';
import BookingSearch from '../../components/admin/booking/BookingSearch';
import type { SearchFormValues } from '../../components/admin/booking/BookingSearch';
import { getAllBookings, deleteBooking, type GetBookingsParams, type BookingPagination } from '../../service/api/bookingAPI';
import { getAllUsers } from '../../service/api/userAPI';
  
const { Title } = Typography;

// Danh sách trạng thái
const statuses = ['pending', 'confirmed', 'completed', 'cancelled', 'processing'];

const BookingManagerPage: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState<BookingPagination>({
    currentPage: 1,
    totalPages: 1,
    totalBookings: 0,
    hasNext: false,
    hasPrev: false
  });
  const [currentPageSize, setCurrentPageSize] = useState(10);
  const [consultants, setConsultants] = useState<{ id: string; name: string }[]>([]);

  // Lấy danh sách consultants
  const fetchConsultants = async () => {
    try {
      const response = await getAllUsers({ role: 'consultant', limit: 100 });
      if (response.success) {
        const consultantList = response.data.map(user => ({
          id: user._id,
          name: user.full_name
        }));
        setConsultants(consultantList);
      }
    } catch (error) {
      console.error('Error fetching consultants:', error);
    }
  };

  // Lấy danh sách bookings từ API
  const fetchBookings = async (params?: GetBookingsParams) => {
    try {
      setLoading(true);
      const response = await getAllBookings(params);
      
      if (response.success) {
        setBookings(response.data);
        setPagination(response.pagination);
      }
    } catch (error) {
      console.error('Error fetching bookings:', error);
      message.error('Có lỗi xảy ra khi tải danh sách lịch hẹn');
    } finally {
      setLoading(false);
    }
  };

  // Load bookings và consultants khi component mount
  useEffect(() => {
    fetchBookings({ page: 1, limit: currentPageSize });
    fetchConsultants();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Xử lý phân trang
  const handlePageChange = (page: number, pageSize?: number) => {
    console.log('handlePageChange called:', { page, pageSize, currentPageSize });
    
    if (pageSize && pageSize !== currentPageSize) {
      // Khi thay đổi page size, reset về trang 1
      setCurrentPageSize(pageSize);
      fetchBookings({ page: 1, limit: pageSize });
    } else {
      // Chỉ thay đổi page
      fetchBookings({ page, limit: currentPageSize });
    }
  };

  // Xử lý tìm kiếm lịch hẹn
  const handleSearch = (values: SearchFormValues) => {
    const params: GetBookingsParams = {
      page: 1,
      limit: currentPageSize,
      search: values.keyword,
      status: values.status,
      consultant: values.consultant,
      date: values.date
    };
    fetchBookings(params);
  };

  // Xử lý reset tìm kiếm
  const handleReset = () => {
    fetchBookings({ page: 1, limit: currentPageSize });
  };

  // Xử lý xóa lịch hẹn
  const handleDelete = async (bookingId: string) => {
    try {
      setLoading(true);
      const response = await deleteBooking(bookingId);
      
      if (response.success) {
        message.success('Xóa lịch hẹn thành công!');
        // Refresh danh sách
        fetchBookings({ page: pagination.currentPage, limit: currentPageSize });
      }
    } catch (error) {
      console.error('Error deleting booking:', error);
      message.error('Có lỗi xảy ra khi xóa lịch hẹn');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full">
      <Title level={2}>Quản lý lịch hẹn đã đặt</Title>
      
      {/* Search Form */}
      <BookingSearch 
        onSearch={handleSearch}
        onReset={handleReset}
        statuses={statuses}
        consultants={consultants}
        loading={loading}
      />
      
      {/* Booking Table */}
      <BookingTable 
        data={bookings} 
        onDelete={handleDelete}
        loading={loading}
        pagination={pagination}
        onPageChange={handlePageChange}
        currentPageSize={currentPageSize}
      />
    </div>
  );
};

export default BookingManagerPage;
