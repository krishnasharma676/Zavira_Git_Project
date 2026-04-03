import { useState } from 'react';
import { Database, Loader2, CheckCircle2, AlertTriangle } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../api/axios';

const DemoData = () => {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSeedData = async () => {
    if (!window.confirm("Are you sure you want to generate 15 categories and 225 total products? This might take a few seconds.")) {
      return;
    }
    
    setLoading(true);
    setSuccess(false);
    
    try {
      const { data } = await api.post('/seed');
      if (data.success) {
        setSuccess(true);
        toast.success(data.message || 'Demo data generated successfully');
      }
    } catch (error: any) {
      console.error(error);
      toast.error(error.response?.data?.message || 'Failed to generate demo data');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Demo Data Generation</h2>
          <p className="text-gray-500 text-sm mt-1">Create placeholder categories and products for testing</p>
        </div>
      </div>

      <div className="bg-white border rounded-xl overflow-hidden shadow-sm p-8">
        <div className="flex flex-col items-center justify-center text-center max-w-lg mx-auto space-y-6">
          
          <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center border-4 border-blue-100 mb-2">
            <Database size={32} className="text-blue-500" />
          </div>

          <div className="space-y-2">
            <h3 className="text-lg font-bold text-gray-900">Populate Your Store</h3>
            <p className="text-gray-500 text-sm leading-relaxed">
              Clicking the button below will automatically create <strong className="text-gray-900">15 new Categories</strong>, and <strong className="text-gray-900">30 Products per category</strong>.
              All products will use realistic jewelry images and placeholder data. Total 450 products will be generated (150 Bulk / 300 Single).
            </p>
          </div>

          <div className="bg-amber-50 border border-amber-200 text-amber-800 text-xs px-4 py-3 rounded-lg flex items-start gap-3 text-left w-full mt-4">
            <AlertTriangle size={16} className="text-amber-500 mt-0.5 shrink-0" />
            <p>This action will add roughly 465 new records to your database. It might take 15-30 seconds to complete. Do not refresh the page while it's processing.</p>
          </div>

          <button
            onClick={handleSeedData}
            disabled={loading}
            className={`w-full py-4 px-6 rounded-xl font-bold uppercase tracking-widest text-xs flex items-center justify-center gap-2 transition-all mt-6 shadow-sm ${
              loading 
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                : success
                ? 'bg-emerald-50 text-emerald-600 border border-emerald-200 hover:bg-emerald-100'
                : 'bg-[#7A578D] hover:bg-[#684a78] text-white hover:shadow-md'
            }`}
          >
            {loading ? (
              <><Loader2 size={16} className="animate-spin" /> Processing...</>
            ) : success ? (
              <><CheckCircle2 size={16} /> Data Generated Successfully</>
            ) : (
              <><Database size={16} /> Generate Demo Data</>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DemoData;
