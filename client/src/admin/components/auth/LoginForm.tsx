
import React from 'react';
import { Mail, Lock, ChevronRight } from 'lucide-react';
import { V } from '../../../utils/validators';

interface LoginFormProps {
  email: string;
  setEmail: (val: string) => void;
  password: string;
  setPassword: (val: string) => void;
  errors: { email?: string; password?: string };
  setErrors: React.Dispatch<React.SetStateAction<{ email?: string; password?: string }>>;
  isSubmitting: boolean;
  onLogin: (e: React.FormEvent) => void;
  setMode: (mode: 'forgot_password') => void;
}

const LoginForm: React.FC<LoginFormProps> = ({
  email,
  setEmail,
  password,
  setPassword,
  errors,
  setErrors,
  isSubmitting,
  onLogin,
  setMode,
}) => {
  return (
    <form onSubmit={onLogin} className="space-y-4">
      <div className="space-y-3">
        {/* Email Field */}
        <div className="group transition-all">
          <label className="text-[9px] font-black text-white/40 uppercase tracking-[0.3em] mb-2 block ml-1 group-focus-within:text-[#7A578D]">
            Email Address
          </label>
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 group-focus-within:text-[#7A578D] transition-colors" size={14} />
            <input
              type="email"
              placeholder="admin@example.com"
              value={email}
              onChange={(e) => {
                const val = e.target.value;
                setEmail(val);
                setErrors((p) => ({ ...p, email: V.email(val) }));
              }}
              disabled={isSubmitting}
              className={`w-full border rounded-md py-2.5 pl-11 pr-4 outline-none transition-all text-sm font-bold text-white placeholder:text-white/30 bg-white/[0.03] ${
                errors.email ? 'border-red-500/50 bg-red-500/5' : 'border-white/10 focus:border-[#7A578D]/50 focus:bg-[#7A578D]/5'
              }`}
            />
          </div>
          {errors.email && <p className="text-[10px] text-red-400 font-bold ml-1 mt-1">{errors.email}</p>}
        </div>

        {/* Password Field */}
        <div className="group transition-all">
          <label className="text-[9px] font-black text-white/40 uppercase tracking-[0.3em] mb-2 block ml-1 group-focus-within:text-[#7A578D]">
            Password
          </label>
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 group-focus-within:text-[#7A578D] transition-colors" size={14} />
            <input
              type="password"
              placeholder="••••••••••••"
              value={password}
              onChange={(e) => {
                const val = e.target.value;
                setPassword(val);
                setErrors((p) => ({ ...p, password: V.password(val) }));
              }}
              disabled={isSubmitting}
              className={`w-full border rounded-md py-2.5 pl-11 pr-4 outline-none transition-all text-sm font-bold text-white placeholder:text-white/30 bg-white/[0.03] ${
                errors.password ? 'border-red-500/50 bg-red-500/5' : 'border-white/10 focus:border-[#7A578D]/50 focus:bg-[#7A578D]/5'
              }`}
            />
          </div>
          {errors.password && <p className="text-[10px] text-red-400 font-bold ml-1 mt-1">{errors.password}</p>}
        </div>

        {/* Forgot Password */}
        <div className="flex justify-end pt-1 pb-2 pr-1">
          <button
            type="button"
            onClick={() => {
              setMode('forgot_password');
              setErrors({});
            }}
            className="text-[9px] font-black uppercase tracking-widest text-white/50 hover:text-[#7A578D] transition-colors focus:outline-none"
          >
            Forgot Password?
          </button>
        </div>
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className={`w-full ${
          isSubmitting ? 'bg-[#7A578D]/50 cursor-not-allowed' : 'bg-[#7A578D] hover:bg-white hover:text-black'
        } text-white py-2.5 rounded-md font-black text-xs uppercase tracking-[0.3em] flex items-center justify-center space-x-2 transition-all shadow-[0_10px_30px_rgba(122,87,141,0.2)] group`}
      >
        <span>{isSubmitting ? 'Verifying...' : 'Login'}</span>
        <ChevronRight size={14} className={isSubmitting ? '' : 'group-hover:translate-x-1 transition-transform'} />
      </button>
    </form>
  );
};

export default LoginForm;
