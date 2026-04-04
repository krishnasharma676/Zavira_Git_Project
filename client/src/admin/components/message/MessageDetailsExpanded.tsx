
import React from 'react';
import { User, Mail, MessageSquare, Clock, ShieldCheck, CheckCircle, Hash, CornerDownRight } from 'lucide-react';

interface MessageDetailsExpandedProps {
  msg: any;
  columnsLength: number;
}

const MessageDetailsExpanded: React.FC<MessageDetailsExpandedProps> = ({
  msg,
  columnsLength,
}) => {
  if (!msg) return null;

  return (
    <tr className="bg-gray-50/50">
      <td colSpan={columnsLength + 1} className="p-0 border-b border-gray-100">
        <div className="p-6 grid grid-cols-1 md:grid-cols-4 gap-6 animate-in slide-in-from-top-2 duration-300">
          {/* Inquiry Context */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-2.5 h-8 bg-[#7A578D] rounded-full shadow-md" />
              <h3 className="text-[11px] font-black uppercase tracking-widest text-gray-900 flex items-center gap-2">
                <MessageSquare size={18} className="text-[#7A578D]" /> Support Context
              </h3>
            </div>
            <div className="space-y-4">
               <div className="p-5 bg-white border border-gray-200 rounded-sm shadow-sm hover:shadow-md transition-shadow">
                  <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest block mb-2">Original Inquiry</span>
                  <p className="text-xs font-semibold text-gray-700 leading-relaxed italic">
                    "{msg.message || 'No narrative archive provided'}"
                  </p>
               </div>

               {msg.reply && (
                 <div className="p-5 bg-emerald-50/30 border border-emerald-100/50 rounded-sm shadow-sm relative group overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 text-emerald-100 opacity-20 group-hover:opacity-40 transition-opacity">
                       <CheckCircle size={48} fill="currentColor" />
                    </div>
                    <span className="text-[9px] font-black text-emerald-700 uppercase tracking-widest block mb-2 flex items-center gap-2">
                       <CornerDownRight size={14} /> Resolution Record
                    </span>
                    <p className="text-xs font-bold text-emerald-800 leading-relaxed italic relative z-10">
                       {msg.reply}
                    </p>
                 </div>
               )}
            </div>
          </div>

          {/* Registrant Metadata */}
          <div className="space-y-4">
             <h3 className="text-[11px] font-black uppercase tracking-widest text-gray-400">Registrant Metadata</h3>
             <div className="space-y-4 pl-6 border-l-2 border-gray-200">
                <div className="flex flex-col">
                   <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Identify Sender</span>
                   <span className="text-xs font-black text-gray-900 uppercase tracking-tighter">{msg.name || 'Anonymous User'}</span>
                </div>
                <div className="flex flex-col">
                   <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Digital Mail</span>
                   <span className="text-[10px] font-mono font-black text-[#7A578D] lowercase flex items-center gap-2 underline underline-offset-4 decoration-[#7A578D]/20">
                      <Mail size={14} /> {msg.email}
                   </span>
                </div>
                <div className="flex flex-col">
                   <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Inquiry Subject</span>
                   <span className="text-[10px] font-black text-gray-800 uppercase tracking-widest bg-gray-100 px-2 py-0.5 rounded-sm w-fit border border-gray-200">
                      {msg.subject || 'GENERAL_QUERY'}
                   </span>
                </div>
             </div>
          </div>

          {/* Audit Ledger */}
          <div className="space-y-4">
             <h3 className="text-[11px] font-black uppercase tracking-widest text-gray-400">Audit Ledger</h3>
             <div className="space-y-4">
                <div className="flex items-center gap-3">
                   <div className="p-2 bg-white rounded-sm border border-gray-100 shadow-sm text-gray-400 flex items-center justify-center">
                      <Clock size={18} />
                   </div>
                   <div className="flex flex-col">
                      <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Nexus Entry</span>
                      <span className="text-xs font-black text-gray-900 uppercase">
                        {new Date(msg.createdAt).toLocaleDateString()}
                      </span>
                      <span className="text-[9px] font-medium text-gray-400">{new Date(msg.createdAt).toLocaleTimeString()}</span>
                   </div>
                </div>

                <div className="flex items-center gap-3">
                   <div className="p-2 bg-white rounded-sm border border-gray-100 shadow-sm text-gray-400 flex items-center justify-center">
                      <ShieldCheck size={18} />
                   </div>
                   <div className="flex flex-col">
                      <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Support State</span>
                      <div className="flex items-center gap-2">
                         <div className={`w-1.5 h-1.5 rounded-full ${msg.status === 'PENDING' ? 'bg-amber-500 shadow-amber-500/30 shadow-lg animate-pulse' : msg.status === 'READ' ? 'bg-blue-500 shadow-blue-500/30 shadow-lg' : 'bg-emerald-500 shadow-emerald-500/30 shadow-lg'}`} />
                         <span className={`text-[10px] font-black uppercase tracking-widest ${msg.status === 'PENDING' ? 'text-amber-700' : msg.status === 'READ' ? 'text-blue-700' : 'text-emerald-700'}`}>
                            {msg.status}
                         </span>
                      </div>
                   </div>
                </div>

                <div className="flex items-center gap-3">
                   <div className="p-2 bg-white rounded-sm border border-gray-100 shadow-sm text-gray-400 flex items-center justify-center">
                      <Hash size={18} />
                   </div>
                   <div className="flex flex-col min-w-0">
                      <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Internal ID</span>
                      <span className="text-[9px] font-mono font-black text-gray-900 tracking-tight block truncate max-w-[120px]" title={msg.id}>{msg.id}</span>
                   </div>
                </div>
             </div>
          </div>
        </div>
      </td>
    </tr>
  );
};

export default MessageDetailsExpanded;
