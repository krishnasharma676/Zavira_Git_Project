import { motion } from 'framer-motion';

interface AccountTabProps {
  user: any;
}

const AccountTab = ({ user }: AccountTabProps) => {
  return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
      <h2 className="text-lg font-sans font-black mb-4 uppercase tracking-tighter">Personal <span className="text-[#7A578D]">Information_</span></h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1">
          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Full Name</label>
          <div className="bg-gray-50 dark:bg-white/5 p-3 rounded-xl border border-gray-100 dark:border-white/10 text-[11px] font-black uppercase tracking-wider text-gray-900 dark:text-white">
            {user.name}
          </div>
        </div>
        <div className="space-y-1">
          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Email Address</label>
          <div className="bg-gray-50 dark:bg-white/5 p-3 rounded-xl border border-gray-100 dark:border-white/10 text-[11px] font-black uppercase tracking-wider text-gray-900 dark:text-white">
            {user.email}
          </div>
        </div>
      </div>
      <div className="pt-4 border-t border-gray-50 dark:border-white/5">
        <p className="text-[10px] text-gray-400 font-black mb-2 uppercase tracking-widest">Security Settings</p>
        <button className="bg-black dark:bg-white dark:text-black text-white px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-[#7A578D] dark:hover:bg-[#7A578D] dark:hover:text-white transition-all shadow-lg shadow-black/5 dark:shadow-none">Change Password</button>
      </div>
    </motion.div>
  );
};

export default AccountTab;
