
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
            className="bg-white w-full max-w-7xl rounded-sm border border-gray-200 shadow-2xl relative overflow-hidden flex flex-col max-h-[95vh]"
          >
            <div className="px-4 py-2 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
              <div>
                <h2 className="text-[12px] font-black uppercase tracking-widest text-gray-900 leading-none">{title}</h2>
              </div>
              <button 
                onClick={onClose} 
                className="w-6 h-6 flex items-center justify-center hover:bg-gray-100 rounded text-gray-400 hover:text-gray-900 transition-all"
              >
                <X size={14} />
              </button>
            </div>
            
            <div className="p-4 overflow-y-auto no-scrollbar bg-white">
              {children}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default ManagementModal;
