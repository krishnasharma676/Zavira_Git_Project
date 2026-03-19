import { useState, useEffect } from 'react';
import { Plus, Trash2, Palette, RefreshCw } from 'lucide-react';
import api from '../../api/axios';
import toast from 'react-hot-toast';

interface Color {
  id: string;
  name: string;
  hexCode: string;
}

const ColorManagement = () => {
  const [colors, setColors] = useState<Color[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newColor, setNewColor] = useState({ name: '', hexCode: '#000000' });

  const fetchColors = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/colors');
      setColors(data.data);
    } catch (error) {
      toast.error('Failed to fetch colors');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchColors();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newColor.name || isSubmitting) return;

    setIsSubmitting(true);
    try {
      await api.post('/colors', newColor);
      toast.success('Color saved to repository');
      setNewColor({ name: '', hexCode: '#000000' });
      fetchColors();
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
      fetchColors();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to delete color');
    }
  };

  return (
    <div className="space-y-4 max-w-4xl mx-auto py-4 px-4 font-sans uppercase">
      <header className="flex justify-between items-end border-b border-gray-100 pb-2">
        <div>
          <h1 className="text-xl font-black tracking-tight text-gray-900 leading-none">Color Repository</h1>
          <p className="text-gray-400 text-[8px] font-bold tracking-widest mt-1 flex items-center gap-2">
            <Palette size={12} className="text-[#7A578D]" /> Centralized Color & Hex Palette Management
          </p>
        </div>
        <button onClick={fetchColors} className="text-xs font-black text-[#7A578D] hover:bg-[#7A578D]/5 p-1.5 rounded-lg transition-all">
          <RefreshCw size={13} className={loading ? 'animate-spin' : ''} />
        </button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Creation Form */}
        <section className="md:col-span-1 bg-white p-4 rounded-xl border border-gray-100 shadow-sm h-fit space-y-3">
          <h2 className="text-[10px] font-black text-gray-800 tracking-widest border-b border-gray-50 pb-1.5">Add New Spectrum</h2>
          <form onSubmit={handleCreate} className="space-y-3">
            <div className="space-y-1">
              <label className="text-[8px] font-black tracking-widest text-gray-400 ml-1">Color Designation</label>
              <input 
                required 
                value={newColor.name} 
                placeholder="e.g. Royal Blue"
                onChange={(e) => setNewColor({...newColor, name: e.target.value})} 
                className="w-full bg-gray-50 border border-gray-100 rounded-lg py-1.5 px-3 outline-none focus:border-[#7A578D] text-[10px] font-black uppercase" 
              />
            </div>
            <div className="space-y-1">
              <label className="text-[8px] font-black tracking-widest text-gray-400 ml-1">Hexadecimal Identity</label>
              <div className="flex items-center gap-2 bg-gray-50 border border-gray-100 rounded-lg px-2 py-1">
                <input 
                  type="color" 
                  value={newColor.hexCode} 
                  onChange={(e) => setNewColor({...newColor, hexCode: e.target.value})} 
                  className="w-7 h-7 rounded cursor-pointer shrink-0 border-0 bg-transparent" 
                />
                <input 
                  type="text"
                  value={newColor.hexCode}
                  onChange={(e) => setNewColor({...newColor, hexCode: e.target.value})}
                  className="bg-transparent text-[10px] font-mono font-black outline-none w-full uppercase"
                />
              </div>
            </div>
            <div className="pt-1">
              <button 
                type="submit" 
                disabled={isSubmitting}
                className="w-full bg-[#7A578D] text-white py-2 rounded-lg text-[9px] font-black tracking-widest hover:bg-black transition-all shadow-lg shadow-purple-500/10 flex items-center justify-center gap-2"
              >
                <Plus size={12} /> Register Color
              </button>
            </div>
          </form>
        </section>

        {/* Color Grid */}
        <section className="md:col-span-2 space-y-3">
          <h2 className="text-[10px] font-black text-gray-400 tracking-widest">Saved Spectrums ({colors.length})</h2>
          {loading && colors.length === 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {[1,2,3,4,5,6].map(i => <div key={i} className="h-20 bg-gray-50 animate-pulse rounded-xl" />)}
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {colors.map((color) => (
                <div key={color.id} className="group bg-white p-2 rounded-xl border border-gray-100 shadow-sm hover:border-[#7A578D]/30 transition-all space-y-2 relative">
                  <div className="aspect-[2.5/1] rounded-lg shadow-inner border border-gray-50" style={{ backgroundColor: color.hexCode }} />
                  <div className="flex justify-between items-start pt-0.5 px-0.5">
                    <div className="min-w-0">
                      <p className="text-[8px] font-black text-gray-900 truncate pr-2 leading-tight">{color.name}</p>
                      <p className="text-[7px] font-mono font-bold text-gray-400 leading-none">{color.hexCode}</p>
                    </div>
                    <button 
                      onClick={() => handleDelete(color.id)}
                      className="text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all shrink-0"
                    >
                      <Trash2 size={11} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
          {colors.length === 0 && !loading && (
            <div className="bg-gray-50 rounded-xl p-10 text-center border border-dashed border-gray-200">
              <p className="text-[9px] font-black text-gray-400 tracking-widest">No colors registered in the repository.</p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default ColorManagement;
