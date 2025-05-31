import React, { useEffect } from 'react';
import { Modal, Form, Input, Select, Upload, Button, Row, Col, DatePicker } from 'antd';
import { UploadOutlined, InboxOutlined } from '@ant-design/icons';
import type { Document } from './DocumentTypes';
import type { UploadFile, UploadChangeParam } from 'antd/es/upload/interface';
import dayjs from 'dayjs';
import locale from 'antd/es/date-picker/locale/vi_VN';

const { Option } = Select;
const { TextArea } = Input;
const { Dragger } = Upload;

interface DocumentFormProps {
  visible: boolean;
  title: string;
  loading: boolean;
  initialValues?: Document;
  onCancel: () => void;
  onSubmit: (values: Partial<Document>) => void;
}

const DocumentForm: React.FC<DocumentFormProps> = ({
  visible,
  title,
  loading,
  initialValues,
  onCancel,
  onSubmit
}) => {
  const [form] = Form.useForm();
  const [fileList, setFileList] = React.useState<UploadFile[]>([]);
  const [thumbnailList, setThumbnailList] = React.useState<UploadFile[]>([]);

  useEffect(() => {
    if (visible) {
      form.resetFields();
      setFileList([]);
      setThumbnailList([]);
      
      if (initialValues) {
        form.setFieldsValue({
          ...initialValues,
          createdAt: initialValues.createdAt ? dayjs(initialValues.createdAt, 'DD/MM/YYYY HH:mm') : undefined
        });
        
        // Thiết lập file và thumbnail nếu có
        if (initialValues.fileUrl) {
          setFileList([
            {
              uid: '-1',
              name: initialValues.title,
              status: 'done',
              url: initialValues.fileUrl,
            }
          ]);
        }
        
        if (initialValues.thumbnailUrl) {
          setThumbnailList([
            {
              uid: '-1',
              name: 'thumbnail',
              status: 'done',
              url: initialValues.thumbnailUrl,
            }
          ]);
        }
      }
    }
  }, [visible, initialValues, form]);

  const handleSubmit = () => {
    form.validateFields().then(values => {
      const formattedValues = {
        ...values,
        createdAt: values.createdAt ? values.createdAt.format('DD/MM/YYYY HH:mm') : undefined,
        fileUrl: fileList.length > 0 ? fileList[0].url || fileList[0].response?.url : undefined,
        thumbnailUrl: thumbnailList.length > 0 ? thumbnailList[0].url || thumbnailList[0].response?.url : undefined
      };
      
      onSubmit(formattedValues);
    }).catch(info => {
      console.log('Validate Failed:', info);
    });
  };

  const normFile = (e: UploadChangeParam | UploadFile[]) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e?.fileList;
  };

  return (
    <Modal
      open={visible}
      title={title}
      onCancel={onCancel}
      width={800}
      footer={[
        <Button key="back" onClick={onCancel}>
          Hủy
        </Button>,
        <Button key="submit" type="primary" loading={loading} onClick={handleSubmit}>
          Lưu
        </Button>,
      ]}
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={{ status: 'active', isFavorite: false }}
      >
        <Row gutter={16}>
          <Col span={16}>
            <Form.Item
              name="title"
              label="Tiêu đề tài liệu"
              rules={[{ required: true, message: 'Vui lòng nhập tiêu đề tài liệu' }]}
            >
              <Input placeholder="Nhập tiêu đề tài liệu" />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              name="type"
              label="Loại tài liệu"
              rules={[{ required: true, message: 'Vui lòng chọn loại tài liệu' }]}
            >
              <Select placeholder="Chọn loại tài liệu">
                <Option value="report">Báo cáo</Option>
                <Option value="prescription">Đơn thuốc</Option>
                <Option value="test">Xét nghiệm</Option>
                <Option value="other">Khác</Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="patientName"
              label="Tên bệnh nhân"
              rules={[{ required: true, message: 'Vui lòng nhập tên bệnh nhân' }]}
            >
              <Input placeholder="Nhập tên bệnh nhân" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="doctorName"
              label="Tên bác sĩ"
              rules={[{ required: true, message: 'Vui lòng nhập tên bác sĩ' }]}
            >
              <Input placeholder="Nhập tên bác sĩ" />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="createdAt"
              label="Ngày tạo"
              rules={[{ required: true, message: 'Vui lòng chọn ngày tạo' }]}
            >
              <DatePicker 
                format="DD/MM/YYYY HH:mm"
                showTime={{ format: 'HH:mm' }}
                placeholder="Chọn ngày tạo"
                locale={locale}
                className="w-full"
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="status"
              label="Trạng thái"
              rules={[{ required: true, message: 'Vui lòng chọn trạng thái' }]}
            >
              <Select placeholder="Chọn trạng thái">
                <Option value="active">Đang hoạt động</Option>
                <Option value="archived">Đã lưu trữ</Option>
                <Option value="deleted">Đã xóa</Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <Form.Item
          name="content"
          label="Nội dung"
        >
          <TextArea rows={4} placeholder="Nhập nội dung mô tả tài liệu" />
        </Form.Item>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="file"
              label="Tài liệu"
              valuePropName="fileList"
              getValueFromEvent={normFile}
            >
              <Dragger
                name="file"
                fileList={fileList}
                onChange={({ fileList }) => setFileList(fileList)}
                beforeUpload={() => false}
                maxCount={1}
              >
                <p className="ant-upload-drag-icon">
                  <InboxOutlined />
                </p>
                <p className="ant-upload-text">Nhấp hoặc kéo file vào khu vực này để tải lên</p>
                <p className="ant-upload-hint">Hỗ trợ tải lên một file duy nhất.</p>
              </Dragger>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="thumbnail"
              label="Ảnh thu nhỏ"
              valuePropName="fileList"
              getValueFromEvent={normFile}
            >
              <Upload
                name="thumbnail"
                listType="picture"
                fileList={thumbnailList}
                onChange={({ fileList }) => setThumbnailList(fileList)}
                beforeUpload={() => false}
                maxCount={1}
              >
                <Button icon={<UploadOutlined />}>Tải lên ảnh thu nhỏ</Button>
              </Upload>
            </Form.Item>
          </Col>
        </Row>

        <Form.Item
          name="isFavorite"
          valuePropName="checked"
        >
          <Select className="w-52">
            <Option value={true}>Đánh dấu yêu thích</Option>
            <Option value={false}>Không đánh dấu</Option>
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default DocumentForm; 