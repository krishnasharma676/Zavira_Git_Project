
import React from 'react';
import { Camera, X, Plus, ChevronDown, Monitor, Clock } from 'lucide-react';

interface TestimonialFormProps {
  formData: { name: string; role: string; content: string; rating: number; isActive: boolean };
  setFormData: (data: any) => void;
  handleSubmit: (e: React.FormEvent) => void;
  isSubmitting: boolean;
  imagePreview: string | null;
  handleImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  setImageFile: (file: File | null) => void;
  setImagePreview: (preview: string | null) => void;
}

const TestimonialForm: React.FC<TestimonialFormProps> = ({
  formData,
  setFormData,
  handleSubmit,
  isSubmitting,
  imagePreview,
  handleImageChange,
  setImageFile,
  setImagePreview,
}) => {
  return (
    <form onSubmit={handleSubmit} className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
      {/* Profile Photo Upload */}
      <div className="flex justify-center flex-col items-center gap-4 border-b border-gray-50 pb-6">
        <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Identify Core Asset</h3>
        <div className="relative group">
          <div className="w-28 h-28 rounded-sm bg-gray-50 border-2 border-dashed border-gray-200 flex items-center justify-center overflow-hidden transition-all group-hover:border-[#7A578D]/40 shadow-inner p-1">
            {imagePreview ? (
              <img src={imagePreview} alt="Preview" className="w-full h-full object-cover rounded-sm" />
            ) : (
              <div className="flex flex-col items-center gap-1.5">
                <Camera size={28} className="text-gray-300" />
                <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Select Archive</span>
              </div>
            )}
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="absolute inset-0 opacity-0 cursor-pointer z-10"
            />
          </div>
          <div className="absolute -bottom-2 -right-2 bg-white p-2 rounded-sm shadow-xl border border-gray-100 pointer-events-none group-hover:scale-110 transition-transform">
            <Plus size={14} className="text-[#7A578D]" />
          </div>
          {imagePreview && (
            <button
              type="button"
              onClick={() => { setImageFile(null); setImagePreview(null); }}
              className="absolute -top-3 -right-3 bg-red-500 text-white w-8 h-8 rounded-sm shadow-xl hover:scale-110 transition-all opacity-0 group-hover:opacity-100 flex items-center justify-center border-b-2 border-red-700/30 active:scale-90"
            >
              <X size={16} />
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Identify Subject</label>
          <input
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full bg-gray-50 border border-gray-200 rounded-sm py-2 px-3 outline-none focus:ring-2 focus:ring-[#7A578D]/20 focus:border-[#7A578D] text-xs font-black tracking-tighter uppercase"
            placeholder="e.g. MARCUS AURELIUS"
          />
        </div>
        <div className="space-y-2">
          <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Assigned Role</label>
          <input
            value={formData.role}
            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
            className="w-full bg-gray-50 border border-gray-200 rounded-sm py-2 px-3 outline-none focus:ring-2 focus:ring-[#7A578D]/20 focus:border-[#7A578D] text-xs font-black tracking-widest uppercase text-[#7A578D]"
            placeholder="e.g. PATRON_VERIFIED"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Star Validation</label>
          <div className="relative group">
             <select
               value={formData.rating}
               onChange={(e) => setFormData({ ...formData, rating: parseInt(e.target.value) })}
               className="w-full bg-gray-50 border border-gray-200 rounded-sm py-2.5 px-3 outline-none focus:ring-2 focus:ring-[#7A578D]/20 focus:border-[#7A578D] text-[10px] font-black uppercase tracking-[0.3em] appearance-none cursor-pointer transition-all shadow-sm group-hover:bg-gray-100/50"
             >
               {[5, 4, 3, 2, 1].map((num) => (
                 <option key={num} value={num}>
                   {num} STARS_PRISTINE
                 </option>
               ))}
             </select>
             <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-gray-400 group-hover:text-[#7A578D] transition-colors">
                <ChevronDown size={18} />
             </div>
          </div>
        </div>
        <div className="space-y-2">
          <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Visibility Framework</label>
          <div className="relative group">
             <select
               value={formData.isActive ? 'true' : 'false'}
               onChange={(e) => setFormData({ ...formData, isActive: e.target.value === 'true' })}
               className="w-full bg-gray-50 border border-gray-200 rounded-sm py-2.5 px-3 outline-none focus:ring-2 focus:ring-[#7A578D]/20 focus:border-[#7A578D] text-[10px] font-black uppercase tracking-[0.3em] appearance-none cursor-pointer transition-all shadow-sm group-hover:bg-gray-100/50"
             >
               <option value="true">MANIFEST_PUBLISHED</option>
               <option value="false">DRAFT_ENCRYPTED</option>
             </select>
             <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-gray-400 group-hover:text-[#7A578D] transition-colors">
                <ChevronDown size={18} />
             </div>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Narrative Content</label>
        <textarea
          required
          rows={4}
          value={formData.content}
          onChange={(e) => setFormData({ ...formData, content: e.target.value })}
          className="w-full bg-gray-50 border border-gray-200 rounded-sm py-3 px-4 outline-none focus:ring-2 focus:ring-[#7A578D]/20 focus:border-[#7A578D] text-xs font-semibold transition-all resize-none leading-relaxed italic placeholder:opacity-40"
          placeholder="Acquire customer perspective manifest..."
        />
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-black text-white h-12 mt-4 rounded-sm text-[11px] font-black uppercase tracking-[0.3em] hover:bg-[#7A578D] transition-all shadow-xl shadow-black/10 active:scale-95 border-b-2 border-black/20"
      >
        {isSubmitting ? (
          <span className="flex items-center justify-center gap-2">
            <div className="w-3 h-3 border-2 border-white/20 border-t-white rounded-full animate-spin" />
            SYNCHRONIZING_ARCHIVE...
          </span>
        ) : (
          'COMMIT_NARRATIVE_FRAG'
        )}
      </button>
    </form>
  );
};

export default TestimonialForm;
