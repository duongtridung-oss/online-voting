import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, Shield, User, Lock, Unlock, Trash2, Edit } from 'lucide-react';
import { adminService } from '../../services/adminService';

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');

  const fetchUsers = async () => {
    try {
      const roleQuery = roleFilter === 'all' ? '' : roleFilter;
      const data = await adminService.getUsers(searchTerm, roleQuery);
      setUsers(data);
    } catch (error) {
      console.error("Lỗi khi tải danh sách cử tri:", error);
    }
  };

  // Debounced search
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchUsers();
    }, 500);
    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm, roleFilter]);

  const toggleLock = async (id) => {
    try {
      await adminService.toggleUserLock(id);
      fetchUsers();
    } catch (error) {
      console.error("Lỗi khi thay đổi trạng thái khóa:", error);
    }
  };

  const deleteUser = async (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa tài khoản này?")) {
      try {
        await adminService.deleteUser(id);
        fetchUsers();
      } catch (error) {
        console.error("Lỗi khi xóa người dùng:", error);
      }
    }
  };

  const changeRole = async (id, newRole) => {
    if (window.confirm(`Bạn có chắc chắn muốn chuyển người này thành ${newRole === 'candidate' ? 'Ứng viên' : newRole === 'admin' ? 'Admin' : 'Cử tri'}?`)) {
      try {
        await adminService.updateUser(id, { role: newRole });
        fetchUsers();
      } catch (error) {
        console.error("Lỗi khi đổi quyền:", error);
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-1">Quản lý Cử tri</h1>
          <p className="text-gray-500 dark:text-gray-400">Theo dõi danh sách, thông tin và số lượng cử tri đã đăng ký.</p>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden">
        {/* Toolbar */}
        <div className="p-6 border-b border-gray-100 dark:border-gray-800 flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Tìm kiếm theo Tên hoặc Email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-2.5 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all dark:text-white"
            />
          </div>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="pl-10 pr-8 py-2.5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl outline-none appearance-none cursor-pointer focus:ring-2 focus:ring-primary-500 dark:text-white"
              >
                <option value="all">Tất cả Vai trò</option>
                <option value="admin">Quản trị viên</option>
                <option value="user">Người dùng / Cử tri</option>
                <option value="candidate">Ứng viên</option>
              </select>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="bg-gray-50/50 dark:bg-gray-800/20 text-gray-500 dark:text-gray-400 text-sm border-b border-gray-100 dark:border-gray-800">
                <th className="px-6 py-4 font-semibold">Cử tri</th>
                <th className="px-6 py-4 font-semibold">Mã cử tri</th>
                <th className="px-6 py-4 font-semibold">Thông tin thêm</th>
                <th className="px-6 py-4 font-semibold">Vai trò</th>
                <th className="px-6 py-4 font-semibold">Trạng thái</th>
                <th className="px-6 py-4 font-semibold text-right">Hành động</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {users.map((user, index) => (
                <motion.tr
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2, delay: index * 0.05 }}
                  key={user._id}
                  className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors group"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 flex items-center justify-center font-bold">
                        {user.username.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div className="font-bold text-gray-900 dark:text-white">{user.full_name || user.username}</div>
                        <div className="text-sm text-gray-500">{user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-mono text-gray-600 dark:text-gray-400 text-sm">{user.voter_id || 'Chưa cập nhật'}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 max-w-[200px]" title={user.address}>
                      {user.address || 'Chưa có địa chỉ'}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
                      user.role === 'admin' 
                        ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400' 
                        : user.role === 'candidate'
                        ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
                        : 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                    }`}>
                      {user.role === 'admin' ? <Shield size={12} /> : user.role === 'candidate' ? <User size={12} /> : <User size={12} />}
                      {user.role === 'admin' ? 'Admin' : user.role === 'candidate' ? 'Ứng viên' : 'Cử tri'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${user.is_active
                        ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                        : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                      }`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${user.is_active ? 'bg-emerald-500' : 'bg-red-500'}`}></span>
                      {user.is_active ? 'Hoạt động' : 'Đã khóa'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      {user.role !== 'admin' && (
                        <button
                          onClick={() => changeRole(user._id, user.role === 'candidate' ? 'user' : 'candidate')}
                          className="px-3 py-1.5 text-xs font-bold rounded-lg transition-colors bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 dark:text-white"
                        >
                          {user.role === 'candidate' ? 'Hạ xuống Cử tri' : 'Lên Ứng viên'}
                        </button>
                      )}
                      <button 
                        onClick={() => toggleLock(user._id)}
                        className={`p-2 rounded-lg transition-colors ${user.is_active ? 'text-amber-500 hover:bg-amber-50 dark:hover:bg-amber-900/30' : 'text-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-900/30'}`} 
                        title={user.is_active ? 'Khóa tài khoản' : 'Mở khóa'}
                      >
                        {user.is_active ? <Lock size={18} /> : <Unlock size={18} />}
                      </button>
                      <button 
                        onClick={() => deleteUser(user._id)}
                        className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors" 
                        title="Xóa"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>

          {users.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500 dark:text-gray-400">Không tìm thấy người dùng nào phù hợp.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ManageUsers;
