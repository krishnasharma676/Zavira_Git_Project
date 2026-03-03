import { motion } from 'framer-motion';
import { ShieldCheck, CreditCard, Banknote, CheckCircle } from 'lucide-react';

interface PaymentSectionProps {
  paymentMethod: 'COD' | 'ONLINE';
  setPaymentMethod: (method: 'COD' | 'ONLINE') => void;
  handleCompleteOrder: () => void;
  loading: boolean;
}

const PaymentSection = ({ paymentMethod, setPaymentMethod, handleCompleteOrder, loading }: PaymentSectionProps) => {
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-10">
      <div className="bg-blue-50/50 dark:bg-blue-500/5 p-6 rounded-2xl border border-blue-100/20 text-[11px] text-blue-900 dark:text-blue-300 font-medium italic flex items-start space-x-4">
        <ShieldCheck size={18} className="shrink-0 mt-0.5" />
        <p>All financial transmissions are processed through secured multi-layered encryption protocols. Your identity remains non-persistent on our primary arrays.</p>
      </div>

      <div className="space-y-4">
        <h3 className="text-[11px] font-black uppercase tracking-widest text-gray-400 mb-6">Settlement Protocol</h3>
        
        <div className="grid grid-cols-1 gap-4">
          <div 
            onClick={() => setPaymentMethod('ONLINE')}
            className={`p-6 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${
              paymentMethod === 'ONLINE' ? 'border-[#7A578D] bg-[#7A578D]/5 shadow-lg shadow-[#7A578D]/5' : 'border-gray-100 dark:border-white/10 hover:border-gray-300'
            }`}
          >
            <div className="flex items-center space-x-4">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${paymentMethod === 'ONLINE' ? 'bg-[#7A578D] text-white' : 'bg-gray-100 dark:bg-white/5 text-gray-400'}`}>
                 <CreditCard size={18} />
              </div>
              <div>
                <p className="text-[11px] font-black uppercase">Instant Clearance</p>
                <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest">Card / UPI / NetBanking</p>
              </div>
            </div>
            {paymentMethod === 'ONLINE' && <CheckCircle size={16} className="text-[#7A578D]" />}
          </div>

          <div 
            onClick={() => setPaymentMethod('COD')}
            className={`p-6 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${
              paymentMethod === 'COD' ? 'border-[#7A578D] bg-[#7A578D]/5 shadow-lg shadow-[#7A578D]/5' : 'border-gray-100 dark:border-white/10 hover:border-gray-300'
            }`}
          >
            <div className="flex items-center space-x-4">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${paymentMethod === 'COD' ? 'bg-[#7A578D] text-white' : 'bg-gray-100 dark:bg-white/5 text-gray-400'}`}>
                 <Banknote size={18} />
              </div>
              <div>
                <p className="text-[11px] font-black uppercase">Deferred Settlement</p>
                <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest">Cash on Delivery</p>
              </div>
            </div>
            {paymentMethod === 'COD' && <CheckCircle size={16} className="text-[#7A578D]" />}
          </div>
        </div>
      </div>

      <button 
        onClick={handleCompleteOrder}
        disabled={loading}
        className="luxury-button w-full rounded-2xl flex items-center justify-center space-x-4 group"
      >
        {loading ? (
          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
        ) : (
          <>
            <span>SUBMIT MANIFEST</span>
            <ShieldCheck size={18} />
          </>
        )}
      </button>
    </motion.div>
  );
};

export default PaymentSection;
