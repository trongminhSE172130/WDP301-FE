import React, { useState, useEffect } from 'react';
import { Typography, message, Modal } from 'antd';
import { useNavigate } from 'react-router-dom';
import ConsultantTable from '../../components/admin/consultant/ConsultantTable';
import type { Consultant } from '../../components/admin/consultant/ConsultantTable';
import ConsultantSearch from '../../components/admin/consultant/ConsultantSearch';
import ConsultantForm from '../../components/admin/consultant/ConsultantForm';
import type { SearchFormValues } from '../../components/admin/consultant/ConsultantSearch';
import type { FormValues } from '../../components/admin/consultant/ConsultantForm';
import { getAllConsultants, createConsultant, updateConsultant, deleteConsultant, assignServices } from '../../service/api/consultantAPI';
import { getAllServices } from '../../service/api/serviceAPI';
import type { Service } from '../../components/admin/service/ServiceTypes';

const { Title } = Typography;

const ConsultantManagement: React.FC = () => {
  const [consultants, setConsultants] = useState<Consultant[]>([]);
  const [allConsultants, setAllConsultants] = useState<Consultant[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [currentConsultant, setCurrentConsultant] = useState<Consultant | undefined>(undefined);
  const navigate = useNavigate();

  // Load danh sách tư vấn viên
  const loadConsultants = async () => {
    try {
      setLoading(true);
      const response = await getAllConsultants();
      if (response.success) {
        setConsultants(response.data);
        setAllConsultants(response.data);
      } else {
        message.error('Không thể tải danh sách tư vấn viên');
      }
    } catch (error) {
      console.error('Error loading consultants:', error);
      message.error('Có lỗi xảy ra khi tải danh sách tư vấn viên');
    } finally {
      setLoading(false);
    }
  };

  const loadServices = async () => {
    try {
      const response = await getAllServices();
      if (response.success) {
        setServices(response.data);
      }
    } catch (error) {
      console.error('Error loading services:', error);
      // Không hiển thị lỗi vì services không bắt buộc
    }
  };

  // Load dữ liệu khi component mount
  useEffect(() => {
    loadConsultants();
    loadServices();
  }, []);

  // Xử lý tìm kiếm tư vấn viên
  const handleSearch = (values: SearchFormValues) => {
    const { keyword } = values;
    
    if (!keyword) {
      setConsultants(allConsultants);
      return;
    }
    
    const filteredConsultants = allConsultants.filter(
          consultant => 
        consultant.full_name.toLowerCase().includes(keyword.toLowerCase()) || 
            consultant.email.toLowerCase().includes(keyword.toLowerCase()) ||
        consultant.specialty.toLowerCase().includes(keyword.toLowerCase())
    );
      
      setConsultants(filteredConsultants);
  };

  // Xử lý reset tìm kiếm
  const handleReset = () => {
    setConsultants(allConsultants);
  };

  // Xử lý thêm tư vấn viên
  const handleAdd = () => {
    setCurrentConsultant(undefined);
    setShowForm(true);
  };

  // Xử lý chỉnh sửa tư vấn viên
  const handleEdit = (consultant: Consultant) => {
    setCurrentConsultant(consultant);
    setShowForm(true);
  };

  // Xử lý xóa tư vấn viên
  const handleDelete = async (consultantId: string) => {
    try {
    setLoading(true);
      const response = await deleteConsultant(consultantId);
      if (response.success) {
        message.success('Xóa tư vấn viên thành công!');
        await loadConsultants(); // Reload danh sách
      } else {
        message.error('Không thể xóa tư vấn viên');
      }
    } catch (error) {
      console.error('Error deleting consultant:', error);
      message.error('Có lỗi xảy ra khi xóa tư vấn viên');
    } finally {
      setLoading(false);
    }
  };

  // Xử lý xem hồ sơ tư vấn viên
  const handleViewProfile = (consultantId: string) => {
    navigate(`/admin/consultants/${consultantId}`);
  };

  // Xử lý gán dịch vụ cho tư vấn viên
  const handleAssignServices = async (consultantId: string, serviceIds: string[]) => {
    try {
      setLoading(true);
      const response = await assignServices(consultantId, serviceIds);
      
      if (response.success) {
        message.success('Gán dịch vụ thành công!');
        
        // Cập nhật danh sách tư vấn viên trong state
        setConsultants(prevConsultants => 
          prevConsultants.map(consultant => 
            consultant._id === consultantId 
              ? { ...consultant, services: serviceIds } 
              : consultant
          )
        );
        
        setAllConsultants(prevConsultants => 
          prevConsultants.map(consultant => 
            consultant._id === consultantId 
              ? { ...consultant, services: serviceIds } 
              : consultant
          )
        );
      } else {
        message.error('Không thể gán dịch vụ cho tư vấn viên');
      }
    } catch (error) {
      console.error('Error assigning services:', error);
      message.error('Có lỗi xảy ra khi gán dịch vụ');
    } finally {
      setLoading(false);
    }
  };

  // Xử lý submit form
  const handleFormSubmit = async (values: FormValues) => {
    try {
    setLoading(true);
    
             if (currentConsultant) {
         // Cập nhật - chỉ gửi các trường có thể thay đổi
         await updateConsultant(currentConsultant._id, {
          degree: values.degree,
          specialty: values.specialty,
          experience_years: values.experience_years,
          bio: values.bio
        });
        message.success('Cập nhật tư vấn viên thành công');
      } else {
        // Tạo mới - sử dụng API register-consultant
        if (!values.password) {
          message.error('Vui lòng nhập mật khẩu!');
          return;
        }
        
        await createConsultant({
          full_name: values.full_name,
          email: values.email,
          password: values.password,
          degree: values.degree,
          specialty: values.specialty,
          experience_years: values.experience_years,
          bio: values.bio,
          services: values.services || []
        });
        message.success('Thêm tư vấn viên thành công');
      }
      
             setShowForm(false);
       loadConsultants();
    } catch (error: unknown) {
      console.error('Error in handleFormSubmit:', error);
      
             if (error && typeof error === 'object' && 'response' in error) {
         const axiosError = error as { response: { status: number; data?: { message?: string } } };
         const status = axiosError.response.status;
         const errorMessage = axiosError.response.data?.message || 'Có lỗi xảy ra';
        
        if (status === 400) {
          message.error(`Lỗi dữ liệu: ${errorMessage}`);
        } else if (status === 401) {
          message.error('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
        } else if (status === 403) {
          message.error('Bạn không có quyền thực hiện thao tác này.');
        } else if (status === 409) {
          message.error('Email đã tồn tại trong hệ thống. Vui lòng sử dụng email khác.');
        } else {
          message.error(errorMessage);
        }
      } else {
                 const action = currentConsultant ? 'cập nhật' : 'thêm';
        message.error(`Không thể ${action} tư vấn viên`);
      }
    } finally {
      setLoading(false);
    }
  };

  // Xử lý hủy form
  const handleCancel = () => {
    setShowForm(false);
  };

  // Map service ID to service name
  const getServiceNames = (serviceIds: string[]): string[] => {
    return serviceIds.map(id => {
      const service = services.find(s => s._id === id);
      return service ? service.title : id;
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 ">
      <div >
        {/* Header */}
        <div className="mb-8">
          <Title level={2} className="text-gray-800 mb-2">
            Quản lý tư vấn viên
          </Title>
          <p className="text-gray-600">
            Quản lý thông tin và hoạt động của các tư vấn viên trong hệ thống
          </p>
        </div>
        
        {/* Search Form */}
        <ConsultantSearch 
          onSearch={handleSearch}
          onAdd={handleAdd}
          onReset={handleReset}
          loading={loading}
        />
        
        {/* Consultant Table */}
        <ConsultantTable 
          data={consultants} 
          onEdit={handleEdit} 
          onDelete={handleDelete}
          onViewProfile={handleViewProfile}
          onAssignServices={handleAssignServices}
          loading={loading}
          services={services}
          getServiceNames={getServiceNames}
        />
        
        {/* Consultant Form Modal */}
        <Modal
          open={showForm}
          title={
            <div className="flex items-center space-x-3 py-2">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white text-lg">
                  {currentConsultant ? '✏️' : '👨‍⚕️'}
                </span>
              </div>
              <div>
            <div className="text-lg font-semibold text-gray-800">
                  {currentConsultant ? 'Chỉnh sửa thông tin tư vấn viên' : 'Thêm tư vấn viên mới'}
                </div>
                <div className="text-sm text-gray-500">
                  {currentConsultant ? 'Cập nhật thông tin và cài đặt' : 'Điền đầy đủ thông tin bên dưới'}
                </div>
              </div>
            </div>
          }
          onCancel={handleCancel}
          footer={null}
          width={900}
          className="consultant-form-modal"
          maskStyle={{ backgroundColor: 'rgba(0, 0, 0, 0.45)', backdropFilter: 'blur(4px)' }}
          bodyStyle={{ padding: '0', maxHeight: '80vh', overflowY: 'auto' }}
          centered
        >
          <div className="bg-gray-50">
            <div className="p-6 bg-white">
            <ConsultantForm
              consultant={currentConsultant}
              onFinish={handleFormSubmit}
              loading={loading}
              title=""
              services={services}
            />
            </div>
            
            {/* Form Actions */}
            <div className="bg-white border-t border-gray-200 px-6 py-4">
              <div className="flex justify-between items-center">
                <div className="text-sm text-gray-500">
                  <span className="text-red-500">*</span> Các trường bắt buộc
                </div>
                <div className="flex space-x-3">
              <button 
                onClick={handleCancel} 
                    className="px-6 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200"
              >
                    Hủy bỏ
              </button>
              <button 
                form="consultantForm"
                type="submit"
                    disabled={loading}
                    className="px-6 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-blue-700 border border-transparent rounded-lg shadow-sm hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:from-blue-600 disabled:hover:to-blue-700"
              >
                    {loading ? (
                      <div className="flex items-center space-x-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Đang xử lý...</span>
                      </div>
                    ) : (
                      <>
                        {currentConsultant ? (
                          <div className="flex items-center space-x-2">
                            <span>✓</span>
                            <span>Cập nhật</span>
                          </div>
                        ) : (
                          <div className="flex items-center space-x-2">
                            <span>+</span>
                            <span>Thêm mới</span>
                          </div>
                        )}
                      </>
                    )}
              </button>
                </div>
              </div>
            </div>
          </div>
        </Modal>
      </div>
    </div>
  );
};

export default ConsultantManagement; 