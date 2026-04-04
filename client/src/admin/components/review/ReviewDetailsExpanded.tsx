
import React from 'react';
import { User, Package, Calendar, ShieldCheck, MessageSquare, Star } from 'lucide-react';

interface ReviewDetailsExpandedProps {
  review: any;
  columnsLength: number;
}

const ReviewDetailsExpanded: React.FC<ReviewDetailsExpandedProps> = ({
  review,
  columnsLength,
}) => {
  if (!review) return null;

  return (
    <tr className="bg-gray-50/50">
      <td colSpan={columnsLength + 1} className="p-0 border-b border-gray-100">
        <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6 animate-in slide-in-from-top-2 duration-300">
          {/* Main Review Text */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-2.5 h-8 bg-[#7A578D] rounded-full shadow-md" />
              <h3 className="text-[11px] font-black uppercase tracking-widest text-gray-900 flex items-center gap-2">
                <MessageSquare size={18} className="text-[#7A578D]" /> Customer Narrative
              </h3>
            </div>
            <div className="p-5 bg-white border border-gray-200 rounded-sm shadow-sm hover:shadow-md transition-shadow relative">
               <div className="flex items-center gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={14} fill={i < review.rating ? "#7A578D" : "transparent"} className={i < review.rating ? "text-[#7A578D]" : "text-gray-200"} />
                  ))}
               </div>
               <p className="text-xs font-semibold text-gray-600 leading-relaxed italic">
                 "{review.comment || 'No comment provided'}"
               </p>
               <div className="absolute -bottom-2 -right-2 p-2 bg-gray-50 rounded-full border border-gray-100 text-gray-300">
                  <MessageSquare size={14} />
               </div>
            </div>
          </div>

          {/* Metadata Ledger */}
          <div className="space-y-4 pl-0 md:pl-6 border-l-0 md:border-l-2 border-gray-200">
             <h3 className="text-[10px] font-black uppercase tracking-widest text-gray-400">Context Ledger</h3>
             <div className="space-y-4">
                <div className="flex items-center gap-3">
                   <div className="p-2 bg-white rounded-sm border border-gray-100 shadow-sm text-gray-400">
                      <User size={16} />
                   </div>
                   <div className="flex flex-col">
                      <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Registrant</span>
                      <span className="text-xs font-black text-gray-900">{review.user?.name || 'Anonymous User'}</span>
                      <span className="text-[9px] font-mono font-bold text-gray-400 lowercase">{review.user?.email}</span>
                   </div>
                </div>

                <div className="flex items-center gap-3">
                   <div className="p-2 bg-white rounded-sm border border-gray-100 shadow-sm text-gray-400">
                      <Package size={16} />
                   </div>
                   <div className="flex flex-col">
                      <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Asset Focus</span>
                      <span className="text-xs font-black text-[#7A578D] uppercase tracking-wider">{review.product?.name || 'N/A'}</span>
                   </div>
                </div>

                <div className="flex items-center gap-3">
                   <div className="p-2 bg-white rounded-sm border border-gray-100 shadow-sm text-gray-400">
                      <Calendar size={16} />
                   </div>
                   <div className="flex flex-col">
                      <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Transmission</span>
                      <span className="text-xs font-black text-gray-900 uppercase">
                        {new Date(review.createdAt).toLocaleDateString()}
                      </span>
                      <span className="text-[9px] font-medium text-gray-400">{new Date(review.createdAt).toLocaleTimeString()}</span>
                   </div>
                </div>

                <div className="flex items-center gap-3">
                   <div className={`p-2 rounded-sm border shadow-sm ${review.isApproved ? 'bg-emerald-50 text-emerald-500 border-emerald-100' : 'bg-yellow-50 text-yellow-500 border-yellow-100'}`}>
                      <ShieldCheck size={16} />
                   </div>
                   <div className="flex flex-col">
                      <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Protocol</span>
                      <span className={`text-[10px] font-black uppercase ${review.isApproved ? 'text-emerald-700' : 'text-yellow-700'}`}>
                         {review.isApproved ? 'Validated' : 'Pending Review'}
                      </span>
                   </div>
                </div>
             </div>
          </div>
        </div>
      </td>
    </tr>
  );
};

export default ReviewDetailsExpanded;
