import React, { useState, useEffect } from 'react';
import { Button, message, Spin, Alert, Typography } from 'antd';
import { ArrowLeftOutlined, PlusOutlined } from '@ant-design/icons';
import DynamicFormTable from '../../components/admin/dynamicform/DynamicFormTable';
import DynamicFormRenderer from '../../components/admin/dynamicform/DynamicFormRenderer';
import DynamicFormDetailModal from '../../components/admin/dynamicform/DynamicFormDetailModal';
import DynamicFormCreator from '../../components/admin/dynamicform/DynamicFormCreator';
import DynamicFormSearch from '../../components/admin/dynamicform/DynamicFormSearch';
import type { DynamicForm, FormSubmissionData } from '../../types/dynamicForm';
import { getAllDynamicForms, submitDynamicForm, deleteDynamicForm, toggleFormStatus } from '../../service/api/dynamicformAPI';
import type { DynamicFormSearchParams } from '../../service/api/dynamicformAPI';
import type { SearchFormValues } from '../../components/admin/dynamicform/DynamicFormSearch';

const { Title } = Typography;

const DynamicFormPage: React.FC = () => {
  const [filteredForms, setFilteredForms] = useState<DynamicForm[]>([]);
  const [selectedForm, setSelectedForm] = useState<DynamicForm | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // State cho modal detail
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [detailForm, setDetailForm] = useState<DynamicForm | null>(null);
  
  // State cho modal tạo form
  const [createModalVisible, setCreateModalVisible] = useState(false);

  // State cho modal edit form
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editingForm, setEditingForm] = useState<DynamicForm | null>(null);

  // State cho search và filter

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
    console.log('Opening edit modal for form:', form);
    setEditingForm(form);
    setEditModalVisible(true);
  };

  // Xử lý xem chi tiết form
  const handlePreviewForm = (form: DynamicForm) => {
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
    setCreateModalVisible(true);
  };

  // Xử lý khi tạo form thành công
  const handleCreateSuccess = () => {
    setCreateModalVisible(false);
    loadForms(); // Reload danh sách forms
  };

  // Xử lý khi edit form thành công
  const handleEditSuccess = () => {
    setEditModalVisible(false);
    setEditingForm(null);
    loadForms(); // Reload danh sách forms
  };

  // Xử lý search
  const handleSearch = (values: SearchFormValues) => {
    const params: DynamicFormSearchParams = {
      keyword: values.keyword,
      form_type: values.formType,
      is_active: values.status === 'active' ? true : values.status === 'inactive' ? false : undefined
    };
    loadForms(params);
  };

  // Xử lý reset search
  const handleReset = () => {
    loadForms();
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <Spin size="large" />
        <span className="ml-3 text-lg">Đang tải...</span>
      </div>
    );
  }

  if (error) {
    return (
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
    );
  }

  if (selectedForm) {
    return (
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
    );
  }

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-4">
        <Title level={2}>Quản lý biểu mẫu động</Title>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={handleAddForm}
        >
          Thêm Schema Form
        </Button>
      </div>
      
      {/* Search Form */}
      <DynamicFormSearch 
        onSearch={handleSearch}
        onReset={handleReset}
        loading={loading}
      />
      
      {/* Dynamic Form Table */}
      <DynamicFormTable
        data={filteredForms}
        onDelete={handleDeleteForm}
        onToggleStatus={handleToggleStatus}
        onEdit={handleEditForm}
        onPreview={handlePreviewForm}
        loading={loading}
      />
      
      {/* Modal chi tiết form */}
      <DynamicFormDetailModal
        visible={detailModalVisible}
        form={detailForm}
        onCancel={handleCloseDetailModal}
      />
      
      {/* Modal tạo form mới */}
      <DynamicFormCreator
        visible={createModalVisible}
        onCancel={() => setCreateModalVisible(false)}
        onSuccess={handleCreateSuccess}
        mode="create"
      />
      
      {/* Modal edit form */}
      <DynamicFormCreator
        visible={editModalVisible}
        onCancel={() => {
          setEditModalVisible(false);
          setEditingForm(null);
        }}
        onSuccess={handleEditSuccess}
        editForm={editingForm}
        mode="edit"
      />
    </div>
  );
};

export default DynamicFormPage;
