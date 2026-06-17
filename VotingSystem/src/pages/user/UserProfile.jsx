import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import { User, AlertTriangle, CheckCircle, Save, Mail, MapPin, Hash, UserCircle, Phone, Calendar, Shield, Edit3, X } from 'lucide-react';

const UserProfile = () => {
  const { user, updateUser } = useAuth();
  const [formData, setFormData] = useState({
    full_name: '',
    voter_id: '',
    address: '',
    phone_number: '',
    date_of_birth: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (user) {
      setFormData({
        full_name: user.full_name || '',
        voter_id: user.voter_id || '',
        address: user.address || '',
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
      setIsEditing(false);
    } catch (err) {
      setError('Đã xảy ra lỗi khi cập nhật hồ sơ.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) return null;

  const getRoleBadge = (role) => {
    switch (role) {
      case 'admin':
        return { label: 'Quản trị viên', color: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400' };
      case 'candidate':
        return { label: 'Ứng viên', color: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' };
      default:
        return { label: 'Cử tri', color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' };
    }
  };

  const roleBadge = getRoleBadge(user.role);

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl min-h-screen">
      {/* Header Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative mb-8 overflow-hidden"
      >
        {/* Decorative Background */}
        <div className="h-40 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-t-3xl relative overflow-hidden">
          <div className="absolute inset-0 opacity-20">
            <div className="absolute w-64 h-64 bg-white/10 rounded-full -top-20 -right-10 blur-2xl" />
            <div className="absolute w-48 h-48 bg-white/10 rounded-full -bottom-10 left-20 blur-2xl" />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 border-t-0 rounded-b-3xl px-6 md:px-8 pb-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-end gap-4 -mt-12">
            {/* Avatar */}
            <div className="w-24 h-24 rounded-2xl bg-white dark:bg-gray-800 border-4 border-white dark:border-gray-900 shadow-xl flex items-center justify-center text-3xl font-black text-blue-600 dark:text-blue-400">
              {user.full_name ? user.full_name.charAt(0).toUpperCase() : user.username.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 pb-1">
              <h1 className="text-2xl font-black text-gray-900 dark:text-white">
                {user.full_name || user.username}
              </h1>
              <p className="text-gray-500 dark:text-gray-400 font-medium">{user.email}</p>
            </div>
            <div className="flex items-center gap-3 pb-1">
              <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold ${roleBadge.color}`}>
                <Shield size={12} />
                {roleBadge.label}
              </span>
              {user.is_profile_complete && !isEditing && (
                <button
                  onClick={() => setIsEditing(true)}
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl font-medium text-sm transition-colors"
                >
                  <Edit3 size={16} />
                  Chỉnh sửa
                </button>
              )}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Alerts */}
      {!user.is_profile_complete && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800/50 p-4 mb-6 rounded-2xl flex items-start gap-3"
        >
          <AlertTriangle className="text-amber-500 shrink-0 mt-0.5" size={22} />
          <div>
            <h3 className="font-bold text-amber-800 dark:text-amber-400">Yêu cầu hoàn thiện hồ sơ</h3>
            <p className="text-amber-700 dark:text-amber-300/80 text-sm mt-1">
              Bạn cần cung cấp đầy đủ thông tin để có thể tham gia bình chọn trong các cuộc bầu cử.
            </p>
          </div>
        </motion.div>
      )}

      {message && !isEditing && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-emerald-50 dark:bg-emerald-900/10 border border-emerald-200 dark:border-emerald-800/50 p-4 mb-6 rounded-2xl flex items-center gap-3"
        >
          <CheckCircle className="text-emerald-500" size={22} />
          <span className="font-medium text-emerald-800 dark:text-emerald-400">{message}</span>
        </motion.div>
      )}

      {/* Main Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-3xl shadow-sm overflow-hidden"
      >
        {isEditing ? (
          <form onSubmit={handleSubmit}>
            <div className="p-6 md:p-8 border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/50">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">Chỉnh sửa thông tin</h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Cập nhật thông tin cá nhân của bạn</p>
                </div>
                {user.is_profile_complete && (
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="p-2 text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-800 rounded-xl transition-colors"
                  >
                    <X size={20} />
                  </button>
                )}
              </div>
            </div>

            <div className="p-6 md:p-8 space-y-5">
              {error && <div className="p-3 bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800/50 text-red-700 dark:text-red-400 rounded-xl text-sm font-medium">{error}</div>}

              {/* Tên đăng nhập / Email (read-only) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1.5">Tên đăng nhập</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400"><User size={18} /></div>
                    <input type="text" disabled value={user.username} className="block w-full pl-11 pr-4 py-3 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-500 dark:text-gray-400 cursor-not-allowed" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1.5">Địa chỉ Email</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400"><Mail size={18} /></div>
                    <input type="text" disabled value={user.email} className="block w-full pl-11 pr-4 py-3 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-500 dark:text-gray-400 cursor-not-allowed" />
                  </div>
                </div>
              </div>

              {/* Họ tên & Mã cử tri */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1.5">Họ và Tên <span className="text-red-500">*</span></label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400"><UserCircle size={18} /></div>
                    <input
                      type="text"
                      required
                      value={formData.full_name}
                      onChange={(e) => setFormData({...formData, full_name: e.target.value})}
                      placeholder="Nguyễn Văn A"
                      className="block w-full pl-11 pr-4 py-3 bg-gray-50/50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1.5">Mã cử tri</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400"><Hash size={18} /></div>
                    <input
                      type="text"
                      value={formData.voter_id}
                      onChange={(e) => setFormData({...formData, voter_id: e.target.value})}
                      placeholder="CT-123456"
                      className="block w-full pl-11 pr-4 py-3 bg-gray-50/50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                    />
                  </div>
                </div>
              </div>

              {/* Địa chỉ */}
              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1.5">Địa chỉ thường trú</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400"><MapPin size={18} /></div>
                  <input
                    type="text"
                    value={formData.address}
                    onChange={(e) => setFormData({...formData, address: e.target.value})}
                    placeholder="Số nhà, Tên đường, Quận/Huyện, Tỉnh/TP"
                    className="block w-full pl-11 pr-4 py-3 bg-gray-50/50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                  />
                </div>
              </div>

              {/* SĐT & Ngày sinh */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1.5">Số điện thoại</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400"><Phone size={18} /></div>
                    <input
                      type="tel"
                      value={formData.phone_number}
                      onChange={(e) => setFormData({...formData, phone_number: e.target.value})}
                      placeholder="0912 345 678"
                      className="block w-full pl-11 pr-4 py-3 bg-gray-50/50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1.5">Ngày sinh</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400"><Calendar size={18} /></div>
                    <input
                      type="date"
                      value={formData.date_of_birth}
                      onChange={(e) => setFormData({...formData, date_of_birth: e.target.value})}
                      className="block w-full pl-11 pr-4 py-3 bg-gray-50/50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="p-6 md:p-8 border-t border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/50 flex flex-col sm:flex-row gap-3 justify-end">
              {user.is_profile_complete && (
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-6 py-3 rounded-xl font-bold text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors"
                >
                  Hủy
                </button>
              )}
              <button
                type="submit"
                disabled={isLoading}
                className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold shadow-lg shadow-blue-500/30 transition-all flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <><Save size={18} /> Lưu thay đổi</>
                )}
              </button>
            </div>
          </form>
        ) : (
          /* View Mode */
          <div className="p-6 md:p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InfoField icon={<User size={18} />} label="Tên đăng nhập" value={user.username} />
              <InfoField icon={<Mail size={18} />} label="Địa chỉ Email" value={user.email} />
              <InfoField icon={<UserCircle size={18} />} label="Họ và Tên" value={user.full_name} />
              <InfoField icon={<Hash size={18} />} label="Mã cử tri" value={user.voter_id} />
              <InfoField icon={<MapPin size={18} />} label="Địa chỉ thường trú" value={user.address} fullWidth />
              <InfoField icon={<Phone size={18} />} label="Số điện thoại" value={user.phone_number} />
              <InfoField icon={<Calendar size={18} />} label="Ngày sinh" value={user.date_of_birth ? new Date(user.date_of_birth).toLocaleDateString('vi-VN') : null} />
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};

const InfoField = ({ icon, label, value, fullWidth }) => (
  <div className={fullWidth ? 'md:col-span-2' : ''}>
    <div className="flex items-center gap-2 mb-1.5">
      <span className="text-gray-400">{icon}</span>
      <h4 className="text-sm font-semibold text-gray-500 dark:text-gray-400">{label}</h4>
    </div>
    <p className="text-base font-medium text-gray-900 dark:text-gray-100 pl-7">
      {value || <span className="text-gray-400 dark:text-gray-600 italic">Chưa cập nhật</span>}
    </p>
  </div>
);

export default UserProfile;
