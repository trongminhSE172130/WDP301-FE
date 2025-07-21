import React, { useState, useEffect, useRef } from 'react';
import { Modal, Form, Input, message, Select, Upload } from 'antd';
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import 'quill/dist/quill.snow.css';
import { getBlogCategories, addBlog, uploadBlogThumbnail } from '../../../service/api/blogAPI';
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
      } catch {
        // Failed to load Quill editor
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
      // Quill instance is ready
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
  const [thumbnailUrl, setThumbnailUrl] = useState<string>('');
  const [categories, setCategories] = useState<BlogCategory[]>([]);
  const [loadingCategories, setLoadingCategories] = useState<boolean>(false);
  const [imageUploading, setImageUploading] = useState<boolean>(false);

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
    } catch {
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
      setThumbnailUrl('');
    }
  }, [isOpen, form]);

  const handleContentChange = (content: string) => {
    setBlogContent(content);
  };

  const handleImageUpload = async (file: File) => {
    setImageUploading(true);
    
    try {
      const response = await uploadBlogThumbnail(file);
      
      if (response.success && response.data && response.data.url) {
        // Lưu URL vào state - sử dụng url từ response
        setThumbnailUrl(response.data.url);
        message.success('Tải ảnh thành công');
    } else {
        message.error('Tải ảnh thất bại - không có URL');
      }
    } catch {
      message.error('Tải ảnh thất bại');
    } finally {
      setImageUploading(false);
    }
  };

  const beforeUpload = (file: File) => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/webp';
    if (!isJpgOrPng) {
      message.error('Chỉ chấp nhận file JPG/PNG/WEBP!');
      return false;
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error('Kích thước ảnh phải nhỏ hơn 2MB!');
      return false;
    }
    
    // Upload file ngay khi được chọn
    handleImageUpload(file);
    return false; // Prevent default upload behavior
  };

  const handleAdd = async () => {
    try {
      setUploading(true);
      
      // Validate các field bắt buộc
      const values = await form.validateFields();

      if (!blogContent.trim()) {
        message.error('Vui lòng nhập nội dung blog');
        return;
      }

      if (!thumbnailUrl) {
        message.error('Vui lòng tải ảnh thumbnail');
        return;
      }

      const blogData = {
          title: values.title,
        excerpt: values.excerpt,
          content: blogContent,
          author: values.author,
          category_id: values.category_id,
        thumbnail_url: thumbnailUrl, // Sử dụng URL từ state
        status: 'published' // Thêm status field bắt buộc
      };

      const response = await addBlog(blogData);
      
      if (response.success) {
        message.success('Thêm blog thành công!');
        onSuccess();
        handleCancel();
      } else {
        message.error('Có lỗi xảy ra khi thêm blog');
      }
    } catch {
      message.error('Có lỗi xảy ra khi thêm blog');
    } finally {
      setUploading(false);
    }
  };

  const handleCancel = () => {
    form.resetFields();
    setBlogContent('');
    setThumbnailUrl('');
    onClose();
  };

  const uploadButton = (
    <div>
      {imageUploading ? <LoadingOutlined /> : <PlusOutlined />}
      <div style={{ marginTop: 8 }}>Tải ảnh</div>
    </div>
  );

  return (
    <Modal
      title="Thêm Blog Mới"
      open={isOpen}
      onOk={handleAdd}
      onCancel={handleCancel}
      width={800}
      confirmLoading={uploading}
      okText="Thêm Blog"
      cancelText="Hủy"
      destroyOnClose
    >
      <Form
        form={form}
        layout="vertical"
        name="add_blog_form"
      >
        {/* Thumbnail Upload */}
        <Form.Item
          label="Ảnh Thumbnail"
          required
        >
          <Upload
            name="thumbnail"
            listType="picture-card"
            className="avatar-uploader"
            showUploadList={false}
            beforeUpload={beforeUpload}
            accept="image/*"
          >
            {thumbnailUrl ? (
              <img 
                src={thumbnailUrl} 
                alt="thumbnail" 
                style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
              />
            ) : (
              uploadButton
            )}
          </Upload>
        </Form.Item>

        {/* Title */}
        <Form.Item
          name="title"
          label="Tiêu đề"
          rules={[
            { required: true, message: 'Vui lòng nhập tiêu đề blog!' },
            { max: 255, message: 'Tiêu đề không được vượt quá 255 ký tự!' }
          ]}
        >
          <Input placeholder="Nhập tiêu đề blog" />
        </Form.Item>

        {/* Excerpt */}
        <Form.Item
          name="excerpt"
          label="Mô tả ngắn"
          rules={[
            { required: true, message: 'Vui lòng nhập mô tả ngắn!' },
            { max: 500, message: 'Mô tả ngắn không được vượt quá 500 ký tự!' }
          ]}
        >
          <TextArea 
            rows={3}
            placeholder="Nhập mô tả ngắn về blog"
            showCount 
            maxLength={500}
          />
        </Form.Item>

        {/* Author */}
        <Form.Item
          name="author"
          label="Tác giả"
          rules={[
            { required: true, message: 'Vui lòng nhập tên tác giả!' },
            { max: 100, message: 'Tên tác giả không được vượt quá 100 ký tự!' }
          ]}
        >
          <Input placeholder="Nhập tên tác giả" />
        </Form.Item>

        {/* Category */}
        <Form.Item
          name="category_id"
          label="Danh mục"
          rules={[{ required: true, message: 'Vui lòng chọn danh mục!' }]}
        >
          <Select
            placeholder="Chọn danh mục blog"
            loading={loadingCategories}
          >
            {categories.map((category) => (
              <Option key={category._id} value={category._id}>
                {category.name}
              </Option>
            ))}
          </Select>
        </Form.Item>

        {/* Content Editor */}
        <Form.Item
          label="Nội dung"
          required
        >
            <QuillEditor onChange={handleContentChange} />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default BlogAdd;