import { motion } from 'framer-motion';
import { Check, Sparkles } from 'lucide-react';

interface OrderHeaderProps {
  orderNumber?: string;
}

const OrderHeader = ({ orderNumber }: OrderHeaderProps) => {
  return (
    <div className="text-center space-y-6">
      <div className="relative inline-block">
         <motion.div 
           initial={{ scale: 0.8, opacity: 0 }}
           animate={{ scale: 1, opacity: 1 }}
           transition={{ type: 'spring', damping: 25, stiffness: 300 }}
           className="w-20 h-20 bg-[#7A578D] rounded-full flex items-center justify-center text-white mx-auto shadow-[0_0_40px_rgba(122,87,141,0.4)] border-4 border-white dark:border-[#0A0A0A] relative z-10"
         >
            <Check size={32} strokeWidth={4} />
         </motion.div>
         
         <motion.div 
           animate={{ 
             scale: [1, 1.4, 1],
             opacity: [0.3, 0, 0.3]
           }}
           transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
           className="absolute inset-0 bg-[#7A578D] rounded-full blur-xl -z-0"
         />

         <motion.div 
           animate={{ rotate: 360 }}
           transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
           className="absolute -top-2 -right-2 text-[#7A578D]/50"
         >
            <Sparkles size={24} />
         </motion.div>
      </div>

      <div className="space-y-2">
         <div className="flex items-center justify-center gap-2 text-[8px] font-black uppercase tracking-[0.4em] text-[#7A578D] opacity-80">
            <div className="h-[1px] w-6 bg-[#7A578D]/20"></div>
            <span>ORDER CONFIRMED</span>
            <div className="h-[1px] w-6 bg-[#7A578D]/20"></div>
         </div>
         <h1 className="text-3xl lg:text-4xl font-sans font-black uppercase tracking-tighter leading-tight text-gray-900 dark:text-white">
            Reserved For You
         </h1>
         <p className="text-[9px] font-bold uppercase tracking-[0.3em] text-gray-400">
            REF ID: <span className="text-[#7A578D] font-black">{orderNumber?.split('-').pop()}</span>
         </p>
      </div>

      <div className="max-w-md mx-auto text-[12px] font-medium text-gray-500 dark:text-gray-400 leading-relaxed italic opacity-80 border-t border-b border-gray-50 dark:border-white/5 py-4">
         "Your journey with Zaviraa has begun. We are curating your selection with the utmost care."
      </div>
    </div>
  );
};

export default OrderHeader;
