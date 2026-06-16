import React from 'react';
import { motion } from 'framer-motion';
import { Users, Vote, CheckCircle2, AlertCircle, TrendingUp, BarChart2 } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend, Cell } from 'recharts';

const dataArea = [
  { name: 'T2', votes: 4000, users: 2400 },
  { name: 'T3', votes: 3000, users: 1398 },
  { name: 'T4', votes: 2000, users: 9800 },
  { name: 'T5', votes: 2780, users: 3908 },
  { name: 'T6', votes: 1890, users: 4800 },
  { name: 'T7', votes: 2390, users: 3800 },
  { name: 'CN', votes: 3490, users: 4300 },
];

const dataBar = [
  { name: 'Đang mở', value: 12, fill: '#10b981' },
  { name: 'Sắp diễn ra', value: 5, fill: '#8b5cf6' },
  { name: 'Đã đóng', value: 34, fill: '#6b7280' },
];

const AdminDashboard = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Tổng quan Hệ thống</h1>
        <p className="text-gray-500 dark:text-gray-400">Xem các chỉ số quan trọng và hoạt động gần đây.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          icon={<Users size={24} />} 
          label="Tổng Người dùng" 
          value="12,345" 
          trend="+12%" 
          color="bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400" 
          delay={0.1}
        />
        <StatCard 
          icon={<Vote size={24} />} 
          label="Tổng Bình chọn" 
          value="51" 
          trend="+3 mới" 
          color="bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400" 
          delay={0.2}
        />
        <StatCard 
          icon={<CheckCircle2 size={24} />} 
          label="Tổng Phiếu bầu" 
          value="842,104" 
          trend="+5.4%" 
          color="bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400" 
          delay={0.3}
        />
        <StatCard 
          icon={<AlertCircle size={24} />} 
          label="Đang trực tuyến" 
          value="1,204" 
          trend="Ổn định" 
          color="bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400" 
          delay={0.4}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Area Chart */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="lg:col-span-2 bg-white dark:bg-gray-900 rounded-3xl p-6 border border-gray-200 dark:border-gray-800 shadow-sm"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold flex items-center gap-2">
              <TrendingUp size={20} className="text-primary-500" /> Xu hướng Bỏ phiếu (7 Ngày)
            </h3>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={dataArea} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorVotes" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" opacity={0.3} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 12 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 12 }} />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
                  labelStyle={{ fontWeight: 'bold', color: '#374151' }}
                />
                <Area type="monotone" dataKey="votes" name="Phiếu bầu" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorVotes)" />
                <Area type="monotone" dataKey="users" name="Người dùng" stroke="#8b5cf6" strokeWidth={3} fillOpacity={1} fill="url(#colorUsers)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Status Bar Chart */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="bg-white dark:bg-gray-900 rounded-3xl p-6 border border-gray-200 dark:border-gray-800 shadow-sm"
        >
          <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
            <BarChart2 size={20} className="text-primary-500" /> Trạng thái Bình chọn
          </h3>
          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dataBar} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" opacity={0.3} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 12 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 12 }} />
                <Tooltip 
                  cursor={{ fill: 'transparent' }}
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                />
                <Bar dataKey="value" radius={[6, 6, 0, 0]} barSize={40}>
                  {dataBar.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          
          <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-800 space-y-2">
            {dataBar.map((item, idx) => (
              <div key={idx} className="flex justify-between items-center text-sm">
                <span className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full" style={{ backgroundColor: item.fill }}></span>
                  {item.name}
                </span>
                <span className="font-bold">{item.value} cuộc</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

const StatCard = ({ icon, label, value, trend, color, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4, delay }}
    className="bg-white dark:bg-gray-900 rounded-3xl p-6 border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-md transition-shadow"
  >
    <div className="flex items-start justify-between mb-4">
      <div className={`p-3 rounded-2xl ${color}`}>
        {icon}
      </div>
      <span className="text-xs font-bold text-emerald-500 bg-emerald-50 dark:bg-emerald-900/20 px-2 py-1 rounded-full">
        {trend}
      </span>
    </div>
    <div>
      <div className="text-gray-500 dark:text-gray-400 text-sm font-medium mb-1">{label}</div>
      <div className="text-3xl font-black">{value}</div>
    </div>
  </motion.div>
);

export default AdminDashboard;
