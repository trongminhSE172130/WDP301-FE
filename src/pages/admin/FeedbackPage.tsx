import React, { useState, useEffect } from 'react';
import { Card, Form, message, Typography } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { Modal } from 'antd';
import type { Feedback, FeedbackStatistics, FeedbackFilter as ApiFeedbackFilter } from '../../service/api/feedbackAPI';
import { 
  getAllFeedbacks, 
  getFeedbackStatistics, 
  updateFeedback, 
  deleteFeedback,
  getFeedbackById
} from '../../service/api/feedbackAPI';
import FeedbackTable from '../../components/admin/feedback/FeedbackTable';
import FeedbackFilterComponent from '../../components/admin/feedback/FeedbackFilter';
import FeedbackDetailModal from '../../components/admin/feedback/FeedbackDetailModal';
import FeedbackStats from '../../components/admin/feedback/FeedbackStats';
import type { FeedbackResponseFormValues } from '../../components/admin/feedback/FeedbackTypes';

const { Title } = Typography;
const { confirm } = Modal;

const FeedbackPage: React.FC = () => {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [statistics, setStatistics] = useState<FeedbackStatistics | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [statisticsLoading, setStatisticsLoading] = useState<boolean>(true);
  const [selectedFeedback, setSelectedFeedback] = useState<Feedback | null>(null);
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [responseForm] = Form.useForm();
  const [searchText, setSearchText] = useState<string>('');
  const [ratingFilter, setRatingFilter] = useState<number | null>(null);
  const [featuredFilter, setFeaturedFilter] = useState<boolean | null>(null);
  const [serviceIdFilter, setServiceIdFilter] = useState<string>('');
  const [userIdFilter, setUserIdFilter] = useState<string>('');
  const [dateRange, setDateRange] = useState<[string, string] | null>(null);
  const [sortBy, setSortBy] = useState<string>('created_at');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [total, setTotal] = useState<number>(0);
  const [detailLoading, setDetailLoading] = useState<boolean>(false);

  // Lấy thống kê feedback
  const fetchStatistics = async () => {
    setStatisticsLoading(true);
    try {
      const response = await getFeedbackStatistics();
      if (response.success && response.data) {
        setStatistics(response.data);
      } else {
        message.error('Không thể lấy thống kê feedback');
      }
    } catch (error) {
      console.error('Error fetching feedback statistics:', error);
      message.error('Có lỗi xảy ra khi lấy thống kê feedback');
    } finally {
      setStatisticsLoading(false);
    }
  };

  // Lấy danh sách feedback từ API
  const fetchFeedbacks = async (page: number = currentPage) => {
    setLoading(true);
    try {
      const filters: ApiFeedbackFilter = {
        page,
        limit: pageSize,
        sort_by: sortBy,
        sort_order: sortOrder
      };
      
      if (ratingFilter !== null) filters.rating = ratingFilter;
      if (featuredFilter !== null) filters.is_featured = featuredFilter;
      if (searchText) filters.search = searchText;
      if (serviceIdFilter) filters.service_id = serviceIdFilter;
      if (userIdFilter) filters.user_id = userIdFilter;
      
      if (dateRange && dateRange[0] && dateRange[1]) {
        filters.date_from = dateRange[0];
        filters.date_to = dateRange[1];
      }

      const response = await getAllFeedbacks(filters);
      if (response.success) {
        setFeedbacks(response.data);
        setTotal(response.total);
        setCurrentPage(response.page);
      } else {
        message.error('Không thể lấy danh sách feedback');
      }
    } catch (error) {
      console.error('Error fetching feedbacks:', error);
      message.error('Có lỗi xảy ra khi lấy danh sách feedback');
    } finally {
      setLoading(false);
    }
  };

  // Lấy chi tiết feedback từ API
  const fetchFeedbackDetail = async (id: string) => {
    setDetailLoading(true);
    try {
      const response = await getFeedbackById(id);
      if (response.success && response.data) {
        setSelectedFeedback(response.data);
        
        // Nếu đã có phản hồi, hiển thị trong form
        if (response.data.admin_reply) {
          responseForm.setFieldsValue({ 
            response: response.data.admin_reply,
            status: response.data.status || 'pending',
            moderation_notes: response.data.moderation_notes || ''
          });
        } else {
          responseForm.resetFields();
          responseForm.setFieldsValue({ status: response.data.status || 'pending' });
        }
      } else {
        message.error('Không thể lấy chi tiết feedback');
      }
    } catch (error) {
      console.error('Error fetching feedback detail:', error);
      message.error('Có lỗi xảy ra khi lấy chi tiết feedback');
    } finally {
      setDetailLoading(false);
    }
  };

  // Lấy dữ liệu ban đầu
  useEffect(() => {
    fetchFeedbacks(1);
    fetchStatistics();
  }, []);

  // Xử lý phản hồi feedback
  const handleResponse = async (values: FeedbackResponseFormValues) => {
    if (!selectedFeedback) return;
    
    message.loading({ content: 'Đang gửi phản hồi...', key: 'response' });
    
    try {
      const response = await updateFeedback(selectedFeedback._id, {
        admin_reply: values.response,
        status: values.status,
        moderation_notes: values.moderation_notes || ''
      });
      
      if (response.success && response.data) {
        message.success({ content: 'Đã gửi phản hồi thành công!', key: 'response' });
        
        // Cập nhật state
        setFeedbacks(prevFeedbacks => 
          prevFeedbacks.map(feedback => 
            feedback._id === selectedFeedback._id ? response.data! : feedback
          )
        );
        
        setIsModalVisible(false);
        responseForm.resetFields();
        fetchStatistics(); // Cập nhật thống kê
      } else {
        message.error({ content: 'Không thể gửi phản hồi', key: 'response' });
      }
    } catch (error) {
      console.error('Error responding to feedback:', error);
      message.error({ content: 'Có lỗi xảy ra khi gửi phản hồi', key: 'response' });
    }
  };

  // Xử lý xóa feedback
  const handleDelete = (id: string) => {
    confirm({
      title: 'Bạn có chắc chắn muốn xóa feedback này?',
      icon: <ExclamationCircleOutlined />,
      content: 'Hành động này không thể hoàn tác.',
      okText: 'Xóa',
      okType: 'danger',
      cancelText: 'Hủy',
      onOk: async () => {
        message.loading({ content: 'Đang xóa...', key: 'delete' });
        
        try {
          const response = await deleteFeedback(id);
          
          if (response.success) {
            message.success({ content: 'Đã xóa feedback thành công!', key: 'delete' });
            setFeedbacks(prevFeedbacks => prevFeedbacks.filter(feedback => feedback._id !== id));
            fetchStatistics(); // Cập nhật thống kê
          } else {
            message.error({ content: response.message || 'Không thể xóa feedback', key: 'delete' });
          }
        } catch (error) {
          console.error('Error deleting feedback:', error);
          message.error({ content: 'Có lỗi xảy ra khi xóa feedback', key: 'delete' });
        }
      }
    });
  };

  // Xử lý đánh dấu nổi bật
  const handleToggleFeatured = async (id: string, featured: boolean) => {
    try {
      message.loading({ content: 'Đang cập nhật...', key: 'featured' });
      
      const response = await updateFeedback(id, {
        is_featured: !featured
      });
      
      if (response.success) {
        message.success({ 
          content: !featured ? 'Đã đánh dấu nổi bật!' : 'Đã bỏ đánh dấu nổi bật!', 
          key: 'featured' 
        });
        
        // Cập nhật state
        setFeedbacks(prevFeedbacks => 
          prevFeedbacks.map(feedback => 
            feedback._id === id 
              ? { ...feedback, is_featured: !featured } 
              : feedback
          )
        );
      } else {
        message.error({ content: 'Không thể cập nhật trạng thái', key: 'featured' });
      }
    } catch (error) {
      console.error('Error toggling featured status:', error);
      message.error({ content: 'Có lỗi xảy ra khi cập nhật trạng thái', key: 'featured' });
    }
  };

  // Xử lý xem chi tiết và phản hồi
  const showResponseModal = (feedback: Feedback) => {
    setSelectedFeedback(null); // Reset trước khi lấy dữ liệu mới
    setIsModalVisible(true);
    fetchFeedbackDetail(feedback._id);
  };

  // Xử lý thay đổi trang
  const handlePageChange = (page: number, pageSize?: number) => {
    if (pageSize) setPageSize(pageSize);
    setCurrentPage(page);
    fetchFeedbacks(page);
  };

  // Xử lý tìm kiếm
  const handleSearch = () => {
    setCurrentPage(1);
    fetchFeedbacks(1);
  };

  // Xử lý reset bộ lọc
  const handleReset = () => {
    setSearchText('');
    setRatingFilter(null);
    setFeaturedFilter(null);
    setServiceIdFilter('');
    setUserIdFilter('');
    setDateRange(null);
    setSortBy('created_at');
    setSortOrder('desc');
    setCurrentPage(1);
    fetchFeedbacks(1);
    fetchStatistics();
  };

  return (
    <div>
      <Title level={2}>Quản lý Feedback</Title>
      
      {/* Thống kê */}
      <FeedbackStats statistics={statistics} loading={statisticsLoading} />
      
      {/* Các bộ lọc và tìm kiếm */}
      <Card className="mb-4">
        <FeedbackFilterComponent 
          searchText={searchText}
          ratingFilter={ratingFilter}
          featuredFilter={featuredFilter}
          dateRange={dateRange}
          onSearchTextChange={setSearchText}
          onRatingFilterChange={setRatingFilter}
          onFeaturedFilterChange={setFeaturedFilter}
          onDateRangeChange={setDateRange}
          onSearch={handleSearch}
          onReset={handleReset}
        />
      </Card>
      
      {/* Bảng dữ liệu */}
      <Card>
        <FeedbackTable 
          feedbacks={feedbacks}
          loading={loading}
          currentPage={currentPage}
          pageSize={pageSize}
          total={total}
          onPageChange={handlePageChange}
          onViewDetail={showResponseModal}
          onDelete={handleDelete}
          onToggleFeatured={handleToggleFeatured}
        />
      </Card>
      
      {/* Modal phản hồi */}
      <FeedbackDetailModal 
        visible={isModalVisible}
        loading={detailLoading}
        feedback={selectedFeedback}
        form={responseForm}
        onCancel={() => setIsModalVisible(false)}
        onSubmit={(values) => handleResponse(values)}
        onToggleFeatured={handleToggleFeatured}
      />
    </div>
  );
};

export default FeedbackPage; 