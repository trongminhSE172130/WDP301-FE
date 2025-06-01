import React, { useState, useEffect, useRef } from 'react';
import { Modal, Form, Input, message, Upload } from 'antd';
import { InboxOutlined } from '@ant-design/icons';
import type { UploadFile, UploadProps } from 'antd/es/upload/interface';
import 'quill/dist/quill.snow.css';

const { Dragger } = Upload;

// Định nghĩa các kiểu dữ liệu
interface BlogAddProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

// Định nghĩa kiểu dữ liệu cho Quill
interface QuillType {
  clipboard: {
    dangerouslyPasteHTML: (html: string) => void;
  };
  root: {
    innerHTML: string;
  };
  on: (event: string, callback: () => void) => void;
}

// Giả lập BlogAPI service - Sẽ được thay thế bằng API thực tế sau
const BlogAPI = {
  uploadToFirebase: async () => {
    // Mock implementation
    return Promise.resolve({
      data: {
        data: 'https://example.com/image.jpg'
      }
    });
  },
  AddBlog: async () => {
    // Mock implementation
    return Promise.resolve({ success: true });
  }
};

// Component QuillEditor với TypeScript
const QuillEditor: React.FC<{ onChange: (content: string) => void }> = ({ onChange }) => {
  const [quillLoaded, setQuillLoaded] = useState<boolean>(false);
  const [quillInstance, setQuillInstance] = useState<QuillType | null>(null);

  // Create a ref to hold the div element
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let mounted = true;

    const loadQuill = async () => {
      try {
        // Dynamically import Quill
        const ReactQuill = await import('quill');

        if (!mounted) return;

        // Initialize Quill directly
        if (containerRef.current) {
          const quill = new ReactQuill.default(containerRef.current, {
          theme: 'snow',
          modules: {
            toolbar: [
              ['bold', 'italic', 'underline', 'strike'],
              [{ color: [] }, { background: [] }],
              [{ list: 'ordered' }, { list: 'bullet' }],
              [{ align: [] }],
              ['link', 'image'],
              ['clean']
            ],
          },
        });

          setQuillInstance(quill);
        setQuillLoaded(true);

        // Set up the text-change handler
          quill.on('text-change', () => {
            if (onChange && quill.root) {
              onChange(quill.root.innerHTML);
          }
        });
        }
      } catch (error) {
        console.error("Failed to load Quill editor:", error);
      }
    };

    if (typeof window !== 'undefined' && !quillLoaded && containerRef.current) {
      loadQuill();
    }

    return () => {
      mounted = false;
    };
  }, [quillLoaded, onChange]);

  // Demo effect để sử dụng quillInstance (tránh lỗi linter)
  useEffect(() => {
    if (quillInstance) {
      // console.log('Quill instance is ready');
    }
  }, [quillInstance]);

  return (
    <div style={{ height: 300 }}>
      <div ref={containerRef} style={{ height: 250 }} />
    </div>
  );
};

const BlogAdd: React.FC<BlogAddProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [form] = Form.useForm();
  const [blogContent, setBlogContent] = useState<string>('');
  const [uploading, setUploading] = useState<boolean>(false);
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [imagePreview, setImagePreview] = useState<string>('');

  // Reset form when modal closes
  useEffect(() => {
    if (!isOpen) {
      form.resetFields();
      setBlogContent('');
      setFileList([]);
      setImagePreview('');
    }
  }, [isOpen, form]);

  const handleContentChange = (content: string) => {
    setBlogContent(content);
  };

  const handleUploadChange: UploadProps['onChange'] = ({ fileList: newFileList }) => {
    const newList = newFileList.slice(-1); // Chỉ giữ file mới nhất
    setFileList(newList);

    // Tạo preview nếu có file
    if (newList.length > 0 && newList[0].originFileObj) {
      const url = URL.createObjectURL(newList[0].originFileObj);
      setImagePreview(url);
    } else {
      setImagePreview('');
    }
  };

  const uploadProps: UploadProps = {
    name: 'file',
    multiple: false,
    fileList: fileList,
    accept: 'image/jpeg,image/png,image/gif',
    beforeUpload: (file) => {
      const isImage = file.type.startsWith('image/');
      if (!isImage) {
        message.error('Bạn chỉ có thể tải lên file hình ảnh!');
      }
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isLt2M) {
        message.error('Kích thước ảnh phải nhỏ hơn 2MB!');
      }
      return false; // Ngăn upload tự động
    },
    onChange: handleUploadChange,
    onRemove: () => {
      setImagePreview('');
      return true;
    },
  };

  const handleAdd = async () => {
    try {
      await form.validateFields();

      // Check if quill editor has content
      if (!blogContent || blogContent === '<p><br></p>') {
        message.error('Blog content is required');
        return;
      }

      setUploading(true);

      // Handle image upload if there's a file
      if (fileList.length > 0 && fileList[0].originFileObj) {
        try {
          const response = await BlogAPI.uploadToFirebase();
          if (response && response.data) {
            // Trong thực tế, response.data.data sẽ là URL của ảnh đã upload
            message.success('Image uploaded successfully');
          } else {
            message.error('Failed to upload image');
            setUploading(false);
            return;
          }
        } catch (error) {
          console.error("Error uploading image:", error);
          message.error('Failed to upload image');
          setUploading(false);
          return;
        }
      }

      try {
        // Directly call the API here
        await BlogAPI.AddBlog();
        message.success('Blog added successfully');
        setUploading(false); // Reset loading state before closing the modal
        handleCancel(); // Reset and close the form
        onSuccess(); // Notify parent to refresh the list
      } catch (apiError) {
        console.error("API error:", apiError);
        message.error('Failed to add blog');
        setUploading(false);
      }
    } catch (info) {
      console.log('Validate Failed:', info);
      setUploading(false);
    }
  };

  const handleCancel = () => {
    form.resetFields();
    setBlogContent('');
    setFileList([]);
    setImagePreview('');
    setUploading(false);
    onClose();
  };

  return (
    <Modal
      title="Thêm bài viết mới"
      open={isOpen}
      onCancel={handleCancel}
      okText="Thêm"
      cancelText="Hủy"
      onOk={handleAdd}
      maskClosable={false}
      width={800}
      confirmLoading={uploading}
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={{ status: 'Draft' }}
      >
        <Form.Item
          name="title"
          label="Tiêu đề bài viết"
          rules={[{ required: true, message: 'Vui lòng nhập tiêu đề bài viết' }]}
        >
          <Input placeholder="Nhập tiêu đề bài viết" />
        </Form.Item>

        <Form.Item
          name="categoryName"
          label="Danh mục"
          rules={[{ required: true, message: 'Vui lòng nhập tên danh mục' }]}
        >
          <Input placeholder="Nhập tên danh mục" />
        </Form.Item>

        <Form.Item
          label="Nội dung"
          rules={[{ required: true, message: 'Vui lòng nhập nội dung bài viết' }]}
        >
          {typeof window !== 'undefined' && (
            <QuillEditor onChange={handleContentChange} />
          )}
          {typeof window === 'undefined' && (
            <div>Đang tải trình soạn thảo...</div>
          )}
        </Form.Item>

        <Form.Item
          name="featured_image"
          label="Ảnh đại diện"
          extra="Hỗ trợ các định dạng: JPG, PNG, GIF (kích thước tối đa: 2MB)"
        >
          <Dragger {...uploadProps} style={{ marginBottom: '16px' }}>
            <p className="ant-upload-drag-icon">
              <InboxOutlined />
            </p>
            <p className="ant-upload-text">Nhấp hoặc kéo thả file vào khu vực này để tải lên</p>
            <p className="ant-upload-hint">
              Chọn một ảnh đại diện cho bài viết của bạn
            </p>
          </Dragger>
          
          {imagePreview && (
            <div style={{ marginTop: '16px', textAlign: 'center' }}>
              <img 
                src={imagePreview} 
                alt="Preview" 
                style={{ 
                  maxWidth: '100%', 
                  maxHeight: '200px',
                  objectFit: 'contain',
                  borderRadius: '4px',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
                }} 
          />
            </div>
          )}
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default BlogAdd;