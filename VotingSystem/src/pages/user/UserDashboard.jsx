import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Search, Clock, CheckCircle2, ChevronRight, BarChart2 } from 'lucide-react';
import { pollService } from '../../services/pollService';

const UserDashboard = () => {
  const [polls, setPolls] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchPolls();
  }, [searchTerm, filter]);

  const fetchPolls = async () => {
    try {
      const data = await pollService.getPolls(searchTerm, filter);
      setPolls(data);
    } catch (error) {
      console.error("Lỗi lấy danh sách bầu cử:", error);
    }
  };

  return (
    <div className="container mx-auto px-4 md:px-6 py-12 min-h-screen">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-2 text-gray-900 dark:text-white">Bảng điều khiển Cử tri</h1>
          <p className="text-gray-500 dark:text-gray-400">Tham gia thực hiện quyền công dân tại các kỳ bầu cử.</p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Tìm kiếm kỳ bầu cử..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none dark:text-white"
          />
        </div>
        <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 hide-scrollbar">
          {[
            { value: 'all', label: 'Tất cả' },
            { value: 'open', label: 'Đang mở hòm phiếu' },
            { value: 'upcoming', label: 'Sắp diễn ra' },
            { value: 'closed', label: 'Đã đóng' }
          ].map(status => (
            <button
              key={status.value}
              onClick={() => setFilter(status.value)}
              className={`px-4 py-3 rounded-xl whitespace-nowrap font-medium text-sm transition-colors border ${
                filter === status.value 
                  ? 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-500/20' 
                  : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50 dark:bg-gray-900 dark:border-gray-800 dark:text-gray-400 dark:hover:bg-gray-800'
              }`}
            >
              {status.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {polls.map((poll, index) => (
          <PollCard key={poll._id} poll={poll} index={index} />
        ))}
      </div>

      {polls.length === 0 && (
        <div className="text-center py-20">
          <div className="inline-flex justify-center items-center w-20 h-20 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-400 mb-4">
            <Search size={32} />
          </div>
          <h3 className="text-xl font-bold mb-2 dark:text-white">Không tìm thấy cuộc bầu cử nào</h3>
          <p className="text-gray-500 dark:text-gray-400">Hiện tại hệ thống chưa ghi nhận kỳ bầu cử nào phù hợp.</p>
        </div>
      )}
    </div>
  );
};

const PollCard = ({ poll, index }) => {
  const getStatusConfig = (status) => {
    switch (status) {
      case 'open': return { color: 'text-emerald-600 bg-emerald-100 dark:text-emerald-400 dark:bg-emerald-900/30', text: 'Đang mở' };
      case 'closed': return { color: 'text-red-600 bg-red-100 dark:text-red-400 dark:bg-red-900/30', text: 'Đã đóng' };
      case 'upcoming': return { color: 'text-purple-600 bg-purple-100 dark:text-purple-400 dark:bg-purple-900/30', text: 'Sắp diễn ra' };
      default: return { color: 'text-gray-600 bg-gray-100 dark:text-gray-400 dark:bg-gray-900/30', text: 'Không rõ' };
    }
  };

  const statusConfig = getStatusConfig(poll.status);
  const totalVotes = poll.options?.reduce((sum, opt) => sum + opt.vote_count, 0) || 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      className="group relative bg-white dark:bg-gray-900 rounded-3xl border border-gray-200 dark:border-gray-800 p-6 shadow-sm hover:shadow-xl hover:shadow-blue-500/5 hover:border-blue-500/30 transition-all duration-300 flex flex-col h-full overflow-hidden"
    >
      <div className="flex items-center justify-between mb-4">
        <span className={`px-3 py-1 rounded-full text-xs font-bold ${statusConfig.color}`}>
          {statusConfig.text}
        </span>
      </div>

      <h3 className="text-xl font-bold mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors dark:text-white">
        {poll.title}
      </h3>
      
      <p className="text-gray-500 dark:text-gray-400 text-sm mb-6 flex-1 line-clamp-3">
        {poll.description}
      </p>

      <div className="mt-auto pt-4 border-t border-gray-100 dark:border-gray-800">
        <div className="flex items-center justify-between text-sm mb-4">
          <div className="flex items-center gap-1.5 text-gray-500">
            <Clock size={16} />
            <span className="font-medium">
              {new Date(poll.end_time).toLocaleDateString('vi-VN')}
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-gray-500">
            <BarChart2 size={16} />
            <span className="font-medium">{totalVotes} phiếu</span>
          </div>
        </div>

        <Link 
          to={`/polls/${poll._id}`}
          className={`w-full py-3 rounded-xl flex items-center justify-center gap-2 font-bold transition-all ${
            poll.status === 'open'
              ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-md shadow-blue-500/20'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
          }`}
        >
          {poll.status === 'closed' ? 'Xem Kết quả' : 'Tham gia Bỏ phiếu'}
          <ChevronRight size={18} />
        </Link>
      </div>
    </motion.div>
  );
};

export default UserDashboard;
