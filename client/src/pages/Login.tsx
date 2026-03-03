import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { X, Award, Gem, Sparkles, Phone, ShieldCheck, ChevronRight, Hash } from 'lucide-react';
import { useAuth } from '../store/useAuth';
import api from '../api/axios';

const Login = () => {
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState(1); // 1: Phone, 2: OTP
  const [isLoading, setIsLoading] = useState(false);
  const { setAuth } = useAuth();
  const navigate = useNavigate();

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone || phone.length < 10) {
      toast.error('Please enter a valid mobile number');
      return;
    }
    
    setIsLoading(true);
    try {
      await api.post('/auth/send-otp', { phone });
      toast.success('Verification code sent! 📲');
      setStep(2);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to send OTP');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp || otp.length < 6) {
      toast.error('Please enter the 6-digit OTP');
      return;
    }

    setIsLoading(true);
    try {
      const { data } = await api.post('/auth/verify-otp', { phone, code: otp });
      setAuth(data.data.user, data.data.accessToken);
      toast.success('Login Successful! Welcome to Zavira. ✨');
      navigate('/');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Invalid OTP');
    } finally {
      setIsLoading(false);
    }
  };

  const features = [
    { icon: Award,    title: 'Customer-first', desc: 'Putting you in the center',         color: 'text-yellow-500' },
    { icon: Gem,      title: 'Transparent',    desc: 'Honest from the inside out',        color: 'text-blue-500'   },
    { icon: Sparkles, title: 'Innovative',     desc: 'Getting the absolute best for you', color: 'text-[#C9A0C8]'   },
  ];

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center p-4">
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=1400')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          filter: 'brightness(0.25)',
        }}
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="relative z-10 w-[95vw] sm:w-full max-w-4xl rounded-3xl overflow-hidden shadow-2xl flex flex-col sm:flex-row min-h-[500px]"
      >
        <Link
          to="/"
          className="absolute top-4 right-4 z-50 w-10 h-10 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white transition-all border border-white/20"
        >
          <X size={18} />
        </Link>

        {/* LEFT: Identity Panel */}
        <div className="bg-gradient-to-br from-[#EAD0DB] to-[#C9A0C8] w-full sm:w-[50%] p-8 flex flex-col">
          <div className="mb-6">
            <span className="text-3xl font-sans font-black text-[#7A578D] tracking-tighter italic">Zavira</span>
          </div>

          <p className="text-xl font-black text-gray-800 mb-8 leading-tight uppercase tracking-tighter">
            Welcome to<br />
            <span className="text-[#7A578D]">Zavira</span>
          </p>

          <div className="space-y-4 flex-grow">
            {features.map((f) => (
              <div
                key={f.title}
                className="bg-white/30 backdrop-blur-sm rounded-2xl p-4 flex items-center space-x-4 border border-white/40"
              >
                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm">
                   <f.icon size={20} className={f.color} />
                </div>
                <div>
                  <p className="text-[10px] font-black text-gray-800 uppercase tracking-widest">{f.title}</p>
                  <p className="text-[9px] text-gray-600 font-medium">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <p className="text-[10px] text-gray-700 font-bold mt-8 uppercase tracking-widest opacity-60">
            Shopping with us is easy
          </p>
        </div>

        {/* RIGHT: Form Panel */}
        <div className="bg-white dark:bg-[#0A0A0A] w-full sm:w-[50%] p-8 flex flex-col justify-center relative overflow-hidden transition-colors duration-500">
           <AnimatePresence mode="wait">
             {step === 1 ? (
               <motion.div
                 key="step1"
                 initial={{ opacity: 0, x: 20 }}
                 animate={{ opacity: 1, x: 0 }}
                 exit={{ opacity: 0, x: -20 }}
                 className="space-y-8"
               >
                 <div className="text-center space-y-2">
                   <h2 className="text-2xl font-black text-gray-900 dark:text-white tracking-tighter uppercase italic">Login / Signup</h2>
                   <p className="text-[10px] text-gray-400 font-black uppercase tracking-[0.3em]">Enter your mobile number</p>
                 </div>

                 <form onSubmit={handleSendOtp} className="space-y-6">
                   <div className="group space-y-2">
                     <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Mobile Number</label>
                     <div className="relative">
                       <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center space-x-2 border-r border-gray-100 pr-3">
                         <Phone className="text-gray-400 group-focus-within:text-[#7A578D] transition-colors" size={14} />
                         <span className="text-xs font-black text-gray-400">+91</span>
                       </div>
                       <input
                         type="tel"
                         maxLength={10}
                         value={phone}
                         onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                         className="w-full pl-20 pr-4 py-4 bg-gray-50 border border-transparent rounded-2xl outline-none focus:border-[#7A578D] focus:bg-white transition-all text-sm font-bold tracking-widest placeholder:text-gray-300"
                         placeholder="9876543210"
                         autoFocus
                       />
                     </div>
                   </div>

                   <button
                     type="submit"
                     disabled={isLoading || phone.length < 10}
                     className="luxury-button w-full rounded-2xl flex items-center justify-center space-x-3 py-4 shadow-xl shadow-purple-500/10 disabled:opacity-50 disabled:cursor-not-allowed"
                   >
                     {isLoading ? <span className="animate-pulse tracking-widest">SENDING OTP...</span> : <><span>SEND OTP</span><ChevronRight size={16} /></>}
                   </button>
                 </form>

                 <div className="mt-8 text-center space-y-4">
                   <div className="flex items-center justify-center space-x-4">
                     <div className="h-[1px] flex-1 bg-gray-100" />
                     <ShieldCheck size={14} className="text-[#7A578D] opacity-40" />
                     <div className="h-[1px] flex-1 bg-gray-100" />
                   </div>
                   <p className="text-[9px] text-gray-400 leading-relaxed font-bold uppercase tracking-[0.2em]">
                     100% Secure & Private
                   </p>
                 </div>
               </motion.div>
             ) : (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-8"
                >
                  <div className="text-center space-y-2">
                    <h2 className="text-2xl font-black text-gray-900 dark:text-white tracking-tighter uppercase italic">Verify OTP</h2>
                    <p className="text-[10px] text-[#7A578D] font-black uppercase tracking-[0.3em]">Code sent to +91 {phone}</p>
                  </div>

                  <form onSubmit={handleVerifyOtp} className="space-y-6">
                    <div className="group space-y-2">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Enter 6-Digit OTP</label>
                      <div className="relative">
                        <Hash className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#7A578D] transition-colors" size={14} />
                        <input
                          type="text"
                          maxLength={6}
                          value={otp}
                          onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                          className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-transparent rounded-2xl outline-none focus:border-[#7A578D] focus:bg-white transition-all text-sm font-black tracking-[1em] placeholder:text-gray-300 placeholder:tracking-normal"
                          placeholder="••••••"
                          autoFocus
                        />
                      </div>
                    </div>

                    <div className="flex flex-col space-y-3">
                      <button
                        type="submit"
                        disabled={isLoading || otp.length < 6}
                        className="luxury-button w-full rounded-2xl flex items-center justify-center space-x-3 py-4 shadow-xl shadow-purple-500/10"
                      >
                        {isLoading ? <span className="animate-pulse tracking-widest">VERIFYING...</span> : <><span>VERIFY & LOGIN</span><ShieldCheck size={16} /></>}
                      </button>
                      
                      <button 
                        type="button"
                        onClick={() => { setStep(1); setOtp(''); }}
                        className="text-[9px] font-black text-[#7A578D] uppercase tracking-widest hover:underline"
                      >
                        Change Phone Number
                      </button>
                    </div>
                  </form>
                </motion.div>
             )}
           </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
