
import React from 'react';
import { Trash2 } from 'lucide-react';

interface ColorCardProps {
  color: any;
  handleDelete: (id: string) => void;
}

const ColorCard: React.FC<ColorCardProps> = ({ color, handleDelete }) => {
  return (
    <div className="group bg-white p-3 rounded-sm border border-gray-100 hover:border-[#7A578D]/30 hover:shadow-xl transition-all animate-in zoom-in-95 cursor-default relative overflow-hidden shadow-sm">
      <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
      <div
        className="w-full h-24 rounded-sm border border-gray-100 shadow-inner group-hover:scale-105 transition-transform duration-700 z-10 relative ring-1 ring-black/5"
        style={{ backgroundColor: color.hexCode }}
      >
        <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity" />
      </div>
      <div className="mt-4 flex flex-col gap-2 px-1 z-10 relative">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-[10px] font-black text-gray-900 uppercase tracking-widest truncate max-w-[120px]" title={color.name}>
              {color.name}
            </p>
            <p className="text-[9px] font-mono font-black text-gray-400 uppercase tracking-widest mt-1 bg-gray-50 px-2 py-1 rounded-sm border border-gray-100 shadow-inner">
              {color.hexCode}
            </p>
          </div>
          <button
            onClick={() => handleDelete(color.id)}
            className="p-2.5 text-gray-300 hover:text-red-500 hover:bg-red-50/50 rounded-sm transition-all border border-transparent hover:border-red-100 shrink-0 shadow-sm active:scale-90"
            title="Purge Color"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>
      <div className="absolute bottom-0 right-0 w-8 h-8 bg-[#7A578D]/5 rotate-45 translate-x-4 translate-y-4 opacity-0 group-hover:opacity-100 transition-opacity" />
    </div>
  );
};

export default ColorCard;
