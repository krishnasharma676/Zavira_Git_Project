
import React from 'react';
import { Megaphone, CheckCircle, RefreshCw, Layers, ExternalLink, Activity } from 'lucide-react';

interface AnnouncementFormProps {
  formData: {
    title: string;
    subtitle: string;
    type: string;
    link: string;
    isActive: boolean;
  };
  setFormData: (data: any) => void;
  onSubmit: (e: React.FormEvent) => void;
  isSubmitting: boolean;
  editingItem: any;
}

const AnnouncementForm: React.FC<AnnouncementFormProps> = ({
  formData,
  setFormData,
  onSubmit,
  isSubmitting,
  editingItem,
}) => {
  return (
    <form onSubmit={onSubmit} className="space-y-6 animate-in fade-in duration-500">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Core Broadcast Payload */}
        <div className="md:col-span-2 space-y-3">
          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Broadcast Directive Title</label>
          <input
            required
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="w-full bg-gray-50 border border-gray-200 rounded-sm py-3 px-4 outline-none focus:ring-4 focus:ring-[#7A578D]/5 focus:border-[#7A578D]/40 text-xs font-black uppercase tracking-widest shadow-inner placeholder:italic transition-all"
            placeholder="Structure the primary broadcast directive..."
          />
        </div>

        <div className="space-y-3">
          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Secondary Directive Info</label>
          <input
            value={formData.subtitle}
            onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
            className="w-full bg-gray-50 border border-gray-200 rounded-sm py-3 px-4 outline-none focus:ring-4 focus:ring-[#7A578D]/5 focus:border-[#7A578D]/40 text-xs font-black uppercase tracking-tighter shadow-inner placeholder:italic transition-all"
            placeholder="Auxiliary broadcast data..."
          />
        </div>

        <div className="space-y-3">
          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Categorical Strategy</label>
          <div className="relative">
             <select
               value={formData.type}
               onChange={(e) => setFormData({ ...formData, type: e.target.value })}
               className="w-full bg-gray-50 border border-gray-200 rounded-sm py-3 px-4 outline-none focus:ring-4 focus:ring-[#7A578D]/5 focus:border-[#7A578D]/40 text-xs font-black uppercase tracking-widest appearance-none cursor-pointer shadow-inner transition-all"
             >
               <option value="ANNOUNCEMENT">GLOBAL_BROADCAST_Nexus</option>
               <option value="BADGE">Nexus_TAG_ARTIFACT</option>
             </select>
             <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-300">
                <Layers size={14}/>
             </div>
          </div>
        </div>

        {/* Action Strategy */}
        <div className="md:col-span-2 space-y-3">
          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Action Destination Hub</label>
          <div className="relative">
             <input
               value={formData.link}
               onChange={(e) => setFormData({ ...formData, link: e.target.value })}
               className="w-full bg-gray-50 border border-gray-200 rounded-sm py-3 px-4 pl-12 outline-none focus:ring-4 focus:ring-[#7A578D]/5 focus:border-[#7A578D]/40 text-xs font-mono font-black text-[#7A578D] lowercase tracking-tighter shadow-inner transition-all"
               placeholder="e.g. /shop?category=artifact_nexus"
             />
             <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-300">
                <ExternalLink size={14}/>
             </div>
          </div>
        </div>

        {/* Presence State */}
        <div className="md:col-span-2">
           <label className="flex items-center gap-4 cursor-pointer bg-emerald-50 border border-emerald-100 p-4 rounded-sm hover:bg-emerald-100 transition-all group shadow-sm active:scale-[0.98]">
              <div className="relative">
                  <input 
                     type="checkbox" 
                     id="isActive"
                     checked={formData.isActive}
                     onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                     className="peer hidden" 
                  />
                  <div className="w-10 h-6 bg-gray-200 rounded-full peer-checked:bg-emerald-500 transition-all shadow-inner"></div>
                  <div className="absolute top-1 left-1 w-4 h-4 bg-white rounded-full peer-checked:translate-x-4 transition-all shadow-md"></div>
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-black text-emerald-900 uppercase tracking-widest">Commission Broadcast Live</span>
                <span className="text-[10px] font-bold text-emerald-700/70 uppercase">Elevate alert prominence in the platform registry.</span>
              </div>
              <div className="ml-auto">
                 <CheckCircle size={20} className={`transition-all ${formData.isActive ? 'text-emerald-500 scale-110' : 'text-gray-200'}`} />
              </div>
           </label>
        </div>
      </div>

      {/* Authoritative Live Immersion */}
      <div className="bg-gray-900 border border-black p-6 rounded-sm shadow-2xl relative overflow-hidden group">
         <div className="absolute top-0 right-0 p-4 pointer-events-none opacity-5 rotate-12 group-hover:rotate-0 transition-transform duration-700">
            <Megaphone size={120} className="text-white"/>
         </div>
         <div className="flex items-center gap-4 border-b border-white/5 pb-4 mb-4">
            <div className={`p-2 rounded-sm ${formData.isActive ? 'bg-emerald-500 shadow-lg shadow-emerald-500/30 animate-pulse' : 'bg-gray-700'} text-white`}>
               <Activity size={18} />
            </div>
            <div className="flex flex-col">
               <span className="text-[10px] font-black text-white uppercase tracking-widest">IMMERSIVE_LIVE_Nexus</span>
               <span className="text-[8px] font-bold text-gray-500 uppercase tracking-[0.2em]">{formData.type} Nexus_BROADCAST</span>
            </div>
         </div>
         <div className="space-y-2 relative z-10">
            <h5 className="text-[14px] font-black text-white uppercase tracking-tighter leading-none">{formData.title || 'AWAITING_Nexus_PAYLOAD...'}</h5>
            <p className="text-[10px] font-black text-[#7A578D] uppercase tracking-widest">{formData.subtitle || 'NO_SECONDARY_DATA_Nexus'}</p>
         </div>
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full h-14 bg-black text-white rounded-sm text-[11px] font-black uppercase tracking-[0.4em] hover:bg-[#7A578D] transition-all shadow-2xl shadow-black/20 flex items-center justify-center gap-4 disabled:opacity-50 mt-4 active:scale-95 border-b-4 border-black/30 group"
      >
        {isSubmitting ? (
          <>
            <RefreshCw size={24} className="animate-spin" />
            <span>COMMISSIONING_Nexus_BROADCAST...</span>
          </>
        ) : (
          <>
            <Megaphone size={24} className="group-hover:translate-y-[-2px] transition-transform" />
            <span>{editingItem ? 'COMMIT_ARTIFACT_Nexus_UPDATES' : 'COMMISSION_Nexus_ARTIFACT'}</span>
          </>
        )}
      </button>
    </form>
  );
};

export default AnnouncementForm;
