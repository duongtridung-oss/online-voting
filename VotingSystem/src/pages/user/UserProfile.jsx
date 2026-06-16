import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import { User, AlertTriangle, CheckCircle, Save } from 'lucide-react';

const UserProfile = () => {
  const { user, updateUser } = useAuth();
  const [formData, setFormData] = useState({ full_name: '', phone_number: '', date_of_birth: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (user) {
      setFormData({ 
        full_name: user.full_name || '',
        phone_number: user.phone_number || '',
        date_of_birth: user.date_of_birth || ''
      });
      if (!user.is_profile_complete) {
        setIsEditing(true);
      }
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');
    setError('');

    try {
      const response = await api.put('/auth/profile', formData);
      updateUser(response.data);
      setMessage('Cập nhật hồ sơ thành công!');
      setIsEditing(false); // Switch back to view mode on success
    } catch (err) {
      setError('Đã xảy ra lỗi khi cập nhật hồ sơ.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) return null;

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold flex items-center gap-3">
          <User className="text-primary-600" size={32} />
          Trang cá nhân
        </h1>
        {user.is_profile_complete && !isEditing && (
          <button 
            onClick={() => setIsEditing(true)}
            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl font-medium transition-colors"
          >
            Chỉnh sửa
          </button>
        )}
      </div>

      {!user.is_profile_complete && (
        <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 mb-8 rounded-r-lg flex items-start gap-3 shadow-sm">
          <AlertTriangle className="text-yellow-500 shrink-0 mt-0.5" size={24} />
          <div>
            <h3 className="font-bold text-yellow-800">Yêu cầu hoàn thiện hồ sơ</h3>
            <p className="text-yellow-700 text-sm mt-1">
              Bạn cần cung cấp đầy đủ thông tin để có thể tham gia bình chọn trong các cuộc khảo sát.
            </p>
          </div>
        </div>
      )}

      {user.is_profile_complete && !isEditing && message && (
        <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-8 rounded-r-lg flex items-center gap-3 shadow-sm">
          <CheckCircle className="text-green-500" size={24} />
          <span className="font-medium text-green-800">{message}</span>
        </div>
      )}

      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-6 md:p-8 shadow-sm">
        {isEditing ? (
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && <div className="p-3 bg-red-50 text-red-700 rounded-lg text-sm">{error}</div>}

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Tên đăng nhập / Email</label>
              <input 
                type="text" 
                disabled 
                value={user.email || user.username} 
                className="w-full px-4 py-3 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-500 cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Họ và tên <span className="text-red-500">*</span></label>
              <input 
                type="text" 
                required
                value={formData.full_name} 
                onChange={(e) => setFormData({...formData, full_name: e.target.value})}
                placeholder="Nhập họ và tên đầy đủ của bạn"
                className="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-colors"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Số điện thoại</label>
                <input 
                  type="tel" 
                  value={formData.phone_number} 
                  onChange={(e) => setFormData({...formData, phone_number: e.target.value})}
                  placeholder="Ví dụ: 0912345678"
                  className="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Ngày sinh</label>
                <input 
                  type="date" 
                  value={formData.date_of_birth} 
                  onChange={(e) => setFormData({...formData, date_of_birth: e.target.value})}
                  className="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-colors"
                />
              </div>
            </div>

            <div className="flex gap-4 pt-2">
              <button 
                type="submit" 
                disabled={isLoading}
                className="w-full sm:w-auto px-8 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-medium shadow-md shadow-primary-500/20 transition-colors flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <><Save size={20} /> Lưu thay đổi</>
                )}
              </button>
              {user.is_profile_complete && (
                <button 
                  type="button" 
                  onClick={() => setIsEditing(false)}
                  className="w-full sm:w-auto px-8 py-3 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl font-medium transition-colors"
                >
                  Hủy
                </button>
              )}
            </div>
          </form>
        ) : (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-8">
              <div>
                <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Tên đăng nhập / Email</h4>
                <p className="text-lg font-medium text-gray-900 dark:text-gray-100">{user.email || user.username}</p>
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Họ và tên</h4>
                <p className="text-lg font-medium text-gray-900 dark:text-gray-100">{user.full_name}</p>
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Số điện thoại</h4>
                <p className="text-lg font-medium text-gray-900 dark:text-gray-100">{user.phone_number || <span className="text-gray-400 italic">Chưa cập nhật</span>}</p>
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Ngày sinh</h4>
                <p className="text-lg font-medium text-gray-900 dark:text-gray-100">{user.date_of_birth ? new Date(user.date_of_birth).toLocaleDateString('vi-VN') : <span className="text-gray-400 italic">Chưa cập nhật</span>}</p>
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Vai trò</h4>
                <p className="text-lg font-medium text-gray-900 dark:text-gray-100 capitalize">{user.role}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserProfile;
