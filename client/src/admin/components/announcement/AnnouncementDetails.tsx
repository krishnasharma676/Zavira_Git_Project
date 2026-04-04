
import React from 'react';
import { Megaphone, Activity, MousePointerClick, Clock } from 'lucide-react';

interface AnnouncementDetailsProps {
  item: any;
  columnsLength: number;
}

const AnnouncementDetails: React.FC<AnnouncementDetailsProps> = ({ item, columnsLength }) => {
  if (!item) return null;
  return (
    <tr className="bg-gray-50/50 text-left">
      <td colSpan={columnsLength + 1} className="p-0 border-b border-gray-100">
        <div className="p-2 grid grid-cols-1 md:grid-cols-3 gap-2 animate-in slide-in-from-top-2 duration-300">
          {/* Alert Information */}
          <div className="space-y-1">
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-[#7A578D] flex items-center gap-2">
              <Megaphone size={12} /> Broadcast Pulse
            </h3>
            <div className="space-y-1 pl-4">
              <div className="flex flex-col">
                <span className="text-[7px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1.5">Primary Directive</span>
                <h4 className="text-[11px] font-black text-gray-900 uppercase leading-tight">{item.title}</h4>
                <p className="text-[9px] font-bold text-[#7A578D] uppercase mt-1 italic">{item.subtitle || 'NO_SECONDARY_DATA'}</p>
              </div>
              <div className="bg-white border border-gray-100 rounded-sm p-2.5 shadow-sm flex items-center justify-between group">
                <span className="text-[8px] font-black text-gray-400 uppercase">Alert Strategy</span>
                <span className="text-[9px] font-black text-gray-900 uppercase bg-gray-50 px-2 py-0.5 rounded border border-gray-100">{item.type}</span>
              </div>
            </div>
          </div>

          {/* Performance Metrics */}
          <div className="space-y-1 border-l border-gray-100 pl-6">
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-900 flex items-center gap-2">
              <Activity size={12} /> Live Metrics
            </h3>
            <div className="grid grid-cols-1 gap-2">
              <div className="bg-white border border-gray-100 rounded-sm p-3 shadow-sm flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <MousePointerClick size={12} className="text-[#7A578D]" />
                  <span className="text-[8px] font-black text-gray-400 uppercase">Interactive Reach</span>
                </div>
                <span className="text-xs font-black text-gray-900">{item.clickCount || 0} CLICKS</span>
              </div>
              <div className="p-3 bg-gray-50 rounded-sm border border-gray-100">
                <span className="text-[7px] font-black text-gray-400 uppercase tracking-widest block mb-1.5 italic">Destination Protocol</span>
                <div className="bg-white px-2 py-1 rounded border border-gray-100 text-[9px] font-bold text-gray-500 lowercase truncate leading-none">
                  {item.link || 'DIRECT_ACTION_DISABLED'}
                </div>
              </div>
            </div>
          </div>

          {/* Registry Audit */}
          <div className="space-y-1 border-l border-gray-100 pl-6">
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-900 flex items-center gap-2">
              <Clock size={12} /> Registry Audit
            </h3>
            <div className="space-y-1">
              <div className="flex flex-col gap-1">
                <span className="text-[7px] font-black text-gray-400 uppercase tracking-widest ml-1">Creation Stamp</span>
                <div className="bg-gray-50 p-2 rounded-sm border border-gray-100 text-[9px] font-black text-gray-700 uppercase">
                  {new Date(item.createdAt).toLocaleString()}
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-[7px] font-black text-gray-400 uppercase tracking-widest ml-1">Terminal Audit</span>
                <div className="bg-gray-50 p-2 rounded-sm border border-gray-100 text-[9px] font-black text-gray-700 uppercase">
                  {new Date(item.updatedAt).toLocaleString()}
                </div>
              </div>
              <div className="pt-2">
                <div className={`p-2 rounded-sm border flex items-center justify-center gap-2 ${
                  item.isActive ? 'bg-emerald-50 border-emerald-100 text-emerald-700' : 'bg-red-50 border-red-100 text-red-700'
                }`}>
                  <div className={`w-1 h-1 rounded-full ${item.isActive ? 'bg-emerald-500 animate-pulse' : 'bg-red-500'}`} />
                  <span className="text-[8px] font-black uppercase tracking-[0.2em]">{item.isActive ? 'ONLINE' : 'OFFLINE'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </td>
    </tr>
  );
};

export default AnnouncementDetails;
