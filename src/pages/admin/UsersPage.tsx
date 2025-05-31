import React, { useState } from 'react';
import { Typography, message } from 'antd';
import UserTable from '../../components/admin/user/UserTable';
import type { User } from '../../components/admin/user/UserTable';
import UserSearch from '../../components/admin/user/UserSearch';
import UserForm from '../../components/admin/user/UserForm';
import type { SearchFormValues } from '../../components/admin/user/UserSearch';
import type { FormValues } from '../../components/admin/user/UserForm';
  
const { Title } = Typography;

// Dữ liệu mẫu
const dummyUsers: User[] = [
  {
    id: 1,
    name: 'Nguyễn Văn A',
    email: 'nguyenvana@example.com',
    role: 'admin',
    status: 'active',
    createdAt: '01/05/2023',
  },
  {
    id: 2,
    name: 'Trần Thị B',
    email: 'tranthib@example.com',
    role: 'staff',
    status: 'active',
    createdAt: '15/05/2023',
  },
  {
    id: 3,
    name: 'Lê Văn C',
    email: 'levanc@example.com',
    role: 'user',
    status: 'inactive',
    createdAt: '20/05/2023',
  },
  {
    id: 4,
    name: 'Phạm Thị D',
    email: 'phamthid@example.com',
    role: 'staff',
    status: 'active',
    createdAt: '25/05/2023',
  },
  {
    id: 5,
    name: 'Hoàng Văn E',
    email: 'hoangvane@example.com',
    role: 'user',
    status: 'active',
    createdAt: '30/05/2023',
  },
];

// Danh sách vai trò
const roles = ['Quản trị viên', 'Nhân viên', 'Người dùng'];

// Danh sách trạng thái
const statuses = ['Hoạt động', 'Không hoạt động'];

const UsersPage: React.FC = () => {
  const [users, setUsers] = useState<User[]>(dummyUsers);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | undefined>(undefined);

  // Xử lý tìm kiếm người dùng
  const handleSearch = (values: SearchFormValues) => {
    setLoading(true);
    
    // Giả lập gọi API tìm kiếm
    setTimeout(() => {
      const { keyword, role, status } = values;
      let filteredUsers = [...dummyUsers];
      
      if (keyword) {
        filteredUsers = filteredUsers.filter(
          user => user.name.toLowerCase().includes(keyword.toLowerCase()) || 
                  user.email.toLowerCase().includes(keyword.toLowerCase())
        );
      }
      
      if (role) {
        filteredUsers = filteredUsers.filter(user => user.role === role.toLowerCase());
      }
      
      if (status) {
        filteredUsers = filteredUsers.filter(user => user.status === status.toLowerCase());
      }
      
      setUsers(filteredUsers);
      setLoading(false);
    }, 500);
  };

  // Xử lý reset tìm kiếm
  const handleReset = () => {
    setUsers(dummyUsers);
  };

  // Xử lý thêm người dùng
  const handleAdd = () => {
    setCurrentUser(undefined);
    setShowForm(true);
  };

  // Xử lý chỉnh sửa người dùng
  const handleEdit = (user: User) => {
    setCurrentUser(user);
    setShowForm(true);
  };

  // Xử lý xóa người dùng
  const handleDelete = (userId: number) => {
    setLoading(true);
    
    // Giả lập gọi API xóa
    setTimeout(() => {
      setUsers(users.filter(user => user.id !== userId));
      message.success('Xóa người dùng thành công!');
      setLoading(false);
    }, 500);
  };

  // Xử lý submit form
  const handleFormSubmit = (values: FormValues) => {
    setLoading(true);
    
    // Giả lập gọi API thêm/cập nhật
    setTimeout(() => {
      if (values.id) {
        // Cập nhật người dùng
        setUsers(users.map(user => user.id === values.id ? { ...user, ...values } : user));
        message.success('Cập nhật người dùng thành công!');
      } else {
        // Thêm người dùng mới
        const newUser: User = {
          id: Math.max(...users.map(user => user.id)) + 1,
          name: values.name,
          email: values.email,
          role: values.role,
          status: values.status,
          createdAt: new Date().toLocaleDateString('vi-VN'),
        };
        setUsers([...users, newUser]);
        message.success('Thêm người dùng thành công!');
      }
      setLoading(false);
      setShowForm(false);
    }, 800);
  };

  return (
    <div className="w-full">
      <Title level={2}>Quản lý người dùng</Title>
      
      {/* Search Form */}
      <UserSearch 
        onSearch={handleSearch}
        onAdd={handleAdd}
        onReset={handleReset}
        roles={roles}
        statuses={statuses}
        loading={loading}
      />
      
      {/* User Table */}
      <UserTable 
        data={users} 
        onEdit={handleEdit} 
        onDelete={handleDelete}
        loading={loading}
      />
      
      {/* User Form */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg w-full max-w-xl">
            <UserForm
              user={currentUser}
              onFinish={handleFormSubmit}
              loading={loading}
              title={currentUser ? 'Chỉnh sửa người dùng' : 'Thêm người dùng mới'}
            />
            <div className="p-4 flex justify-end">
              <button 
                onClick={() => setShowForm(false)} 
                className="px-4 py-2 text-gray-500 hover:text-gray-700"
              >
                Hủy
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UsersPage; 