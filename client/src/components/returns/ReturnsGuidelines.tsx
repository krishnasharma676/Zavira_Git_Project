import { motion } from 'framer-motion';
import { RefreshCw, Clock, Truck } from 'lucide-react';

const ReturnsGuidelines = () => {
  const guidelines = [
    { icon: Clock, title: '14-Day Return', desc: 'Return items within 14 days.' },
    { icon: Truck, title: 'Free Pickup', desc: 'No-cost pickup from home.' },
    { icon: RefreshCw, title: 'Easy Exchange', desc: 'Exchange for any size or style.' },
  ];

  return (
    <div className="lg:col-span-5 space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-4">
         {guidelines.map((item, i) => (
           <motion.div 
             key={i}
             initial={{ opacity: 0, x: 20 }}
             animate={{ opacity: 1, x: 0 }}
             transition={{ delay: 0.3 + (i * 0.1) }}
             className="flex items-center space-x-3 bg-white/50 dark:bg-white/[0.02] p-3 rounded-2xl border border-gray-50 dark:border-white/5"
           >
             <div className="w-8 h-8 rounded-lg bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 flex items-center justify-center shrink-0">
               <item.icon size={14} className="text-[#7A578D]" />
             </div>
             <div>
               <h4 className="text-[9px] font-black uppercase tracking-wider text-gray-900 dark:text-gray-100">{item.title}</h4>
               <p className="text-[9px] text-gray-400 font-medium leading-tight italic">{item.desc}</p>
             </div>
           </motion.div>
         ))}
      </div>
      
      <div className="p-4 bg-[#EAD0DB]/50 dark:bg-[#7A578D]/10 rounded-2xl border border-[#7A578D]/10 text-center">
         <p className="text-[9px] font-bold text-[#7A578D] dark:text-[#C9A0C8] uppercase tracking-widest">
           Support: <span className="text-gray-900 dark:text-white">care@zavira.com</span>
         </p>
      </div>
    </div>
  );
};

export default ReturnsGuidelines;
