import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Search, Filter, Trash2, Power, Clock, BarChart2, X, CheckCircle2, UserPlus, Check } from 'lucide-react';
import { pollService } from '../../services/pollService';
import { adminService } from '../../services/adminService';

const ManagePolls = () => {
  const [polls, setPolls] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Candidate users list (from Manage Users -> role=candidate)
  const [candidateUsers, setCandidateUsers] = useState([]);
  const [selectedCandidateIds, setSelectedCandidateIds] = useState([]);
  const [candidateSearch, setCandidateSearch] = useState('');

  // Form State
  const [formData, setFormData] = useState({
    title: '', description: '', start_time: '', end_time: ''
  });

  const fetchPolls = async () => {
    try {
      const data = await pollService.getPolls(searchTerm, statusFilter);
      setPolls(data);
    } catch (error) {
      console.error("Lỗi khi tải danh sách bầu cử:", error);
    }
  };

  const fetchCandidateUsers = async () => {
    try {
      const data = await adminService.getUsers(candidateSearch, 'candidate');
      setCandidateUsers(data);
    } catch (error) {
      console.error("Lỗi khi tải danh sách ứng viên:", error);
    }
  };

  useEffect(() => {
    const delayDebounce = setTimeout(() => fetchPolls(), 500);
    return () => clearTimeout(delayDebounce);
  }, [searchTerm, statusFilter]);

  // When modal opens, fetch candidate users
  useEffect(() => {
    if (isCreateModalOpen) {
      fetchCandidateUsers();
    }
  }, [isCreateModalOpen, candidateSearch]);

  const toggleCandidateSelection = (userId) => {
    setSelectedCandidateIds(prev =>
      prev.includes(userId)
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  const handleCreatePoll = async (e) => {
    e.preventDefault();
    if (selectedCandidateIds.length === 0) {
      alert('Vui lòng chọn ít nhất một ứng viên!');
      return;
    }
    setIsSubmitting(true);
    try {
      // Build options from selected candidate users
      const options = selectedCandidateIds.map((userId, i) => {
        const user = candidateUsers.find(u => u._id === userId);
        return {
          id: `opt_${Date.now()}_${i}`,
          name: user?.full_name || user?.username || 'Ứng viên',
          description: user?.party || user?.biography || '',
          candidate_id: userId
        };
      });

      const formattedData = {
        ...formData,
        start_time: new Date(formData.start_time).toISOString(),
        end_time: new Date(formData.end_time).toISOString(),
        options
      };
      await pollService.createPoll(formattedData);
      setIsCreateModalOpen(false);
      fetchPolls();
      setFormData({ title: '', description: '', start_time: '', end_time: '' });
      setSelectedCandidateIds([]);
      setCandidateSearch('');
    } catch (error) {
      console.error("Lỗi tạo bầu cử:", error);
    } finally {
      setIsSubmitting(false);
    }
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
                    <span className="flex items-center gap-1"><UserPlus size={14} /> {poll.options.length} Ứng viên</span>
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

      {/* Create Poll Modal */}
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
                    <input required type="text" value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none dark:text-white" placeholder="VD: Bầu cử Đại biểu Quốc hội Khóa XV" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Mô tả mục đích</label>
                    <textarea required rows="3" value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none dark:text-white" placeholder="Mô tả chi tiết và thể lệ..."></textarea>
                  </div>

                  {/* Candidate Selection */}
                  <div className="p-4 bg-blue-50/50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-800/50 rounded-xl">
                    <div className="flex justify-between items-center mb-4">
                      <label className="block text-sm font-bold text-blue-800 dark:text-blue-300">
                        Chọn Ứng viên ({selectedCandidateIds.length} đã chọn)
                      </label>
                    </div>

                    {/* Search candidates */}
                    <div className="relative mb-3">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                      <input
                        type="text"
                        placeholder="Tìm ứng viên..."
                        value={candidateSearch}
                        onChange={(e) => setCandidateSearch(e.target.value)}
                        className="w-full pl-9 pr-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none dark:text-white"
                      />
                    </div>

                    {/* Candidate list */}
                    <div className="space-y-2 max-h-60 overflow-y-auto">
                      {candidateUsers.length === 0 ? (
                        <div className="text-center py-6 text-gray-500 dark:text-gray-400 text-sm">
                          <UserPlus size={24} className="mx-auto mb-2 text-gray-400" />
                          <p>Chưa có ứng viên nào.</p>
                          <p className="text-xs mt-1">Chuyển vai trò người dùng tại <span className="font-semibold">Quản lý Cử tri</span>.</p>
                        </div>
                      ) : (
                        candidateUsers.map(candidate => {
                          const isSelected = selectedCandidateIds.includes(candidate._id);
                          return (
                            <button
                              key={candidate._id}
                              type="button"
                              onClick={() => toggleCandidateSelection(candidate._id)}
                              className={`w-full flex items-center gap-3 p-3 rounded-xl border transition-all text-left ${
                                isSelected
                                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 dark:border-blue-500/50 ring-1 ring-blue-500/20'
                                  : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-blue-300 dark:hover:border-blue-700'
                              }`}
                            >
                              {/* Avatar */}
                              <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm shrink-0 ${
                                isSelected
                                  ? 'bg-blue-600 text-white'
                                  : 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
                              }`}>
                                {isSelected ? <Check size={18} /> : (candidate.full_name || candidate.username || '?').charAt(0).toUpperCase()}
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="font-bold text-sm text-gray-900 dark:text-white truncate">
                                  {candidate.full_name || candidate.username}
                                </div>
                                <div className="text-xs text-gray-500 dark:text-gray-400 truncate">
                                  {candidate.party || candidate.email}
                                </div>
                              </div>
                            </button>
                          );
                        })
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Bắt đầu bỏ phiếu</label>
                      <input required type="datetime-local" value={formData.start_time} onChange={e => setFormData({ ...formData, start_time: e.target.value })} className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none dark:text-white" />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Đóng hòm phiếu</label>
                      <input required type="datetime-local" value={formData.end_time} onChange={e => setFormData({ ...formData, end_time: e.target.value })} className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none dark:text-white" />
                    </div>
                  </div>
                </div>

                <div className="p-6 border-t border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/50 flex justify-end gap-3">
                  <button type="button" onClick={() => setIsCreateModalOpen(false)} className="px-6 py-3 rounded-xl font-bold text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors">
                    Hủy
                  </button>
                  <button type="submit" disabled={isSubmitting || selectedCandidateIds.length === 0} className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl font-bold shadow-lg shadow-blue-500/30 transition-all flex items-center gap-2">
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
