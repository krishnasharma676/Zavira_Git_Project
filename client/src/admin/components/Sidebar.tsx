import { NavLink, useNavigate, Link } from 'react-router-dom';
import { LogOut, ChevronRight, ExternalLink, X } from 'lucide-react';
import { ADMIN_MODULES } from '../utils/modules';

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
        w-[200px] bg-white h-screen fixed left-0 top-0 border-r border-gray-100 flex flex-col z-[70] transition-transform duration-300
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="p-3 border-b border-gray-50 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 bg-[#7A578D] rounded-lg flex items-center justify-center text-white font-black text-xs shadow-lg">Z</div>
            <div>
              <h1 className="text-[9px] font-black uppercase tracking-widest text-gray-900">Admin</h1>
              <p className="text-[6px] text-gray-400 font-bold uppercase tracking-widest">Manager</p>
            </div>
          </div>
          <button onClick={onClose} className="lg:hidden p-1 text-gray-400 hover:text-gray-900">
             <X size={16} />
          </button>
        </div>

        <div className="px-3 py-2">
          <Link 
            to="/" 
            className="flex items-center space-x-2 px-2.5 py-1.5 bg-gray-50 border border-gray-100 rounded-lg text-[7px] font-black uppercase tracking-widest text-gray-500 hover:text-white hover:bg-[#7A578D] hover:border-[#7A578D] transition-all group"
          >
            <ExternalLink size={9} className="group-hover:scale-110 transition-transform" />
            <span>View Site</span>
          </Link>
        </div>

        <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto no-scrollbar pt-2">
          <p className="px-3 text-[7px] font-black text-gray-300 uppercase tracking-widest mb-3">Menu</p>
          {ADMIN_MODULES.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={() => {
                if (window.innerWidth < 1024) onClose();
              }}
              className={({ isActive }) => `
                flex items-center justify-between px-2.5 py-1.5 rounded-lg transition-all group
                ${isActive 
                  ? 'bg-[#7A578D]/5 text-[#7A578D] border border-[#7A578D]/10 shadow-sm font-bold' 
                  : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'}
              `}
            >
              {({ isActive }) => (
                <>
                  <div className="flex items-center space-x-2.5">
                    <item.icon size={16} strokeWidth={isActive ? 2.5 : 2} className={isActive ? 'text-[#7A578D]' : 'text-gray-400 group-hover:text-gray-600'} />
                    <span className="text-[10px] uppercase tracking-wider">{item.label}</span>
                  </div>
                  <ChevronRight 
                    size={10} 
                    className={`transition-all ${isActive ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0'}`} 
                  />
                </>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="p-3 border-t border-gray-50 bg-gray-50/30">
          <button 
            onClick={handleLogout}
            className="w-full flex items-center space-x-2 px-3 py-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all font-black uppercase tracking-widest text-[8px]"
          >
            <LogOut size={14} />
            <span>Logout Account</span>
          </button>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
