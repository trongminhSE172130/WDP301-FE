import React, { useState, useEffect } from 'react';
import { Typography, message } from 'antd';
import UserTable from '../../components/admin/user/UserTable';
import type { User } from '../../components/admin/user/UserTable';
import UserSearch from '../../components/admin/user/UserSearch';
import type { SearchFormValues } from '../../components/admin/user/UserSearch';
import { 
  getAllUsers, 
  type GetUsersParams, 
  type Pagination 
} from '../../service/api/userAPI';
  
const { Title } = Typography;

// Danh sách vai trò
const roles = ['user', 'consultant', 'admin'];

// Danh sách trạng thái (có thể dùng cho filter tương lai)
const statuses = ['active', 'inactive'];

const UsersPage: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState<Pagination>({
    currentPage: 1,
    totalPages: 1,
    totalUsers: 0,
    hasNext: false,
    hasPrev: false
  });
  const [currentPageSize, setCurrentPageSize] = useState(10);

  // Lấy danh sách users từ API
  const fetchUsers = async (params?: GetUsersParams) => {
    try {
      setLoading(true);
      const response = await getAllUsers(params);
      
      if (response.success) {
        setUsers(response.data);
        setPagination(response.pagination);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      message.error('Có lỗi xảy ra khi tải danh sách người dùng');
    } finally {
      setLoading(false);
    }
  };

  // Load users khi component mount
  useEffect(() => {
    fetchUsers({ page: 1, limit: currentPageSize });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Xử lý phân trang
  const handlePageChange = (page: number, pageSize?: number) => {
    console.log('handlePageChange called:', { page, pageSize, currentPageSize });
    
    if (pageSize && pageSize !== currentPageSize) {
      // Khi thay đổi page size, reset về trang 1
      setCurrentPageSize(pageSize);
      fetchUsers({ page: 1, limit: pageSize });
    } else {
      // Chỉ thay đổi page
      fetchUsers({ page, limit: currentPageSize });
    }
  };

  // Xử lý tìm kiếm người dùng
  const handleSearch = (values: SearchFormValues) => {
    const params: GetUsersParams = {
      page: 1,
      limit: currentPageSize,
      search: values.keyword,
      role: values.role,
      status: values.status
    };
    fetchUsers(params);
  };

  // Xử lý reset tìm kiếm
  const handleReset = () => {
    fetchUsers({ page: 1, limit: currentPageSize });
  };

  return (
    <div className="w-full">
      <Title level={2}>Quản lý người dùng</Title>
      
      {/* Search Form */}
      <UserSearch 
        onSearch={handleSearch}
        onReset={handleReset}
        roles={roles}
        statuses={statuses}
        loading={loading}
      />
      
      {/* User Table */}
      <UserTable 
        data={users} 
        loading={loading}
        pagination={pagination}
        onPageChange={handlePageChange}
        currentPageSize={currentPageSize}
      />
    </div>
  );
};

export default UsersPage; 