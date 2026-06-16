import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useParams, Link } from 'react-router-dom';
import { ChevronLeft, CheckCircle2, Users, Clock, Vote, Share2 } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, CartesianGrid } from 'recharts';

const MOCK_POLL = {
  id: '1', title: 'Ưu tiên Lộ trình Sản phẩm Quý 3', description: 'Bình chọn tính năng nào chúng ta nên ưu tiên cho chu kỳ phát hành Quý 3 sắp tới. Phản hồi của bạn trực tiếp quyết định đội ngũ kỹ thuật sẽ làm gì tiếp theo.', status: 'open', endTime: new Date(Date.now() + 86400000 * 2).toISOString(), hasVoted: false, totalVotes: 145, creator: 'Alex Rivera (VP of Product)',
  options: [
    { id: 'o1', name: 'Bảng điều khiển Phân tích Nâng cao', description: 'Báo cáo tùy chỉnh và xuất dữ liệu thời gian thực', voteCount: 65 },
    { id: 'o2', name: 'Làm lại Giao diện Ứng dụng Di động', description: 'Thay đổi toàn bộ ứng dụng iOS và Android', voteCount: 40 },
    { id: 'o3', name: 'Xác thực Đa yếu tố (MFA)', description: 'Hỗ trợ thêm SMS và ứng dụng Authenticator', voteCount: 25 },
    { id: 'o4', name: 'Hỗ trợ Giao diện Tối (Dark Mode)', description: 'Tích hợp Dark Mode toàn hệ thống', voteCount: 15 },
  ]
};

const COLORS = ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444'];

const PollDetails = () => {
  const { id } = useParams();
  const [poll, setPoll] = useState(MOCK_POLL);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasVoted, setHasVoted] = useState(MOCK_POLL.hasVoted);

  const handleVote = () => {
    if (!selectedOption) return;
    setIsSubmitting(true);
    setTimeout(() => {
      setHasVoted(true); setIsSubmitting(false);
      const updatedOptions = poll.options.map(opt => opt.id === selectedOption ? { ...opt, voteCount: opt.voteCount + 1 } : opt);
      setPoll({ ...poll, options: updatedOptions, totalVotes: poll.totalVotes + 1 });
    }, 1500);
  };

  const chartData = poll.options.map((opt, index) => ({
    name: opt.name, votes: opt.voteCount, percentage: Math.round((opt.voteCount / poll.totalVotes) * 100) || 0, fill: COLORS[index % COLORS.length]
  })).sort((a, b) => b.votes - a.votes);

  return (
    <div className="container mx-auto px-4 md:px-6 py-10 max-w-5xl">
      <Link to="/dashboard" className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-primary-600 dark:text-gray-400 mb-8 transition-colors">
        <ChevronLeft size={16} className="mr-1" /> Quay lại Bảng điều khiển
      </Link>

      <div className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden mb-8">
        <div className="p-8 md:p-10 border-b border-gray-100 dark:border-gray-800">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 rounded-full text-xs font-bold text-emerald-600 bg-emerald-100 dark:text-emerald-400 dark:bg-emerald-900/30 border border-emerald-200">Đang mở</span>
              <span className="text-sm font-medium text-gray-500 flex items-center gap-1"><Clock size={14} /> Kết thúc trong 2 ngày</span>
            </div>
            <button className="text-gray-500 hover:text-gray-900 dark:hover:text-white p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"><Share2 size={20} /></button>
          </div>

          <h1 className="text-3xl md:text-4xl font-black mb-4 leading-tight">{poll.title}</h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-6">{poll.description}</p>
          
          <div className="flex items-center gap-6 text-sm font-medium">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-400 to-purple-500 flex items-center justify-center text-white font-bold text-xs">AR</div>
              <span className="text-gray-700 dark:text-gray-300">Bởi {poll.creator}</span>
            </div>
            <div className="flex items-center gap-1.5 text-gray-500">
              <Users size={18} /><span>{poll.totalVotes} Tổng số Phiếu</span>
            </div>
          </div>
        </div>

        <div className="p-8 md:p-10 bg-gray-50/50 dark:bg-gray-900/50">
          <AnimatePresence mode="wait">
            {!hasVoted ? (
              <motion.div key="voting" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} transition={{ duration: 0.3 }}>
                <h3 className="text-xl font-bold mb-6 flex items-center gap-2"><Vote size={24} className="text-primary-500" /> Bỏ phiếu của bạn</h3>
                
                <div className="space-y-4 mb-8">
                  {poll.options.map((option) => (
                    <label key={option.id} className={`block cursor-pointer relative p-6 rounded-2xl border-2 transition-all duration-200 ${selectedOption === option.id ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20 shadow-md' : 'border-gray-200 dark:border-gray-700 hover:border-primary-300 dark:hover:border-primary-700 bg-white dark:bg-gray-800 shadow-sm hover:shadow-md'}`}>
                      <div className="flex items-center justify-between">
                        <div>
                          <div className={`text-lg font-bold mb-1 ${selectedOption === option.id ? 'text-primary-700 dark:text-primary-300' : ''}`}>{option.name}</div>
                          <div className="text-gray-500 dark:text-gray-400 text-sm">{option.description}</div>
                        </div>
                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 ml-4 ${selectedOption === option.id ? 'border-primary-500 bg-primary-500' : 'border-gray-300 dark:border-gray-600'}`}>
                          {selectedOption === option.id && <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="w-2.5 h-2.5 rounded-full bg-white" />}
                        </div>
                      </div>
                      <input type="radio" name="poll_option" value={option.id} className="sr-only" onChange={() => setSelectedOption(option.id)} />
                    </label>
                  ))}
                </div>

                <div className="flex items-center justify-end">
                  <button onClick={handleVote} disabled={!selectedOption || isSubmitting} className="px-8 py-4 bg-primary-600 text-white rounded-xl font-bold text-lg hover:bg-primary-700 transition-all flex items-center gap-2">
                    {isSubmitting ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <>Xác nhận Bầu <CheckCircle2 size={20} /></>}
                  </button>
                </div>
              </motion.div>
            ) : (
              <motion.div key="results" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5, type: "spring" }}>
                <div className="flex items-center gap-3 p-4 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 rounded-2xl mb-8">
                  <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center"><CheckCircle2 size={24} /></div>
                  <div>
                    <h4 className="font-bold text-emerald-800 dark:text-emerald-300">Ghi nhận Phiếu Bầu Thành công</h4>
                    <p className="text-sm text-emerald-600 dark:text-emerald-400">Cảm ơn bạn đã tham gia! Phiếu bầu của bạn là ẩn danh và được mã hóa.</p>
                  </div>
                </div>

                <h3 className="text-xl font-bold mb-6">Kết quả Hiện tại</h3>
                <div className="h-[400px] w-full mt-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e5e7eb" opacity={0.5} />
                      <XAxis type="number" hide />
                      <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} width={150} tick={{ fill: '#6b7280', fontSize: 13, fontWeight: 500 }} />
                      <Tooltip content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          return (
                            <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-xl border border-gray-100 dark:border-gray-700">
                              <p className="font-bold mb-1">{payload[0].payload.name}</p>
                              <p className="text-primary-600 dark:text-primary-400 font-medium">{payload[0].value} phiếu ({payload[0].payload.percentage}%)</p>
                            </div>
                          );
                        }
                        return null;
                      }} />
                      <Bar dataKey="votes" radius={[0, 8, 8, 0]} barSize={32} animationDuration={1500}>
                        {chartData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.fill} />)}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default PollDetails;
