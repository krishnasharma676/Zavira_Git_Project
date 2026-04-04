
import React from 'react';
import { Palette } from 'lucide-react';

interface ColorFormProps {
  newColor: { name: string; hexCode: string };
  setNewColor: (color: { name: string; hexCode: string }) => void;
  handleCreate: (e: React.FormEvent) => void;
  isSubmitting: boolean;
}

const ColorForm: React.FC<ColorFormProps> = ({
  newColor,
  setNewColor,
  handleCreate,
  isSubmitting,
}) => {
  return (
    <section className="bg-white p-6 rounded-sm border border-gray-100 shadow-sm space-y-6">
      <div className="flex items-center gap-3 border-b border-gray-50 pb-4">
        <div className="w-10 h-10 bg-[#7A578D]/5 rounded-sm flex items-center justify-center text-[#7A578D] shadow-inner">
          <Palette size={24} />
        </div>
        <div>
          <h2 className="text-[11px] font-black text-gray-900 uppercase tracking-widest">Chromatic Registry</h2>
          <p className="text-[10px] text-gray-400 font-black uppercase tracking-[0.2em] mt-1 opacity-60">Define color identity</p>
        </div>
      </div>

      <form onSubmit={handleCreate} className="space-y-6">
        <div className="space-y-2">
          <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Color Identity</label>
          <input
            required
            value={newColor.name}
            onChange={(e) => setNewColor({ ...newColor, name: e.target.value })}
            placeholder="e.g. Imperial Crimson"
            className="w-full bg-gray-50 border border-gray-200 rounded-sm py-2 px-3 outline-none focus:ring-2 focus:ring-[#7A578D]/20 focus:border-[#7A578D] text-xs font-bold uppercase transition-all tracking-wider"
          />
        </div>
        <div className="space-y-2">
          <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Hexadecimal Protocol</label>
          <div className="relative group">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full border-2 border-white shadow-xl overflow-hidden ring-1 ring-black/5 z-10 scale-90 group-hover:scale-105 transition-transform">
              <input
                type="color"
                value={newColor.hexCode}
                onChange={(e) => setNewColor({ ...newColor, hexCode: e.target.value })}
                className="absolute inset-0 w-[200%] h-[200%] -top-1/2 -left-1/2 cursor-pointer border-0 p-0"
              />
            </div>
            <input
              required
              value={newColor.hexCode}
              onChange={(e) => setNewColor({ ...newColor, hexCode: e.target.value })}
              className="w-full bg-white border border-gray-200 rounded-sm py-2.5 pl-14 pr-4 outline-none focus:ring-2 focus:ring-[#7A578D]/20 focus:border-[#7A578D] text-xs font-mono uppercase font-black tracking-widest transition-all shadow-sm text-[#7A578D]"
              placeholder="#000000"
            />
          </div>
        </div>
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-black text-white h-11 rounded-sm text-[11px] font-black uppercase tracking-[0.2em] hover:bg-[#7A578D] transition-all shadow-xl shadow-black/10 active:scale-95 disabled:opacity-50 mt-4 border-b-2 border-black/20"
        >
          {isSubmitting ? (
            <span className="flex items-center justify-center gap-2">
              <div className="w-3 h-3 border-2 border-white/20 border-t-white rounded-full animate-spin" />
              Registering Tone...
            </span>
          ) : (
            'Commit New Tone'
          )}
        </button>
      </form>
    </section>
  );
};

export default ColorForm;
