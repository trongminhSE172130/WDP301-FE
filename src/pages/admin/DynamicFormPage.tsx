import React, { useState, useEffect } from 'react';
import { Button, message, Spin, Alert } from 'antd';
import { ArrowLeftOutlined, PlusOutlined } from '@ant-design/icons';
import DynamicFormTable from '../../components/admin/dynamicform/DynamicFormTable';
import DynamicFormRenderer from '../../components/admin/dynamicform/DynamicFormRenderer';
import DynamicFormDetailModal from '../../components/admin/dynamicform/DynamicFormDetailModal';
import type { DynamicForm, FormSubmissionData } from '../../types/dynamicForm';
import { getAllDynamicForms, submitDynamicForm, deleteDynamicForm, toggleFormStatus } from '../../service/api/dynamicformAPI';
import type { DynamicFormSearchParams } from '../../service/api/dynamicformAPI';



const DynamicFormPage: React.FC = () => {
  const [filteredForms, setFilteredForms] = useState<DynamicForm[]>([]);
  const [selectedForm, setSelectedForm] = useState<DynamicForm | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // State cho modal detail
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [detailForm, setDetailForm] = useState<DynamicForm | null>(null);

  // State cho search và filter
  const [searchQuery, setSearchQuery] = useState('');
  const [allForms, setAllForms] = useState<DynamicForm[]>([]);
  const [filters, setFilters] = useState<{ formType?: string; status?: string }>({});

  // Load forms khi component mount
  useEffect(() => {
    loadForms();
  }, []);

  // Function để load danh sách forms
  const loadForms = async (params?: DynamicFormSearchParams) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await getAllDynamicForms(params);
      
      if (response.success) {
        setFilteredForms(response.data);
        setAllForms(response.data);
      } else {
        throw new Error('Không thể tải danh sách form');
      }
    } catch (err) {
      console.error('Error loading forms:', err);
      setError(err instanceof Error ? err.message : 'Có lỗi xảy ra khi tải danh sách form');
    } finally {
      setLoading(false);
    }
  };

  // Xử lý quay lại danh sách
  const handleBackToList = () => {
    setSelectedForm(null);
  };



  // Xử lý submit form
  const handleSubmitForm = async (data: FormSubmissionData) => {
    try {
      setSubmitting(true);
      
      if (!selectedForm) {
        throw new Error('Không tìm thấy thông tin form');
      }

      const response = await submitDynamicForm(selectedForm._id, data);
      
      if (response.success) {
        message.success('Gửi thông tin thành công! Chúng tôi sẽ liên hệ với bạn sớm nhất.');
        setSelectedForm(null);
      } else {
        throw new Error('Gửi form thất bại');
      }
    } catch (err) {
      console.error('Error submitting form:', err);
      message.error(err instanceof Error ? err.message : 'Có lỗi xảy ra khi gửi thông tin. Vui lòng thử lại.');
    } finally {
      setSubmitting(false);
    }
  };

  // Xử lý xóa form
  const handleDeleteForm = async (formId: string) => {
    try {
      const response = await deleteDynamicForm(formId);
      if (response.success) {
        message.success('Xóa form thành công!');
        loadForms(); // Reload danh sách
      } else {
        throw new Error('Xóa form thất bại');
      }
    } catch (error) {
      console.error('Delete error:', error);
      message.error(error instanceof Error ? error.message : 'Có lỗi xảy ra khi xóa form!');
    }
  };

  // Xử lý toggle trạng thái form
  const handleToggleStatus = async (formId: string) => {
    try {
      const response = await toggleFormStatus(formId);
      if (response.success) {
        message.success('Cập nhật trạng thái thành công!');
        // Cập nhật state local
        setFilteredForms((prev: DynamicForm[]) => prev.map((form: DynamicForm) => 
          form._id === formId ? { ...form, is_active: !form.is_active } : form
        ));
      } else {
        throw new Error('Cập nhật trạng thái thất bại');
      }
    } catch (error) {
      console.error('Toggle status error:', error);
      message.error(error instanceof Error ? error.message : 'Có lỗi xảy ra khi cập nhật trạng thái!');
    }
  };

  // Xử lý chỉnh sửa form
  const handleEditForm = (form: DynamicForm) => {
    message.info(`Chỉnh sửa form: ${form.form_name}`);
    // TODO: Implement edit form logic
    console.log('Edit form:', form);
  };

  // Xử lý xem chi tiết form
  const handlePreviewForm = (form: DynamicForm) => {
    // Sử dụng data form hiện tại để hiển thị chi tiết
    setDetailForm(form);
    setDetailModalVisible(true);
  };

  // Xử lý đóng modal detail
  const handleCloseDetailModal = () => {
    setDetailModalVisible(false);
    setDetailForm(null);
  };

  // Xử lý thêm schema form mới
  const handleAddForm = () => {
    message.info('Chức năng thêm schema form đang được phát triển');
    // TODO: Implement add form logic
    console.log('Add new form schema');
  };

  // Xử lý search
  const handleSearch = (value: string) => {
    setSearchQuery(value);
  };

  // Xử lý filter
  const handleFilterChange = (newFilters: { formType?: string; status?: string }) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  // Effect để filter data
  React.useEffect(() => {
    let filtered = [...allForms];

    // Filter theo search query
    if (searchQuery) {
      filtered = filtered.filter(form => 
        form.form_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        form.form_description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter theo form type
    if (filters.formType) {
      filtered = filtered.filter(form => form.form_type === filters.formType);
    }

    // Filter theo status
    if (filters.status) {
      const isActive = filters.status === 'active';
      filtered = filtered.filter(form => form.is_active === isActive);
    }

    setFilteredForms(filtered);
  }, [allForms, searchQuery, filters]);

  return (
    <div className="min-h-screen bg-gray-50">
      {loading ? (
        <div className="flex justify-center items-center h-96">
          <Spin size="large" />
          <span className="ml-3 text-lg">Đang tải...</span>
        </div>
      ) : error ? (
        <div className="max-w-4xl mx-auto p-6">
          <Alert
            message="Lỗi tải dữ liệu"
            description={error}
            type="error"
            showIcon
            action={
              <Button onClick={() => window.location.reload()}>
                Thử lại
              </Button>
            }
          />
        </div>
      ) : selectedForm ? (
        // Render form được chọn
        <div>
          <div className="bg-white shadow-sm border-b px-6 py-4">
            <Button
              icon={<ArrowLeftOutlined />}
              onClick={handleBackToList}
              className="mb-2"
            >
              Quay lại danh sách
            </Button>
          </div>
          
          <DynamicFormRenderer
            form={selectedForm}
            onSubmit={handleSubmitForm}
            loading={submitting}
          />
        </div>
      ) : (
        // Render danh sách forms với search và table
        <div>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Quản lý biểu mẫu động</h2>
            <div>
              <Button
                type="primary"
                onClick={handleAddForm}
                className="h-9 rounded"
                icon={<PlusOutlined />}
              >
                Thêm Schema Form
              </Button>
            </div>
          </div>
          
                      <DynamicFormTable
            data={filteredForms}
            onDelete={handleDeleteForm}
            onToggleStatus={handleToggleStatus}
            onEdit={handleEditForm}
            onPreview={handlePreviewForm}
            onSearch={handleSearch}
            onFilterChange={handleFilterChange}
            searchQuery={searchQuery}
              loading={loading}
            />
        </div>
      )}
      
      {/* Modal chi tiết form */}
      <DynamicFormDetailModal
        visible={detailModalVisible}
        form={detailForm}
        onCancel={handleCloseDetailModal}
      />
    </div>
  );
};

export default DynamicFormPage;
