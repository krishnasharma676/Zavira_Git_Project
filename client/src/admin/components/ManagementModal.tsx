
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ManagementModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

const ManagementModal = ({ isOpen, onClose, title, children }: ManagementModalProps) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 selection:bg-[#7A578D] selection:text-white">
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.98, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98, y: 10 }}
            className="bg-white w-full max-w-2xl rounded-2xl border border-gray-100 shadow-[0_30px_60px_rgba(0,0,0,0.1)] relative overflow-hidden flex flex-col max-h-[90vh]"
          >
            <div className="px-5 py-3 border-b border-gray-50 flex items-center justify-between bg-gray-50/30">
              <div>
                <h2 className="text-[13px] font-sans font-black uppercase tracking-widest text-gray-900 leading-none">{title}</h2>
                <p className="text-[8px] font-black text-gray-400 uppercase tracking-[0.2em] mt-1">Update information below</p>
              </div>
              <button 
                onClick={onClose} 
                className="w-7 h-7 flex items-center justify-center hover:bg-white hover:shadow-sm rounded-lg text-gray-400 hover:text-gray-900 transition-all border border-gray-100 bg-gray-50/50"
              >
                <X size={14} />
              </button>
            </div>
            
            <div className="p-5 overflow-y-auto no-scrollbar bg-white">
              {children}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default ManagementModal;
