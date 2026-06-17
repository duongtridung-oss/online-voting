import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Image as ImageIcon, Briefcase, Calendar, Mail, MapPin, Hash, Users } from 'lucide-react';
import { adminService } from '../../services/adminService';

const ManageCandidates = () => {
  const [candidates, setCandidates] = useState([]);
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const fetchCandidates = async () => {
    try {
      setIsLoading(true);
      // Fetch users with role='candidate'
      const data = await adminService.getUsers(search, 'candidate');
      setCandidates(data);
    } catch (error) {
      console.error("Lỗi khi tải danh sách ứng viên:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchCandidates();
    }, 400);
    return () => clearTimeout(delayDebounceFn);
  }, [search]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-2">Quản lý Ứng viên</h1>
          <p className="text-gray-500 dark:text-gray-400">
            Danh sách người dùng được chỉ định vai trò Ứng viên. Chuyển đổi vai trò tại <span className="font-semibold text-gray-700 dark:text-gray-300">Quản lý Cử tri</span>.
          </p>
        </div>
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
          <div className="text-sm text-gray-500 dark:text-gray-400 font-medium">
            Tổng: <span className="font-bold text-gray-900 dark:text-white">{candidates.length}</span> ứng viên
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
                {/* Header gradient */}
                <div className="h-28 bg-gradient-to-r from-amber-500/20 via-orange-500/20 to-red-500/20 relative">
                  {candidate.symbol_url && (
                    <img src={candidate.symbol_url} alt="Biểu tượng" className="absolute top-4 right-4 w-10 h-10 object-contain drop-shadow-md" />
                  )}
                  <div className="absolute top-4 left-4">
                    <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-400">
                      Ứng viên
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="px-6 pb-6 pt-0 relative">
                  <div className="w-20 h-20 rounded-2xl bg-white dark:bg-gray-700 border-4 border-gray-50 dark:border-gray-800 -mt-10 mb-4 overflow-hidden shadow-lg flex items-center justify-center">
                    {candidate.avatar_url ? (
                      <img src={candidate.avatar_url} alt={candidate.full_name || candidate.username} className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-2xl font-black text-gray-400">
                        {(candidate.full_name || candidate.username || '?').charAt(0).toUpperCase()}
                      </span>
                    )}
                  </div>

                  <h3 className="text-xl font-bold mb-1 dark:text-white">
                    {candidate.full_name || candidate.username}
                  </h3>

                  <div className="space-y-2 mb-4 text-sm text-gray-600 dark:text-gray-300">
                    <div className="flex items-center gap-2">
                      <Mail size={14} className="text-gray-400" />
                      <span className="truncate">{candidate.email}</span>
                    </div>
                    {candidate.voter_id && (
                      <div className="flex items-center gap-2">
                        <Hash size={14} className="text-gray-400" />
                        <span className="font-mono">{candidate.voter_id}</span>
                      </div>
                    )}
                    {candidate.party && (
                      <div className="flex items-center gap-2">
                        <Briefcase size={14} className="text-gray-400" />
                        <span>{candidate.party}</span>
                      </div>
                    )}
                    {candidate.address && (
                      <div className="flex items-center gap-2">
                        <MapPin size={14} className="text-gray-400" />
                        <span className="truncate">{candidate.address}</span>
                      </div>
                    )}
                  </div>

                  {candidate.biography && (
                    <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 border-t border-gray-200 dark:border-gray-700 pt-3">
                      {candidate.biography}
                    </p>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {!isLoading && candidates.length === 0 && (
          <div className="text-center py-16">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-400 mb-4">
              <Users size={28} />
            </div>
            <h3 className="text-xl font-bold mb-2 dark:text-white">Chưa có ứng viên nào</h3>
            <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto">
              Vào <span className="font-semibold">Quản lý Cử tri</span> để chuyển vai trò người dùng thành <span className="font-semibold">Ứng viên</span>.
            </p>
          </div>
        )}

        {isLoading && (
          <div className="text-center py-12">
            <div className="w-8 h-8 border-3 border-gray-200 border-t-blue-600 rounded-full animate-spin mx-auto" />
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageCandidates;
