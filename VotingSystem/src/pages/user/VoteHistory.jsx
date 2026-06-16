import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Clock, Vote, AlertCircle, ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const MOCK_HISTORY = [
  { id: 'h1', pollId: '2', pollTitle: 'Địa điểm Du lịch Công ty Hàng năm', optionSelected: 'Bali, Indonesia', votedAt: new Date(Date.now() - 86400000 * 2).toISOString(), status: 'open', type: 'vote' },
  { id: 'h2', pollId: '3', pollTitle: 'Lựa chọn Bố cục Văn phòng Mới', optionSelected: 'Mở với các khu vực tập trung (Focus Pods)', votedAt: new Date(Date.now() - 86400000 * 15).toISOString(), status: 'closed', type: 'vote' },
  { id: 'h3', pollId: '1', pollTitle: 'Đã tạo Tài khoản', optionSelected: null, votedAt: new Date(Date.now() - 86400000 * 30).toISOString(), status: null, type: 'system' }
];

const VoteHistory = () => {
  return (
    <div className="container mx-auto px-4 md:px-6 py-12 max-w-4xl">
      <div className="mb-10">
        <h1 className="text-3xl font-bold mb-2">Lịch sử Hoạt động</h1>
        <p className="text-gray-500 dark:text-gray-400">Xem các lượt bình chọn trước đây và hoạt động tài khoản của bạn.</p>
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-200 dark:border-gray-800 shadow-sm p-6 md:p-10 relative">
        <div className="absolute left-10 md:left-14 top-10 bottom-10 w-0.5 bg-gray-200 dark:bg-gray-800" />
        <div className="space-y-12 relative z-10">
          {MOCK_HISTORY.map((item, index) => <TimelineItem key={item.id} item={item} index={index} />)}
        </div>
      </div>
    </div>
  );
};

const TimelineItem = ({ item, index }) => {
  const isVote = item.type === 'vote';
  const formatDate = (dateString) => new Date(dateString).toLocaleDateString('vi-VN', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });

  return (
    <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: index * 0.1 }} className="flex gap-6 md:gap-8 relative">
      <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 relative z-10 ${isVote ? 'bg-primary-100 text-primary-600 dark:bg-primary-900/50 dark:text-primary-400 ring-4 ring-white dark:ring-gray-900' : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400 ring-4 ring-white dark:ring-gray-900'}`}>
        {isVote ? <Vote size={20} /> : <AlertCircle size={20} />}
      </div>
      
      <div className="flex-1 pb-4">
        <div className="text-sm font-medium text-gray-500 mb-2 flex items-center gap-1.5">
          <Clock size={14} /> {formatDate(item.votedAt)}
        </div>
        
        <div className="bg-gray-50 dark:bg-gray-800/50 rounded-2xl p-5 border border-gray-100 dark:border-gray-800/80 hover:shadow-md transition-shadow">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-bold mb-1 group flex items-center gap-2">{item.pollTitle}</h3>
              {isVote && (
                <p className="text-gray-600 dark:text-gray-400 font-medium">
                  Đã bầu cho: <span className="text-gray-900 dark:text-white font-bold">{item.optionSelected}</span>
                </p>
              )}
            </div>
            
            {isVote && (
              <div className="flex items-center gap-3">
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${item.status === 'open' ? 'text-emerald-600 bg-emerald-100 dark:text-emerald-400 dark:bg-emerald-900/30' : 'text-gray-600 bg-gray-200 dark:text-gray-400 dark:bg-gray-800'}`}>
                  {item.status === 'open' ? 'Đang mở' : 'Đã đóng'}
                </span>
                <Link to={`/polls/${item.pollId}`} className="text-primary-600 hover:text-primary-700 dark:text-primary-400 bg-white dark:bg-gray-900 p-2 rounded-full border border-gray-200 dark:border-gray-700 hover:shadow-sm transition-all"><ArrowUpRight size={18} /></Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default VoteHistory;
