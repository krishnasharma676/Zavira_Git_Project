
import { Palette, RefreshCw, Layers, Activity, ShieldCheck, Zap, Info, ChevronRight, Droplets, Grid } from 'lucide-react';

// Components
import ColorForm from '../components/color/ColorForm';
import ColorCard from '../components/color/ColorCard';

// Hooks
import { useColors } from '../hooks/useColors';

const ColorManagement = () => {
  const {
    colors,
    loading,
    isSubmitting,
    newColor,
    setNewColor,
    refreshColors,
    handleCreate,
    handleDelete,
  } = useColors();

  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-[1600px] pb-24">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-gray-100 pb-8 gap-4">
        <div>
           <h1 className="text-2xl font-black uppercase tracking-tighter text-gray-900 leading-none">Chromatic_Nexus_Hub</h1>
           <div className="flex items-center gap-3 mt-3">
              <div className="flex items-center gap-2 bg-[#7A578D]/5 px-2 py-1 rounded-sm border border-[#7A578D]/10 shadow-xl shadow-[#7A578D]/5">
                 <span className="w-1.5 h-1.5 rounded-full bg-[#7A578D] animate-pulse shadow-lg shadow-[#7A578D]/50"></span>
                 <span className="text-[10px] font-black uppercase tracking-widest text-[#7A578D] opacity-70 italic">Global Color Palette Protocol Active</span>
              </div>
              <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest">{colors.length} REGISTERED_CHROMA_Nexus</span>
           </div>
        </div>
        <button
          onClick={refreshColors}
          className="w-12 h-12 bg-white border border-gray-200 rounded-sm text-gray-300 hover:text-[#7A578D] hover:border-[#7A578D] hover:rotate-180 transition-all duration-700 shadow-sm flex items-center justify-center group"
          title="Synchronize Palette"
        >
          <RefreshCw size={24} className={loading ? 'animate-spin' : ''} />
        </button>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Editor */}
        <section className="lg:col-span-4 lg:sticky lg:top-8 animate-in slide-in-from-left-8 duration-700">
           <div className="bg-white border border-gray-100 rounded-sm shadow-xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-6 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity">
                 <Droplets size={160} />
              </div>
              <div className="p-8 relative z-10">
                 <header className="flex items-center gap-4 mb-10 border-b border-gray-50 pb-6">
                    <div className="p-3 bg-black rounded-sm text-white shadow-xl">
                       <Palette size={18} />
                    </div>
                    <div>
                       <h4 className="text-[11px] font-black uppercase tracking-[0.4em] text-gray-900">Chroma Commission</h4>
                       <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest italic mt-1 block">Registering NEW_TONAL_Nexus</span>
                    </div>
                 </header>
                 <ColorForm
                   newColor={newColor}
                   setNewColor={setNewColor}
                   handleCreate={handleCreate}
                   isSubmitting={isSubmitting}
                 />
              </div>
           </div>
        </section>

        {/* Display */}
        <section className="lg:col-span-8 space-y-8 animate-in slide-in-from-right-8 duration-700 delay-200">
          <div className="flex items-center justify-between bg-white px-8 py-6 rounded-sm border border-gray-100 shadow-xl group/ledger">
             <div className="flex items-center gap-4">
                <div className="p-3 bg-[#7A578D]/5 text-[#7A578D] rounded-sm shadow-inner group-hover/ledger:scale-110 transition-transform">
                   <Grid size={20} />
                </div>
                <div className="flex flex-col">
                  <h3 className="text-[12px] font-black text-gray-900 uppercase tracking-[0.4em]">
                    Active_Palette_Ledger
                  </h3>
                  <span className="text-[10px] font-black text-[#7A578D] uppercase tracking-widest mt-1 italic">
                    {colors.length} Tonal Fragments Synchronized
                  </span>
                </div>
             </div>
             <div className="flex items-center gap-1.5 bg-emerald-50 px-4 py-2 rounded-sm border border-emerald-100 text-emerald-700 shadow-xl shadow-emerald-500/5">
                <ShieldCheck size={14} className="animate-pulse" />
                <span className="text-[10px] font-black uppercase tracking-widest">MASTER_SYNC_VALID</span>
             </div>
          </div>

          {(loading && colors.length === 0) ? (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="h-48 bg-gray-50/50 rounded-sm animate-pulse border border-gray-100 shadow-inner" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
              {colors.map((color) => (
                <ColorCard key={color.id} color={color} handleDelete={handleDelete} />
              ))}
            </div>
          )}

          {colors.length === 0 && !loading && (
            <div className="bg-white rounded-sm py-40 text-center border-2 border-dashed border-gray-100 shadow-sm flex flex-col items-center justify-center animate-in zoom-in-95 duration-1000 group">
               <Palette size={64} className="text-gray-100 mb-8 animate-pulse group-hover:text-[#7A578D]/20 transition-colors" />
               <div className="space-y-4">
                  <h6 className="text-[13px] font-black uppercase tracking-[0.5em] text-gray-400">Registry_Nexus_VOID</h6>
                  <p className="text-[10px] font-black text-[#7A578D] uppercase tracking-widest italic max-w-[280px] mx-auto leading-relaxed">
                    No chromatic artifacts detected in global archive. Utilize the commission portal to register fragments.
                  </p>
               </div>
            </div>
          )}
        </section>
      </div>
      
      <footer className="pt-20 border-t border-gray-100 flex items-center justify-center gap-12 opacity-30">
         <div className="flex items-center gap-3">
            <ShieldCheck size={18} className="text-gray-400"/>
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-400">Palette integrity confirmed</span>
         </div>
         <div className="flex items-center gap-3">
            <Zap size={18} className="text-gray-400 animate-pulse"/>
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-400">Live Chroma sync active</span>
         </div>
         <div className="flex items-center gap-3">
            <Info size={18} className="text-gray-400"/>
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-400">Authoritative audit mapping 100% Correct</span>
         </div>
      </footer>
    </div>
  );
};

export default ColorManagement;
