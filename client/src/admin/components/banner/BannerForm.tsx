
import React from 'react';
import { Layout, Layers, RefreshCw, Upload, CheckCircle, Clock } from 'lucide-react';

interface BannerFormProps {
  formData: {
    type: string;
    link: string;
    isActive: boolean;
  };
  setFormData: (val: any) => void;
  categories: any[];
  previewUrl: string;
  handleImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  isSubmitting: boolean;
  editingBanner: any;
  onSubmit: (e: React.FormEvent) => void;
}

const BannerForm: React.FC<BannerFormProps> = ({
  formData,
  setFormData,
  categories,
  previewUrl,
  handleImageChange,
  isSubmitting,
  editingBanner,
  onSubmit,
}) => {
  return (
    <form onSubmit={onSubmit} className="space-y-6 animate-in fade-in duration-500">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Destination Mapping Hub */}
        <div className="space-y-3">
          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Destination Nexus Hub</label>
          <div className="space-y-3">
            <div className="relative">
                <select 
                   value={formData.link} 
                   onChange={(e) => setFormData({ ...formData, link: e.target.value })} 
                   className="w-full bg-gray-50 border border-gray-200 rounded-sm py-3 px-4 outline-none focus:ring-4 focus:ring-[#7A578D]/5 focus:border-[#7A578D]/40 text-xs font-black uppercase tracking-widest appearance-none cursor-pointer shadow-inner"
                >
                   <option value="">MANUAL_OVERRIDE_Nexus</option>
                   {categories?.map((cat) => (
                      <option key={cat.id} value={`/shop?category=${cat.slug}`}>
                         {cat.name.toUpperCase()} COLLECTIVE
                      </option>
                   ))}
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-300">
                   <Layers size={14}/>
                </div>
            </div>
            <input 
              value={formData.link} 
              onChange={(e) => setFormData({ ...formData, link: e.target.value })} 
              className="w-full bg-white border border-gray-100 rounded-sm py-3 px-4 outline-none focus:ring-4 focus:ring-[#7A578D]/5 focus:border-[#7A578D]/40 text-xs font-mono font-black text-[#7A578D] lowercase tracking-tighter shadow-sm" 
              placeholder="e.g. /shop?category=artifact_nexus" 
            />
          </div>
        </div>

        {/* Status Hub */}
        <div className="space-y-4">
          <div className="space-y-3">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Archive Presence State</label>
            <div className="relative">
                <select 
                   value={formData.isActive ? 'true' : 'false'} 
                   onChange={(e) => setFormData({ ...formData, isActive: e.target.value === 'true' })} 
                   className="w-full bg-gray-50 border border-gray-200 rounded-sm py-3 px-4 outline-none focus:ring-4 focus:ring-[#7A578D]/5 focus:border-[#7A578D]/40 text-xs font-black uppercase tracking-widest appearance-none cursor-pointer shadow-inner"
                >
                   <option value="true">Nexus_COMMISSIONED_ACTIVE</option>
                   <option value="false">Nexus_HELD_IN_DRAFT</option>
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-300">
                   <CheckCircle size={14}/>
                </div>
            </div>
          </div>
          <div className="space-y-3">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Structural Pivot</label>
            <div className={`p-4 rounded-sm border flex items-center gap-3 shadow-inner ${formData.isActive ? 'bg-emerald-50 border-emerald-100' : 'bg-gray-50 border-gray-100'}`}>
              <div className={`w-2 h-2 rounded-full ${formData.isActive ? 'bg-emerald-500 animate-pulse shadow-lg shadow-emerald-500/50' : 'bg-gray-300'}`} />
              <div className="flex flex-col">
                 <span className={`text-[10px] font-black uppercase tracking-[0.2em] ${formData.isActive ? 'text-emerald-700' : 'text-gray-400'}`}>{formData.type} SCREEN_Nexus_BAN</span>
                 <span className="text-[8px] font-black text-gray-300 uppercase tracking-[0.3em]">Master Promotional Protocol</span>
              </div>
            </div>
          </div>
        </div>

        {/* Visual Asset Artifact */}
        <div className="space-y-3">
          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Master Asset Archive</label>
          <label className="w-full h-[240px] bg-gray-50 border-2 border-dashed border-gray-200 rounded-sm flex flex-col items-center justify-center cursor-pointer hover:bg-white hover:border-[#7A578D] transition-all group relative overflow-hidden shadow-inner">
            <input type="file" className="hidden" onChange={handleImageChange} accept="image/*" />
            {previewUrl ? (
              <img src={previewUrl} className="w-full h-full object-cover animate-in fade-in zoom-in-95 duration-700" alt="Banner preview" />
            ) : (
              <div className="flex flex-col items-center gap-4 group-hover:scale-105 transition-transform duration-500">
                <div className="p-4 bg-white rounded-full shadow-xl group-hover:bg-[#7A578D] group-hover:text-white transition-all">
                   <Layout size={32} className="text-gray-400 group-hover:text-white" />
                </div>
                <div className="text-center space-y-1">
                   <span className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 block group-hover:text-[#7A578D]">Archive_Subject</span>
                   <span className="text-[8px] font-bold uppercase text-gray-300">Click to commission visual artifact</span>
                </div>
              </div>
            )}
            {previewUrl && (
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
                <span className="text-[10px] font-black text-white uppercase tracking-[0.4em] px-6 py-2.5 bg-white/10 rounded-full border border-white/20 shadow-2xl hover:bg-white hover:text-black transition-all">COMMISSION_NEW_ASSET</span>
              </div>
            )}
          </label>
        </div>

        {/* Authoritative Live Preview */}
        <div className="space-y-3">
          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Live Immersive ARCHIVE_Nexus</label>
          <div className="w-full h-[240px] bg-gray-900 rounded-sm border border-black overflow-hidden shadow-2xl flex items-center justify-center relative group">
            {previewUrl ? (
              <img src={previewUrl} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-700 select-none pointer-events-none" alt="Live preview" />
            ) : (
              <div className="flex flex-col items-center opacity-10">
                <Layers size={64} className="text-white" />
                <span className="text-[10px] font-black text-white uppercase tracking-widest mt-4">NO_ACTIVE_STREAM</span>
              </div>
            )}
            
            <div className="absolute top-4 right-4 bg-emerald-500 text-white px-4 py-1.5 rounded-sm text-[9px] font-black uppercase tracking-[0.3em] flex items-center gap-2 shadow-2xl shadow-emerald-500/40 border border-emerald-400/50">
              <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse shadow-inner" />
              Nexus_LIVE
            </div>

            <div className="absolute bottom-4 left-4 p-4 transform translate-y-full group-hover:translate-y-0 transition-transform duration-500 bg-black/40 backdrop-blur-xl border border-white/10 rounded-sm max-w-[80%]">
               <span className="text-[10px] font-black text-white/50 uppercase tracking-widest">Active Mapping Hub</span>
               <p className="text-[9px] font-black text-[#7A578D] lowercase tracking-tighter truncate mt-1">{formData.link || 'AWAITING_Nexus_MAPPING'}</p>
            </div>
          </div>
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
            <span>SYNCHRONIZING_ASSET_Nexus...</span>
          </>
        ) : (
          <>
            <Layout size={24} className="group-hover:translate-y-[-2px] transition-transform" />
            <span>{editingBanner ? 'COMMIT_ARTIFACT_Nexus_UPDATES' : 'COMMISSION_Nexus_ARTIFACT'}</span>
          </>
        )}
      </button>
      <div className="flex justify-center gap-8 opacity-30 mt-4">
         <div className="flex items-center gap-2">
            <Clock size={12} className="text-gray-400"/>
            <span className="text-[8px] font-black uppercase tracking-widest text-gray-400 whitespace-nowrap">Archival Temporal Sync Active</span>
         </div>
      </div>
    </form>
  );
};

export default BannerForm;
