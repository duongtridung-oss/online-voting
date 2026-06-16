import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Search, Clock, CheckCircle2, ChevronRight, BarChart2, Filter } from 'lucide-react';

const MOCK_POLLS = [
  { id: '1', title: 'Ưu tiên Lộ trình Sản phẩm Quý 3', description: 'Bình chọn tính năng nào chúng ta nên ưu tiên cho chu kỳ phát hành Quý 3 sắp tới.', status: 'open', endTime: new Date(Date.now() + 86400000 * 2).toISOString(), hasVoted: false, totalVotes: 145, category: 'Sản phẩm' },
  { id: '2', title: 'Địa điểm Du lịch Công ty Hàng năm', description: 'Giúp chúng tôi chọn điểm đến cho chuyến du lịch toàn công ty năm nay.', status: 'open', endTime: new Date(Date.now() + 86400000 * 5).toISOString(), hasVoted: true, totalVotes: 312, category: 'Chung' },
  { id: '3', title: 'Lựa chọn Bố cục Văn phòng Mới', description: 'Chọn cách sắp xếp chỗ ngồi và bố cục văn phòng yêu thích cho trụ sở mới.', status: 'closed', endTime: new Date(Date.now() - 86400000).toISOString(), hasVoted: true, totalVotes: 420, category: 'Vận hành' },
  { id: '4', title: 'Chương trình Chăm sóc Sức khỏe', description: 'Bạn đánh giá cao nhất lợi ích sức khỏe nào?', status: 'upcoming', endTime: new Date(Date.now() + 86400000 * 10).toISOString(), hasVoted: false, totalVotes: 0, category: 'Nhân sự' }
];

const UserDashboard = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');

  const filteredPolls = MOCK_POLLS.filter(poll => {
    const matchesSearch = poll.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filter === 'all' || poll.status === filter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="container mx-auto px-4 md:px-6 py-12 min-h-screen">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-2">Bảng điều khiển của tôi</h1>
          <p className="text-gray-500 dark:text-gray-400">Khám phá và tham gia các cuộc bình chọn đang diễn ra.</p>
        </div>

        <div className="flex gap-4">
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-4 flex items-center gap-4 shadow-sm">
            <div className="w-12 h-12 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center text-primary-600 dark:text-primary-400">
              <CheckCircle2 size={24} />
            </div>
            <div>
              <div className="text-2xl font-bold">12</div>
              <div className="text-xs text-gray-500 font-medium">Đã bình chọn</div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Tìm kiếm cuộc bình chọn..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all outline-none"
          />
        </div>
        <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 hide-scrollbar">
          {[
            { value: 'all', label: 'Tất cả' },
            { value: 'open', label: 'Đang mở' },
            { value: 'upcoming', label: 'Sắp diễn ra' },
            { value: 'closed', label: 'Đã đóng' }
          ].map(status => (
            <button
              key={status.value}
              onClick={() => setFilter(status.value)}
              className={`px-4 py-3 rounded-xl whitespace-nowrap font-medium text-sm transition-colors border ${
                filter === status.value 
                  ? 'bg-gray-900 text-white border-gray-900 dark:bg-white dark:text-gray-900 dark:border-white' 
                  : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50 dark:bg-gray-900 dark:border-gray-800 dark:text-gray-400 dark:hover:bg-gray-800'
              }`}
            >
              {status.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPolls.map((poll, index) => (
          <PollCard key={poll.id} poll={poll} index={index} />
        ))}
      </div>

      {filteredPolls.length === 0 && (
        <div className="text-center py-20">
          <div className="inline-flex justify-center items-center w-20 h-20 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-400 mb-4">
            <Search size={32} />
          </div>
          <h3 className="text-xl font-bold mb-2">Không tìm thấy cuộc bình chọn nào</h3>
          <p className="text-gray-500">Hãy thử điều chỉnh từ khóa tìm kiếm hoặc bộ lọc.</p>
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

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      className="group relative bg-white dark:bg-gray-900 rounded-3xl border border-gray-200 dark:border-gray-800 p-6 shadow-sm hover:shadow-xl hover:shadow-primary-500/5 hover:border-primary-500/30 transition-all duration-300 flex flex-col h-full overflow-hidden"
    >
      {poll.hasVoted && (
        <div className="absolute top-0 right-0 overflow-hidden w-20 h-20">
          <div className="absolute transform rotate-45 bg-primary-500 text-white text-xs font-bold py-1 right-[-35px] top-[15px] w-[120px] text-center shadow-md">
            ĐÃ BẦU
          </div>
        </div>
      )}

      <div className="flex items-center justify-between mb-4">
        <span className={`px-3 py-1 rounded-full text-xs font-bold ${statusConfig.color}`}>
          {statusConfig.text}
        </span>
        <span className="text-xs font-medium text-gray-400 dark:text-gray-500 border border-gray-200 dark:border-gray-700 px-2 py-1 rounded-md">
          {poll.category}
        </span>
      </div>

      <h3 className="text-xl font-bold mb-2 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
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
              {poll.status === 'closed' ? 'Đã kết thúc' : 'Còn 2 ngày'}
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-gray-500">
            <BarChart2 size={16} />
            <span className="font-medium">{poll.totalVotes} phiếu</span>
          </div>
        </div>

        <Link 
          to={`/polls/${poll.id}`}
          className={`w-full py-3 rounded-xl flex items-center justify-center gap-2 font-bold transition-all ${
            poll.status === 'open' && !poll.hasVoted
              ? 'bg-gray-900 text-white hover:bg-primary-600 dark:bg-white dark:text-gray-900 dark:hover:bg-primary-500 shadow-md'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
          }`}
        >
          {poll.status === 'closed' || poll.hasVoted ? 'Xem Kết quả' : 'Bỏ phiếu ngay'}
          <ChevronRight size={18} />
        </Link>
      </div>
    </motion.div>
  );
};

export default UserDashboard;
