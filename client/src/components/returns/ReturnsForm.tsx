import { motion } from 'framer-motion';

const ReturnsForm = () => {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.2 }}
      className="lg:col-span-7 bg-white dark:bg-[#121212] p-6 md:p-10 rounded-[2rem] shadow-[0_20px_40px_rgba(0,0,0,0.03)] dark:shadow-none border border-gray-50 dark:border-white/5"
    >
      <h2 className="text-lg font-sans font-black text-gray-900 dark:text-white mb-1 uppercase tracking-tight">Locate Your Order</h2>
      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-6">Enter details to initiate request</p>
      
      <form className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-[9px] font-black uppercase tracking-widest text-[#7A578D] ml-1">Order Number</label>
            <input 
              type="text" 
              placeholder="EX: #ZV-88901"
              className="w-full bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-xl px-5 py-3.5 outline-none focus:border-[#7A578D] text-xs text-gray-900 dark:text-white transition-all font-medium placeholder:text-gray-300"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[9px] font-black uppercase tracking-widest text-[#7A578D] ml-1">Email or Phone</label>
            <input 
              type="text" 
              placeholder="name@example.com"
              className="w-full bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-xl px-5 py-3.5 outline-none focus:border-[#7A578D] text-xs text-gray-900 dark:text-white transition-all font-medium placeholder:text-gray-300"
            />
          </div>
        </div>

        <div className="pt-2">
          <button 
            className="w-full bg-[#7A578D] hover:bg-black text-white font-black uppercase text-[10px] py-4 rounded-xl transition-all tracking-[0.2em] shadow-lg shadow-[#7A578D]/15 active:scale-[0.98]"
          >
            Find My Order
          </button>
        </div>
      </form>
    </motion.div>
  );
};

export default ReturnsForm;
