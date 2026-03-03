import { Link, useNavigate } from 'react-router-dom';
import { User, Clock, X } from 'lucide-react';
import { useUIStore } from '../../store/useUIStore';

interface UserMenuProps {
  user: any;
  isAuthenticated: boolean;
  logout: () => void;
  isActive: (path: string) => boolean;
}

const UserMenu = ({ user, isAuthenticated, logout, isActive }: UserMenuProps) => {
  const navigate = useNavigate();
  const { openAuthModal } = useUIStore();

  return (
    <div className="group relative">
      <button
        onClick={() => isAuthenticated ? navigate('/profile') : openAuthModal()}
        className={`hover:text-[#7A578D] transition-colors p-1 flex items-center gap-1 ${isActive('/profile') ? 'text-[#7A578D]' : ''}`}
      >
        <User size={22} strokeWidth={1.5} />
      </button>
      {isAuthenticated && (
        <div className="absolute right-0 top-full mt-2 w-52 bg-white dark:bg-[#1A1A1A] z-[500] shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 border border-gray-100 dark:border-gray-800 rounded-2xl overflow-hidden before:absolute before:inset-x-0 before:-top-2 before:h-2 before:bg-transparent">
          <div className="px-4 py-3 bg-gray-50 dark:bg-[#121212] border-b border-gray-100 dark:border-gray-800">
            <p className="text-[11px] text-gray-400 uppercase tracking-widest font-bold">Logged in as</p>
            <p className="text-sm font-black text-gray-800 dark:text-gray-200 truncate">{user?.name || user?.phone || 'User'}</p>
          </div>
          <Link
            to="/profile"
            className="flex items-center space-x-3 px-4 py-3 hover:bg-[#EAD0DB] dark:hover:bg-white/5 transition-colors group/item border-b border-gray-50 dark:border-gray-800"
          >
            <div className="w-7 h-7 bg-gray-100 dark:bg-white/5 rounded-lg flex items-center justify-center group-hover/item:bg-[#7A578D]/10 transition-colors">
              <Clock size={14} className="text-gray-500 dark:text-gray-400 group-hover/item:text-[#7A578D]" />
            </div>
            <span className="text-xs font-bold text-gray-700 dark:text-gray-300 group-hover/item:text-[#7A578D] transition-colors">Order History</span>
          </Link>
          {user?.role === 'ADMIN' && (
            <Link
              to="/admin"
              className="flex items-center space-x-3 px-4 py-3 hover:bg-[#EAD0DB] dark:hover:bg-white/5 transition-colors group/item border-b border-gray-50 dark:border-gray-800"
            >
              <div className="w-7 h-7 bg-gray-100 dark:bg-white/5 rounded-lg flex items-center justify-center">
                <User size={14} className="text-[#7A578D]" />
              </div>
              <span className="text-xs font-bold text-[#7A578D]">Admin Panel</span>
            </Link>
          )}
          <button
            onClick={logout}
            className="flex items-center space-x-3 w-full px-4 py-3 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors group/item"
          >
            <div className="w-7 h-7 bg-red-50 dark:bg-red-500/10 rounded-lg flex items-center justify-center group-hover/item:bg-red-100 dark:group-hover/item:bg-red-500/20 transition-colors">
              <X size={14} className="text-red-500" />
            </div>
            <span className="text-xs font-bold text-red-500">Logout</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default UserMenu;
