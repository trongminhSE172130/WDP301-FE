import { useState, useEffect } from 'react';
import { Button, Modal, Image, Tag, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import BlogTable from '../../components/admin/blog/BlogTable';
import BlogAdd from '../../components/admin/blog/BlogAdd';
import BlogEdit from '../../components/admin/blog/BlogEdit';
import { blogsData } from '../../components/admin/blog/BlogData';
import type { BlogData } from '../../components/admin/blog/BlogTypes';

// Interface cho API response
interface ApiResponse<T> {
  data: {
    data: T;
    metaData?: {
      currentPage: number;
      pageSize: number;
      totalCount: number;
    };
  };
}

// Interface cho pagination
interface PaginationState {
  current: number;
  pageSize: number;
  total: number;
}

// Interface cho API blog
interface BlogAPIType {
  GetBlogs: (page: number, pageSize: number) => Promise<ApiResponse<BlogData[]>>;
  searchBlog: (query: string, page?: number, pageSize?: number) => Promise<ApiResponse<BlogData[]>>;
  DeleteBlog: (blogId: string | number) => Promise<{ success: boolean }>;
  UpdateBlog: (blogData: Partial<BlogData>) => Promise<{ success: boolean }>;
  AddBlog: (blogData: Partial<BlogData>) => Promise<{ success: boolean }>;
  uploadToFirebase: (file: File) => Promise<ApiResponse<string>>;
}

// Mock BlogAPI service
const BlogAPI: BlogAPIType = {
  GetBlogs: async (page: number, pageSize: number) => {
    // Mock implementation - sử dụng dữ liệu từ BlogData.ts
    const start = (page - 1) * pageSize;
    const end = page * pageSize;
    const data = blogsData.slice(start, end);
    
    return Promise.resolve({
      data: {
        data: data,
        metaData: {
          currentPage: page,
          pageSize: pageSize,
          totalCount: blogsData.length
        }
      }
    });
  },
  searchBlog: async (query: string, page?: number, pageSize?: number) => {
    // Mock implementation với tìm kiếm
    const searchResults = blogsData.filter(blog => 
      blog.title.toLowerCase().includes(query.toLowerCase()) || 
      blog.content.toLowerCase().includes(query.toLowerCase())
    );
    
    const actualPage = page || 1;
    const actualPageSize = pageSize || 10;
    const start = (actualPage - 1) * actualPageSize;
    const end = actualPage * actualPageSize;
    
    return Promise.resolve({
      data: {
        data: searchResults.slice(start, end),
        metaData: {
          currentPage: actualPage,
          pageSize: actualPageSize,
          totalCount: searchResults.length
        }
      }
    });
  },
  DeleteBlog: async () => {
    return Promise.resolve({ success: true });
  },
  UpdateBlog: async () => {
    return Promise.resolve({ success: true });
  },
  AddBlog: async () => {
    return Promise.resolve({ success: true });
  },
  uploadToFirebase: async () => {
    return Promise.resolve({
      data: {
        data: 'https://example.com/image.jpg'
      }
    });
  }
};

const BlogPage = () => {
  const [blogs, setBlogs] = useState<BlogData[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Add pagination states
  const [pagination, setPagination] = useState<PaginationState>({
    current: 1,
    pageSize: 10,
    total: 0
  });

  // States for modal visibility
  const [isAddModalVisible, setIsAddModalVisible] = useState<boolean>(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState<boolean>(false);
  const [isViewModalVisible, setIsViewModalVisible] = useState<boolean>(false);
  const [currentBlog, setCurrentBlog] = useState<BlogData | null>(null);

  // Fetch blogs on component mount
  useEffect(() => {
    fetchBlogs();
  }, [pagination.current, pagination.pageSize]);

  // Function to fetch blogs
  const fetchBlogs = async () => {
    setLoading(true);
    try {
      let response;
      if (searchQuery) {
        response = await BlogAPI.searchBlog(searchQuery, pagination.current, pagination.pageSize);
      } else {
        response = await BlogAPI.GetBlogs(pagination.current, pagination.pageSize);
      }

      if (response && response.data) {
        setBlogs(response.data.data || []);

        // Update total count for pagination using the metaData structure
        if (response.data.metaData) {
          setPagination(prev => ({
            ...prev,
            total: response.data.metaData?.totalCount || 0,
            current: response.data.metaData?.currentPage || 1
          }));
        }
      } else {
        setBlogs([]);
        console.error("Unexpected API response structure:", response);
      }
    } catch (error) {
      message.error('Failed to fetch blogs');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Function to show edit modal
  const showEditModal = (blog: BlogData) => {
    setCurrentBlog(blog);
    setIsEditModalVisible(true);
  };

  // Function to show view modal
  const showViewModal = (blog: BlogData) => {
    setCurrentBlog(blog);
    setIsViewModalVisible(true);
  };

  // Function to handle delete blog
  const handleDeleteBlog = async (blogId: string | number) => {
    try {
      await BlogAPI.DeleteBlog(blogId);
      message.success('Blog deleted successfully');
      fetchBlogs(); // Refresh blogs after deletion
    } catch (error) {
      message.error('Failed to delete blog');
      console.error(error);
    }
  };

  // Function to handle search
  const handleSearch = async (value: string) => {
    setSearchQuery(value);
    setLoading(true);
    // Reset to first page when searching
    setPagination(prev => ({
      ...prev,
      current: 1
    }));

    try {
      if (value.trim() === '') {
        // If search query is empty, fetch all blogs
        fetchBlogs();
        return;
      }

      const response = await BlogAPI.searchBlog(value);
      if (response && response.data) {
        setBlogs(response.data.data || []);

        // Update pagination with metadata from search results
        if (response.data.metaData) {
          setPagination(prev => ({
            ...prev,
            total: response.data.metaData?.totalCount || 0,
            current: response.data.metaData?.currentPage || 1
          }));
        } else {
          // If no metadata, just use the array length
          setPagination(prev => ({
            ...prev,
            total: Array.isArray(response.data.data) ? response.data.data.length : 0
          }));
        }
      } else {
        setBlogs([]);
        setPagination(prev => ({ ...prev, total: 0 }));
      }
    } catch (error) {
      message.error('Failed to search blogs');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Handle pagination change
  const handlePaginationChange = (page: number, pageSize: number) => {
    setPagination(prev => ({
      ...prev,
      current: page,
      pageSize: pageSize
    }));
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Quản lý Blog</h2>
        <div>
          <Button
            type="primary"
            onClick={() => setIsAddModalVisible(true)}
            className="h-9 rounded"
            icon={<PlusOutlined />}
          >
            Thêm bài viết mới
          </Button>
        </div>
      </div>

      <BlogTable
        blogs={blogs}
        loading={loading}
        onEdit={showEditModal}
        onDelete={handleDeleteBlog}
        onView={showViewModal}
        onSearch={handleSearch}
        searchQuery={searchQuery}
        pagination={{
          current: pagination.current,
          pageSize: pagination.pageSize,
          total: pagination.total,
          onChange: handlePaginationChange
        }}
      />

      <BlogAdd
        isOpen={isAddModalVisible}
        onClose={() => setIsAddModalVisible(false)}
        onSuccess={fetchBlogs}
      />

      <BlogEdit
        isOpen={isEditModalVisible}
        onClose={() => setIsEditModalVisible(false)}
        onSuccess={fetchBlogs}
        blog={currentBlog}
      />

      {/* View Blog Modal */}
      <Modal
        title="Chi tiết bài viết"
        open={isViewModalVisible}
        onCancel={() => setIsViewModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setIsViewModalVisible(false)}>
            Đóng
          </Button>
        ]}
        width={800}
      >
        {currentBlog && (
          <div>
            <Image
              src={currentBlog.image}
              alt={currentBlog.title}
              style={{ width: '100%', height: 300, objectFit: 'contain', marginBottom: 16 }}
            />
            <h2 style={{ fontSize: 24, fontWeight: 'bold' }}>{currentBlog.title}</h2>
            <div style={{ marginBottom: 16 }}>
              <Tag color="blue">{currentBlog.categoryName}</Tag>
              <span style={{ marginLeft: 8, color: '#666' }}>
                Tác giả: {currentBlog.fullName}
              </span>
            </div>
            <div dangerouslySetInnerHTML={{ __html: currentBlog.content }}></div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default BlogPage;