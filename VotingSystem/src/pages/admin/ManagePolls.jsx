import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Search, Filter, Edit2, Trash2, Power, Eye, Clock, BarChart2 } from 'lucide-react';

const MOCK_POLLS = [
  { id: '1', title: 'Q3 Product Roadmap Priorities', status: 'open', votes: 145, endTime: '2023-08-15T00:00:00' },
  { id: '2', title: 'Annual Company Retreat Location', status: 'open', votes: 312, endTime: '2023-09-01T00:00:00' },
  { id: '3', title: 'New Office Layout Selection', status: 'closed', votes: 420, endTime: '2023-07-01T00:00:00' },
  { id: '4', title: 'Employee Wellness Program', status: 'upcoming', votes: 0, endTime: '2023-10-01T00:00:00' },
];

const ManagePolls = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const filteredPolls = MOCK_POLLS.filter(poll => {
    const matchesSearch = poll.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || poll.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case 'open': return <span className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 px-3 py-1 rounded-full text-xs font-bold">Đang mở</span>;
      case 'closed': return <span className="bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 px-3 py-1 rounded-full text-xs font-bold">Đã đóng</span>;
      case 'upcoming': return <span className="bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400 px-3 py-1 rounded-full text-xs font-bold">Sắp diễn ra</span>;
      default: return null;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-1">Quản lý Bình chọn</h1>
          <p className="text-gray-500 dark:text-gray-400">Tạo mới, chỉnh sửa và theo dõi các cuộc bình chọn.</p>
        </div>
        
        <button 
          onClick={() => setIsCreateModalOpen(true)}
          className="px-5 py-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-bold transition-all shadow-md flex items-center gap-2"
        >
          <Plus size={20} /> Tạo cuộc bình chọn
        </button>
      </div>

      {/* Main Content */}
      <div className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden">
        {/* Toolbar */}
        <div className="p-6 border-b border-gray-100 dark:border-gray-800 flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Tìm kiếm theo tên cuộc bình chọn..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-2.5 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all"
            />
          </div>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="pl-10 pr-8 py-2.5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl outline-none appearance-none cursor-pointer focus:ring-2 focus:ring-primary-500"
              >
                <option value="all">Tất cả Trạng thái</option>
                <option value="open">Đang mở</option>
                <option value="upcoming">Sắp diễn ra</option>
                <option value="closed">Đã đóng</option>
              </select>
            </div>
          </div>
        </div>

        {/* Polls List */}
        <div className="divide-y divide-gray-100 dark:divide-gray-800">
          {filteredPolls.map((poll, index) => (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2, delay: index * 0.05 }}
              key={poll.id}
              className="p-6 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors flex flex-col md:flex-row gap-4 items-start md:items-center justify-between group"
            >
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  {getStatusBadge(poll.status)}
                  <span className="text-sm font-medium text-gray-500 flex items-center gap-1">
                    <Clock size={14} /> {new Date(poll.endTime).toLocaleDateString('vi-VN')}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                  {poll.title}
                </h3>
                <div className="text-sm text-gray-500 flex items-center gap-4">
                  <span className="flex items-center gap-1"><BarChart2 size={14} /> {poll.votes} Lượt bình chọn</span>
                </div>
              </div>

              <div className="flex items-center gap-2 w-full md:w-auto justify-end">
                <button className="p-2.5 text-gray-500 hover:text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/30 rounded-xl transition-colors font-medium text-sm flex items-center gap-2">
                  <Eye size={18} /> Chi tiết
                </button>
                <div className="w-px h-6 bg-gray-200 dark:bg-gray-700 mx-1 hidden md:block"></div>
                <button className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition-colors" title="Chỉnh sửa">
                  <Edit2 size={18} />
                </button>
                <button className={`p-2 rounded-lg transition-colors ${poll.status === 'open' ? 'text-amber-500 hover:bg-amber-50 dark:hover:bg-amber-900/30' : 'text-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-900/30'}`} title={poll.status === 'open' ? 'Đóng bình chọn' : 'Mở lại'}>
                  <Power size={18} />
                </button>
                <button className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors" title="Xóa">
                  <Trash2 size={18} />
                </button>
              </div>
            </motion.div>
          ))}

          {filteredPolls.length === 0 && (
            <div className="text-center py-16">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-400 mb-4">
                <Search size={24} />
              </div>
              <h3 className="text-xl font-bold mb-2">Không tìm thấy kết quả</h3>
              <p className="text-gray-500">Hãy thử thay đổi từ khóa hoặc bộ lọc của bạn.</p>
            </div>
          )}
        </div>
      </div>

      {/* Create Poll Modal (Dummy) */}
      <AnimatePresence>
        {isCreateModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm"
              onClick={() => setIsCreateModalOpen(false)}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative bg-white dark:bg-gray-900 rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]"
            >
              <div className="p-6 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center bg-gray-50/50 dark:bg-gray-900/50">
                <h2 className="text-2xl font-bold">Tạo cuộc bình chọn mới</h2>
                <button onClick={() => setIsCreateModalOpen(false)} className="text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-800 p-2 rounded-full transition-colors">
                  <X size={20} />
                </button>
              </div>
              
              <div className="p-6 overflow-y-auto flex-1 space-y-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Tiêu đề</label>
                  <input type="text" className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none" placeholder="Nhập tiêu đề cuộc bình chọn..." />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Mô tả</label>
                  <textarea rows="3" className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none" placeholder="Nhập mô tả chi tiết..."></textarea>
                </div>
                
                <div className="p-4 bg-primary-50 dark:bg-primary-900/20 border border-primary-100 dark:border-primary-800/50 rounded-xl">
                  <div className="flex justify-between items-center mb-4">
                    <label className="block text-sm font-bold text-primary-800 dark:text-primary-300">Các Lựa chọn (Options)</label>
                    <button className="text-sm font-bold text-primary-600 hover:text-primary-700 dark:text-primary-400 flex items-center gap-1">
                      <Plus size={16} /> Thêm lựa chọn
                    </button>
                  </div>
                  <div className="space-y-3">
                    <div className="flex gap-2">
                      <input type="text" className="flex-1 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none" placeholder="Lựa chọn 1..." />
                      <button className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg"><Trash2 size={18} /></button>
                    </div>
                    <div className="flex gap-2">
                      <input type="text" className="flex-1 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none" placeholder="Lựa chọn 2..." />
                      <button className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg"><Trash2 size={18} /></button>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Thời gian bắt đầu</label>
                    <input type="datetime-local" className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Thời gian kết thúc</label>
                    <input type="datetime-local" className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none" />
                  </div>
                </div>
              </div>

              <div className="p-6 border-t border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/50 flex justify-end gap-3">
                <button onClick={() => setIsCreateModalOpen(false)} className="px-6 py-3 rounded-xl font-bold text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors">
                  Hủy
                </button>
                <button className="px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-bold shadow-lg shadow-primary-500/30 transition-all flex items-center gap-2">
                  <CheckCircle2 size={20} /> Lưu & Bắt đầu
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ManagePolls;
