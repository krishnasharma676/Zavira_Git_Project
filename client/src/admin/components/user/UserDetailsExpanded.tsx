
import React from 'react';
import { User, Mail, Phone, Shield, BadgeCheck, Activity, Calendar, Hash, Globe } from 'lucide-react';

interface UserDetailsExpandedProps {
  user: any;
  columnsLength: number;
}

const UserDetailsExpanded: React.FC<UserDetailsExpandedProps> = ({
  user,
  columnsLength,
}) => {
  if (!user) return null;

  return (
    <tr className="bg-gray-50/50">
      <td colSpan={columnsLength + 1} className="p-0 border-b border-gray-100">
        <div className="p-6 grid grid-cols-1 md:grid-cols-4 gap-6 animate-in slide-in-from-top-2 duration-300">
          {/* Identity Profile */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-2.5 h-8 bg-[#7A578D] rounded-full shadow-md" />
              <h3 className="text-[11px] font-black uppercase tracking-widest text-gray-900 flex items-center gap-2">
                <User size={18} className="text-[#7A578D]" /> Identity Profile
              </h3>
            </div>
            <div className="space-y-4 pl-6 border-l-2 border-gray-200">
              <div className="flex flex-col">
                <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Name</span>
                <span className="text-xs font-black text-gray-900">{user.name || 'Anonymous User'}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Digital Contact</span>
                <span className="text-[10px] font-mono font-black text-[#7A578D] lowercase flex items-center gap-2">
                   <Mail size={14} /> {user.email}
                </span>
              </div>
            </div>
          </div>

          {/* Access Matrix */}
          <div className="space-y-4">
            <h3 className="text-[11px] font-black uppercase tracking-widest text-gray-400">Access Matrix</h3>
            <div className="space-y-4">
               <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-sm border shadow-sm ${user.role === 'ADMIN' ? 'bg-[#7A578D]/10 text-[#7A578D] border-[#7A578D]/10' : 'bg-gray-50 text-gray-400 border-gray-100'}`}>
                     <Shield size={18} />
                  </div>
                  <div className="flex flex-col">
                     <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Permission Level</span>
                     <span className={`text-[10px] font-black uppercase tracking-widest ${user.role === 'ADMIN' ? 'text-[#7A578D]' : 'text-gray-900'}`}>
                        {user.role || 'USER'}
                     </span>
                  </div>
               </div>

               <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-sm border shadow-sm ${user.isEmailVerified ? 'bg-emerald-50 text-emerald-500 border-emerald-100' : 'bg-amber-50 text-amber-500 border-amber-100'}`}>
                     <BadgeCheck size={18} />
                  </div>
                  <div className="flex flex-col">
                     <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Verification Status</span>
                     <span className={`text-[10px] font-black uppercase ${user.isEmailVerified ? 'text-emerald-700' : 'text-amber-700'}`}>
                        {user.isEmailVerified ? 'Validated Identity' : 'Pending Verification'}
                     </span>
                  </div>
               </div>
            </div>
          </div>

          {/* Operational Status */}
          <div className="space-y-4">
             <h3 className="text-[11px] font-black uppercase tracking-widest text-gray-400">Operational Status</h3>
             <div className="space-y-4">
                <div className="flex items-center gap-3">
                   <div className={`p-2 rounded-sm border shadow-sm ${user.status === 'ACTIVE' ? 'bg-emerald-50 text-emerald-500 border-emerald-100' : 'bg-red-50 text-red-500 border-red-100'}`}>
                      <Activity size={18} />
                   </div>
                   <div className="flex flex-col">
                      <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Registry State</span>
                      <span className={`text-[10px] font-black uppercase ${user.status === 'ACTIVE' ? 'text-emerald-700' : 'text-red-700'}`}>
                         {user.status}
                      </span>
                   </div>
                </div>

                <div className="flex items-center gap-3">
                   <div className="p-2 bg-white rounded-sm border border-gray-100 shadow-sm text-gray-400">
                      <Phone size={18} />
                   </div>
                   <div className="flex flex-col">
                      <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Verified Contact</span>
                      <span className="text-xs font-black text-gray-900">{user.phoneNumber || 'MOCK_PH_UNAVAILABLE'}</span>
                   </div>
                </div>
             </div>
          </div>

          {/* Audit Ledger */}
          <div className="space-y-4">
             <h3 className="text-[11px] font-black uppercase tracking-widest text-gray-400">Audit Ledger</h3>
             <div className="space-y-4">
                <div className="flex items-center gap-3">
                   <div className="p-2 bg-white rounded-sm border border-gray-100 shadow-sm text-gray-400">
                      <Calendar size={18} />
                   </div>
                   <div className="flex flex-col">
                      <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Nexus Entry</span>
                      <span className="text-xs font-black text-gray-900 uppercase">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </span>
                      <span className="text-[9px] font-medium text-gray-400">{new Date(user.createdAt).toLocaleTimeString()}</span>
                   </div>
                </div>

                <div className="flex items-center gap-3">
                   <div className="p-2 bg-white rounded-sm border border-gray-100 shadow-sm text-gray-400">
                      <Hash size={18} />
                   </div>
                   <div className="flex flex-col">
                      <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Reference Protocol</span>
                      <span className="text-[10px] font-mono font-black text-gray-900 tracking-tight block truncate max-w-[150px]" title={user.id}>{user.id}</span>
                   </div>
                </div>
             </div>
          </div>
        </div>
      </td>
    </tr>
  );
};

export default UserDetailsExpanded;
