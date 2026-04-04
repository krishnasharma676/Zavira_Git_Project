
import React from 'react';
import { User, ShieldCheck, BadgeCheck, Star, Calendar, Hash, MessageSquare, Quote } from 'lucide-react';

interface TestimonialDetailsExpandedProps {
  item: any;
  columnsLength: number;
}

const TestimonialDetailsExpanded: React.FC<TestimonialDetailsExpandedProps> = ({
  item,
  columnsLength,
}) => {
  if (!item) return null;

  return (
    <tr className="bg-gray-50/50">
      <td colSpan={columnsLength + 1} className="p-0 border-b border-gray-100">
        <div className="p-6 grid grid-cols-1 md:grid-cols-4 gap-6 animate-in slide-in-from-top-2 duration-300">
          {/* Customer Perspective */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-2.5 h-8 bg-[#7A578D] rounded-full shadow-md" />
              <h3 className="text-[11px] font-black uppercase tracking-widest text-gray-900 flex items-center gap-2">
                <Quote size={18} className="text-[#7A578D]" /> Published Narrative
              </h3>
            </div>
            <div className="p-5 bg-white border border-gray-200 rounded-sm shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
               <div className="flex items-center gap-1.5 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={14} fill={i < item.rating ? "#7A578D" : "transparent"} className={i < item.rating ? "text-[#7A578D]" : "text-gray-200"} />
                  ))}
               </div>
               <p className="text-xs font-semibold text-gray-600 leading-relaxed italic relative z-10">
                 "{item.content || 'No narrative archive provided'}"
               </p>
               <div className="absolute -bottom-4 -right-4 p-4 text-gray-50 opacity-0 group-hover:opacity-100 transition-opacity">
                  <MessageSquare size={64} fill="currentColor" />
               </div>
            </div>
          </div>

          {/* Registrant Metadata */}
          <div className="space-y-4">
             <h3 className="text-[11px] font-black uppercase tracking-widest text-gray-400">Registrant Profile</h3>
             <div className="space-y-4 pl-6 border-l-2 border-gray-200">
                <div className="flex flex-col">
                   <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Identify Full</span>
                   <span className="text-xs font-black text-gray-900 uppercase tracking-tighter">{item.name || 'Anonymous User'}</span>
                </div>
                <div className="flex flex-col">
                   <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Assigned Role</span>
                   <span className="text-[10px] font-black text-[#7A578D] uppercase tracking-widest bg-[#7A578D]/5 px-2 py-0.5 rounded-sm w-fit border border-[#7A578D]/10">
                      {item.role || 'Verified Buyer'}
                   </span>
                </div>
                <div className="flex flex-col">
                   <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Visibility Protocol</span>
                   <div className="flex items-center gap-2 mt-1">
                      <div className={`w-2 h-2 rounded-full ${item.isActive ? 'bg-emerald-500 shadow-emerald-500/50 shadow-lg animate-pulse' : 'bg-red-500 shadow-red-500/50 shadow-lg'}`} />
                      <span className={`text-[10px] font-black uppercase tracking-widest ${item.isActive ? 'text-emerald-700' : 'text-red-700'}`}>
                         {item.isActive ? 'MANIFEST_PUBLISHED' : 'DRAFT_HIDDEN'}
                      </span>
                   </div>
                </div>
             </div>
          </div>

          {/* Audit Trail */}
          <div className="space-y-4">
             <h3 className="text-[11px] font-black uppercase tracking-widest text-gray-400">Audit Trail</h3>
             <div className="space-y-4">
                <div className="flex items-center gap-3">
                   <div className="p-2 bg-white rounded-sm border border-gray-100 shadow-sm text-gray-400 flex items-center justify-center">
                      <Calendar size={18} />
                   </div>
                   <div className="flex flex-col">
                      <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Nexus Entry</span>
                      <span className="text-xs font-black text-gray-900 uppercase">
                        {new Date(item.createdAt).toLocaleDateString()}
                      </span>
                      <span className="text-[9px] font-medium text-gray-400">{new Date(item.createdAt).toLocaleTimeString()}</span>
                   </div>
                </div>

                <div className="flex items-center gap-3">
                   <div className="p-2 bg-white rounded-sm border border-gray-100 shadow-sm text-gray-400 flex items-center justify-center">
                      <Hash size={18} />
                   </div>
                   <div className="flex flex-col">
                      <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Internal Protocol</span>
                      <span className="text-[9px] font-mono font-black text-gray-900 tracking-tight block truncate max-w-[120px]" title={item.id}>{item.id}</span>
                   </div>
                </div>
             </div>
          </div>
        </div>
      </td>
    </tr>
  );
};

export default TestimonialDetailsExpanded;
