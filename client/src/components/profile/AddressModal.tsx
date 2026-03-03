import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

interface AddressModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => Promise<void>;
}

const AddressModal = ({ isOpen, onClose, onSubmit }: AddressModalProps) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm" 
          />
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-lg bg-white dark:bg-[#0A0A0A] rounded-3xl overflow-hidden shadow-2xl border border-gray-100 dark:border-white/10"
          >
            <div className="p-8">
              <div className="flex justify-between items-center mb-8">
                <h3 className="text-xl font-sans font-black uppercase italic tracking-tighter text-gray-900 dark:text-white">Initialize_Node</h3>
                <button onClick={onClose} className="text-gray-400 hover:text-black dark:hover:text-white transition-colors p-2">
                  <X size={20} />
                </button>
              </div>

              <form className="space-y-6" onSubmit={async (e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                const data = Object.fromEntries(formData.entries());
                await onSubmit(data);
              }}>
                <div className="grid grid-cols-2 gap-4 text-gray-900 dark:text-white">
                  <div className="space-y-2">
                     <label className="text-[8px] font-black uppercase tracking-widest text-gray-400">Node Type</label>
                     <select name="type" className="w-full bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 p-3 rounded-xl text-[10px] uppercase font-black tracking-widest outline-none focus:border-[#7A578D] dark:text-white">
                        <option value="HOME">HOME</option>
                        <option value="WORK">WORK</option>
                        <option value="OFFICE">OFFICE</option>
                     </select>
                  </div>
                  <div className="space-y-2">
                     <label className="text-[8px] font-black uppercase tracking-widest text-gray-400">Receiver Label</label>
                     <input name="name" required className="w-full bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 p-3 rounded-xl text-[10px] font-bold outline-none focus:border-[#7A578D] dark:text-white" placeholder="Personnel Name" />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[8px] font-black uppercase tracking-widest text-gray-400">Coordinates (Street/Area)</label>
                  <input name="street" required className="w-full bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 p-3 rounded-xl text-[10px] font-bold outline-none focus:border-[#7A578D] dark:text-white" placeholder="Node path address..." />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                     <label className="text-[8px] font-black uppercase tracking-widest text-gray-400">Sector (City)</label>
                     <input name="city" required className="w-full bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 p-3 rounded-xl text-[10px] font-bold outline-none focus:border-[#7A578D] dark:text-white" placeholder="City Alpha" />
                  </div>
                  <div className="space-y-2">
                     <label className="text-[8px] font-black uppercase tracking-widest text-gray-400">Region (State)</label>
                     <input name="state" required className="w-full bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 p-3 rounded-xl text-[10px] font-bold outline-none focus:border-[#7A578D] dark:text-white" placeholder="Region Code" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                     <label className="text-[8px] font-black uppercase tracking-widest text-gray-400">Postal Index</label>
                     <input name="pincode" required className="w-full bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 p-3 rounded-xl text-[10px] font-bold outline-none focus:border-[#7A578D] dark:text-white" placeholder="6 Digit Code" />
                  </div>
                  <div className="space-y-2">
                     <label className="text-[8px] font-black uppercase tracking-widest text-gray-400">Signal (Phone)</label>
                     <input name="phone" required className="w-full bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 p-3 rounded-xl text-[10px] font-bold outline-none focus:border-[#7A578D] dark:text-white" placeholder="Contact Stream" />
                  </div>
                </div>

                <button type="submit" className="w-full bg-black dark:bg-white text-white dark:text-black py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-[#7A578D] dark:hover:bg-[#7A578D] dark:hover:text-white transition-all shadow-xl shadow-black/10">Establish Logistic Node</button>
              </form>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default AddressModal;
