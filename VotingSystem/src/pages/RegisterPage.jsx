import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Lock, ArrowRight, Eye, EyeOff, Vote } from 'lucide-react';
import api from '../services/api';

const RegisterPage = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ username: '', email: '', password: '', confirmPassword: '' });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const validate = () => {
    const newErrors = {};
    if (!formData.username) newErrors.username = 'Vui lòng nhập Tên người dùng';
    if (!formData.email) newErrors.email = 'Vui lòng nhập Email';
    if (!formData.password) newErrors.password = 'Vui lòng nhập Mật khẩu';
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Mật khẩu không khớp';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validate()) {
      setIsLoading(true);
      setErrors({ ...errors, server: null });
      try {
        await api.post('/auth/register', {
          username: formData.username,
          email: formData.email,
          password: formData.password
        });
        
        const params = new URLSearchParams();
        params.append('username', formData.username);
        params.append('password', formData.password);
        const loginRes = await api.post('/auth/token', params);
        
        localStorage.setItem('token', loginRes.data.access_token);
        navigate('/dashboard');
      } catch (error) {
        if (error.response && error.response.data && error.response.data.detail) {
          setErrors({ ...errors, server: error.response.data.detail });
        } else {
          setErrors({ ...errors, server: "Đã xảy ra lỗi khi kết nối với máy chủ" });
        }
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] flex flex-col justify-center items-center p-4 relative overflow-hidden py-12">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full max-w-4xl flex items-center justify-center pointer-events-none -z-10">
        <div className="absolute w-[400px] h-[400px] bg-purple-500/20 rounded-full blur-[100px] animate-pulse" />
        <div className="absolute w-[300px] h-[300px] bg-primary-500/20 rounded-full blur-[80px] translate-x-20 -translate-y-20" />
      </div>

      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, type: "spring" }} className="w-full max-w-md">
        <div className="bg-white/60 dark:bg-gray-900/60 backdrop-blur-xl border border-white/40 dark:border-gray-800/60 rounded-3xl p-8 shadow-2xl shadow-gray-200/50 dark:shadow-black/40">
          
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-purple-100 dark:bg-purple-900/50 text-purple-600 dark:text-purple-400 mb-4 shadow-inner">
              <Vote size={32} />
            </div>
            <h2 className="text-3xl font-black bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400">
              Tạo Tài khoản
            </h2>
            <p className="text-gray-500 dark:text-gray-400 mt-2 font-medium">
              Tham gia cùng chúng tôi và cùng nhau ra quyết định
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {errors.server && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-600 rounded-xl text-sm font-medium text-center">
                {errors.server}
              </div>
            )}
            <div>
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1.5">Tên người dùng</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400"><User size={20} /></div>
                <input type="text" value={formData.username} onChange={(e) => setFormData({...formData, username: e.target.value})} className={`block w-full pl-11 pr-4 py-3 bg-gray-50/50 dark:bg-gray-800/50 border ${errors.username ? 'border-red-500' : 'border-gray-200 dark:border-gray-700'} rounded-xl text-gray-900 dark:text-white outline-none`} placeholder="johndoe" />
              </div>
              {errors.username && <p className="mt-1 text-sm text-red-500">{errors.username}</p>}
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1.5">Địa chỉ Email</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400"><Mail size={20} /></div>
                <input type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className={`block w-full pl-11 pr-4 py-3 bg-gray-50/50 dark:bg-gray-800/50 border ${errors.email ? 'border-red-500' : 'border-gray-200 dark:border-gray-700'} rounded-xl text-gray-900 dark:text-white outline-none`} placeholder="name@example.com" />
              </div>
              {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email}</p>}
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1.5">Mật khẩu</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400"><Lock size={20} /></div>
                <input type={showPassword ? 'text' : 'password'} value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} className={`block w-full pl-11 pr-12 py-3 bg-gray-50/50 dark:bg-gray-800/50 border ${errors.password ? 'border-red-500' : 'border-gray-200 dark:border-gray-700'} rounded-xl text-gray-900 dark:text-white outline-none`} placeholder="••••••••" />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400">{showPassword ? <EyeOff size={20} /> : <Eye size={20} />}</button>
              </div>
              {errors.password && <p className="mt-1 text-sm text-red-500">{errors.password}</p>}
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1.5">Xác nhận Mật khẩu</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400"><Lock size={20} /></div>
                <input type={showPassword ? 'text' : 'password'} value={formData.confirmPassword} onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})} className={`block w-full pl-11 pr-12 py-3 bg-gray-50/50 dark:bg-gray-800/50 border ${errors.confirmPassword ? 'border-red-500' : 'border-gray-200 dark:border-gray-700'} rounded-xl text-gray-900 dark:text-white outline-none`} placeholder="••••••••" />
              </div>
              {errors.confirmPassword && <p className="mt-1 text-sm text-red-500">{errors.confirmPassword}</p>}
            </div>

            <button type="submit" disabled={isLoading} className="w-full py-4 mt-4 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-bold text-lg shadow-lg shadow-purple-500/30 transition-all flex items-center justify-center gap-2">
              {isLoading ? <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <>Đăng ký <ArrowRight size={20} /></>}
            </button>
          </form>

          <div className="mt-8 text-center text-gray-600 dark:text-gray-400 font-medium">
            Đã có tài khoản?{' '}
            <Link to="/login" className="text-purple-600 dark:text-purple-400 font-bold hover:underline">
              Đăng nhập tại đây
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default RegisterPage;
