import React, { useState, useEffect } from 'react';
import { Typography, message, Button } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { SubscriptionTable, SubscriptionSearch, SubscriptionForm, SubscriptionDetailModal, type SubscriptionPlan, type SearchFormValues, type SubscriptionFormData } from '../../components/admin/subscription';
import { getAllSubscriptionPlans, deleteSubscriptionPlan, createSubscriptionPlan, updateSubscriptionPlan, type GetSubscriptionPlansParams } from '../../service/api/subscriptionAPI';

const { Title } = Typography;

const SubscriptionPage: React.FC = () => {
  const [subscriptions, setSubscriptions] = useState<SubscriptionPlan[]>([]);
  const [loading, setLoading] = useState(false);
  const [formVisible, setFormVisible] = useState(false);
  const [formMode, setFormMode] = useState<'create' | 'edit'>('create');
  const [editingPlan, setEditingPlan] = useState<SubscriptionPlan | null>(null);
  const [formLoading, setFormLoading] = useState(false);
  
  // State cho detail modal
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan | null>(null);

  // Lấy danh sách gói đăng ký từ API
  const fetchSubscriptions = async (params?: GetSubscriptionPlansParams) => {
    try {
      setLoading(true);
      const response = await getAllSubscriptionPlans(params);
      
      if (response.success) {
        setSubscriptions(response.data);
      }
    } catch (error) {
      console.error('Error fetching subscription plans:', error);
      message.error('Có lỗi xảy ra khi tải danh sách gói đăng ký');
    } finally {
      setLoading(false);
    }
  };

  // Load subscriptions khi component mount
  useEffect(() => {
    fetchSubscriptions();
  }, []);

  // Xử lý tìm kiếm gói đăng ký
  const handleSearch = (values: SearchFormValues) => {
    console.log('Search values:', values);
    const params: GetSubscriptionPlansParams = {
      search: values.keyword,
      is_active: values.is_active
    };
    fetchSubscriptions(params);
  };

  // Xử lý reset tìm kiếm
  const handleReset = () => {
    fetchSubscriptions();
  };

  // Xử lý xóa gói đăng ký
  const handleDelete = async (subscriptionId: string) => {
    try {
      setLoading(true);
      const response = await deleteSubscriptionPlan(subscriptionId);
      
      if (response.success) {
        message.success('Xóa gói đăng ký thành công!');
        fetchSubscriptions();
      } else {
        message.error('Có lỗi xảy ra khi xóa gói đăng ký');
      }
    } catch (error) {
      console.error('Error deleting subscription plan:', error);
      message.error('Có lỗi xảy ra khi xóa gói đăng ký');
    } finally {
      setLoading(false);
    }
  };

  // Xử lý xem chi tiết gói đăng ký
  const handleViewDetail = (plan: SubscriptionPlan) => {
    setSelectedPlan(plan);
    setDetailModalVisible(true);
  };

  // Xử lý đóng detail modal
  const handleCloseDetailModal = () => {
    setDetailModalVisible(false);
    setSelectedPlan(null);
  };

  // Xử lý mở form tạo gói mới
  const handleCreatePlan = () => {
    setFormMode('create');
    setEditingPlan(null);
    setFormVisible(true);
  };

  // Xử lý mở form chỉnh sửa
  const handleEditPlan = (plan: SubscriptionPlan) => {
    setFormMode('edit');
    setEditingPlan(plan);
    setFormVisible(true);
  };

  // Xử lý đóng form
  const handleCloseForm = () => {
    setFormVisible(false);
    setEditingPlan(null);
  };

  // Xử lý submit form (tạo hoặc cập nhật)
  const handleFormSubmit = async (values: SubscriptionFormData) => {
    try {
      setFormLoading(true);
      
      if (formMode === 'create') {
        const response = await createSubscriptionPlan(values);
        if (response.success) {
          message.success('Tạo gói đăng ký thành công!');
          handleCloseForm();
          fetchSubscriptions();
        } else {
          message.error('Có lỗi xảy ra khi tạo gói đăng ký');
        }
      } else if (formMode === 'edit' && editingPlan) {
        const response = await updateSubscriptionPlan(editingPlan._id, values);
        if (response.success) {
          message.success('Cập nhật gói đăng ký thành công!');
          handleCloseForm();
          fetchSubscriptions();
        } else {
          message.error('Có lỗi xảy ra khi cập nhật gói đăng ký');
        }
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      message.error('Có lỗi xảy ra khi xử lý yêu cầu');
    } finally {
      setFormLoading(false);
    }
  };

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-6">
        <Title level={2} className="mb-0">Quản lý gói đăng ký</Title>
        <Button 
          type="primary" 
          icon={<PlusOutlined />}
          onClick={handleCreatePlan}
        >
          Tạo gói đăng ký mới
        </Button>
      </div>
      
      {/* Search Form */}
      <SubscriptionSearch 
        onSearch={handleSearch}
        onReset={handleReset}
        loading={loading}
      />
      
      {/* Subscription Table */}
      <SubscriptionTable 
        data={subscriptions} 
        onDelete={handleDelete}
        onEdit={handleEditPlan}
        onViewDetail={handleViewDetail}
        loading={loading}
      />

      {/* Form Modal */}
      <SubscriptionForm
        visible={formVisible}
        mode={formMode}
        onCancel={handleCloseForm}
        onSubmit={handleFormSubmit}
        loading={formLoading}
        initialValues={editingPlan || undefined}
      />

      {/* Detail Modal */}
      <SubscriptionDetailModal
        visible={detailModalVisible}
        onClose={handleCloseDetailModal}
        subscription={selectedPlan}
      />
    </div>
  );
};

export default SubscriptionPage;
