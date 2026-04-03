import { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { Menu } from 'lucide-react';
import { useAdminStore } from '../../store/useAdminStore';
import zaviraLogo from '../../assets/zavira-logo.png';

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
        <div className="flex items-center gap-2 ml-4">
           <img src={zaviraLogo} alt="Logo" className="h-6 w-auto object-contain" />
           <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#7A578D]">Zaviraa <span className="text-gray-300">Panel</span></span>
        </div>
      </div>

      <main className="lg:pl-[220px] flex flex-col min-h-screen">
        {/* Sticky Desktop Top Header */}
        <header className="hidden lg:flex h-10 bg-white/80 backdrop-blur-md border-b border-gray-100 items-center justify-between px-4 sticky top-0 z-40">
           <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400">Product <span className="text-[#7A578D] font-black">Management</span></span>
           </div>
           
        </header>

        <div className="flex-1 p-2 lg:p-3 max-w-full w-full">
          <Outlet />
        </div>

        {/* Sticky Admin Footer */}
        <footer className="px-4 py-2 bg-white border-t border-gray-100 sticky bottom-0 z-40">
           <div className="flex flex-col md:flex-row items-center justify-between gap-2">
               <div className="flex items-center gap-2">
                  <img src={zaviraLogo} alt="Logo" className="w-5 h-5 object-contain opacity-50" />
                  <div className="flex items-center gap-2 text-gray-900 font-bold">
                     <span className="text-[10px] uppercase tracking-widest opacity-60 text-gray-500">Order Records</span>
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
