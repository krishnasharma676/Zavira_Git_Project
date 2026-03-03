
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Mail, ChevronRight, CornerDownRight } from 'lucide-react';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { useAuth } from '../../store/useAuth';
import api from '../../api/axios';
import zaviraLogo from '../../assets/zavira-logo.png';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const { setAuth } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { data } = await api.post('/auth/login', { email, password });
      
      const user = data.data.user;
      const token = data.data.accessToken;

      if (user.role !== 'ADMIN' && user.role !== 'SUPER_ADMIN') {
        toast.error('Unauthorized access. Admin role required.');
        return;
      }

      setAuth(user, token);
      localStorage.setItem('isAdmin', 'true');
      toast.success('System Access Granted');
      navigate('/admin/dashboard');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center p-6 selection:bg-[#7A578D] selection:text-white">
      {/* Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#7A578D]/5 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[30%] h-[30%] bg-[#7A578D]/5 blur-[100px] rounded-full" />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-[400px] relative z-10"
      >
        <div className="bg-white/[0.02] border border-white/10 backdrop-blur-xl rounded-[2rem] p-7 shadow-2xl">
          <header className="mb-6 text-center">
            <div className="flex justify-center mb-6">
              <img src={zaviraLogo} alt="Zavira" className="h-10 w-auto object-contain" />
            </div>
            <div className="h-[1px] w-10 bg-[#7A578D] mx-auto mb-2" />
            <p className="text-[8px] font-black text-white/30 uppercase tracking-[0.4em] px-2">Admin Login</p>
          </header>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-3">
              <div className="group transition-all">
                <label className="text-[7px] font-black text-white/30 uppercase tracking-[0.3em] mb-1.5 block ml-1 group-focus-within:text-[#7A578D]">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-[#7A578D] transition-colors" size={12} />
                  <input 
                    type="email" 
                    placeholder="ADMIN@EXAMPLE.COM"
                    className="w-full bg-white/[0.03] border border-white/5 rounded-xl py-2.5 pl-10 pr-4 outline-none focus:border-[#7A578D]/50 focus:bg-[#7A578D]/5 transition-all text-[9px] font-bold text-white uppercase tracking-widest placeholder:text-white/10"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              <div className="group transition-all">
                <label className="text-[7px] font-black text-white/30 uppercase tracking-[0.3em] mb-1.5 block ml-1 group-focus-within:text-[#7A578D]">Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-[#7A578D] transition-colors" size={12} />
                  <input 
                    type="password" 
                    placeholder="••••••••••••"
                    className="w-full bg-white/[0.03] border border-white/5 rounded-xl py-2.5 pl-10 pr-4 outline-none focus:border-[#7A578D]/50 focus:bg-[#7A578D]/5 transition-all text-[9px] font-bold text-white uppercase tracking-widest placeholder:text-white/10"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <button 
              type="submit"
              className="w-full bg-[#7A578D] text-white py-3 rounded-xl font-black text-[9px] uppercase tracking-[0.3em] flex items-center justify-center space-x-2 hover:bg-white hover:text-black transition-all shadow-[0_10px_30px_rgba(227,29,37,0.2)] group"
            >
              <span>Login</span>
              <ChevronRight size={12} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </form>

          <footer className="mt-6 pt-5 border-t border-white/5 flex flex-col items-center space-y-3 text-center">
             <div className="flex items-center space-x-2 text-[7px] font-black text-white/20 uppercase tracking-[0.2em]">
                <CornerDownRight size={8} />
                <span>Secure Login</span>
             </div>
          </footer>
        </div>
      </motion.div>
    </div>
  );
};

export default AdminLogin;
