import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useParams, Link } from 'react-router-dom';
import { ChevronLeft, CheckCircle2, Users, Clock, Vote, Share2 } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, CartesianGrid } from 'recharts';
import { pollService } from '../../services/pollService';

const COLORS = ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444', '#06b6d4', '#84cc16'];

const PollDetails = () => {
  const { id } = useParams();
  const [poll, setPoll] = useState(null);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasVoted, setHasVoted] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);

  useEffect(() => {
    fetchPollData();
  }, [id]);

  const fetchPollData = async () => {
    try {
      const data = await pollService.getPoll(id);
      setPoll(data);
    } catch (error) {
      console.error("Lỗi lấy thông tin bầu cử:", error);
    }
  };

  const handleVote = async () => {
    if (!selectedOption) return;
    setIsSubmitting(true);
    setErrorMsg(null);
    try {
      await pollService.vote(id, selectedOption);
      setHasVoted(true);
      await fetchPollData(); // Refresh data to get updated vote counts
    } catch (error) {
      if (error.response && error.response.data && error.response.data.detail) {
        if (error.response.data.detail.includes("already voted")) {
          setHasVoted(true);
          setErrorMsg("Bạn đã bỏ phiếu cho kỳ bầu cử này rồi.");
        } else {
          setErrorMsg(error.response.data.detail);
        }
      } else {
        setErrorMsg("Đã xảy ra lỗi khi gửi phiếu bầu.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!poll) {
    return (
      <div className="container mx-auto flex justify-center items-center h-96">
        <div className="w-10 h-10 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  const totalVotes = poll.options.reduce((sum, opt) => sum + opt.vote_count, 0);

  const chartData = poll.options.map((opt, index) => ({
    name: opt.name, 
    votes: opt.vote_count, 
    percentage: totalVotes === 0 ? 0 : Math.round((opt.vote_count / totalVotes) * 100), 
    fill: COLORS[index % COLORS.length]
  })).sort((a, b) => b.votes - a.votes);

  return (
    <div className="container mx-auto px-4 md:px-6 py-10 max-w-5xl">
      <Link to="/dashboard" className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-blue-600 dark:text-gray-400 mb-8 transition-colors">
        <ChevronLeft size={16} className="mr-1" /> Quay lại Bảng điều khiển
      </Link>

      <div className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden mb-8">
        <div className="p-8 md:p-10 border-b border-gray-100 dark:border-gray-800">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
            <div className="flex items-center gap-3">
              {poll.status === 'open' && <span className="px-3 py-1 rounded-full text-xs font-bold text-emerald-600 bg-emerald-100 dark:text-emerald-400 dark:bg-emerald-900/30">Đang mở hòm phiếu</span>}
              {poll.status === 'closed' && <span className="px-3 py-1 rounded-full text-xs font-bold text-red-600 bg-red-100 dark:text-red-400 dark:bg-red-900/30">Đã đóng</span>}
              <span className="text-sm font-medium text-gray-500 flex items-center gap-1"><Clock size={14} /> Hạn chót: {new Date(poll.end_time).toLocaleDateString('vi-VN')}</span>
            </div>
          </div>

          <h1 className="text-3xl md:text-4xl font-black mb-4 leading-tight dark:text-white">{poll.title}</h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-6">{poll.description}</p>
          
          <div className="flex items-center gap-6 text-sm font-medium">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-bold text-xs">A</div>
              <span className="text-gray-700 dark:text-gray-300">Tổ chức bởi Admin</span>
            </div>
            <div className="flex items-center gap-1.5 text-gray-500">
              <Users size={18} /><span>{totalVotes} Cử tri đã bỏ phiếu</span>
            </div>
          </div>
        </div>

        <div className="p-8 md:p-10 bg-gray-50/50 dark:bg-gray-900/50">
          <AnimatePresence mode="wait">
            {!hasVoted && poll.status === 'open' ? (
              <motion.div key="voting" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} transition={{ duration: 0.3 }}>
                <h3 className="text-xl font-bold mb-6 flex items-center gap-2 dark:text-white"><Vote size={24} className="text-blue-500" /> Thực hiện quyền Bỏ phiếu</h3>
                
                {errorMsg && (
                  <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-xl border border-red-200 dark:border-red-800">
                    {errorMsg}
                  </div>
                )}

                <div className="space-y-4 mb-8">
                  {poll.options.map((option) => (
                    <label key={option.id} className={`block cursor-pointer relative p-6 rounded-2xl border-2 transition-all duration-200 ${selectedOption === option.id ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 shadow-md' : 'border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-700 bg-white dark:bg-gray-800 shadow-sm hover:shadow-md'}`}>
                      <div className="flex items-center justify-between">
                        <div>
                          <div className={`text-lg font-bold mb-1 ${selectedOption === option.id ? 'text-blue-700 dark:text-blue-300' : 'text-gray-900 dark:text-white'}`}>{option.name}</div>
                          {option.description && <div className="text-gray-500 dark:text-gray-400 text-sm">{option.description}</div>}
                        </div>
                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 ml-4 ${selectedOption === option.id ? 'border-blue-500 bg-blue-500' : 'border-gray-300 dark:border-gray-600'}`}>
                          {selectedOption === option.id && <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="w-2.5 h-2.5 rounded-full bg-white" />}
                        </div>
                      </div>
                      <input type="radio" name="poll_option" value={option.id} className="sr-only" onChange={() => setSelectedOption(option.id)} />
                    </label>
                  ))}
                </div>

                <div className="flex items-center justify-end">
                  <button onClick={handleVote} disabled={!selectedOption || isSubmitting} className="px-8 py-4 bg-blue-600 text-white rounded-xl font-bold text-lg hover:bg-blue-700 disabled:opacity-50 transition-all flex items-center gap-2 shadow-lg shadow-blue-500/30">
                    {isSubmitting ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <>Xác nhận Bầu cử <CheckCircle2 size={20} /></>}
                  </button>
                </div>
              </motion.div>
            ) : (
              <motion.div key="results" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5, type: "spring" }}>
                {hasVoted && (
                  <div className="flex items-center gap-3 p-4 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-2xl mb-8">
                    <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center"><CheckCircle2 size={24} /></div>
                    <div>
                      <h4 className="font-bold text-emerald-800 dark:text-emerald-300">Ghi nhận Phiếu Bầu Thành công</h4>
                      <p className="text-sm text-emerald-600 dark:text-emerald-400">Cảm ơn bạn đã thực hiện quyền công dân! Phiếu bầu của bạn là ẩn danh và được mã hóa.</p>
                    </div>
                  </div>
                )}

                {poll.status === 'closed' && !hasVoted && (
                  <div className="flex items-center gap-3 p-4 bg-gray-100 dark:bg-gray-800 rounded-2xl mb-8 border border-gray-200 dark:border-gray-700">
                    <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-500 flex items-center justify-center"><Clock size={24} /></div>
                    <div>
                      <h4 className="font-bold text-gray-800 dark:text-gray-200">Kỳ bầu cử đã kết thúc</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Bạn không thể bỏ phiếu cho kỳ bầu cử này nữa.</p>
                    </div>
                  </div>
                )}

                <h3 className="text-xl font-bold mb-6 dark:text-white">Kết quả Hiện tại</h3>
                <div className="h-[400px] w-full mt-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e5e7eb" opacity={0.5} />
                      <XAxis type="number" hide />
                      <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} width={200} tick={{ fill: '#6b7280', fontSize: 13, fontWeight: 500 }} />
                      <Tooltip content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          return (
                            <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-xl border border-gray-100 dark:border-gray-700">
                              <p className="font-bold mb-1 dark:text-white">{payload[0].payload.name}</p>
                              <p className="text-blue-600 dark:text-blue-400 font-medium">{payload[0].value} phiếu ({payload[0].payload.percentage}%)</p>
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
