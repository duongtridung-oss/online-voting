import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Search, Filter, Trash2, Power, Eye, Clock, BarChart2, X, CheckCircle2 } from 'lucide-react';
import { pollService } from '../../services/pollService';

const ManagePolls = () => {
  const [polls, setPolls] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    title: '', description: '', start_time: '', end_time: '',
    options: [{ id: 'opt_1', name: '', description: '' }]
  });

  const fetchPolls = async () => {
    try {
      const data = await pollService.getPolls(searchTerm, statusFilter);
      setPolls(data);
    } catch (error) {
      console.error("Lỗi khi tải danh sách bầu cử:", error);
    }
  };

  useEffect(() => {
    const delayDebounce = setTimeout(() => fetchPolls(), 500);
    return () => clearTimeout(delayDebounce);
  }, [searchTerm, statusFilter]);

  const handleCreatePoll = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const formattedData = {
        ...formData,
        start_time: new Date(formData.start_time).toISOString(),
        end_time: new Date(formData.end_time).toISOString(),
        options: formData.options.filter(opt => opt.name.trim() !== '').map((opt, i) => ({
          ...opt,
          id: `opt_${Date.now()}_${i}`
        }))
      };
      await pollService.createPoll(formattedData);
      setIsCreateModalOpen(false);
      fetchPolls();
      setFormData({
        title: '', description: '', start_time: '', end_time: '',
        options: [{ id: 'opt_1', name: '', description: '' }]
      });
    } catch (error) {
      console.error("Lỗi tạo bầu cử:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const addOption = () => {
    setFormData(prev => ({
      ...prev,
      options: [...prev.options, { id: `opt_${Date.now()}`, name: '', description: '' }]
    }));
  };

  const removeOption = (id) => {
    setFormData(prev => ({
      ...prev,
      options: prev.options.filter(opt => opt.id !== id)
    }));
  };

  const updateOption = (id, field, value) => {
    setFormData(prev => ({
      ...prev,
      options: prev.options.map(opt => opt.id === id ? { ...opt, [field]: value } : opt)
    }));
  };

  const togglePollStatus = async (id, currentStatus) => {
    try {
      if (currentStatus === 'open') {
        await pollService.closePoll(id);
      } else {
        await pollService.reopenPoll(id);
      }
      fetchPolls();
    } catch (error) {
      console.error("Lỗi thay đổi trạng thái:", error);
    }
  };

  const deletePoll = async (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa cuộc bầu cử này? Hành động này không thể hoàn tác.")) {
      try {
        await pollService.deletePoll(id);
        fetchPolls();
      } catch (error) {
        console.error("Lỗi xóa bầu cử:", error);
      }
    }
  };

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
          <h1 className="text-3xl font-bold mb-1">Quản lý Bầu cử</h1>
          <p className="text-gray-500 dark:text-gray-400">Tạo mới, chỉnh sửa và theo dõi các cuộc bầu cử, biểu quyết.</p>
        </div>
        
        <button 
          onClick={() => setIsCreateModalOpen(true)}
          className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold transition-all shadow-md flex items-center gap-2"
        >
          <Plus size={20} /> Thiết lập Bầu cử
        </button>
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-100 dark:border-gray-800 flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Tìm kiếm theo tên cuộc bầu cử..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-2.5 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all dark:text-white"
            />
          </div>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="pl-10 pr-8 py-2.5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl outline-none appearance-none cursor-pointer focus:ring-2 focus:ring-blue-500 dark:text-white"
              >
                <option value="all">Tất cả Trạng thái</option>
                <option value="open">Đang mở</option>
                <option value="upcoming">Sắp diễn ra</option>
                <option value="closed">Đã đóng</option>
              </select>
            </div>
          </div>
        </div>

        <div className="divide-y divide-gray-100 dark:divide-gray-800">
          {polls.map((poll, index) => {
            const totalVotes = poll.options.reduce((sum, opt) => sum + opt.vote_count, 0);
            return (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2, delay: index * 0.05 }}
                key={poll._id}
                className="p-6 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors flex flex-col md:flex-row gap-4 items-start md:items-center justify-between group"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    {getStatusBadge(poll.status)}
                    <span className="text-sm font-medium text-gray-500 flex items-center gap-1">
                      <Clock size={14} /> {new Date(poll.end_time).toLocaleDateString('vi-VN')}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {poll.title}
                  </h3>
                  <div className="text-sm text-gray-500 flex items-center gap-4">
                    <span className="flex items-center gap-1"><BarChart2 size={14} /> {totalVotes} Lượt bỏ phiếu</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 w-full md:w-auto justify-end">
                  <button onClick={() => togglePollStatus(poll._id, poll.status)} className={`p-2 rounded-lg transition-colors ${poll.status === 'open' ? 'text-amber-500 hover:bg-amber-50 dark:hover:bg-amber-900/30' : 'text-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-900/30'}`} title={poll.status === 'open' ? 'Đóng bầu cử' : 'Mở lại'}>
                    <Power size={18} />
                  </button>
                  <button onClick={() => deletePoll(poll._id)} className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors" title="Xóa">
                    <Trash2 size={18} />
                  </button>
                </div>
              </motion.div>
            )
          })}

          {polls.length === 0 && (
            <div className="text-center py-16">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-400 mb-4">
                <Search size={24} />
              </div>
              <h3 className="text-xl font-bold mb-2">Không tìm thấy kết quả</h3>
              <p className="text-gray-500">Chưa có cuộc bầu cử nào được tạo hoặc phù hợp với bộ lọc.</p>
            </div>
          )}
        </div>
      </div>

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
                <h2 className="text-2xl font-bold dark:text-white">Thiết lập Bầu cử mới</h2>
                <button onClick={() => setIsCreateModalOpen(false)} className="text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-800 p-2 rounded-full transition-colors">
                  <X size={20} />
                </button>
              </div>
              
              <form onSubmit={handleCreatePoll} className="flex flex-col flex-1 overflow-hidden">
                <div className="p-6 overflow-y-auto flex-1 space-y-6">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Tiêu đề (Chủ đề bầu cử)</label>
                    <input required type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none dark:text-white" placeholder="VD: Bầu cử Đại biểu Quốc hội Khóa XV" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Mô tả mục đích</label>
                    <textarea required rows="3" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none dark:text-white" placeholder="Mô tả chi tiết và thể lệ..."></textarea>
                  </div>
                  
                  <div className="p-4 bg-blue-50/50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-800/50 rounded-xl">
                    <div className="flex justify-between items-center mb-4">
                      <label className="block text-sm font-bold text-blue-800 dark:text-blue-300">Danh sách Ứng viên (Lựa chọn)</label>
                      <button type="button" onClick={addOption} className="text-sm font-bold text-blue-600 hover:text-blue-700 dark:text-blue-400 flex items-center gap-1">
                        <Plus size={16} /> Thêm Ứng viên
                      </button>
                    </div>
                    <div className="space-y-3">
                      {formData.options.map((opt, idx) => (
                        <div key={opt.id} className="flex gap-2">
                          <div className="flex-1 space-y-2">
                            <input required type="text" value={opt.name} onChange={e => updateOption(opt.id, 'name', e.target.value)} className="w-full px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none dark:text-white" placeholder={`Tên ứng viên ${idx + 1}`} />
                            <input type="text" value={opt.description} onChange={e => updateOption(opt.id, 'description', e.target.value)} className="w-full px-4 py-2 text-sm bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none dark:text-white" placeholder={`Chức vụ / Tiểu sử tóm tắt (Không bắt buộc)`} />
                          </div>
                          {formData.options.length > 1 && (
                            <button type="button" onClick={() => removeOption(opt.id)} className="p-2 self-start text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg"><Trash2 size={18} /></button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Bắt đầu bỏ phiếu</label>
                      <input required type="datetime-local" value={formData.start_time} onChange={e => setFormData({...formData, start_time: e.target.value})} className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none dark:text-white" />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Đóng hòm phiếu</label>
                      <input required type="datetime-local" value={formData.end_time} onChange={e => setFormData({...formData, end_time: e.target.value})} className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none dark:text-white" />
                    </div>
                  </div>
                </div>

                <div className="p-6 border-t border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/50 flex justify-end gap-3">
                  <button type="button" onClick={() => setIsCreateModalOpen(false)} className="px-6 py-3 rounded-xl font-bold text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors">
                    Hủy
                  </button>
                  <button type="submit" disabled={isSubmitting} className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold shadow-lg shadow-blue-500/30 transition-all flex items-center gap-2">
                    {isSubmitting ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <><CheckCircle2 size={20} /> Lưu & Khởi tạo</>}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ManagePolls;
