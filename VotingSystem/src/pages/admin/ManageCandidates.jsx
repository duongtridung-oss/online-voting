import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Search, Edit2, Trash2, X, Image as ImageIcon, Briefcase, Calendar, Info } from 'lucide-react';
import { adminService } from '../../services/adminService';

const ManageCandidates = () => {
  const [candidates, setCandidates] = useState([]);
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  
  const [formData, setFormData] = useState({
    full_name: '',
    age: '',
    party: '',
    biography: '',
    avatar_url: '',
    symbol_url: ''
  });

  const fetchCandidates = async () => {
    try {
      const data = await adminService.getCandidates(search);
      setCandidates(data);
    } catch (error) {
      console.error("Lỗi khi tải danh sách ứng viên:", error);
    }
  };

  useEffect(() => {
    fetchCandidates();
  }, [search]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const openModal = (candidate = null) => {
    if (candidate) {
      setEditingId(candidate._id);
      setFormData({
        full_name: candidate.full_name,
        age: candidate.age,
        party: candidate.party,
        biography: candidate.biography,
        avatar_url: candidate.avatar_url || '',
        symbol_url: candidate.symbol_url || ''
      });
    } else {
      setEditingId(null);
      setFormData({
        full_name: '', age: '', party: '', biography: '', avatar_url: '', symbol_url: ''
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = { ...formData, age: parseInt(formData.age) };
      if (editingId) {
        await adminService.updateCandidate(editingId, payload);
      } else {
        await adminService.createCandidate(payload);
      }
      setIsModalOpen(false);
      fetchCandidates();
    } catch (error) {
      console.error("Lỗi lưu ứng viên:", error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa ứng viên này?")) {
      try {
        await adminService.deleteCandidate(id);
        fetchCandidates();
      } catch (error) {
        console.error("Lỗi xóa ứng viên:", error);
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-2">Quản lý Ứng viên</h1>
          <p className="text-gray-500 dark:text-gray-400">Thêm, sửa, xóa và theo dõi thông tin ứng viên bầu cử.</p>
        </div>
        <button 
          onClick={() => openModal()}
          className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-2xl font-semibold shadow-lg shadow-primary-500/30 transition-all flex items-center gap-2"
        >
          <Plus size={20} />
          Thêm Ứng viên
        </button>
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-3xl p-4 sm:p-6 border border-gray-200 dark:border-gray-800 shadow-sm">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
          <div className="relative w-full sm:w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input 
              type="text" 
              placeholder="Tìm kiếm ứng viên..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-gray-800 border-none rounded-2xl focus:ring-2 focus:ring-primary-500 transition-shadow outline-none dark:text-white"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {candidates.map((candidate) => (
              <motion.div 
                key={candidate._id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-gray-50 dark:bg-gray-800 rounded-3xl overflow-hidden border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-all group"
              >
                <div className="h-32 bg-gradient-to-r from-primary-500/20 to-purple-500/20 relative">
                  {candidate.symbol_url && (
                    <img src={candidate.symbol_url} alt="Biểu tượng" className="absolute top-4 right-4 w-10 h-10 object-contain drop-shadow-md" />
                  )}
                </div>
                <div className="px-6 pb-6 pt-0 relative">
                  <div className="w-20 h-20 rounded-2xl bg-white dark:bg-gray-700 border-4 border-gray-50 dark:border-gray-800 -mt-10 mb-4 overflow-hidden shadow-lg flex items-center justify-center">
                    {candidate.avatar_url ? (
                      <img src={candidate.avatar_url} alt={candidate.full_name} className="w-full h-full object-cover" />
                    ) : (
                      <ImageIcon className="text-gray-400" size={32} />
                    )}
                  </div>
                  <h3 className="text-xl font-bold mb-1 dark:text-white">{candidate.full_name}</h3>
                  <div className="flex flex-wrap gap-2 mb-4 text-sm text-gray-600 dark:text-gray-300">
                    <span className="flex items-center gap-1"><Briefcase size={14} /> {candidate.party}</span>
                    <span className="flex items-center gap-1"><Calendar size={14} /> {candidate.age} tuổi</span>
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 mb-6">
                    {candidate.biography}
                  </p>
                  
                  <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button 
                      onClick={() => openModal(candidate)}
                      className="p-2 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-xl hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors"
                    >
                      <Edit2 size={18} />
                    </button>
                    <button 
                      onClick={() => handleDelete(candidate._id)}
                      className="p-2 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-xl hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
        {candidates.length === 0 && (
          <div className="text-center py-12 text-gray-500 dark:text-gray-400">
            Không tìm thấy ứng viên nào.
          </div>
        )}
      </div>

      {/* Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}></div>
            <motion.div 
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              className="relative bg-white dark:bg-gray-900 w-full max-w-2xl rounded-3xl shadow-2xl border border-gray-200 dark:border-gray-800 overflow-hidden"
            >
              <div className="p-6 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center bg-gray-50 dark:bg-gray-900/50">
                <h2 className="text-2xl font-bold dark:text-white">
                  {editingId ? 'Sửa thông tin Ứng viên' : 'Thêm Ứng viên mới'}
                </h2>
                <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-gray-200 dark:hover:bg-gray-800 rounded-xl text-gray-500 transition-colors">
                  <X size={20} />
                </button>
              </div>
              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Họ và tên</label>
                    <input required name="full_name" value={formData.full_name} onChange={handleInputChange} className="w-full p-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none transition-all dark:text-white" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Tuổi</label>
                    <input required type="number" name="age" value={formData.age} onChange={handleInputChange} className="w-full p-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none transition-all dark:text-white" />
                  </div>
                </div>
                
                <div className="space-y-1">
                  <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Đảng phái</label>
                  <input required name="party" value={formData.party} onChange={handleInputChange} className="w-full p-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none transition-all dark:text-white" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">URL Ảnh đại diện</label>
                    <input name="avatar_url" value={formData.avatar_url} onChange={handleInputChange} className="w-full p-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none transition-all dark:text-white" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">URL Biểu tượng</label>
                    <input name="symbol_url" value={formData.symbol_url} onChange={handleInputChange} className="w-full p-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none transition-all dark:text-white" />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Tiểu sử</label>
                  <textarea required name="biography" value={formData.biography} onChange={handleInputChange} rows="4" className="w-full p-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none transition-all dark:text-white resize-none"></textarea>
                </div>

                <div className="pt-4 flex justify-end gap-3">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="px-6 py-3 rounded-xl font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                    Hủy
                  </button>
                  <button type="submit" className="px-6 py-3 rounded-xl font-medium text-white bg-primary-600 hover:bg-primary-700 shadow-lg shadow-primary-500/30 transition-all">
                    Lưu thông tin
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

export default ManageCandidates;
