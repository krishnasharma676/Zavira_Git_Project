
import { RefreshCw, Images, Plus, ShieldCheck, Zap, Info, ChevronRight, Layout, Activity, Droplets } from 'lucide-react';

// Hooks
import { useBulkProduct } from '../hooks/useBulkProduct';

// Sub-components
import ProductBasicInfoForm from '../components/bulk-product/ProductBasicInfoForm';
import ProductLogisticsForm from '../components/bulk-product/ProductLogisticsForm';
import VariantManagementSection from '../components/bulk-product/VariantManagementSection';

const BulkProductCreate = () => {
  const {
    id,
    formData,
    setFormData,
    variants,
    setVariants,
    loading,
    isSubmitting,
    categories,
    generateSKU,
    handleAddVariant,
    handleRemoveVariant,
    handleAddSize,
    handleRemoveSize,
    handleImageChange,
    handleRemoveImage,
    handleDeleteImage,
    handleSubmit,
  } = useBulkProduct();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center animate-pulse bg-gray-50/10">
        <div className="w-12 h-12 border-4 border-[#7A578D] border-t-transparent rounded-full animate-spin shadow-2xl shadow-[#7A578D]/20" />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-[1600px] pb-24">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-gray-100 pb-8 gap-4">
        <div>
           <h1 className="text-2xl font-black uppercase tracking-tighter text-gray-900 leading-none">
             {id ? 'Artifact_Modification_Nexus' : 'Bulk_Product_Commissioning'}
           </h1>
           <div className="flex items-center gap-3 mt-4">
              <div className="flex items-center gap-2 bg-[#7A578D]/5 px-2 py-1 rounded-sm border border-[#7A578D]/10 shadow-xl shadow-[#7A578D]/5">
                 <span className="w-1.5 h-1.5 rounded-full bg-[#7A578D] animate-pulse shadow-lg shadow-[#7A578D]/50"></span>
                 <span className="text-[10px] font-black uppercase tracking-widest text-[#7A578D] opacity-70 italic">
                    {id ? `IDENTITY_NEXUS: ${id?.toUpperCase()}` : 'Complex Variation Protocol Active'}
                 </span>
              </div>
              <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest">
                {id ? 'Refining Archetypal Lattice' : 'Multi-Variant Orchestration Hub'}
              </span>
           </div>
        </div>
        
        <div className="flex items-center gap-4">
           {id && (
             <div className="bg-emerald-50 px-4 py-2.5 rounded-sm border border-emerald-100 flex items-center gap-3 shadow-xl shadow-emerald-500/5">
                <ShieldCheck size={16} className="text-emerald-500 animate-pulse" />
                <span className="text-[10px] font-black text-emerald-700 uppercase tracking-widest">VALID_ARCHIVE_MATCH</span>
             </div>
           )}
        </div>
      </header>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-10">
        <div className="space-y-12">
          {/* Section: Basic Identity */}
          <section className="animate-in slide-in-from-bottom-8 duration-700">
             <ProductBasicInfoForm
               formData={formData}
               setFormData={setFormData}
               categories={categories}
             />
          </section>

          {/* Section: Logistics Mapping */}
          <section className="animate-in slide-in-from-bottom-8 duration-700 delay-150">
             <ProductLogisticsForm formData={formData} setFormData={setFormData} />
          </section>

          {/* Section: Variant Orchestration */}
          <section className="animate-in slide-in-from-bottom-8 duration-700 delay-300">
             <VariantManagementSection
               variants={variants}
               setVariants={setVariants}
               productName={formData.name}
               generateSKU={generateSKU}
               onAddVariant={handleAddVariant}
               onRemoveVariant={handleRemoveVariant}
               onImageChange={handleImageChange}
               onRemoveImage={handleRemoveImage}
               onDeleteLiveImage={handleDeleteImage}
               onAddSize={handleAddSize}
               onRemoveSize={handleRemoveSize}
             />
          </section>
        </div>

        {/* Executive Action Portal */}
        <div className="pt-20 border-t border-gray-100 flex flex-col items-center gap-8 group/footer">
          <div className="flex items-center gap-4 text-gray-300 opacity-20 group-hover/footer:opacity-40 transition-opacity">
             <Droplets size={24} />
             <div className="w-40 h-[1px] bg-gray-200" />
             <Activity size={24} />
             <div className="w-40 h-[1px] bg-gray-200" />
             <Layout size={24} />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full max-w-[600px] h-20 bg-black text-white text-[11px] font-black uppercase tracking-[0.5em] rounded-sm transition-all hover:bg-[#7A578D] shadow-2xl shadow-black/20 active:scale-95 border-b-8 border-black/30 disabled:opacity-50 disabled:pointer-events-none group relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-white/5 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
            <div className="relative z-10 flex items-center justify-center gap-6">
              {isSubmitting ? (
                <RefreshCw className="animate-spin" size={24} />
              ) : (
                <Plus className="group-hover:rotate-180 transition-transform duration-700" size={28} />
              )}
              <span className="group-hover:tracking-[0.8em] transition-all duration-700">
                {isSubmitting
                  ? 'SYNCING_ARTIFACT...'
                  : id
                  ? 'COMMIT_MODIFICATION'
                  : 'EXECUTE_BULK_COMMISSION'}
              </span>
            </div>
          </button>
          
          <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest italic animate-pulse">
            Critical Action: Structural integrity validation Required before submission
          </p>
        </div>
      </form>
      
      <footer className="pt-20 border-t border-gray-100 flex items-center justify-center gap-12 opacity-30">
         <div className="flex items-center gap-3">
            <ShieldCheck size={18} className="text-gray-400"/>
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-400">Artifact integrity confirmed</span>
         </div>
         <div className="flex items-center gap-3">
            <Zap size={18} className="text-gray-400 animate-pulse"/>
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-400">Live Commissioning active</span>
         </div>
         <div className="flex items-center gap-3">
            <Info size={18} className="text-gray-400"/>
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-400">Structural audit mapping 100% Correct</span>
         </div>
      </footer>
    </div>
  );
};

export default BulkProductCreate;
