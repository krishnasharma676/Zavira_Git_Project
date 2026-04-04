
import React from 'react';
import { Shield, ChevronDown } from 'lucide-react';

interface StaffMemberFormProps {
  authForm: { email: string; phone: string; role: string };
  setAuthForm: (form: { email: string; phone: string; role: string }) => void;
  handleAuthorize: (e: React.FormEvent) => void;
}

const StaffMemberForm: React.FC<StaffMemberFormProps> = ({
  authForm,
  setAuthForm,
  handleAuthorize,
}) => {
  return (
    <form onSubmit={handleAuthorize} className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div className="flex items-center gap-4 bg-[#7A578D]/5 p-4 rounded-sm border border-[#7A578D]/10 shadow-inner">
        <div className="w-10 h-10 bg-white rounded-sm flex items-center justify-center text-[#7A578D] shadow-md border border-[#7A578D]/10">
          <Shield size={24} />
        </div>
        <div className="space-y-1">
          <h3 className="text-[11px] font-black text-[#7A578D] uppercase tracking-[0.2em]">Staff Credentials</h3>
          <p className="text-gray-500 text-[10px] font-black uppercase tracking-widest opacity-60">Granting administrative nexus access</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Identity Mail</label>
          <input
            type="email"
            required
            value={authForm.email}
            onChange={(e) => setAuthForm({ ...authForm, email: e.target.value })}
            className="w-full bg-gray-50 border border-gray-200 rounded-sm py-2 px-3 outline-none focus:ring-2 focus:ring-[#7A578D]/20 focus:border-[#7A578D] text-xs font-mono lowercase font-bold transition-all placeholder:opacity-30"
            placeholder="registrant@zavira.nexus"
          />
        </div>
        <div className="space-y-2">
          <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Identity Contact</label>
          <input
            type="text"
            required
            value={authForm.phone}
            onChange={(e) => setAuthForm({ ...authForm, phone: e.target.value })}
            className="w-full bg-gray-50 border border-gray-200 rounded-sm py-2 px-3 outline-none focus:ring-2 focus:ring-[#7A578D]/20 focus:border-[#7A578D] text-xs font-black tracking-widest transition-all placeholder:opacity-30"
            placeholder="9876543210"
          />
        </div>
        <div className="space-y-2 md:col-span-2">
          <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Permission Protocol</label>
          <div className="relative group">
            <select
              value={authForm.role}
              onChange={(e) => setAuthForm({ ...authForm, role: e.target.value })}
              className="w-full bg-gray-50 border border-gray-200 rounded-sm py-2.5 px-3 outline-none focus:ring-2 focus:ring-[#7A578D]/20 focus:border-[#7A578D] text-[10px] font-black uppercase tracking-[0.3em] appearance-none cursor-pointer transition-all shadow-sm group-hover:bg-gray-100/50"
            >
              <option value="ADMIN">ADMINISTRATOR_FULL</option>
              <option value="MANAGER">MANAGER_PROTOCOL</option>
              <option value="EDITOR">EDITOR_CONTENT</option>
            </select>
            <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-gray-400 group-hover:text-[#7A578D] transition-colors">
              <ChevronDown size={18} />
            </div>
          </div>
        </div>
      </div>

      <button
        type="submit"
        className="w-full bg-black text-white h-12 mt-4 rounded-sm text-[11px] font-black uppercase tracking-[0.3em] hover:bg-[#7A578D] transition-all shadow-xl shadow-black/10 active:scale-95 border-b-2 border-black/20"
      >
        GENERATE STAFF PROTOCOL
      </button>
    </form>
  );
};

export default StaffMemberForm;
