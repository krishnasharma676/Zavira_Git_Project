import { NavLink, useNavigate, Link } from 'react-router-dom';
import { LogOut, ChevronRight, ExternalLink, X } from 'lucide-react';
import { ADMIN_MODULES } from '../utils/modules';
import zaviraLogo from '../../assets/zavira-logo.png';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar = ({ isOpen, onClose }: SidebarProps) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('isAdmin');
    navigate('/admin/login');
  };

  return (
    <>
      {/* Mobile Overlay */}
      <div 
        className={`fixed inset-0 bg-black/40 backdrop-blur-sm z-[60] lg:hidden transition-opacity duration-300 ${isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`} 
        onClick={onClose}
      />

      <div className={`
        w-[220px] bg-white h-screen fixed left-0 top-0 border-r border-gray-100 flex flex-col z-[70] transition-transform duration-300 shadow-sm
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="p-3 border-b border-gray-100 flex items-center justify-between">
            <div className="flex items-center gap-2 px-2 py-1 bg-gray-50 rounded border border-gray-100 hover:bg-white transition-all cursor-pointer group">
                 <img src={zaviraLogo} alt="Admin" className="w-6 h-6 object-contain" />
                 <div className="flex flex-col">
                    <span className="text-[10px] font-black uppercase text-gray-900 leading-none">System Admin</span>
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-0.5">Manager</p>
                 </div>
            </div>
          <button onClick={onClose} className="lg:hidden p-1 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded transition-colors">
             <X size={16} />
          </button>
        </div>

        <div className="px-3 py-2">
          <Link 
            to="/" 
            className="flex items-center justify-center space-x-2 w-full py-1.5 bg-gray-50 border border-gray-200 rounded text-[10px] font-bold uppercase tracking-widest text-gray-600 hover:text-white hover:bg-[#7A578D] hover:border-[#7A578D] transition-all group"
          >
            <ExternalLink size={12} />
            <span>View Site</span>
          </Link>
        </div>

        <nav className="flex-1 px-2 space-y-0.5 overflow-y-auto no-scrollbar pt-1 pb-4">
          <p className="px-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Menu</p>
          {ADMIN_MODULES.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={() => {
                if (window.innerWidth < 1024) onClose();
              }}
              className={({ isActive }) => `
                flex items-center justify-between px-3 py-1.5 rounded transition-all group border border-transparent
                ${isActive 
                  ? 'bg-[#7A578D]/5 text-[#7A578D] border-[#7A578D]/10 font-bold' 
                  : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50 hover:border-gray-100 font-bold'}
              `}
            >
              {({ isActive }) => (
                <>
                  <div className="flex items-center space-x-2">
                    <item.icon size={14} strokeWidth={isActive ? 2.5 : 2} className={isActive ? 'text-[#7A578D]' : 'text-gray-400 group-hover:text-gray-600 transition-colors'} />
                    <span className="text-[11px] uppercase tracking-wider">{item.label}</span>
                  </div>
                  <ChevronRight 
                    size={12} 
                    className={`transition-all ${isActive ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0'}`} 
                  />
                </>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="p-3 border-t border-gray-100 bg-gray-50/50">
          <button 
            onClick={handleLogout}
            className="w-full flex items-center justify-center space-x-2 py-2 rounded text-gray-500 hover:text-red-600 hover:bg-red-50 hover:border-red-100 border border-transparent transition-all font-bold uppercase tracking-widest text-[10px]"
          >
            <LogOut size={14} />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
