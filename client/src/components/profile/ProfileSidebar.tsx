import { LogOut } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';


interface NavItem {
  id: string;
  label: string;
  icon: LucideIcon;
}

interface ProfileSidebarProps {
  user: any;
  navItems: NavItem[];
  activeTab: string;
  setActiveTab: (tab: string) => void;
  handleLogout: () => void;
}

const ProfileSidebar = ({ user, navItems, activeTab, setActiveTab, handleLogout }: ProfileSidebarProps) => {
  return (
    <aside className="lg:w-1/4 lg:sticky lg:top-24 h-max transition-all">
      <div className="bg-gray-50 dark:bg-white/[0.02] border border-gray-100 dark:border-white/10 rounded-2xl overflow-hidden shadow-sm">
        <div className="p-4 border-b border-gray-100 dark:border-white/5 bg-white dark:bg-transparent">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-[#7A578D] flex items-center justify-center text-white font-black text-md">
              {user.name?.[0].toUpperCase()}
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest leading-none mb-1">{user.name}</p>
              <p className="text-[9px] text-gray-400 font-bold lowercase truncate max-w-[120px]">{user.email}</p>
            </div>
          </div>
        </div>
        <div className="py-1">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center justify-between px-5 py-3 text-[10px] font-black uppercase tracking-[0.1em] transition-all ${
                activeTab === item.id 
                  ? 'text-[#7A578D] bg-white dark:bg-white/5 border-r-2 border-[#7A578D]' 
                  : 'text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              <div className="flex items-center space-x-3">
                <item.icon size={14} />
                <span>{item.label}</span>
              </div>
            </button>
          ))}
        </div>
        <div className="p-4 bg-red-50/50 dark:bg-red-500/5 mt-4">
          <button 
            onClick={handleLogout}
            className="w-full flex items-center justify-center space-x-2 py-3 text-[10px] font-black uppercase tracking-widest text-red-500 hover:bg-red-500 hover:text-white transition-all rounded-xl border border-red-500/20"
          >
            <LogOut size={14} />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </aside>
  );
};

export default ProfileSidebar;
