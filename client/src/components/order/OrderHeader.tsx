import { motion } from 'framer-motion';
import { CheckCircle } from 'lucide-react';

interface OrderHeaderProps {
  orderNumber?: string;
}

const OrderHeader = ({ orderNumber }: OrderHeaderProps) => {
  return (
    <div className="text-center space-y-8">
      <div className="relative inline-block">
         <motion.div 
           initial={{ scale: 0 }}
           animate={{ scale: 1 }}
           transition={{ type: 'spring', damping: 12 }}
           className="w-24 h-24 bg-[#7A578D] rounded-full flex items-center justify-center text-white mx-auto shadow-2xl shadow-[#7A578D]/40"
         >
            <CheckCircle size={40} />
         </motion.div>
         <motion.div 
           initial={{ opacity: 0 }}
           animate={{ opacity: 1 }}
           transition={{ delay: 0.5 }}
           className="absolute -top-4 -right-4 bg-black dark:bg-white dark:text-black text-white text-[8px] font-black px-3 py-1 rounded-full uppercase tracking-widest"
         >
            Archived
         </motion.div>
      </div>

      <div className="space-y-4">
         <h1 className="text-4xl lg:text-5xl font-sans font-black uppercase italic tracking-tighter leading-none">Acquisition_Archived</h1>
         <p className="text-[11px] font-black uppercase tracking-[0.4em] text-gray-400">Order Manifest: {orderNumber}</p>
      </div>

      <div className="max-w-xl mx-auto text-[13px] font-medium text-gray-500 dark:text-gray-400 leading-relaxed italic">
         Success. Your asset allocation protocol has been successfully archived in our high-security vault. Our logistics division has been notified to initiate the white-glove transit procedure.
      </div>
    </div>
  );
};

export default OrderHeader;
