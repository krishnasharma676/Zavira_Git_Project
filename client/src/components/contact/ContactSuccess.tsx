import { motion } from 'framer-motion';
import { CheckCircle2 } from 'lucide-react';

interface ContactSuccessProps {
  onReset: () => void;
}

const ContactSuccess = ({ onReset }: ContactSuccessProps) => {
  return (
    <motion.div
      key="form-success"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-[#FAFAFA] dark:bg-[#121212] p-12 rounded-[2.5rem] text-center border border-[#7A578D]/10 shadow-2xl shadow-[#7A578D]/5"
    >
      <div className="w-16 h-16 bg-[#7A578D] rounded-full flex items-center justify-center text-white mb-8 mx-auto shadow-xl shadow-[#7A578D]/30">
        <CheckCircle2 size={32} />
      </div>
      <h3 className="text-xl font-black text-gray-900 dark:text-white mb-3 uppercase tracking-widest">Message Received</h3>
      <p className="text-gray-500 dark:text-gray-400 text-xs leading-relaxed max-w-xs mx-auto mb-10 uppercase tracking-tight">
        Our concierge has received your request. We will reach out to you within the next 4 working hours.
      </p>
      <button 
        onClick={onReset}
        className="text-[10px] font-black uppercase tracking-[0.2em] text-[#7A578D] border-b border-[#7A578D]/30 pb-1 hover:border-[#7A578D] transition-all"
      >
        Send another query
      </button>
    </motion.div>
  );
};

export default ContactSuccess;
