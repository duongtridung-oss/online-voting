import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ShieldCheck, BarChart3, Clock, ChevronRight, CheckCircle2, Users, Activity } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const LandingPage = () => {
  const { isAuthenticated } = useAuth();
  return (
    <div className="flex flex-col items-center overflow-hidden">
      <section className="w-full relative pt-20 pb-32 lg:pt-32 lg:pb-48 flex justify-center items-center">
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
          <motion.div 
            animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-10 left-1/4 w-[500px] h-[500px] bg-primary-500/20 rounded-full blur-[100px]" 
          />
          <motion.div 
            animate={{ scale: [1, 1.5, 1], opacity: [0.2, 0.4, 0.2] }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
            className="absolute top-40 right-1/4 w-[600px] h-[600px] bg-purple-500/20 rounded-full blur-[120px]" 
          />
        </div>

        <div className="container mx-auto px-4 md:px-6">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="space-y-8 max-w-2xl text-center lg:text-left mx-auto lg:mx-0"
            >
              <motion.div 
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/50 dark:bg-white/5 backdrop-blur-md border border-primary-100 dark:border-white/10 text-primary-700 dark:text-primary-300 text-sm font-semibold shadow-sm"
              >
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-primary-500"></span>
                </span>
                Hệ thống Bầu cử Trực tuyến Toàn dân
              </motion.div>

              <h1 className="text-5xl md:text-6xl lg:text-7xl font-black tracking-tight leading-[1.1]">
                Phát huy Quyền làm chủ với <br className="hidden lg:block" />
                <span className="text-transparent bg-clip-text bg-gradient-to-br from-primary-600 via-purple-600 to-primary-400 dark:from-primary-400 dark:via-purple-400 dark:to-primary-300 relative">
                  Bầu cử Thông minh
                  <motion.span 
                    initial={{ width: 0 }} animate={{ width: "100%" }} transition={{ delay: 1, duration: 0.8 }}
                    className="absolute -bottom-2 left-0 h-2 bg-gradient-to-r from-primary-600 to-purple-600 rounded-full opacity-50"
                  />
                </span>
              </h1>

              <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 leading-relaxed font-medium">
                Trải nghiệm hệ thống bỏ phiếu quốc gia bảo mật, minh bạch và thân thiện nhất. Đảm bảo tính nặc danh tuyệt đối, kết quả kiểm phiếu chuẩn xác thời gian thực.
              </p>

              <motion.div 
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
                className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2"
              >
                <Link to={isAuthenticated ? "/dashboard" : "/register"} className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-primary-600 to-primary-500 text-white font-bold text-lg shadow-xl shadow-primary-500/30 hover:shadow-primary-500/50 transition-all duration-300 hover:-translate-y-1 hover:scale-105 flex items-center justify-center gap-2 group border border-primary-500/50">
                  {isAuthenticated ? "Vào Bảng Điều Khiển" : "Đăng ký Cử tri"} 
                  <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link to={isAuthenticated ? "/dashboard" : "/login"} className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-white/80 dark:bg-gray-900/80 backdrop-blur-md text-gray-900 dark:text-white font-bold text-lg border border-gray-200 dark:border-gray-800 hover:border-primary-500/50 transition-all duration-300 hover:-translate-y-1 hover:bg-gray-50 dark:hover:bg-gray-800 flex items-center justify-center">
                  Xem Kết quả Bầu cử
                </Link>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}
                className="flex items-center justify-center lg:justify-start gap-6 pt-4 text-sm text-gray-500 dark:text-gray-400 font-medium"
              >
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={18} className="text-emerald-500" /> Xác thực Công dân số
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={18} className="text-emerald-500" /> Mã hóa Đầu - Cuối
                </div>
              </motion.div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.8, rotateY: 20 }}
              animate={{ opacity: 1, scale: 1, rotateY: 0 }}
              transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
              className="relative hidden lg:block perspective-1000"
            >
              <div className="relative z-10 w-full max-w-md mx-auto bg-white/60 dark:bg-gray-900/60 backdrop-blur-2xl border border-white/20 dark:border-gray-700/50 rounded-3xl shadow-2xl p-6 transform-gpu hover:-translate-y-2 hover:rotate-1 transition-all duration-500">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400">Bầu cử Đại biểu Quốc hội</h3>
                    <p className="text-sm text-gray-500 flex items-center gap-1 mt-1"><Clock size={14}/> Đóng thùng phiếu trong 2 giờ</p>
                  </div>
                  <div className="h-10 w-10 rounded-full bg-primary-100 dark:bg-primary-900/50 flex items-center justify-center text-primary-600 dark:text-primary-400 font-bold">
                    V
                  </div>
                </div>

                <div className="space-y-4">
                  <MockPollOption name="Đồng chí Nguyễn Văn A" percentage={65} color="bg-primary-500" delay={1} />
                  <MockPollOption name="Đồng chí Lê Thị B" percentage={25} color="bg-purple-500" delay={1.2} />
                  <MockPollOption name="Đồng chí Trần Văn C" percentage={10} color="bg-emerald-500" delay={1.4} />
                </div>

                <div className="mt-8 flex items-center justify-between text-sm font-medium text-gray-500">
                  <span className="flex items-center gap-1"><Users size={16} /> 1,284,500 Phiếu</span>
                  <span className="flex items-center gap-1 text-emerald-500"><Activity size={16} /> Đang kiểm phiếu</span>
                </div>
              </div>

              <motion.div 
                animate={{ y: [-10, 10, -10] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -top-10 -right-10 w-24 h-24 bg-gradient-to-br from-purple-500 to-primary-500 rounded-2xl rotate-12 blur-sm opacity-60 -z-10"
              />
              <motion.div 
                animate={{ y: [10, -10, 10] }} transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                className="absolute -bottom-8 -left-8 w-32 h-32 bg-gradient-to-tr from-primary-400 to-emerald-400 rounded-full blur-md opacity-40 -z-10"
              />
            </motion.div>
          </div>
        </div>
      </section>

      <section className="w-full border-y border-gray-200/50 dark:border-gray-800/50 bg-white/30 dark:bg-gray-900/30 backdrop-blur-sm py-12">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <StatCard number="1M+" label="Phiếu Đã bầu" />
            <StatCard number="99.9%" label="Hoạt động" />
            <StatCard number="50k+" label="Cuộc Bình chọn" />
            <StatCard number="256-bit" label="Mã hóa Bảo mật" />
          </div>
        </div>
      </section>

      <section id="features" className="w-full py-24 lg:py-32">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-20">
            <motion.div 
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              className="inline-block px-4 py-1.5 rounded-full bg-purple-100/50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 font-semibold text-sm mb-6"
            >
              Tính năng Doanh nghiệp
            </motion.div>
            <motion.h2 
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}
              className="text-4xl md:text-5xl font-black mb-6"
            >
              Mọi thứ bạn cần để <br className="hidden md:block"/> tổ chức bầu cử hoàn hảo
            </motion.h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard 
              icon={<ShieldCheck size={36} className="text-emerald-500" />}
              title="Bảo mật cấp Ngân hàng"
              description="Mỗi phiếu bầu đều được mã hóa và lưu trữ an toàn. Chúng tôi đảm bảo tính ẩn danh tuyệt đối trong khi ngăn chặn mọi hành vi gian lận."
              delay={0.1}
            />
            <FeatureCard 
              icon={<BarChart3 size={36} className="text-primary-500" />}
              title="Phân tích Thời gian thực"
              description="Theo dõi kết quả đang diễn ra với các biểu đồ động, tuyệt đẹp ngay sau khi phiếu được bầu. Thông tin chi tiết nằm trong tầm tay."
              delay={0.2}
            />
            <FeatureCard 
              icon={<Clock size={36} className="text-purple-500" />}
              title="Lên lịch Tự động"
              description="Thiết lập thời gian bắt đầu và kết thúc chính xác cho bình chọn. Hệ thống tự động quản lý các trạng thái mà không cần can thiệp."
              delay={0.3}
            />
          </div>
        </div>
      </section>
    </div>
  );
};

const MockPollOption = ({ name, percentage, color, delay }) => (
  <div className="space-y-2">
    <div className="flex justify-between text-sm font-bold">
      <span>{name}</span>
      <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: delay + 0.5 }}>{percentage}%</motion.span>
    </div>
    <div className="h-3 w-full bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
      <motion.div 
        initial={{ width: 0 }} animate={{ width: `${percentage}%` }} transition={{ duration: 1, delay, ease: "easeOut" }}
        className={`h-full ${color} rounded-full`}
      />
    </div>
  </div>
);

const StatCard = ({ number, label }) => (
  <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center">
    <div className="text-4xl font-black bg-clip-text text-transparent bg-gradient-to-br from-primary-600 to-purple-600 dark:from-primary-400 dark:to-purple-400 mb-2">{number}</div>
    <div className="text-gray-500 font-semibold">{label}</div>
  </motion.div>
);

const FeatureCard = ({ icon, title, description, delay }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay, type: "spring", stiffness: 100 }}
      className="p-8 rounded-3xl bg-white/50 dark:bg-gray-900/50 backdrop-blur-lg border border-gray-200/50 dark:border-gray-800/50 hover:bg-white dark:hover:bg-gray-900 hover:border-primary-500/50 dark:hover:border-primary-500/50 shadow-xl shadow-gray-200/20 dark:shadow-black/20 hover:shadow-primary-500/10 transition-all duration-300 group"
    >
      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 flex items-center justify-center mb-8 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300 border border-gray-200 dark:border-gray-700 shadow-sm">
        {icon}
      </div>
      <h3 className="text-2xl font-bold mb-4">{title}</h3>
      <p className="text-gray-600 dark:text-gray-400 leading-relaxed font-medium">{description}</p>
    </motion.div>
  );
}

export default LandingPage;
