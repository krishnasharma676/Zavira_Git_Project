import { NavLink, useNavigate, Link } from 'react-router-dom';
import { LogOut, ChevronRight, ExternalLink } from 'lucide-react';
import { ADMIN_MODULES } from '../utils/modules';

const Sidebar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('isAdmin');
    navigate('/admin/login');
  };

  return (
    <div className="w-[220px] bg-white h-screen fixed left-0 top-0 border-r border-gray-100 flex flex-col z-50">
      <div className="p-4 border-b border-gray-50 flex flex-col space-y-4">
        <div className="flex items-center space-x-2">
          <div className="w-7 h-7 bg-[#7A578D] rounded-lg flex items-center justify-center text-white font-black text-sm shadow-lg">Z</div>
          <div>
            <h1 className="text-[10px] font-black uppercase tracking-widest text-gray-900">Admin</h1>
            <p className="text-[7px] text-gray-400 font-bold uppercase tracking-widest">Manager</p>
          </div>
        </div>

        <Link 
          to="/" 
          className="flex items-center space-x-2 px-3 py-2 bg-gray-50 border border-gray-100 rounded-lg text-[8px] font-black uppercase tracking-widest text-gray-500 hover:text-white hover:bg-[#7A578D] hover:border-[#7A578D] transition-all group"
        >
          <ExternalLink size={10} className="group-hover:scale-110 transition-transform" />
          <span>View Site</span>
        </Link>
      </div>

      <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto no-scrollbar pt-4">
        <p className="px-3 text-[7px] font-black text-gray-300 uppercase tracking-widest mb-3">Menu</p>
        {ADMIN_MODULES.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => `
              flex items-center justify-between px-3 py-2 rounded-lg transition-all group
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

      <div className="p-4 border-t border-gray-50 bg-gray-50/30">
        <button 
          onClick={handleLogout}
          className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all font-black uppercase tracking-widest text-[10px]"
        >
          <LogOut size={18} />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
