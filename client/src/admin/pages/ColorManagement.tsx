import { useState, useEffect } from 'react';
import { Plus, Trash2, Palette, RefreshCw, Layers } from 'lucide-react';
import api from '../../api/axios';
import toast from 'react-hot-toast';

interface Color {
  id: string;
  name: string;
  hexCode: string;
}

import { useAdminStore } from '../../store/useAdminStore';

interface Color {
  id: string;
  name: string;
  hexCode: string;
}

const ColorManagement = () => {
  const { colors, fetchColors, refreshColors } = useAdminStore();
  const [loading, setLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newColor, setNewColor] = useState({ name: '', hexCode: '#000000' });

  const handleFetchColors = async () => {
    setLoading(true);
    try {
      await fetchColors();
    } catch (error) {
      toast.error('Failed to fetch colors');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleFetchColors();
  }, [fetchColors]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newColor.name || isSubmitting) return;

    setIsSubmitting(true);
    try {
      await api.post('/colors', newColor);
      toast.success('Color saved to repository');
      setNewColor({ name: '', hexCode: '#000000' });
      await refreshColors();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to save color');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure? This will only succeed if the color is not in use.')) return;
    try {
      await api.delete(`/colors/${id}`);
      toast.success('Color removed');
      await refreshColors();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to delete color');
    }
  };

  return (
    <div className="space-y-2 animate-in fade-in duration-500 max-w-[1600px]">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-gray-100 pb-4 gap-2">
        <div>
          <h1 className="text-lg font-bold text-gray-900 tracking-tight uppercase">Product Colors</h1>
          <p className="text-gray-500 text-xs mt-1 font-medium">Add and manage colors for your product variations.</p>
        </div>
        <button onClick={refreshColors} className="p-3 bg-white border border-gray-200 rounded-sm text-gray-500 hover:text-[#7A578D] hover:border-[#7A578D] hover:rotate-180 transition-all duration-500 shadow-sm flex items-center justify-center">
          <RefreshCw size={20} className={loading ? 'animate-spin' : ''} />
        </button>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-2 items-start">
        {/* Editor */}
        <section className="lg:col-span-4 bg-white p-2 rounded-sm border border-gray-100 shadow-sm space-y-2">
          <div className="flex items-center gap-2 border-b border-gray-100 pb-4">
            <div className="w-6 h-6 bg-[#7A578D]/5 rounded-sm flex items-center justify-center text-[#7A578D]">
              <Palette size={24} />
            </div>
            <div>
               <h2 className="text-xs font-bold text-gray-900 uppercase tracking-wider">New Color</h2>
               <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-0.5">Define a new tone</p>
            </div>
          </div>

          <form onSubmit={handleCreate} className="space-y-2">
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">Color Name</label>
              <input 
                required 
                value={newColor.name} 
                onChange={(e) => setNewColor({...newColor, name: e.target.value})}
                placeholder="e.g. Crimson Red"
                className="w-full bg-gray-50 border border-gray-200 rounded-sm py-1.5 px-2 outline-none focus:ring-2 focus:ring-[#7A578D]/20 focus:border-[#7A578D] text-xs font-medium transition-all" 
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">Hex Code</label>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full border border-gray-200 shadow-sm overflow-hidden ring-2 ring-white z-10">
                  <input 
                    type="color" 
                    value={newColor.hexCode} 
                    onChange={(e) => setNewColor({...newColor, hexCode: e.target.value})}
                    className="absolute inset-0 w-full h-full scale-150 cursor-pointer border-0 p-0" 
                  />
                </div>
                <input 
                  required 
                  value={newColor.hexCode} 
                  onChange={(e) => setNewColor({...newColor, hexCode: e.target.value})}
                  className="w-full bg-white border border-gray-200 rounded-sm py-1.5 pl-14 pr-4 outline-none focus:ring-2 focus:ring-[#7A578D]/20 focus:border-[#7A578D] text-xs font-mono uppercase font-bold tracking-wider transition-all shadow-sm" 
                  placeholder="#000000" 
                />
              </div>
            </div>
            <button 
              type="submit" 
              disabled={isSubmitting} 
              className="w-full bg-black text-white py-1 rounded-sm text-xs font-bold uppercase tracking-wider hover:bg-[#7A578D] transition-all shadow-md active:scale-95 disabled:opacity-50 mt-4"
            >
              {isSubmitting ? 'WORKING...' : 'REGISTER NEW COLOR'}
            </button>
          </form>
        </section>

        {/* Display */}
        <section className="lg:col-span-8 space-y-2">
          <div className="flex items-center gap-2 mb-4 ml-1">
             <Layers size={20} className="text-[#7A578D]" />
             <h3 className="text-xs font-bold text-gray-500 uppercase tracking-[0.2em] bg-gray-100 px-3 py-1 rounded-sm">Saved Palette ({colors.length})</h3>
          </div>
          
          {loading && colors.length === 0 ? (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="h-32 bg-gray-50 rounded-sm animate-pulse border border-gray-100" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
              {colors.map(color => (
                <div key={color.id} className="group bg-white p-2 rounded-sm border border-gray-100 hover:border-[#7A578D]/30 hover:shadow-md transition-all animate-in zoom-in-95 cursor-default relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                  <div className="w-full h-20 rounded-sm border border-gray-200 shadow-inner group-hover:scale-105 transition-transform duration-500 z-10 relative" style={{ backgroundColor: color.hexCode }} />
                  <div className="mt-4 flex flex-col gap-1 px-1 z-10 relative">
                    <div className="flex items-start justify-between gap-2">
                       <div className="min-w-0">
                         <p className="text-xs font-bold text-gray-900 uppercase tracking-wider truncate" title={color.name}>{color.name}</p>
                         <p className="text-xs font-mono font-bold text-gray-500 uppercase tracking-widest mt-0.5">{color.hexCode}</p>
                       </div>
                       <button 
                         onClick={() => handleDelete(color.id)} 
                         className="p-2 text-gray-300 hover:text-red-600 hover:bg-red-50 rounded-sm transition-all border border-transparent hover:border-red-100 shrink-0"
                         title="Delete Color"
                       >
                         <Trash2 size={16} />
                       </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
          {colors.length === 0 && !loading && (
            <div className="bg-white rounded-sm p-24 text-center border-2 border-dashed border-gray-200 shadow-sm flex flex-col items-center justify-center">
               <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                  <Palette size={40} className="text-gray-300" />
               </div>
               <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">No colors defined</p>
               <p className="text-xs text-gray-400 font-medium mt-2">Use the form to add your first color preset.</p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default ColorManagement;
