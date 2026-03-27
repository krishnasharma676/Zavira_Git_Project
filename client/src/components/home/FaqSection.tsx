import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Minus, Plus } from 'lucide-react';

interface FaqSectionProps {
  activeFaq: number | null;
  setActiveFaq: (idx: number | null) => void;
}

const FaqSection = ({ activeFaq, setActiveFaq }: FaqSectionProps) => {
  const faqs = [
    { 
      q: 'How can I track my order?', 
      a: 'Once your order is shipped, you will receive a tracking link via email/SMS. You can also use our dedicated Track Order portal in the top navigation.' 
    },
    { 
      q: 'Do you offer refunds or exchanges?', 
      a: 'Yes, we offer a 14-day hassle-free return and exchange policy. Items must be in their original condition and packaging.' 
    },
    { 
      q: 'How can I contact your customer service?', 
      a: 'You can reach our concierge via email at help@zavira.com or call us at +91 999 000 1122 between 10 AM to 7 PM.' 
    },
    {
      q: 'Is my purchase insured?',
      a: 'Every order is fully insured and handled by our delivery partners carefully to ensure safe arrival.'
    }
  ];

  return (
    <section className="pt-10 pb-4 bg-white dark:bg-[#0A0A0A] transition-colors duration-500 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 w-48 h-48 bg-[#7A578D]/5 blur-[80px] rounded-full -mr-24 -mt-24 transition-colors" />
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-[#C9A0C8]/5 blur-[80px] rounded-full -ml-24 -mb-24 transition-colors" />

      <div className="container mx-auto px-6 relative z-10">
        <div className="flex flex-col items-center mb-6 text-center">
            <h2 className="text-lg md:text-xl font-sans font-black uppercase tracking-tighter text-gray-900 dark:text-white mb-2">
              Common <span className="text-[#7A578D]">Questions_</span>
            </h2>
            <div className="w-8 h-px bg-gray-100 dark:bg-gray-800" />
        </div>

        <div className="grid gap-2">
          {faqs.map((faq, idx) => {
            const isOpen = activeFaq === idx;
            return (
              <motion.div 
                key={idx}
                initial={false}
                className={`overflow-hidden border border-gray-100 dark:border-gray-800/50 rounded-lg transition-all duration-300 ${
                  isOpen ? 'bg-gray-50/50 dark:bg-[#111111] border-[#7A578D]/20' : 'bg-white dark:bg-[#0D0D0D]'
                }`}
              >
                <button 
                  onClick={() => setActiveFaq(isOpen ? null : idx)}
                  className="w-full flex items-center justify-between p-4 text-left group"
                >
                  <span className={`text-[11px] font-black uppercase tracking-widest transition-all duration-300 ${
                    isOpen ? 'text-[#7A578D]' : 'text-gray-900 dark:text-white'
                  }`}>
                    {faq.q}
                  </span>
                  <div className={`p-1 rounded-full transition-all duration-300 ${
                    isOpen ? 'bg-[#7A578D] text-white rotate-180' : 'bg-gray-50 dark:bg-gray-800 text-gray-400 group-hover:text-[#7A578D]'
                  }`}>
                    {isOpen ? <Minus size={10} /> : <Plus size={10} />}
                  </div>
                </button>
                
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: 'easeOut' }}
                    >
                      <div className="p-4 pt-0">
                        <div className="h-px w-full bg-gray-50 dark:bg-gray-800 mb-3" />
                        <p className="text-[13px] font-medium leading-relaxed text-gray-500 dark:text-gray-400 italic">
                          {faq.a}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default React.memo(FaqSection);
