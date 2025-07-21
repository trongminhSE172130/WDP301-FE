import React, { useState, useEffect } from 'react';
import { 
  Card, Table, Button, Space, Input, Select, Modal, Form, Rate, 
  Typography, Tooltip, message, Row, Col, Statistic, Switch, DatePicker 
} from 'antd';
import { 
  SearchOutlined, DeleteOutlined, EyeOutlined, 
  ExclamationCircleOutlined, ReloadOutlined, StarOutlined, CommentOutlined 
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import type { Feedback, FeedbackStatistics, FeedbackFilter } from '../../service/api/feedbackAPI';
import { 
  getAllFeedbacks, 
  getFeedbackStatistics, 
  updateFeedback, 
  deleteFeedback 
} from '../../service/api/feedbackAPI';

const { Title, Text } = Typography;
const { Option } = Select;
const { confirm } = Modal;
const { RangePicker } = DatePicker;

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
      const filters: FeedbackFilter = {
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

  // Lấy dữ liệu ban đầu
  useEffect(() => {
    fetchFeedbacks(1);
    fetchStatistics();
  }, []);

  // Xử lý phản hồi feedback
  const handleResponse = async (values: { response: string; moderation_notes?: string; status: string }) => {
    if (!selectedFeedback) return;
    
    message.loading({ content: 'Đang gửi phản hồi...', key: 'response' });
    
    try {
      const response = await updateFeedback(selectedFeedback._id, {
        admin_reply: values.response,
        status: values.status,
        moderation_notes: values.moderation_notes || ''
      });
      
      if (response.success) {
        message.success({ content: 'Đã gửi phản hồi thành công!', key: 'response' });
        
        // Cập nhật state
        setFeedbacks(prevFeedbacks => 
          prevFeedbacks.map(feedback => 
            feedback._id === selectedFeedback._id ? response.data : feedback
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
    setSelectedFeedback(feedback);
    setIsModalVisible(true);
    
    // Nếu đã có phản hồi, hiển thị trong form
    if (feedback.admin_reply) {
      responseForm.setFieldsValue({ response: feedback.admin_reply });
    } else {
      responseForm.resetFields();
    }
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

  // Định nghĩa các cột cho bảng
  const columns: ColumnsType<Feedback> = [
    {
      title: 'ID',
      dataIndex: '_id',
      key: '_id',
      width: 100,
      ellipsis: true,
      render: (id: string) => <Tooltip title={id}>{id.substring(0, 8)}...</Tooltip>
    },
    {
      title: 'Người dùng',
      dataIndex: 'user_id',
      key: 'user',
      render: (user_id) => (
        typeof user_id === 'object' ? (
          <div>
            <div>{user_id.full_name}</div>
            <Text type="secondary" className="text-xs">{user_id.email}</Text>
          </div>
        ) : 'Không xác định'
      )
    },
    {
      title: 'Dịch vụ',
      dataIndex: 'service_id',
      key: 'service',
      render: (service_id) => (
        typeof service_id === 'object' ? service_id.title : 'Không xác định'
      )
    },
    {
      title: 'Đánh giá',
      dataIndex: 'rating',
      key: 'rating',
      width: 120,
      sorter: (a, b) => a.rating - b.rating,
      render: (rating: number) => <Rate disabled defaultValue={rating} />
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      width: 120,
      render: (status: string) => {
        let color = 'default';
        let text = 'Chờ xử lý';
        
        switch(status) {
          case 'approved':
            color = 'green';
            text = 'Đã duyệt';
            break;
          case 'rejected':
            color = 'red';
            text = 'Từ chối';
            break;
          case 'hidden':
            color = 'gray';
            text = 'Ẩn';
            break;
          default:
            color = 'gold';
            text = 'Chờ xử lý';
        }
        
        return <span className={`px-2 py-1 rounded text-xs text-white bg-${color}-500`}>{text}</span>;
      }
    },
    {
      title: 'Nội dung',
      dataIndex: 'comment',
      key: 'comment',
      render: (comment) => (
        <Tooltip title={comment}>
          <div className="truncate max-w-[200px]">{comment}</div>
        </Tooltip>
      )
    },
    {
      title: 'Nổi bật',
      dataIndex: 'is_featured',
      key: 'is_featured',
      render: (is_featured, record) => (
        <Switch 
          checked={!!is_featured} 
          size="small" 
          onChange={() => handleToggleFeatured(record._id, !!is_featured)}
        />
      )
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'created_at',
      key: 'created_at',
      render: (date) => new Date(date).toLocaleDateString('vi-VN')
    },
    {
      title: 'Thao tác',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <Button 
            type="primary" 
            icon={<EyeOutlined />} 
            size="small"
            onClick={() => showResponseModal(record)}
          >
            {record.admin_reply ? 'Xem phản hồi' : 'Phản hồi'}
          </Button>
          <Button 
            danger 
            icon={<DeleteOutlined />} 
            size="small"
            onClick={() => handleDelete(record._id)}
          />
        </Space>
      )
    }
  ];

  return (
    <div>
      <Title level={2}>Quản lý Feedback</Title>
      
      {/* Thống kê */}
      <Card className="mb-4" loading={statisticsLoading}>
        <Row gutter={[16, 16]}>
          <Col span={6}>
            <Statistic 
              title="Tổng số feedback" 
              value={statistics?.total || 0} 
              prefix={<CommentOutlined />} 
            />
          </Col>
          <Col span={6}>
            <Statistic 
              title="Đánh giá trung bình" 
              value={statistics?.avg_ratings?.avg_rating?.toFixed(1) || 0} 
              prefix={<StarOutlined />} 
              suffix="/ 5"
            />
          </Col>
          <Col span={6}>
            <Statistic 
              title="Đánh giá dịch vụ" 
              value={statistics?.avg_ratings?.avg_service_quality?.toFixed(1) || 0} 
              suffix="/ 5"
            />
          </Col>
          <Col span={6}>
            <Statistic 
              title="Đánh giá tư vấn viên" 
              value={statistics?.avg_ratings?.avg_consultant?.toFixed(1) || 0} 
              suffix="/ 5"
            />
          </Col>
        </Row>
      </Card>
      
      {/* Các bộ lọc và tìm kiếm */}
      <Card className="mb-4">
        <Row gutter={[16, 16]}>
          <Col span={8}>
            <Input
              placeholder="Tìm kiếm theo nội dung, tên người dùng..."
              prefix={<SearchOutlined />}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              onPressEnter={handleSearch}
            />
          </Col>
          
          <Col span={8}>
            <Select 
              placeholder="Lọc theo đánh giá" 
              style={{ width: '100%' }}
              value={ratingFilter || undefined}
              onChange={(value) => setRatingFilter(value)}
              allowClear
            >
              <Option value={5}>5 sao</Option>
              <Option value={4}>4 sao</Option>
              <Option value={3}>3 sao</Option>
              <Option value={2}>2 sao</Option>
              <Option value={1}>1 sao</Option>
            </Select>
          </Col>
          
          <Col span={8}>
            <Select 
              placeholder="Lọc theo nổi bật" 
              style={{ width: '100%' }}
              value={featuredFilter === null ? undefined : featuredFilter}
              onChange={(value) => setFeaturedFilter(value)}
              allowClear
            >
              <Option value={true}>Nổi bật</Option>
              <Option value={false}>Không nổi bật</Option>
            </Select>
          </Col>
          
          <Col span={8}>
            <RangePicker 
              style={{ width: '100%' }}
              onChange={(dates) => {
                if (dates) {
                  setDateRange([
                    dates[0]?.format('YYYY-MM-DD') || '',
                    dates[1]?.format('YYYY-MM-DD') || ''
                  ]);
                } else {
                  setDateRange(null);
                }
              }}
            />
          </Col>
          
          <Col span={8}>
            <Space>
              <Button 
                type="primary" 
                icon={<SearchOutlined />}
                onClick={handleSearch}
              >
                Tìm kiếm
              </Button>
              
              <Button 
                icon={<ReloadOutlined />}
                onClick={handleReset}
              >
                Làm mới
              </Button>
            </Space>
          </Col>
        </Row>
      </Card>
      
      {/* Bảng dữ liệu */}
      <Card>
        <Table 
          columns={columns} 
          dataSource={feedbacks} 
          rowKey="_id"
          loading={loading}
          pagination={{
            current: currentPage,
            pageSize: pageSize,
            total: total,
            onChange: handlePageChange,
            showSizeChanger: true,
            showTotal: (total) => `Tổng ${total} mục`
          }}
        />
      </Card>
      
      {/* Modal phản hồi */}
      <Modal
        title={
          <div className="flex justify-between items-center">
            <span>Chi tiết Feedback</span>
            {selectedFeedback && (
              <div className="ml-4">
                <span className={`px-2 py-1 rounded text-xs text-white ${
                  selectedFeedback.status === 'approved' ? 'bg-green-500' :
                  selectedFeedback.status === 'rejected' ? 'bg-red-500' :
                  selectedFeedback.status === 'hidden' ? 'bg-gray-500' :
                  'bg-gold-500'
                }`}>
                  {selectedFeedback.status === 'approved' ? 'Đã duyệt' :
                   selectedFeedback.status === 'rejected' ? 'Từ chối' :
                   selectedFeedback.status === 'hidden' ? 'Ẩn' :
                   'Chờ xử lý'}
                </span>
              </div>
            )}
          </div>
        }
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={selectedFeedback?.admin_reply ? [
          <Button key="back" onClick={() => setIsModalVisible(false)}>
            Đóng
          </Button>
        ] : null}
        onOk={() => responseForm.submit()}
      >
        {selectedFeedback && (
          <div>
            <div className="mb-4">
              <div className="font-bold">Người dùng:</div>
              <div>
                {typeof selectedFeedback.user_id === 'object' 
                  ? selectedFeedback.user_id.full_name 
                  : 'Không xác định'}
              </div>
            </div>
            
            <div className="mb-4">
              <div className="font-bold">Dịch vụ:</div>
              <div>
                {typeof selectedFeedback.service_id === 'object' 
                  ? selectedFeedback.service_id.title 
                  : 'Không xác định'}
              </div>
            </div>
            
            <div className="mb-4">
              <div className="font-bold">Đánh giá:</div>
              <div>
                <Rate disabled defaultValue={selectedFeedback.rating} /> (Tổng thể)
              </div>
              <div className="mt-2">
                <div><strong>Chất lượng dịch vụ:</strong> <Rate disabled defaultValue={selectedFeedback.service_quality_rating} /></div>
                <div><strong>Tư vấn viên:</strong> <Rate disabled defaultValue={selectedFeedback.consultant_rating} /></div>
                <div><strong>Độ chính xác kết quả:</strong> <Rate disabled defaultValue={selectedFeedback.result_accuracy_rating} /></div>
              </div>
            </div>
            
            <div className="mb-4">
              <div className="font-bold">Nội dung feedback:</div>
              <div className="bg-gray-50 p-3 rounded">{selectedFeedback.comment}</div>
            </div>
            
            <div className="mb-4">
              <div className="font-bold">Ngày gửi:</div>
              <div>{new Date(selectedFeedback.created_at).toLocaleString('vi-VN')}</div>
            </div>
            
            <div className="mb-4">
              <div className="font-bold">Nổi bật:</div>
              <Switch 
                checked={!!selectedFeedback.is_featured} 
                onChange={() => handleToggleFeatured(selectedFeedback._id, !!selectedFeedback.is_featured)}
              />
            </div>
            
            {selectedFeedback.admin_reply ? (
              <div>
                <div className="font-bold">Phản hồi:</div>
                <div className="bg-blue-50 p-3 rounded">{selectedFeedback.admin_reply}</div>
                <div className="text-sm text-gray-500 mt-2">
                  Phản hồi bởi: Admin vào lúc {new Date(selectedFeedback.admin_reply_at || '').toLocaleString('vi-VN')}
                </div>
                
                {selectedFeedback.moderation_notes && (
                  <div className="mt-4">
                    <div className="font-bold">Ghi chú kiểm duyệt:</div>
                    <div className="bg-yellow-50 p-3 rounded border border-yellow-200">{selectedFeedback.moderation_notes}</div>
                  </div>
                )}
              </div>
            ) : (
              <Form
                form={responseForm}
                layout="vertical"
                onFinish={handleResponse}
              >
                <Form.Item
                  name="response"
                  label="Phản hồi của bạn"
                  rules={[{ required: true, message: 'Vui lòng nhập nội dung phản hồi!' }]}
                >
                  <Input.TextArea rows={4} placeholder="Nhập nội dung phản hồi..." />
                </Form.Item>
                
                <Form.Item
                  name="status"
                  label="Trạng thái"
                  initialValue="pending"
                >
                  <Select>
                    <Option value="pending">Chờ xử lý</Option>
                    <Option value="approved">Đã duyệt</Option>
                    <Option value="rejected">Từ chối</Option>
                    <Option value="hidden">Ẩn</Option>
                  </Select>
                </Form.Item>
                
                <Form.Item
                  name="moderation_notes"
                  label="Ghi chú kiểm duyệt (chỉ admin nhìn thấy)"
                >
                  <Input.TextArea rows={2} placeholder="Nhập ghi chú nội bộ (không hiển thị cho người dùng)..." />
                </Form.Item>
                
                <Form.Item>
                  <Button type="primary" htmlType="submit">
                    Gửi phản hồi
                  </Button>
                </Form.Item>
              </Form>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
};

export default FeedbackPage; 