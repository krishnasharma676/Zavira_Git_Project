
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CornerDownRight, ShieldCheck, Lock, Activity, Zap, Info, ChevronRight, Fingerprint, Key, Mail } from 'lucide-react';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../store/useAuth';
import api from '../../api/axios';
import zaviraLogo from '../../assets/zavira-logo.png';
import { V } from '../../utils/validators';

// Sub-components
import LoginForm from '../components/auth/LoginForm';
import ForgotPasswordForm from '../components/auth/ForgotPasswordForm';
import ResetPasswordForm from '../components/auth/ResetPasswordForm';

const AdminLogin = () => {
  // State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [mode, setMode] = useState<'login' | 'forgot_password' | 'reset_password'>('login');
  
  // Reset/Forgot Password state
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const navigate = useNavigate();
  const { setAuth } = useAuth();

  const validateLogin = () => {
    const errs: { email?: string; password?: string } = {};
    const emailErr = V.email(email);
    const passErr = V.password(password);
    if (emailErr) errs.email = emailErr;
    if (passErr) errs.password = passErr;
    return errs;
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    const errs = validateLogin();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    try {
      setIsSubmitting(true);
      const { data } = await api.post('/auth/login', { email, password });
      const user = data.data.user;
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
      // Cleanup
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
    <div className="min-h-screen bg-[#050505] flex items-center justify-center p-4 selection:bg-[#7A578D] selection:text-white relative overflow-hidden">
      {/* Background decoration: Abstract Gradients */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-[#7A578D]/10 blur-[160px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-15%] right-[-5%] w-[45%] h-[45%] bg-[#7A578D]/5 blur-[140px] rounded-full" />
        <div className="absolute top-[30%] right-[10%] w-[30%] h-[30%] bg-[#7A578D]/5 blur-[120px] rounded-full animate-pulse delay-1000" />
      </div>

      {/* Grid Pattern Overlay */}
      <div className="fixed inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-[0.03] pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, scale: 0.95, filter: 'blur(10px)' }} 
        animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }} 
        transition={{ duration: 1.2, ease: "easeOut" }}
        className="w-full max-w-[440px] relative z-10"
      >
        <div className="bg-black/40 border border-white/10 backdrop-blur-3xl rounded-sm p-10 shadow-[0_0_100px_rgba(0,0,0,0.5)] group relative overflow-hidden">
           
           {/* Decorative corner accents */}
           <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-[#7A578D]/40 rounded-tl-sm opacity-50 group-hover:scale-110 transition-transform" />
           <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-[#7A578D]/40 rounded-tr-sm opacity-50 group-hover:scale-110 transition-transform" />
           <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-[#7A578D]/40 rounded-bl-sm opacity-50 group-hover:scale-110 transition-transform" />
           <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-[#7A578D]/40 rounded-br-sm opacity-50 group-hover:scale-110 transition-transform" />

           <header className="mb-12 text-center relative z-10">
              <motion.div 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="flex justify-center mb-8"
              >
                <div className="relative">
                   <img src={zaviraLogo} alt="Zavira" className="h-10 w-auto object-contain drop-shadow-[0_0_20px_rgba(122,87,141,0.5)]" />
                   <div className="absolute -inset-4 bg-[#7A578D]/5 blur-2xl rounded-full -z-10" />
                </div>
              </motion.div>
              
              <div className="flex items-center justify-center gap-4 mb-4">
                 <div className="h-[2px] w-8 bg-gradient-to-r from-transparent to-[#7A578D]" />
                 <p className="text-[11px] font-black text-white uppercase tracking-[0.5em] px-2 whitespace-nowrap">
                   Nexus_Administrative_Gateway
                 </p>
                 <div className="h-[2px] w-8 bg-gradient-to-l from-transparent to-[#7A578D]" />
              </div>
              
              <div className="flex items-center justify-center gap-3">
                 <div className="p-1 px-3 bg-[#7A578D]/10 border border-[#7A578D]/20 rounded-full flex items-center gap-2">
                    <ShieldCheck size={12} className="text-[#7A578D] animate-pulse" />
                    <span className="text-[8px] font-black text-[#7A578D] uppercase tracking-widest">Protocol 2.4 Active</span>
                 </div>
              </div>
           </header>

           {/* Form Content based on Mode with AnimatePresence */}
           <div className="relative z-10 min-h-[300px]">
              <AnimatePresence mode="wait">
                 <motion.div
                   key={mode}
                   initial={{ opacity: 0, x: 20 }}
                   animate={{ opacity: 1, x: 0 }}
                   exit={{ opacity: 0, x: -20 }}
                   transition={{ duration: 0.4 }}
                 >
                    {mode === 'login' && (
                      <LoginForm 
                        email={email}
                        setEmail={setEmail}
                        password={password}
                        setPassword={setPassword}
                        errors={errors}
                        setErrors={setErrors}
                        isSubmitting={isSubmitting}
                        onLogin={handleLogin}
                        setMode={setMode}
                      />
                    )}

                    {mode === 'forgot_password' && (
                      <ForgotPasswordForm 
                        email={email}
                        setEmail={setEmail}
                        isSubmitting={isSubmitting}
                        onSendOtp={handleSendOtp}
                        setMode={setMode}
                      />
                    )}

                    {mode === 'reset_password' && (
                      <ResetPasswordForm 
                        otp={otp}
                        setOtp={setOtp}
                        newPassword={newPassword}
                        setNewPassword={setNewPassword}
                        confirmPassword={confirmPassword}
                        setConfirmPassword={setConfirmPassword}
                        isSubmitting={isSubmitting}
                        onReset={handleResetPassword}
                        setMode={setMode}
                      />
                    )}
                 </motion.div>
              </AnimatePresence>
           </div>

           <footer className="mt-12 pt-8 border-t border-white/5 flex flex-col items-center space-y-4 text-center relative z-10">
              <div className="flex items-center space-x-3 text-[9px] font-black text-white/20 uppercase tracking-[0.4em] group/footer cursor-default">
                <Fingerprint size={16} className="text-white/10 group-hover:text-[#7A578D]/30 transition-colors" />
                <span className="group-hover:text-white/30 transition-colors">Authoritative Identity Protocol</span>
              </div>
              
              <div className="flex gap-4 opacity-10 grayscale">
                 <Zap size={14} className="text-white"/>
                 <Activity size={14} className="text-white"/>
                 <Key size={14} className="text-white"/>
              </div>
           </footer>
        </div>

        {/* Global System Info */}
        <div className="mt-8 flex items-center justify-center gap-8 text-[9px] font-black text-white/20 uppercase tracking-widest pointer-events-none">
           <div className="flex items-center gap-2">
              <span className="w-1 h-1 rounded-full bg-[#7A578D] blur-[1px]"></span>
              256-BIT_ENCRYPTED
           </div>
           <div className="flex items-center gap-2">
              <span className="w-1 h-1 rounded-full bg-[#7A578D] blur-[1px]"></span>
              Nexus_MASTER_SYNC
           </div>
        </div>
      </motion.div>
    </div>
  );
};

export default AdminLogin;
