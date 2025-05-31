import React, { useState } from 'react';
import { Typography, Layout, message, Button, Space, Row, Col } from 'antd';
import { PlusOutlined, FilterOutlined } from '@ant-design/icons';
import DocumentFilter from '../../components/admin/document/DocumentFilter';
import DocumentList from '../../components/admin/document/DocumentList';
import DocumentForm from '../../components/admin/document/DocumentForm';
import { documentsData } from '../../components/admin/document/DocumentData';
import type { Document, DocumentFilterParams } from '../../components/admin/document/DocumentTypes';
import 'dayjs/locale/vi';

const { Content } = Layout;
const { Title } = Typography;

const DocumentPage: React.FC = () => {
  const [documents, setDocuments] = useState<Document[]>(documentsData);
  const [loading, setLoading] = useState<boolean>(false);
  const [formVisible, setFormVisible] = useState<boolean>(false);
  const [formTitle, setFormTitle] = useState<string>('Thêm tài liệu mới');
  const [formLoading, setFormLoading] = useState<boolean>(false);
  const [selectedDocument, setSelectedDocument] = useState<Document | undefined>(undefined);
  const [showFilter, setShowFilter] = useState<boolean>(false);

  // Xử lý lọc dữ liệu
  const handleFilter = (filters: DocumentFilterParams) => {
    setLoading(true);
    
    // Giả lập API call
    setTimeout(() => {
      let filteredData = [...documentsData];
      
      if (filters.title) {
        filteredData = filteredData.filter(item => 
          item.title.toLowerCase().includes(filters.title?.toLowerCase() || '')
        );
      }
      
      if (filters.type) {
        filteredData = filteredData.filter(item => 
          item.type === filters.type
        );
      }
      
      if (filters.patientName) {
        filteredData = filteredData.filter(item => 
          item.patientName?.toLowerCase().includes(filters.patientName?.toLowerCase() || '')
        );
      }
      
      if (filters.doctorName) {
        filteredData = filteredData.filter(item => 
          item.doctorName?.toLowerCase().includes(filters.doctorName?.toLowerCase() || '')
        );
      }
      
      if (filters.status) {
        filteredData = filteredData.filter(item => 
          item.status === filters.status
        );
      }
      
      if (filters.dateRange && filters.dateRange.length === 2) {
        // Đơn giản hóa tìm kiếm theo khoảng thời gian
        const startDate = filters.dateRange[0];
        const endDate = filters.dateRange[1];
        filteredData = filteredData.filter(item => {
          const date = item.createdAt.split(' ')[0]; // Lấy phần ngày tháng năm
          return date >= startDate && date <= endDate;
        });
      }
      
      setDocuments(filteredData);
      setLoading(false);
    }, 500);
  };

  // Xử lý đặt lại bộ lọc
  const handleReset = () => {
    setDocuments(documentsData);
    message.success('Đã đặt lại dữ liệu');
  };

  // Xử lý thêm mới
  const handleAddNew = () => {
    setFormTitle('Thêm tài liệu mới');
    setSelectedDocument(undefined);
    setFormVisible(true);
  };

  // Xử lý chỉnh sửa
  const handleEdit = (id: string) => {
    const doc = documents.find(item => item.id === id);
    if (doc) {
      setFormTitle('Chỉnh sửa tài liệu');
      setSelectedDocument(doc);
      setFormVisible(true);
    }
  };

  // Xử lý xem chi tiết
  const handleView = (id: string) => {
    const doc = documents.find(item => item.id === id);
    if (doc) {
      message.info(`Xem chi tiết tài liệu: ${doc.title}`);
      // Mở tab mới để xem tài liệu
      if (doc.fileUrl) {
        window.open(doc.fileUrl, '_blank');
      }
    }
  };

  // Xử lý tải xuống
  const handleDownload = (id: string) => {
    const doc = documents.find(item => item.id === id);
    if (doc && doc.fileUrl) {
      message.success(`Đang tải xuống tài liệu: ${doc.title}`);
      // Giả lập việc tải xuống
      const link = doc.fileUrl;
      const a = window.document.createElement('a');
      a.href = link;
      a.download = doc.title;
      a.click();
    } else {
      message.error('Không tìm thấy file để tải xuống');
    }
  };

  // Xử lý xóa
  const handleDelete = (id: string) => {
    setDocuments(documents.filter(item => item.id !== id));
    message.success('Đã xóa tài liệu thành công');
  };

  // Xử lý đánh dấu yêu thích
  const handleToggleFavorite = (id: string, isFavorite: boolean) => {
    const updatedDocuments = documents.map(item => 
      item.id === id ? { ...item, isFavorite } : item
    );
    setDocuments(updatedDocuments);
    message.success(isFavorite ? 'Đã thêm vào mục yêu thích' : 'Đã bỏ khỏi mục yêu thích');
  };

  // Xử lý khi form được submit
  const handleFormSubmit = (values: Partial<Document>) => {
    setFormLoading(true);
    
    // Giả lập API call
    setTimeout(() => {
      if (selectedDocument) {
        // Cập nhật
        const updatedDocuments = documents.map(item => 
          item.id === selectedDocument.id ? { ...selectedDocument, ...values } : item
        );
        setDocuments(updatedDocuments);
        message.success('Cập nhật tài liệu thành công');
      } else {
        // Thêm mới
        const newId = `DOC${String(documents.length + 1).padStart(3, '0')}`;
        const newDocument = { 
          ...values, 
          id: newId,
          createdAt: values.createdAt || new Date().toLocaleDateString('vi-VN'),
          status: values.status || 'active',
          isFavorite: values.isFavorite || false
        } as Document;
        setDocuments([...documents, newDocument]);
        message.success('Thêm tài liệu mới thành công');
      }
      
      setFormLoading(false);
      setFormVisible(false);
    }, 1000);
  };

  // Xử lý đóng form
  const handleFormCancel = () => {
    setFormVisible(false);
  };

  // Xử lý bật/tắt bộ lọc
  const toggleFilter = () => {
    setShowFilter(!showFilter);
  };

  return (
    <Content className="p-5">
      <div className="mb-5">
        <Row justify="space-between" align="middle">
          <Col>
            <Title level={2} className="m-0">Quản lý tài liệu</Title>
          </Col>
          <Col>
            <Space>
              <Button 
                icon={<FilterOutlined />} 
                onClick={toggleFilter}
                type={showFilter ? 'primary' : 'default'}
              >
                {showFilter ? 'Ẩn bộ lọc' : 'Hiện bộ lọc'}
              </Button>
              <Button 
                type="primary" 
                icon={<PlusOutlined />}
                onClick={handleAddNew}
              >
                Thêm tài liệu
              </Button>
            </Space>
          </Col>
        </Row>
      </div>

      {showFilter && (
        <DocumentFilter 
          onFilter={handleFilter}
          onReset={handleReset}
          loading={loading}
        />
      )}
      
      <DocumentList 
        data={documents}
        loading={loading}
        onEdit={handleEdit}
        onView={handleView}
        onDelete={handleDelete}
        onToggleFavorite={handleToggleFavorite}
        onDownload={handleDownload}
      />

      <DocumentForm
        visible={formVisible}
        title={formTitle}
        loading={formLoading}
        initialValues={selectedDocument}
        onCancel={handleFormCancel}
        onSubmit={handleFormSubmit}
      />
    </Content>
  );
};

export default DocumentPage; 