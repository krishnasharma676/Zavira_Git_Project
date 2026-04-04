
import React from 'react';
import { Mail } from 'lucide-react';

interface ForgotPasswordFormProps {
  email: string;
  setEmail: (val: string) => void;
  isSubmitting: boolean;
  onSendOtp: (e: React.FormEvent) => void;
  setMode: (mode: 'login') => void;
}

const ForgotPasswordForm: React.FC<ForgotPasswordFormProps> = ({
  email,
  setEmail,
  isSubmitting,
  onSendOtp,
  setMode,
}) => {
  return (
    <form onSubmit={onSendOtp} className="space-y-5">
      <div className="group transition-all">
        <label className="text-[9px] font-black text-white/40 uppercase tracking-[0.3em] mb-2 block ml-1 group-focus-within:text-[#7A578D]">
          Confirm Admin Email
        </label>
        <div className="relative">
          <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 group-focus-within:text-[#7A578D] transition-colors" size={14} />
          <input
            type="email"
            placeholder="admin@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isSubmitting}
            className="w-full border rounded-md py-2.5 pl-11 pr-4 outline-none transition-all text-sm font-bold text-white placeholder:text-white/30 bg-white/[0.03] border-white/10 focus:border-[#7A578D]/50 focus:bg-[#7A578D]/5"
          />
        </div>
      </div>
      <button
        type="submit"
        disabled={isSubmitting}
        className={`w-full ${
          isSubmitting ? 'bg-[#7A578D]/50 cursor-not-allowed' : 'bg-[#7A578D] hover:bg-white hover:text-black'
        } text-white py-2.5 rounded-md font-black text-xs uppercase tracking-[0.3em] flex items-center justify-center space-x-2 transition-all`}
      >
        <span>{isSubmitting ? 'Sending...' : 'Send Recovery OTP'}</span>
      </button>
      <div className="text-center pt-3">
        <button
          type="button"
          onClick={() => setMode('login')}
          className="text-[9px] font-black uppercase tracking-widest text-white/40 hover:text-white transition-colors"
        >
          Back to Login
        </button>
      </div>
    </form>
  );
};

export default ForgotPasswordForm;
