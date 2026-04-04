
import React from 'react';
import { Upload, Layers, CheckCircle, RefreshCw, ExternalLink, Activity, Info } from 'lucide-react';

interface CategoryFormProps {
  name: string;
  setName: (val: string) => void;
  isActive: boolean;
  setIsActive: (val: boolean) => void;
  imageUrl: string;
  setImageUrl: (val: string) => void;
  previewUrl: string;
  setPreviewUrl: (val: string) => void;
  handleImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: (e: React.FormEvent) => void;
  isSubmitting: boolean;
  editingCategory: any;
}

const CategoryForm: React.FC<CategoryFormProps> = ({
  name,
  setName,
  isActive,
  setIsActive,
  imageUrl,
  setImageUrl,
  previewUrl,
  setPreviewUrl,
  handleImageChange,
  handleSubmit,
  isSubmitting,
  editingCategory,
}) => {
  return (
    <form onSubmit={handleSubmit} className="space-y-6 animate-in fade-in duration-500">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Core Collection Identity */}
        <div className="space-y-3">
          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">
            Collection Identity Descriptor
          </label>
          <div className="relative group">
             <input
               required
               value={name}
               onChange={(e) => setName(e.target.value)}
               className="w-full bg-gray-50/50 border border-gray-200 rounded-sm py-3 px-12 outline-none focus:ring-4 focus:ring-[#7A578D]/5 focus:border-[#7A578D]/40 text-xs font-black uppercase tracking-widest shadow-inner transition-all placeholder:italic group-hover:border-gray-300"
               placeholder="Structure the collection name..."
             />
             <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#7A578D]">
                <Layers size={18} />
             </div>
          </div>
        </div>

        {/* Presence State Hub */}
        <div className="space-y-3">
          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">
            Visibility Protocol State
          </label>
          <div className="relative group">
             <select
               value={String(isActive)}
               onChange={(e) => setIsActive(e.target.value === 'true')}
               className="w-full bg-gray-50/50 border border-gray-200 rounded-sm py-3 px-10 outline-none focus:ring-4 focus:ring-[#7A578D]/5 focus:border-[#7A578D]/40 text-xs font-black uppercase tracking-widest appearance-none cursor-pointer shadow-inner transition-all text-[#7A578D] group-hover:border-gray-300"
             >
               <option value="true">ACTIVE_CATALOG_Nexus</option>
               <option value="false">HIDDEN_Nexus_Nexus</option>
             </select>
             <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-300">
                <CheckCircle size={14}/>
             </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          {/* External Asset Link hub */}
          <div className="space-y-3">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 flex items-center gap-2">
               <ExternalLink size={12} /> External Asset Archive
            </label>
            <input
              value={imageUrl}
              onChange={(e) => {
                setImageUrl(e.target.value);
                setPreviewUrl(e.target.value);
              }}
              className="w-full bg-gray-50/50 border border-gray-200 rounded-sm py-3.5 px-4 outline-none focus:ring-4 focus:ring-[#7A578D]/5 focus:border-[#7A578D]/40 text-xs font-mono font-black text-[#7A578D] lowercase tracking-tighter shadow-inner transition-all placeholder:italic"
              placeholder="https://nexus.artifact/asset.jpg"
            />
          </div>

          {/* Local Asset Hub */}
          <div className="space-y-3">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">
              Command_Nexus_UPLOAD
            </label>
            <label className="w-full h-[160px] bg-gray-50/20 border-2 border-dashed border-gray-200 rounded-sm flex flex-col items-center justify-center cursor-pointer hover:bg-white hover:border-[#7A578D] transition-all group relative overflow-hidden shadow-inner">
              <input type="file" className="hidden" onChange={handleImageChange} accept="image/*" />
              <div className="flex flex-col items-center gap-4 group-hover:scale-105 transition-transform duration-500">
                <div className="p-4 bg-white rounded-full shadow-2xl border border-gray-100 text-gray-300 group-hover:bg-black group-hover:text-white transition-all">
                  <Upload size={32} />
                </div>
                <div className="text-center">
                   <span className="text-[10px] font-black uppercase text-gray-400 tracking-[0.4em] group-hover:text-gray-900">
                     Inject_Local_Artifact
                   </span>
                </div>
              </div>
              <div className="absolute inset-0 bg-[#7A578D]/5 opacity-0 group-hover:opacity-100 transition-opacity" />
            </label>
          </div>
        </div>

        {/* Immersive Visual Manifestant */}
        <div className="space-y-3">
          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">
            Immersive Collection Preview
          </label>
          <div className="w-full h-[300px] bg-gray-900 rounded-sm border border-black overflow-hidden shadow-2xl flex items-center justify-center relative group overflow-hidden">
            {previewUrl ? (
              <>
                <img src={previewUrl} className="w-full h-full object-cover transition-all duration-1000 group-hover:scale-110 opacity-70 group-hover:opacity-100 grayscale-[50%] group-hover:grayscale-0" alt="Collection manifestant" />
                <div className="absolute inset-x-0 bottom-0 p-8 bg-gradient-to-t from-black via-black/40 to-transparent flex flex-col translate-y-4 group-hover:translate-y-0 transition-transform duration-7 automation">
                   <span className="text-[9px] font-black text-[#7A578D] uppercase tracking-[0.4em] mb-2 px-3 py-1 bg-white/5 backdrop-blur-md rounded-sm border border-white/10 w-fit">ACTIVE_MANIFESTANT</span>
                   <h5 className="text-2xl font-black text-white uppercase tracking-tighter truncate leading-none">{name || 'Nexus_NULL'}</h5>
                </div>
                
                <div className="absolute top-4 right-4 bg-emerald-500 text-white px-4 py-1.5 rounded-sm text-[9px] font-black uppercase tracking-[0.3em] flex items-center gap-2 shadow-2xl shadow-emerald-500/40 border border-emerald-400/50">
                  <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                  Nexus_LIVE
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center opacity-5">
                <Layers size={100} className="text-white" />
                <span className="text-xl font-black text-white uppercase mt-4 tracking-[0.5em]">AWAITING_Nexus</span>
              </div>
            )}
            
            {/* Operational Metrics Overlay */}
            <div className="absolute left-4 top-4 flex flex-col gap-2 scale-75 origin-top-left opacity-30 group-hover:opacity-100 transition-opacity">
               <div className="flex items-center gap-3 bg-black/40 backdrop-blur-md px-3 py-1.5 border border-white/10 rounded-sm">
                  <Activity size={12} className="text-[#7A578D]"/>
                  <span className="text-[10px] font-black text-white uppercase tracking-widest leading-none">Archival Sync 100%</span>
               </div>
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
            <span>SYNCHRONIZING_COLLECTION_Nexus...</span>
          </>
        ) : (
          <>
            <Layers size={24} className="group-hover:translate-y-[-2px] transition-transform" />
            <span>{editingCategory ? 'COMMIT_ARTIFACT_Nexus_UPDATES' : 'COMMISSION_Nexus_ARTIFACT'}</span>
          </>
        )}
      </button>
      
      <div className="flex justify-center gap-8 opacity-30 mt-4">
         <div className="flex items-center gap-2">
            <Info size={12} className="text-gray-400"/>
            <span className="text-[8px] font-black uppercase tracking-widest text-gray-400 whitespace-nowrap">Taxonomy Registry Sync Active</span>
         </div>
      </div>
    </form>
  );
};

export default CategoryForm;
