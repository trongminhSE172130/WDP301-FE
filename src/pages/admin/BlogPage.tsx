import { useState, useEffect, useRef } from 'react';
import { Button, Modal, Image, Tag, message, Spin } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import BlogTable from '../../components/admin/blog/BlogTable';
import BlogAdd from '../../components/admin/blog/BlogAdd';
import BlogEdit from '../../components/admin/blog/BlogEdit';
import type { BlogData } from '../../components/admin/blog/BlogTypes';
import { getBlogs, deleteBlog, updateBlogStatus, getBlogDetail } from '../../service/api/blogAPI';
import type { Blog } from '../../service/api/blogAPI';

// Interface cho pagination
interface PaginationState {
  current: number;
  pageSize: number;
  total: number;
}

const BlogPage = () => {
  const [blogs, setBlogs] = useState<BlogData[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [categoryFilter, setCategoryFilter] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [sortOrder, setSortOrder] = useState<string>('');
  const isMounted = useRef(false);
  const navigate = useNavigate();

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
  const [viewLoading, setViewLoading] = useState<boolean>(false);
  const [viewBlogData, setViewBlogData] = useState<BlogData | null>(null);

  // Kiểm tra token admin khi component mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      message.error('Bạn cần đăng nhập để quản lý blog');
      navigate('/admin/login');
      return;
    }
  }, [navigate]);

  // Fetch blogs on component mount and when filters/pagination change
  useEffect(() => {
    if (!isMounted.current) {
      fetchBlogs();
      isMounted.current = true;
    }
  }, []);

  useEffect(() => {
    fetchBlogs();
  }, [pagination.current, pagination.pageSize, categoryFilter, statusFilter, sortOrder]);

  // Chuyển đổi dữ liệu API sang định dạng component
  const mapApiDataToComponentData = (apiData: Blog[]): BlogData[] => {
    return apiData.map(item => ({
      id: item._id,
      title: item.title,
      excerpt: item.excerpt,
      content: item.content,
      author: item.author,
      thumbnail_url: item.thumbnail_url,
      image: item.thumbnail_url,
      blogCategoryId: item.category_id._id,
      categoryName: item.category_id.name,
      userId: item.admin_user_id._id,
      fullName: item.admin_user_id.full_name,
      email: item.admin_user_id.email,
      status: item.status,
      view_count: item.view_count,
      like_count: item.like_count,
      createdAt: item.created_at,
      updatedAt: item.updated_at
    }));
  };

  // Function to fetch blogs
  const fetchBlogs = async () => {
    setLoading(true);
    try {
      console.log('Fetching blogs...');
      const response = await getBlogs(
        pagination.current,
        pagination.pageSize,
        categoryFilter,
        searchQuery,
        sortOrder,
        statusFilter
      );

      if (response && response.data) {
        const mappedData = mapApiDataToComponentData(response.data);
        setBlogs(mappedData);

        // Update pagination info
        if (response.pagination) {
          setPagination(prev => ({
            ...prev,
            total: response.pagination.total || 0,
            current: response.pagination.page || 1
          }));
        }
      } else {
        setBlogs([]);
        console.error("Unexpected API response structure:", response);
      }
    } catch (error) {
      message.error('Không thể tải danh sách bài viết');
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
  const showViewModal = async (blog: BlogData) => {
    setCurrentBlog(blog); // Thiết lập blog từ danh sách (để hiển thị ngay)
    setViewLoading(true);
    setIsViewModalVisible(true);
    
    try {
      // Gọi API để lấy thông tin chi tiết mới nhất
      const response = await getBlogDetail(blog.id);
      if (response && response.success && response.data) {
        // Chuyển đổi dữ liệu API thành định dạng của component
        const detailData: BlogData = {
          id: response.data._id,
          title: response.data.title,
          excerpt: response.data.excerpt,
          content: response.data.content,
          author: response.data.author,
          thumbnail_url: response.data.thumbnail_url,
          image: response.data.thumbnail_url,
          blogCategoryId: response.data.category_id._id,
          categoryName: response.data.category_id.name,
          userId: response.data.admin_user_id._id,
          fullName: response.data.admin_user_id.full_name,
          email: response.data.admin_user_id.email,
          status: response.data.status,
          view_count: response.data.view_count,
          like_count: response.data.like_count,
          createdAt: response.data.created_at,
          updatedAt: response.data.updated_at
        };
        setViewBlogData(detailData);
      } else {
        message.error('Không thể tải thông tin chi tiết bài viết');
      }
    } catch (error) {
      console.error('Lỗi khi tải chi tiết bài viết:', error);
      message.error('Không thể tải chi tiết bài viết');
    } finally {
      setViewLoading(false);
    }
  };

  // Function to handle delete blog
  const handleDeleteBlog = async (id: string) => {
    try {
      await deleteBlog(id);
      message.success('Xóa bài viết thành công');
      fetchBlogs(); // Refresh blogs after deletion
    } catch (error) {
      message.error('Xóa bài viết thất bại');
      console.error(error);
    }
  };

  // Function to handle search
  const handleSearch = (value: string) => {
    setSearchQuery(value);
    setPagination(prev => ({
      ...prev,
      current: 1
    }));
    // Will trigger useEffect to fetch data
  };

  // Handle category filter change
  const handleCategoryFilter = (value: string) => {
    setCategoryFilter(value);
    setPagination(prev => ({
      ...prev,
      current: 1
    }));
  };

  // Handle status filter change
  const handleStatusFilter = (value: string) => {
    setStatusFilter(value);
    setPagination(prev => ({
      ...prev,
      current: 1
    }));
  };

  // Handle sort change
  const handleSortChange = (value: string) => {
    setSortOrder(value);
  };

  // Handle pagination change
  const handlePaginationChange = (page: number, pageSize: number) => {
    setPagination(prev => ({
      ...prev,
      current: page,
      pageSize: pageSize
    }));
  };

  // Function to handle status change
  const handleStatusChange = async (id: string, checked: boolean) => {
    try {
      const newStatus = checked ? 'published' : 'draft';
      await updateBlogStatus(id, newStatus);
      message.success(`Đã ${checked ? 'xuất bản' : 'chuyển thành bản nháp'} bài viết`);
      fetchBlogs(); // Refresh blogs after status change
    } catch (error) {
      message.error('Cập nhật trạng thái bài viết thất bại');
      console.error(error);
    }
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
        onCategoryFilter={handleCategoryFilter}
        onStatusFilter={handleStatusFilter}
        onSortChange={handleSortChange}
        onStatusChange={handleStatusChange}
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
        onCancel={() => {
          setIsViewModalVisible(false);
          setViewBlogData(null);
        }}
        footer={[
          <Button key="close" onClick={() => {
            setIsViewModalVisible(false);
            setViewBlogData(null);
          }}>
            Đóng
          </Button>
        ]}
        width={800}
      >
        {viewLoading ? (
          <div style={{ textAlign: 'center', padding: '50px 0' }}>
            <Spin size="large" />
            <p style={{ marginTop: 16 }}>Đang tải thông tin chi tiết...</p>
          </div>
        ) : (
          (viewBlogData || currentBlog) && (
            <div>
              <Image
                src={(viewBlogData || currentBlog)?.thumbnail_url || ''}
                alt={(viewBlogData || currentBlog)?.title || ''}
                style={{ width: '100%', height: 300, objectFit: 'contain', marginBottom: 16 }}
              />
              <h2 style={{ fontSize: 24, fontWeight: 'bold' }}>{(viewBlogData || currentBlog)?.title}</h2>
              <div style={{ marginBottom: 16 }}>
                <Tag color="blue">{(viewBlogData || currentBlog)?.categoryName}</Tag>
                <span style={{ marginLeft: 8, color: '#666' }}>
                  Tác giả: {(viewBlogData || currentBlog)?.author}
                </span>
                <span style={{ marginLeft: 8, color: '#666' }}>
                  Người đăng: {(viewBlogData || currentBlog)?.fullName}
                </span>
                <Tag color={(viewBlogData || currentBlog)?.status === 'published' ? 'green' : 'orange'} style={{ marginLeft: 8 }}>
                  {(viewBlogData || currentBlog)?.status === 'published' ? 'Đã xuất bản' : 'Bản nháp'}
                </Tag>
              </div>
              <p style={{ marginBottom: 16, fontStyle: 'italic' }}>{(viewBlogData || currentBlog)?.excerpt}</p>
              <div dangerouslySetInnerHTML={{ __html: (viewBlogData || currentBlog)?.content || '' }}></div>
              <div style={{ marginTop: 16, fontSize: 12, color: '#999' }}>
                <p>Lượt xem: {(viewBlogData || currentBlog)?.view_count}</p>
                <p>Lượt thích: {(viewBlogData || currentBlog)?.like_count}</p>
                <p>Ngày tạo: {new Date((viewBlogData || currentBlog)?.createdAt || '').toLocaleString('vi-VN')}</p>
                <p>Cập nhật: {new Date((viewBlogData || currentBlog)?.updatedAt || '').toLocaleString('vi-VN')}</p>
              </div>
            </div>
          )
        )}
      </Modal>
    </div>
  );
};

export default BlogPage;