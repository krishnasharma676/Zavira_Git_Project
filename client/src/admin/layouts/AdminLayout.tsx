import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { Menu } from 'lucide-react';

const AdminLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

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

      <main className="lg:pl-[200px] flex flex-col min-h-screen">
        {/* Sticky Desktop Top Header */}
        <header className="hidden lg:flex h-10 bg-white/80 backdrop-blur-md border-b border-gray-100 items-center justify-between px-4 sticky top-0 z-40 shadow-sm">
           <div className="flex items-center gap-3">
              <span className="text-[8px] font-black uppercase tracking-[0.4em] text-gray-400">Inventory <span className="text-[#7A578D] font-black">Control</span> Hub</span>
           </div>
           
           <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 px-2.5 py-0.5 bg-gray-50 rounded-lg border border-gray-100 hover:bg-white hover:shadow-sm transition-all cursor-pointer group">
                 <div className="w-4.5 h-4.5 bg-[#7A578D] text-white rounded-md flex items-center justify-center text-[9px] font-black shadow-lg shadow-purple-500/20 transition-transform group-hover:scale-105">A</div>
                 <div className="flex flex-col">
                    <span className="text-[8px] font-black uppercase text-gray-900 leading-none">System Admin</span>
                    <span className="text-[6px] text-[#7A578D] font-bold uppercase tracking-widest mt-0.5">Live</span>
                 </div>
              </div>
           </div>
        </header>

        <div className="flex-1 p-3 md:p-3 lg:p-4 max-w-[1640px] mx-auto w-full">
          <Outlet />
        </div>

        {/* Sticky Admin Footer */}
        <footer className="px-4 py-1.5 bg-white border-t border-gray-100 sticky bottom-0 z-40 shadow-[0_-4px_20px_rgba(0,0,0,0.03)]">
           <div className="flex flex-col md:flex-row items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                 <div className="w-3.5 h-3.5 bg-[#7A578D] rounded flex items-center justify-center text-white text-[6px] font-black shadow-sm">Z</div>
                 <div className="flex items-center gap-2 text-gray-900 font-black">
                    <span className="text-[7.5px] uppercase tracking-[0.15em] opacity-80 text-gray-400">Admin Ledger</span>
                    <span className="w-1 h-1 rounded-full bg-gray-200" />
                    <span className="text-[6px] opacity-40">v2.4.0</span>
                 </div>
              </div>
              
              <div className="flex items-center gap-6">
                 <span className="text-[7px] font-black text-gray-300 uppercase tracking-widest">© 2026 Zaviraa</span>
                 <div className="flex items-center gap-2 px-2 py-0.5 bg-[#7A578D]/5 rounded-md border border-[#7A578D]/10">
                    <div className="w-1 h-1 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]" />
                    <span className="text-[6.5px] font-black uppercase text-emerald-600 tracking-[0.2em]">Operational</span>
                 </div>
              </div>
           </div>
        </footer>
      </main>
    </div>
  );
};

export default AdminLayout;
