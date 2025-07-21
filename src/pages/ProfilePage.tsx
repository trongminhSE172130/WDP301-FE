import React, { useState } from 'react';
import { updateProfile } from '../service/api/authApi';
import type { ProfileData } from '../context/ProfileContext';
import { useProfile } from '../context/ProfileContext';

const ProfilePage: React.FC = () => {
  const { profile, setProfile } = useProfile();
  const [showEdit, setShowEdit] = useState(false);
  const [editData, setEditData] = useState<Partial<ProfileData>>({});
  const [editLoading, setEditLoading] = useState(false);
  const [editError, setEditError] = useState<string | null>(null);

  if (!profile) return <div className="p-8 text-center">Đang tải thông tin...</div>;

  const openEdit = () => {
    setEditData({
      full_name: profile.full_name,
      gender: profile.gender,
      dob: profile.dob ? profile.dob.slice(0, 10) : '',
      phone: profile.phone,
    });
    setShowEdit(true);
    setEditError(null);
  };

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setEditData((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setEditLoading(true);
    setEditError(null);
    try {
      const res = await updateProfile(editData);
      setProfile(res.data.data);
      setShowEdit(false);
    } catch {
      setEditError('Cập nhật thất bại.');
    } finally {
      setEditLoading(false);
    }
  };

  // Helper format date
  const formatDate = (dateStr: string) => {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    return d.toLocaleDateString('vi-VN');
  };

  return (
    <div className="container mx-auto px-6 py-6 bg-white rounded-4xl border border-gray-300">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 mb-2">Thông tin chi tiết</h1>
            <p className="text-gray-600">Quản lý thông tin cá nhân của bạn</p>
          </div>
          <button
            className="px-4 py-2 text-[#3B9AB8] hover:text-[#2d7a94] transition-colors border border-[#3B9AB8] rounded-2xl flex items-center gap-2"
            onClick={openEdit}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
            </svg>
            <span>Chỉnh sửa</span>
          </button>
        </div>

        {/* Edit Modal */}
        {showEdit && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Overlay blur */}
            <div className="absolute inset-0 bg-black/20 backdrop-blur-sm"></div>
            {/* Modal */}
            <div className="relative bg-white rounded-xl shadow-lg p-8 w-full max-w-md border border-gray-200 z-10">
              <button
                className="absolute top-2 right-2 text-gray-400 hover:text-gray-700 text-2xl"
                onClick={() => setShowEdit(false)}
                aria-label="Đóng"
              >
                &times;
              </button>
              <h2 className="text-xl font-bold mb-4">Chỉnh sửa thông tin</h2>
              <form onSubmit={handleEditSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Họ và tên</label>
                  <input
                    type="text"
                    name="full_name"
                    value={editData.full_name || ''}
                    onChange={handleEditChange}
                    className="w-full border rounded-lg px-3 py-2"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Giới tính</label>
                  <select
                    name="gender"
                    value={editData.gender || ''}
                    onChange={handleEditChange}
                    className="w-full border rounded-lg px-3 py-2"
                    required
                  >
                    <option value="">Chọn giới tính</option>
                    <option value="male">Nam</option>
                    <option value="female">Nữ</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Ngày sinh</label>
                  <input
                    type="date"
                    name="dob"
                    value={editData.dob || ''}
                    onChange={handleEditChange}
                    className="w-full border rounded-lg px-3 py-2"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Số điện thoại</label>
                  <input
                    type="text"
                    name="phone"
                    value={editData.phone || ''}
                    onChange={handleEditChange}
                    className="w-full border rounded-lg px-3 py-2"
                    required
                  />
                </div>
                {editError && <div className="text-red-500 text-sm">{editError}</div>}
                <button
                  type="submit"
                  className="w-full bg-[#3B9AB8] hover:bg-[#2d7a94] text-white font-medium py-2.5 px-4 rounded-lg transition duration-200"
                  disabled={editLoading}
                >
                  {editLoading ? 'Đang lưu...' : 'Lưu thay đổi'}
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Content Sections */}
        <div className="space-y-8">
          {/* Personal Information */}
          <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
            <h4 className="text-lg font-semibold text-gray-800 mb-6 flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#3B9AB8]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              Thông tin cá nhân
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-600 text-sm mb-1">Họ và tên</p>
                <p className="font-medium text-gray-800">{profile.full_name}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-600 text-sm mb-1">Ngày sinh</p>
                <p className="font-medium text-gray-800">{formatDate(profile.dob)}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-600 text-sm mb-1">Số điện thoại</p>
                <p className="font-medium text-gray-800">{profile.phone}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-600 text-sm mb-1">Email</p>
                <p className="font-medium text-gray-800">{profile.email}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-600 text-sm mb-1">Giới tính</p>
                <p className="font-medium text-gray-800">{profile.gender === 'male' ? 'Nam' : profile.gender === 'female' ? 'Nữ' : profile.gender}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-600 text-sm mb-1">Vai trò</p>
                <p className="font-medium text-gray-800">{profile.role}</p>
              </div>
            </div>
          </div>

          {/* Notification Settings */}
          {profile.push_notification_settings?.booking_reminders !== undefined && (
            <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
              <h4 className="text-lg font-semibold text-gray-800 mb-6 flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#3B9AB8]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                Cài đặt thông báo
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {profile.push_notification_settings &&
                  Object.entries(profile.push_notification_settings).map(([key, value]) => (
                    <div key={key} className="bg-gray-50 p-4 rounded-lg flex items-center justify-between">
                      <span className="capitalize text-gray-700">{key.replace(/_/g, ' ')}</span>
                      <span className={`font-medium ${value ? 'text-green-600' : 'text-red-500'}`}>{value ? 'Bật' : 'Tắt'}</span>
                    </div>
                  ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
