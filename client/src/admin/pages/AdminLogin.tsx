import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Mail, ChevronRight, CornerDownRight, KeyRound } from 'lucide-react';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { useAuth } from '../../store/useAuth';
import api from '../../api/axios';
import zaviraLogo from '../../assets/zavira-logo.png';
import { V } from '../../utils/validators';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const navigate = useNavigate();
  const { setAuth } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [mode, setMode] = useState<'login' | 'forgot_password' | 'reset_password'>('login');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const validate = () => {
    const errs: { email?: string; password?: string } = {};
    const emailErr = V.email(email);
    const passErr  = V.password(password);
    if (emailErr) errs.email = emailErr;
    if (passErr)  errs.password = passErr;
    return errs;
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    try {
      setIsSubmitting(true);
      const { data } = await api.post('/auth/login', { email, password });
      const user  = data.data.user;
      const token = data.data.accessToken;
      if (user.role !== 'ADMIN' && user.role !== 'SUPER_ADMIN') {
        toast.error('Unauthorized access. Admin role required.');
        setIsSubmitting(false);
        return;
      }
      await setAuth(user, token);
      localStorage.setItem('isAdmin', 'true');
      toast.success('System Access Granted');
      navigate('/admin/inventory');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Login failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;
    if (!email) {
      setErrors({ email: 'Email required' });
      return;
    }
    try {
      setIsSubmitting(true);
      await api.post('/auth/admin/forgot-password-otp', { email });
      toast.success('OTP sent to your email');
      setMode('reset_password');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to send OTP');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;
    if (!otp || !newPassword || newPassword !== confirmPassword) {
      toast.error('Invalid input or passwords do not match');
      return;
    }
    try {
      setIsSubmitting(true);
      await api.post('/auth/admin/reset-password', { email, code: otp, newPassword });
      toast.success('Password changed successfully. Please login.');
      setMode('login');
      setPassword('');
      setOtp('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to reset password');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center p-2 selection:bg-[#7A578D] selection:text-white">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#7A578D]/5 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[30%] h-[30%] bg-[#7A578D]/5 blur-[100px] rounded-full" />
      </div>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-[400px] relative z-10">
        <div className="bg-white/[0.02] border border-white/10 backdrop-blur-xl rounded-[2rem] p-7 shadow-2xl">
          <header className="mb-6 text-center">
            <div className="flex justify-center mb-6">
              <img src={zaviraLogo} alt="Zavira" className="h-6 w-auto object-contain" />
            </div>
            <div className="h-[1px] w-6 bg-[#7A578D] mx-auto mb-2" />
            <p className="text-[8px] font-black text-white/30 uppercase tracking-[0.4em] px-2">Admin Login</p>
          </header>
          {mode === 'login' && (
            <form onSubmit={handleLogin} className="space-y-1">
              <div className="space-y-1">
                <div className="group transition-all">
                  <label className="text-[7px] font-black text-white/30 uppercase tracking-[0.3em] mb-1.5 block ml-1 group-focus-within:text-[#7A578D]">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-[#7A578D] transition-colors" size={12} />
                    <input type="email" placeholder="admin@example.com" value={email} onChange={(e) => { setEmail(e.target.value); setErrors(p => ({ ...p, email: V.email(e.target.value) })); }} disabled={isSubmitting}
                      className={`w-full border rounded-sm py-1 pl-10 pr-4 outline-none transition-all text-[10px] font-bold text-white placeholder:text-white/30 bg-white/[0.03] ${errors.email ? 'border-red-500/50 bg-red-500/5' : 'border-white/5 focus:border-[#7A578D]/50 focus:bg-[#7A578D]/5'}`} />
                  </div>
                  {errors.email && <p className="text-[9px] text-red-400 font-bold ml-1 mt-0.5">{errors.email}</p>}
                </div>
                <div className="group transition-all">
                  <label className="text-[7px] font-black text-white/30 uppercase tracking-[0.3em] mb-1.5 block ml-1 group-focus-within:text-[#7A578D]">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-[#7A578D] transition-colors" size={12} />
                    <input type="password" placeholder="••••••••••••" value={password} onChange={(e) => { setPassword(e.target.value); setErrors(p => ({ ...p, password: V.password(e.target.value) })); }} disabled={isSubmitting}
                      className={`w-full border rounded-sm py-1 pl-10 pr-4 outline-none transition-all text-[10px] font-bold text-white placeholder:text-white/30 bg-white/[0.03] ${errors.password ? 'border-red-500/50 bg-red-500/5' : 'border-white/5 focus:border-[#7A578D]/50 focus:bg-[#7A578D]/5'}`} />
                  </div>
                  {errors.password && <p className="text-[9px] text-red-400 font-bold ml-1 mt-0.5">{errors.password}</p>}
                </div>
                <div className="flex justify-end pt-1 pb-2 pr-1">
                  <button type="button" onClick={() => { setMode('forgot_password'); setErrors({}); }} className="text-[7px] font-black uppercase tracking-widest text-white/50 hover:text-[#7A578D] transition-colors focus:outline-none">
                    Forgot Password?
                  </button>
                </div>
              </div>
              <button type="submit" disabled={isSubmitting}
                className={`w-full ${isSubmitting ? 'bg-[#7A578D]/50 cursor-not-allowed' : 'bg-[#7A578D] hover:bg-white hover:text-black'} text-white py-1 rounded-sm font-black text-[9px] uppercase tracking-[0.3em] flex items-center justify-center space-x-2 transition-all shadow-[0_10px_30px_rgba(122,87,141,0.2)] group`}>
                <span>{isSubmitting ? 'Verifying...' : 'Login'}</span>
                <ChevronRight size={12} className={isSubmitting ? '' : 'group-hover:translate-x-1 transition-transform'} />
              </button>
            </form>
          )}

          {mode === 'forgot_password' && (
            <form onSubmit={handleSendOtp} className="space-y-4">
              <div className="group transition-all">
                <label className="text-[7px] font-black text-white/30 uppercase tracking-[0.3em] mb-1.5 block ml-1 group-focus-within:text-[#7A578D]">Confirm Admin Email</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-[#7A578D] transition-colors" size={12} />
                  <input type="email" placeholder="admin@example.com" value={email} onChange={(e) => setEmail(e.target.value)} disabled={isSubmitting}
                    className="w-full border rounded-sm py-1.5 pl-10 pr-4 outline-none transition-all text-[10px] font-bold text-white placeholder:text-white/30 bg-white/[0.03] border-white/5 focus:border-[#7A578D]/50 focus:bg-[#7A578D]/5" />
                </div>
              </div>
              <button type="submit" disabled={isSubmitting}
                className={`w-full ${isSubmitting ? 'bg-[#7A578D]/50 cursor-not-allowed' : 'bg-[#7A578D] hover:bg-white hover:text-black'} text-white py-1.5 rounded-sm font-black text-[9px] uppercase tracking-[0.3em] flex items-center justify-center space-x-2 transition-all`}>
                <span>{isSubmitting ? 'Sending...' : 'Send Recovery OTP'}</span>
              </button>
              <div className="text-center pt-2">
                <button type="button" onClick={() => setMode('login')} className="text-[7px] font-black uppercase tracking-widest text-white/40 hover:text-white transition-colors">
                  Back to Login
                </button>
              </div>
            </form>
          )}

          {mode === 'reset_password' && (
            <form onSubmit={handleResetPassword} className="space-y-2">
              <div className="group transition-all">
                <label className="text-[7px] font-black text-white/30 uppercase tracking-[0.3em] mb-1 block ml-1 group-focus-within:text-[#7A578D]">6-Digit OTP</label>
                <input type="text" placeholder="------" value={otp} onChange={(e) => setOtp(e.target.value)} disabled={isSubmitting} className="w-full border rounded-sm py-1 px-3 outline-none transition-all text-[10px] font-bold text-white tracking-[0.4em] text-center placeholder:text-white/30 bg-white/[0.03] border-white/5 focus:border-[#7A578D]/50 focus:bg-[#7A578D]/5" maxLength={6} />
              </div>
              <div className="group transition-all">
                <label className="text-[7px] font-black text-white/30 uppercase tracking-[0.3em] mb-1 block ml-1 group-focus-within:text-[#7A578D]">New Password</label>
                <div className="relative">
                  <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-[#7A578D] transition-colors" size={12} />
                  <input type="password" placeholder="••••••••" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} disabled={isSubmitting} className="w-full border rounded-sm py-1 pl-8 pr-3 outline-none transition-all text-[10px] font-bold text-white placeholder:text-white/30 bg-white/[0.03] border-white/5 focus:border-[#7A578D]/50 focus:bg-[#7A578D]/5" />
                </div>
              </div>
              <div className="group transition-all pb-2">
                <label className="text-[7px] font-black text-white/30 uppercase tracking-[0.3em] mb-1 block ml-1 group-focus-within:text-[#7A578D]">Confirm Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-[#7A578D] transition-colors" size={12} />
                  <input type="password" placeholder="••••••••" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} disabled={isSubmitting} className="w-full border rounded-sm py-1 pl-8 pr-3 outline-none transition-all text-[10px] font-bold text-white placeholder:text-white/30 bg-white/[0.03] border-white/5 focus:border-[#7A578D]/50 focus:bg-[#7A578D]/5" />
                </div>
              </div>
              <button type="submit" disabled={isSubmitting}
                className={`w-full ${isSubmitting ? 'bg-green-600/50 cursor-not-allowed' : 'bg-green-600 hover:bg-green-500'} text-white py-1 rounded-sm font-black text-[9px] uppercase tracking-[0.3em] flex items-center justify-center space-x-2 transition-all`}>
                <span>{isSubmitting ? 'Updating...' : 'Change Password'}</span>
              </button>
              <div className="text-center pt-2">
                <button type="button" onClick={() => setMode('login')} className="text-[7px] font-black uppercase tracking-widest text-white/40 hover:text-white transition-colors">
                  Cancel
                </button>
              </div>
            </form>
          )}
          <footer className="mt-6 pt-5 border-t border-white/5 flex flex-col items-center space-y-1 text-center">
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
