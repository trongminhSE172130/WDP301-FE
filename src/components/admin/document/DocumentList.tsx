import React, { useState } from 'react';
import { Card, Row, Col, Button, Tooltip, Modal, Empty, Spin, Pagination, Space, Tag } from 'antd';
import { StarOutlined, StarFilled, EyeOutlined, DownloadOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons';
import type { Document } from './DocumentTypes';

interface DocumentListProps {
  data: Document[];
  loading?: boolean;
  onEdit?: (id: string) => void;
  onView?: (id: string) => void;
  onDelete?: (id: string) => void;
  onToggleFavorite?: (id: string, isFavorite: boolean) => void;
  onDownload?: (id: string) => void;
}

const DocumentList: React.FC<DocumentListProps> = ({
  data,
  loading = false,
  onEdit,
  onView,
  onDelete,
  onToggleFavorite,
  onDownload
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 8;

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

  const handleFavoriteToggle = (document: Document, e: React.MouseEvent) => {
    e.stopPropagation();
    if (onToggleFavorite) {
      onToggleFavorite(document.id, !document.isFavorite);
    }
  };

  const handleView = (document: Document) => {
    if (onView) {
      onView(document.id);
    }
  };

  const handleEdit = (document: Document, e: React.MouseEvent) => {
    e.stopPropagation();
    if (onEdit) {
      onEdit(document.id);
    }
  };

  const handleDownload = (document: Document, e: React.MouseEvent) => {
    e.stopPropagation();
    if (onDownload) {
      onDownload(document.id);
    }
  };

  const handleDelete = (document: Document, e: React.MouseEvent) => {
    e.stopPropagation();
    Modal.confirm({
      title: 'Xác nhận xóa',
      content: `Bạn có chắc chắn muốn xóa tài liệu "${document.title}" không?`,
      okText: 'Xóa',
      cancelText: 'Hủy',
      okButtonProps: { danger: true },
      onOk: () => {
        if (onDelete) {
          onDelete(document.id);
        }
      }
    });
  };

  // Phân trang
  const paginatedData = data.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Kiểm tra nếu không có dữ liệu
  if (data.length === 0 && !loading) {
    return <Empty description="Không có tài liệu nào" />;
  }

  return (
    <div className="document-list">
      <Spin spinning={loading}>
        <Row gutter={[16, 16]}>
          {paginatedData.map(document => (
            <Col key={document.id} xs={24} sm={12} md={8} lg={6}>
              <Card
                hoverable
                className="relative h-full flex flex-col transition-all duration-300 hover:transform hover:-translate-y-1 hover:shadow-lg"
                onClick={() => handleView(document)}
                cover={
                  <div className="relative h-[180px] overflow-hidden bg-gray-100 flex items-center justify-center">
                    <img 
                      alt={document.title} 
                      src={document.thumbnailUrl || '/images/documents/default-thumb.png'} 
                      className="w-full h-full object-cover"
                    />
                    <Tag color={getDocumentTypeColor(document.type)} className="absolute top-2.5 left-2.5">
                      {getDocumentTypeText(document.type)}
                    </Tag>
                    <Button
                      type="text"
                      className="absolute top-2.5 right-2.5 bg-white bg-opacity-70 rounded-full w-8 h-8 flex items-center justify-center"
                      icon={document.isFavorite ? <StarFilled style={{ color: '#f8cb00' }} /> : <StarOutlined />}
                      onClick={(e) => handleFavoriteToggle(document, e)}
                    />
                  </div>
                }
              >
                <div className="flex-1 flex flex-col">
                  <h3 className="mb-2 text-base font-medium overflow-hidden text-ellipsis line-clamp-2 min-h-[48px]">{document.title}</h3>
                  <p className="text-gray-600 text-sm mb-2 flex-1">
                    <span>Bệnh nhân: {document.patientName}</span>
                    <br />
                    <span>Bác sĩ: {document.doctorName}</span>
                    <br />
                    <span>Ngày tạo: {document.createdAt}</span>
                  </p>
                  <div className="mt-auto flex justify-end border-t border-gray-100 pt-2.5">
                    <Space>
                      <Tooltip title="Xem">
                        <Button 
                          type="text" 
                          icon={<EyeOutlined />} 
                          onClick={(e) => { e.stopPropagation(); handleView(document); }}
                        />
                      </Tooltip>
                      <Tooltip title="Chỉnh sửa">
                        <Button 
                          type="text" 
                          icon={<EditOutlined />} 
                          onClick={(e) => handleEdit(document, e)}
                        />
                      </Tooltip>
                      <Tooltip title="Tải xuống">
                        <Button 
                          type="text" 
                          icon={<DownloadOutlined />} 
                          onClick={(e) => handleDownload(document, e)}
                        />
                      </Tooltip>
                      <Tooltip title="Xóa">
                        <Button 
                          type="text" 
                          danger
                          icon={<DeleteOutlined />} 
                          onClick={(e) => handleDelete(document, e)}
                        />
                      </Tooltip>
                    </Space>
                  </div>
                </div>
              </Card>
            </Col>
          ))}
        </Row>

        <div className="text-right mt-5">
          <Pagination
            current={currentPage}
            pageSize={pageSize}
            total={data.length}
            onChange={handlePageChange}
            showSizeChanger={false}
            showTotal={(total) => `Tổng số: ${total} tài liệu`}
          />
        </div>
      </Spin>
    </div>
  );
};

export default DocumentList; 