import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, ArrowRight, Eye, EyeOff, Vote } from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

const LoginPage = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();

  const validate = () => {
    const newErrors = {};
    if (!formData.email) newErrors.email = 'Vui lòng nhập Email';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email không hợp lệ';
    
    if (!formData.password) newErrors.password = 'Vui lòng nhập Mật khẩu';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validate()) {
      setIsLoading(true);
      setErrors({ ...errors, server: null });
      try {
        const params = new URLSearchParams();
        params.append('username', formData.email);
        params.append('password', formData.password);
        
        const response = await api.post('/auth/token', params);
        await login(response.data.access_token);
        navigate('/dashboard');
      } catch (error) {
        if (error.response && error.response.data) {
          setErrors({ ...errors, server: "Email hoặc mật khẩu không chính xác" });
        } else {
          setErrors({ ...errors, server: "Đã xảy ra lỗi khi kết nối với máy chủ" });
        }
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] flex flex-col justify-center items-center p-4 relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full max-w-4xl flex items-center justify-center pointer-events-none -z-10">
        <div className="absolute w-[400px] h-[400px] bg-primary-500/20 rounded-full blur-[100px] animate-pulse" />
        <div className="absolute w-[300px] h-[300px] bg-purple-500/20 rounded-full blur-[80px] -translate-x-20 translate-y-20" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, type: "spring" }}
        className="w-full max-w-md"
      >
        <div className="bg-white/60 dark:bg-gray-900/60 backdrop-blur-xl border border-white/40 dark:border-gray-800/60 rounded-3xl p-8 shadow-2xl shadow-gray-200/50 dark:shadow-black/40">
          
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary-100 dark:bg-primary-900/50 text-primary-600 dark:text-primary-400 mb-4 shadow-inner">
              <Vote size={32} />
            </div>
            <h2 className="text-3xl font-black bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400">
              Chào mừng Trở lại
            </h2>
            <p className="text-gray-500 dark:text-gray-400 mt-2 font-medium">
              Nhập thông tin đăng nhập để truy cập tài khoản
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {errors.server && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-600 rounded-xl text-sm font-medium text-center">
                {errors.server}
              </div>
            )}
            <div>
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1.5">Địa chỉ Email</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-primary-500 transition-colors">
                  <Mail size={20} />
                </div>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className={`block w-full pl-11 pr-4 py-3.5 bg-gray-50/50 dark:bg-gray-800/50 border ${errors.email ? 'border-red-500 focus:ring-red-500' : 'border-gray-200 dark:border-gray-700 focus:border-primary-500 focus:ring-primary-500'} rounded-xl text-gray-900 dark:text-white placeholder-gray-400 outline-none transition-all duration-300`}
                  placeholder="name@example.com"
                />
              </div>
              {errors.email && <p className="mt-1.5 text-sm text-red-500 font-medium">{errors.email}</p>}
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1.5">Mật khẩu</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-primary-500 transition-colors">
                  <Lock size={20} />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  className={`block w-full pl-11 pr-12 py-3.5 bg-gray-50/50 dark:bg-gray-800/50 border ${errors.password ? 'border-red-500 focus:ring-red-500' : 'border-gray-200 dark:border-gray-700 focus:border-primary-500 focus:ring-primary-500'} rounded-xl text-gray-900 dark:text-white placeholder-gray-400 outline-none transition-all duration-300`}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {errors.password && <p className="mt-1.5 text-sm text-red-500 font-medium">{errors.password}</p>}
            </div>

            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500" />
                <span className="text-sm text-gray-600 dark:text-gray-400 font-medium">Ghi nhớ tôi</span>
              </label>
              <a href="#" className="text-sm font-bold text-primary-600 dark:text-primary-400 hover:underline">
                Quên mật khẩu?
              </a>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-4 mt-2 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-bold text-lg shadow-lg shadow-primary-500/30 hover:shadow-primary-500/50 transition-all duration-300 transform hover:-translate-y-0.5 flex items-center justify-center gap-2 disabled:opacity-70 disabled:hover:translate-y-0"
            >
              {isLoading ? (
                <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>Đăng nhập <ArrowRight size={20} /></>
              )}
            </button>
          </form>

          <div className="mt-8 text-center text-gray-600 dark:text-gray-400 font-medium">
            Chưa có tài khoản?{' '}
            <Link to="/register" className="text-primary-600 dark:text-primary-400 font-bold hover:underline">
              Tạo ngay
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginPage;
