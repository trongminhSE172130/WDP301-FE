import React, { useEffect, useState, useRef } from 'react';
import { Modal, Form, Input, message, Typography, Select } from 'antd';
import { LinkOutlined } from '@ant-design/icons';
import 'quill/dist/quill.snow.css';
import type { BlogData } from './BlogTypes';
import { updateBlog, getBlogCategories } from '../../../service/api/blogAPI';
import type { BlogCategory } from '../../../service/api/blogAPI';

const { Text } = Typography;
const { Option } = Select;
const { TextArea } = Input;

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

interface BlogEditProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  blog: BlogData | null;
}

const BlogEdit: React.FC<BlogEditProps> = ({
  isOpen,
  onClose,
  onSuccess,
  blog
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

  // Update form when blog data changes or modal opens
  useEffect(() => {
    if (isOpen && blog) {
      // Set form values based on the blog data from API
      form.setFieldsValue({
        title: blog.title,
        excerpt: blog.excerpt,
        author: blog.author,
        category_id: blog.blogCategoryId,
        thumbnail_url: blog.thumbnail_url
      });

      // Set content for the editor
      setBlogContent(blog.content || '');
      
      // Set image preview if there's an existing image
      if (blog.thumbnail_url) {
        setImagePreview(blog.thumbnail_url);
      } else {
        setImagePreview('');
      }
    }
  }, [isOpen, blog, form]);

  const handleImageUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value.trim();
    
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

  const handleContentChange = (content: string) => {
    setBlogContent(content);
  };

  const handleUpdate = async () => {
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

      if (!blog) {
        message.error('Dữ liệu blog bị thiếu');
        setUploading(false);
        return;
      }

      try {
        // Gọi API cập nhật blog
        await updateBlog(blog.id, {
          title: values.title,
          excerpt: values.excerpt,
          content: blogContent,
          author: values.author,
          category_id: values.category_id,
          thumbnail_url: thumbnailUrl
        });
        
        message.success('Cập nhật blog thành công');
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
              <Text type="secondary" style={{ display: 'block', marginTop: '8px' }}>
                Xem trước ảnh
              </Text>
            </div>
          )}
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
      </Form>
    </Modal>
  );
};

export default BlogEdit;