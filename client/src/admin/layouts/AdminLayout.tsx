import { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { Menu } from 'lucide-react';
import { useAdminStore } from '../../store/useAdminStore';

const AdminLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { fetchMetadata } = useAdminStore();

  useEffect(() => {
    fetchMetadata();
  }, [fetchMetadata]);

  return (
    <div className="min-h-screen bg-white selection:bg-[#7A578D] selection:text-white">
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      
      {/* Mobile Top Bar */}
      <div className="lg:hidden h-14 bg-white border-b border-gray-100 flex items-center px-4 sticky top-0 z-50 shadow-sm">
        <button 
          onClick={() => setIsSidebarOpen(true)}
          className="p-2 text-gray-500 hover:text-[#7A578D] bg-gray-50 rounded-lg border border-gray-100"
        >
          <Menu size={20} />
        </button>
        <span className="ml-4 text-[10px] font-black uppercase tracking-[0.2em] text-[#7A578D]">Zaviraa <span className="text-gray-300">Vault</span></span>
      </div>

      <main className="lg:pl-[220px] flex flex-col min-h-screen">
        {/* Sticky Desktop Top Header */}
        <header className="hidden lg:flex h-10 bg-white/80 backdrop-blur-md border-b border-gray-100 items-center justify-between px-4 sticky top-0 z-40">
           <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400">Inventory <span className="text-[#7A578D] font-black">Control</span> Hub</span>
           </div>
           
           <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 px-2 py-1 bg-gray-50 rounded border border-gray-100 hover:bg-white transition-all cursor-pointer group">
                 <div className="w-6 h-6 bg-[#7A578D] text-white rounded flex items-center justify-center text-[10px] font-black shadow-sm uppercase">A</div>
                 <div className="flex flex-col">
                    <span className="text-[10px] font-black uppercase text-gray-900 leading-none">System Admin</span>
                    <div className="flex items-center gap-1 mt-0.5">
                      <div className="w-1 h-1 rounded-full bg-emerald-500" />
                      <span className="text-[8px] text-[#7A578D] font-bold uppercase tracking-widest">Live</span>
                    </div>
                 </div>
              </div>
           </div>
        </header>

        <div className="flex-1 p-2 lg:p-3 max-w-full w-full">
          <Outlet />
        </div>

        {/* Sticky Admin Footer */}
        <footer className="px-4 py-2 bg-white border-t border-gray-100 sticky bottom-0 z-40">
           <div className="flex flex-col md:flex-row items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                 <div className="w-5 h-5 bg-[#7A578D] rounded flex items-center justify-center text-white text-[9px] font-black">Z</div>
                 <div className="flex items-center gap-2 text-gray-900 font-bold">
                    <span className="text-[10px] uppercase tracking-widest opacity-60 text-gray-500">Admin Ledger</span>
                    <span className="text-[9px] opacity-40 font-mono">v2.4.0</span>
                 </div>
              </div>
              
              <div className="flex items-center gap-4">
                 <span className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.1em]">© 2026 Zaviraa</span>
                 <div className="flex items-center gap-1.5 px-2 py-0.5 bg-emerald-50 rounded border border-emerald-100">
                    <div className="w-1 h-1 rounded-full bg-emerald-500" />
                    <span className="text-[9px] font-bold uppercase text-emerald-600">Operational</span>
                 </div>
              </div>
           </div>
        </footer>
      </main>
    </div>
  );
};

export default AdminLayout;
