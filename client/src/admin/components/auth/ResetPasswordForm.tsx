
import React from 'react';
import { Lock, KeyRound } from 'lucide-react';

interface ResetPasswordFormProps {
  otp: string;
  setOtp: (val: string) => void;
  newPassword: string;
  setNewPassword: (val: string) => void;
  confirmPassword: string;
  setConfirmPassword: (val: string) => void;
  isSubmitting: boolean;
  onReset: (e: React.FormEvent) => void;
  setMode: (mode: 'login') => void;
}

const ResetPasswordForm: React.FC<ResetPasswordFormProps> = ({
  otp,
  setOtp,
  newPassword,
  setNewPassword,
  confirmPassword,
  setConfirmPassword,
  isSubmitting,
  onReset,
  setMode,
}) => {
  return (
    <form onSubmit={onReset} className="space-y-4">
      <div className="group transition-all">
        <label className="text-[9px] font-black text-white/40 uppercase tracking-[0.3em] mb-2 block ml-1 group-focus-within:text-[#7A578D]">
          6-Digit OTP
        </label>
        <input
          type="text"
          placeholder="------"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          disabled={isSubmitting}
          className="w-full border rounded-md py-2.5 px-4 outline-none transition-all text-sm font-bold text-white tracking-[0.4em] text-center placeholder:text-white/30 bg-white/[0.03] border-white/10 focus:border-[#7A578D]/50 focus:bg-[#7A578D]/5"
          maxLength={6}
        />
      </div>
      <div className="group transition-all">
        <label className="text-[9px] font-black text-white/40 uppercase tracking-[0.3em] mb-2 block ml-1 group-focus-within:text-[#7A578D]">
          New Password
        </label>
        <div className="relative">
          <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 group-focus-within:text-[#7A578D] transition-colors" size={14} />
          <input
            type="password"
            placeholder="••••••••"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            disabled={isSubmitting}
            className="w-full border rounded-md py-2.5 pl-11 pr-4 outline-none transition-all text-sm font-bold text-white placeholder:text-white/30 bg-white/[0.03] border-white/10 focus:border-[#7A578D]/50 focus:bg-[#7A578D]/5"
          />
        </div>
      </div>
      <div className="group transition-all pb-2">
        <label className="text-[9px] font-black text-white/40 uppercase tracking-[0.3em] mb-2 block ml-1 group-focus-within:text-[#7A578D]">
          Confirm Password
        </label>
        <div className="relative">
          <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 group-focus-within:text-[#7A578D] transition-colors" size={14} />
          <input
            type="password"
            placeholder="••••••••"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            disabled={isSubmitting}
            className="w-full border rounded-md py-2.5 pl-11 pr-4 outline-none transition-all text-sm font-bold text-white placeholder:text-white/30 bg-white/[0.03] border-white/10 focus:border-[#7A578D]/50 focus:bg-[#7A578D]/5"
          />
        </div>
      </div>
      <button
        type="submit"
        disabled={isSubmitting}
        className={`w-full ${
          isSubmitting ? 'bg-green-600/50 cursor-not-allowed' : 'bg-green-600 hover:bg-green-500'
        } text-white py-2.5 rounded-md font-black text-xs uppercase tracking-[0.3em] flex items-center justify-center space-x-2 transition-all`}
      >
        <span>{isSubmitting ? 'Updating...' : 'Change Password'}</span>
      </button>
      <div className="text-center pt-3">
        <button
          type="button"
          onClick={() => setMode('login')}
          className="text-[9px] font-black uppercase tracking-widest text-white/40 hover:text-white transition-colors"
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

export default ResetPasswordForm;
