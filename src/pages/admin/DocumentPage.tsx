import React, { useState } from 'react';
import { Typography, Layout, message, Button, Space, Row, Col, Modal, Image, Descriptions, Tag } from 'antd';
import { PlusOutlined, FilterOutlined, FileOutlined, FilePdfOutlined, FileImageOutlined, FileWordOutlined, FileExcelOutlined } from '@ant-design/icons';
import DocumentFilter from '../../components/admin/document/DocumentFilter';
import DocumentList from '../../components/admin/document/DocumentList';
import DocumentForm from '../../components/admin/document/DocumentForm';
import { documentsData } from '../../components/admin/document/DocumentData';
import type { Document, DocumentFilterParams } from '../../components/admin/document/DocumentTypes';
import 'dayjs/locale/vi';

const { Content } = Layout;
const { Title, Paragraph } = Typography;

const DocumentPage: React.FC = () => {
  const [documents, setDocuments] = useState<Document[]>(documentsData);
  const [loading, setLoading] = useState<boolean>(false);
  const [formVisible, setFormVisible] = useState<boolean>(false);
  const [formTitle, setFormTitle] = useState<string>('Thêm tài liệu mới');
  const [formLoading, setFormLoading] = useState<boolean>(false);
  const [selectedDocument, setSelectedDocument] = useState<Document | undefined>(undefined);
  const [showFilter, setShowFilter] = useState<boolean>(false);
  const [viewModalVisible, setViewModalVisible] = useState<boolean>(false);
  const [viewingDocument, setViewingDocument] = useState<Document | undefined>(undefined);

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
      setViewingDocument(doc);
      setViewModalVisible(true);
    }
  };

  // Xử lý đóng modal xem chi tiết
  const handleCloseViewModal = () => {
    setViewModalVisible(false);
    setViewingDocument(undefined);
  };

  // Xử lý tải xuống từ modal
  const handleDownloadFromModal = () => {
    if (viewingDocument && viewingDocument.fileUrl) {
      message.success(`Đang tải xuống tài liệu: ${viewingDocument.title}`);
      // Giả lập việc tải xuống
      const link = viewingDocument.fileUrl;
      const a = window.document.createElement('a');
      a.href = link;
      a.download = viewingDocument.title;
      a.click();
    } else {
      message.error('Không tìm thấy file để tải xuống');
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

  // Lấy icon theo loại file
  const getFileIcon = (fileUrl?: string) => {
    if (!fileUrl) return <FileOutlined />;
    
    if (fileUrl.endsWith('.pdf')) return <FilePdfOutlined style={{ color: '#ff4d4f' }} />;
    if (fileUrl.endsWith('.docx') || fileUrl.endsWith('.doc')) return <FileWordOutlined style={{ color: '#1890ff' }} />;
    if (fileUrl.endsWith('.xlsx') || fileUrl.endsWith('.xls')) return <FileExcelOutlined style={{ color: '#52c41a' }} />;
    if (fileUrl.endsWith('.jpg') || fileUrl.endsWith('.png') || fileUrl.endsWith('.jpeg')) return <FileImageOutlined style={{ color: '#722ed1' }} />;
    
    return <FileOutlined />;
  };
  
  // Lấy tên loại tài liệu
  const getDocumentTypeText = (type: string): string => {
    switch (type) {
      case 'report':
        return 'Báo cáo';
      case 'prescription':
        return 'Đơn thuốc';
      case 'test':
        return 'Xét nghiệm';
      default:
        return 'Khác';
    }
  };
  
  // Lấy màu cho loại tài liệu
  const getDocumentTypeColor = (type: string): string => {
    switch (type) {
      case 'report':
        return 'blue';
      case 'prescription':
        return 'green';
      case 'test':
        return 'purple';
      default:
        return 'default';
    }
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

      {/* Modal xem chi tiết tài liệu */}
      <Modal
        title={<div className="flex items-center gap-2">{getFileIcon(viewingDocument?.fileUrl)} {viewingDocument?.title}</div>}
        open={viewModalVisible}
        onCancel={handleCloseViewModal}
        width={800}
        footer={[
          <Button key="back" onClick={handleCloseViewModal}>
            Đóng
          </Button>,
          <Button 
            key="download" 
            type="primary" 
            onClick={handleDownloadFromModal}
            disabled={!viewingDocument?.fileUrl}
          >
            Tải xuống
          </Button>,
        ]}
      >
        {viewingDocument && (
          <div className="document-viewer">
            <Descriptions bordered column={2} className="mb-4">
              <Descriptions.Item label="Loại tài liệu" span={1}>
                <Tag color={getDocumentTypeColor(viewingDocument.type)}>
                  {getDocumentTypeText(viewingDocument.type)}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Ngày tạo" span={1}>
                {viewingDocument.createdAt}
              </Descriptions.Item>
              <Descriptions.Item label="Bệnh nhân" span={1}>
                {viewingDocument.patientName || 'Không có thông tin'}
              </Descriptions.Item>
              <Descriptions.Item label="Bác sĩ" span={1}>
                {viewingDocument.doctorName || 'Không có thông tin'}
              </Descriptions.Item>
              {viewingDocument.content && (
                <Descriptions.Item label="Nội dung" span={2}>
                  <Paragraph>{viewingDocument.content}</Paragraph>
                </Descriptions.Item>
              )}
            </Descriptions>

            {viewingDocument.fileUrl && (
              <div className="document-preview border rounded-md p-4 flex flex-col items-center justify-center">
                {viewingDocument.fileUrl.endsWith('.pdf') ? (
                  <div className="w-full h-[400px] flex flex-col items-center justify-center bg-gray-100 rounded">
                    <FilePdfOutlined style={{ fontSize: 64, color: '#ff4d4f' }} />
                    <p className="mt-3">Xem trước PDF không khả dụng. Vui lòng tải xuống để xem nội dung.</p>
                    <Button type="primary" onClick={handleDownloadFromModal} className="mt-2">
                      Tải xuống để xem
                    </Button>
                  </div>
                ) : viewingDocument.fileUrl.endsWith('.jpg') || 
                   viewingDocument.fileUrl.endsWith('.png') || 
                   viewingDocument.fileUrl.endsWith('.jpeg') ? (
                  <Image
                    src={viewingDocument.fileUrl}
                    alt={viewingDocument.title}
                    className="max-h-[400px] object-contain"
                  />
                ) : (
                  <div className="w-full h-[400px] flex flex-col items-center justify-center bg-gray-100 rounded">
                    {getFileIcon(viewingDocument.fileUrl)}
                    <p className="mt-3">Không thể hiển thị trước file này. Vui lòng tải xuống để xem nội dung.</p>
                    <Button type="primary" onClick={handleDownloadFromModal} className="mt-2">
                      Tải xuống để xem
                    </Button>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </Modal>
    </Content>
  );
};

export default DocumentPage; 