import React, { useEffect, useState, useRef } from 'react';
import { Modal, Form, Input, message, Typography, Upload } from 'antd';
import { InboxOutlined } from '@ant-design/icons';
import type { UploadFile, UploadProps } from 'antd/es/upload/interface';
import 'quill/dist/quill.snow.css';

const { Text } = Typography;
const { Dragger } = Upload;

// Định nghĩa các kiểu dữ liệu
interface BlogData {
  id: string | number;
  title: string;
  content: string;
  image: string;
  blogCategoryId: number | string;
  categoryName: string;
  userId: number | string;
  fullName: string;
}

interface BlogEditProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  blog: BlogData | null;
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
  UpdateBlog: async () => {
    // Mock implementation
    return Promise.resolve({ success: true });
  }
};

// Component QuillEditor với TypeScript
interface QuillEditorProps {
  onChange: (content: string) => void;
  initialContent?: string;
}

const QuillEditor: React.FC<QuillEditorProps> = ({ onChange, initialContent }) => {
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

  // Set initial content when quill is ready and content is provided
  useEffect(() => {
    if (quillInstance && initialContent) {
      quillInstance.clipboard.dangerouslyPasteHTML(initialContent);
    }
  }, [quillInstance, initialContent]);

  return (
    <div style={{ height: 300 }}>
      <div ref={containerRef} style={{ height: 250 }} />
    </div>
  );
};

const BlogEdit: React.FC<BlogEditProps> = ({
  isOpen,
  onClose,
  onSuccess,
  blog
}) => {
  const [form] = Form.useForm();
  const [blogContent, setBlogContent] = useState<string>('');
  const [uploading, setUploading] = useState<boolean>(false);
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [imagePreview, setImagePreview] = useState<string>('');

  // Update form when blog data changes or modal opens
  useEffect(() => {
    if (isOpen && blog) {
      // Set form values based on the blog data from API
      form.setFieldsValue({
        title: blog.title,
        categoryName: blog.categoryName,
      });

      // Set content for the editor
      setBlogContent(blog.content || '');
      
      // Set image preview if there's an existing image
      if (blog.image) {
        setImagePreview(blog.image);
      } else {
        setImagePreview('');
      }
      
      setFileList([]);
    }
  }, [isOpen, blog, form]);

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
    } else if (blog && blog.image && newList.length === 0) {
      // Nếu xóa file mới tải lên và có ảnh cũ, quay về ảnh cũ
      setImagePreview(blog.image);
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
      if (blog && blog.image) {
        // Nếu xóa file mới và có ảnh cũ, quay về ảnh cũ
        setImagePreview(blog.image);
      } else {
        setImagePreview('');
      }
      return true;
    },
  };

  const handleUpdate = async () => {
    try {
      await form.validateFields();

      // Check if quill editor has content
      if (!blogContent || blogContent === '<p><br></p>') {
        message.error('Nội dung bài viết là bắt buộc');
        return;
      }

      setUploading(true);

      // Handle image upload if there's a new file
      if (fileList.length > 0 && fileList[0].originFileObj) {
        try {
          const response = await BlogAPI.uploadToFirebase();
          if (response && response.data) {
            // Trong thực tế, URL ảnh sẽ được lưu vào data của blog
            message.success('Tải lên ảnh thành công');
          } else {
            message.error('Tải lên ảnh thất bại');
            setUploading(false);
            return;
          }
        } catch (error) {
          console.error("Error uploading image:", error);
          message.error('Tải lên ảnh thất bại');
          setUploading(false);
          return;
        }
      }

      if (!blog) {
        message.error('Dữ liệu blog bị thiếu');
        setUploading(false);
        return;
      }

      try {
        await BlogAPI.UpdateBlog();
        message.success('Cập nhật blog thành công');
        setFileList([]);
        onClose(); // Close the modal
        onSuccess(); // Notify parent to refresh the list
      } catch (apiError) {
        console.error("API error:", apiError);
        message.error('Cập nhật blog thất bại');
      } finally {
        setUploading(false);
      }
    } catch (info) {
      console.log('Validate Failed:', info);
      setUploading(false);
    }
  };

  const handleCancel = () => {
    form.resetFields();
    setFileList([]);
    setUploading(false);
    onClose();
  };

  return (
    <Modal
      title="Chỉnh sửa bài viết"
      open={isOpen}
      onCancel={handleCancel}
      okText="Cập nhật"
      cancelText="Hủy"
      onOk={handleUpdate}
      maskClosable={false}
      width={800}
      confirmLoading={uploading}
    >
      <Form
        form={form}
        layout="vertical"
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
            <QuillEditor
              onChange={handleContentChange}
              initialContent={blog?.content || ''}
            />
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
              Chọn một ảnh đại diện mới hoặc giữ nguyên ảnh hiện tại
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
              <Text type="secondary" style={{ display: 'block', marginTop: '8px' }}>
                {fileList.length > 0 ? 'Ảnh mới đã chọn' : 'Ảnh hiện tại'}
              </Text>
            </div>
          )}
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default BlogEdit;