import React, { useState, useEffect, useRef } from 'react';
import { Modal, Form, Input, message, Select } from 'antd';
import { LinkOutlined } from '@ant-design/icons';
import 'quill/dist/quill.snow.css';
import { getBlogCategories, addBlog } from '../../../service/api/blogAPI';
import type { BlogCategory } from '../../../service/api/blogAPI';

const { Option } = Select;
const { TextArea } = Input;

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
  const [imagePreview, setImagePreview] = useState<string>('');
  const [categories, setCategories] = useState<BlogCategory[]>([]);
  const [loadingCategories, setLoadingCategories] = useState<boolean>(false);

  // Fetch categories on mount
  useEffect(() => {
    if (isOpen) {
      fetchCategories();
    }
  }, [isOpen]);

  // Fetch danh mục blog từ API
  const fetchCategories = async () => {
    setLoadingCategories(true);
    try {
      const response = await getBlogCategories();
      if (response.success && response.data) {
        setCategories(response.data);
      } else {
        message.error('Không thể tải danh mục blog');
      }
    } catch (error) {
      console.error('Lỗi khi tải danh mục blog:', error);
      message.error('Không thể tải danh mục blog');
    } finally {
      setLoadingCategories(false);
    }
  };

  // Reset form when modal closes
  useEffect(() => {
    if (!isOpen) {
      form.resetFields();
      setBlogContent('');
      setImagePreview('');
    }
  }, [isOpen, form]);

  const handleContentChange = (content: string) => {
    setBlogContent(content);
  };

  const handleImageUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value.trim();
    
    // Cập nhật giá trị vào form
    form.setFieldValue('thumbnail_url', url);
    
    // Chỉ đặt preview nếu URL có vẻ hợp lệ
    if (url.startsWith('http://') || url.startsWith('https://')) {
      setImagePreview(url);
    } else if (url) {
      // Nếu người dùng không nhập http/https, thử thêm vào
      const httpsUrl = `https://${url}`;
      setImagePreview(httpsUrl);
    } else {
      setImagePreview('');
    }
  };

  const handleAdd = async () => {
    try {
      const values = await form.validateFields();

      // Check if quill editor has content
      if (!blogContent || blogContent === '<p><br></p>') {
        message.error('Nội dung bài viết là bắt buộc');
        return;
      }

      setUploading(true);

      let thumbnailUrl = values.thumbnail_url;
      
      // Chuẩn hóa URL (thêm https:// nếu chưa có)
      if (thumbnailUrl && !thumbnailUrl.startsWith('http://') && !thumbnailUrl.startsWith('https://')) {
        thumbnailUrl = `https://${thumbnailUrl}`;
      }

      try {
        // Gọi API thêm blog
        console.log('Đang gửi dữ liệu blog:', {
          title: values.title,
          excerpt: values.excerpt || '',
          content: blogContent,
          author: values.author,
          category_id: values.category_id,
          thumbnail_url: thumbnailUrl,
          status: values.status || 'draft'
        });
        
        await addBlog({
          title: values.title,
          excerpt: values.excerpt || '',
          content: blogContent,
          author: values.author,
          category_id: values.category_id,
          thumbnail_url: thumbnailUrl,
          status: values.status || 'draft'
        });
        
        message.success('Thêm bài viết thành công');
        setUploading(false);
        handleCancel();
        onSuccess();
      } catch (apiError) {
        console.error("API error:", apiError);
        message.error('Thêm bài viết thất bại');
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
        initialValues={{ status: 'draft' }}
      >
        <Form.Item
          name="title"
          label="Tiêu đề bài viết"
          rules={[{ required: true, message: 'Vui lòng nhập tiêu đề bài viết' }]}
        >
          <Input placeholder="Nhập tiêu đề bài viết" />
        </Form.Item>

        <Form.Item
          name="excerpt"
          label="Tóm tắt"
          rules={[{ required: true, message: 'Vui lòng nhập tóm tắt bài viết' }]}
        >
          <TextArea 
            placeholder="Nhập tóm tắt ngắn gọn về bài viết" 
            rows={3}
            maxLength={200}
            showCount 
          />
        </Form.Item>

        <Form.Item
          name="category_id"
          label="Danh mục"
          rules={[{ required: true, message: 'Vui lòng chọn danh mục' }]}
        >
          <Select
            placeholder="Chọn danh mục"
            loading={loadingCategories}
            allowClear
          >
            {categories.map(category => (
              <Option key={category._id} value={category._id}>
                {category.name}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          name="author"
          label="Tác giả"
          rules={[{ required: true, message: 'Vui lòng nhập tên tác giả' }]}
        >
          <Input placeholder="Nhập tên tác giả" />
        </Form.Item>

        <Form.Item
          name="status"
          label="Trạng thái"
          rules={[{ required: true, message: 'Vui lòng chọn trạng thái' }]}
        >
          <Select placeholder="Chọn trạng thái">
            <Option value="draft">Bản nháp</Option>
            <Option value="published">Xuất bản</Option>
          </Select>
        </Form.Item>

        <Form.Item
          name="thumbnail_url"
          label="Ảnh đại diện"
          extra="Nhập URL ảnh (ví dụ: https://example.com/image.jpg)"
          rules={[{ required: true, message: 'Vui lòng cung cấp URL ảnh đại diện' }]}
        >
          <Input
            placeholder="Nhập URL ảnh (ví dụ: https://example.com/image.jpg)"
            onChange={handleImageUrlChange}
            prefix={<LinkOutlined />}
          />
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
      </Form>
    </Modal>
  );
};

export default BlogAdd;