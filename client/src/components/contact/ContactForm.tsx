import { motion } from 'framer-motion';
import { Send } from 'lucide-react';

interface ContactFormProps {
  onSubmit: (e: React.FormEvent) => void;
  loading?: boolean;
}

const ContactForm = ({ onSubmit, loading }: ContactFormProps) => {
  return (
    <motion.div
      key="contact-form"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      <form onSubmit={onSubmit} className="space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="space-y-1">
            <label className="text-[10px] uppercase font-black tracking-widest text-[#7A578D] ml-1">Full Name</label>
            <input
              type="text"
              name="name"
              className="w-full bg-white dark:bg-white/[0.02] border border-gray-100 dark:border-white/10 rounded-xl px-4 py-3 outline-none focus:border-[#7A578D] text-[13px] text-gray-900 dark:text-white transition-all placeholder:text-gray-300 dark:placeholder:text-gray-700 font-medium"
              placeholder="John Doe"
              required
            />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] uppercase font-black tracking-widest text-[#7A578D] ml-1">Email Address</label>
            <input
              type="email"
              name="email"
              className="w-full bg-white dark:bg-white/[0.02] border border-gray-100 dark:border-white/10 rounded-xl px-4 py-3 outline-none focus:border-[#7A578D] text-[13px] text-gray-900 dark:text-white transition-all placeholder:text-gray-300 dark:placeholder:text-gray-700 font-medium"
              placeholder="john@example.com"
              required
            />
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-[10px] uppercase font-black tracking-widest text-[#7A578D] ml-1">Subject</label>
          <input
            type="text"
            name="subject"
            className="w-full bg-white dark:bg-white/[0.02] border border-gray-100 dark:border-white/10 rounded-xl px-4 py-3 outline-none focus:border-[#7A578D] text-[13px] text-gray-900 dark:text-white transition-all placeholder:text-gray-300 dark:placeholder:text-gray-700 font-medium"
            placeholder="How can we help?"
            required
          />
        </div>

        <div className="space-y-1">
          <label className="text-[10px] uppercase font-black tracking-widest text-[#7A578D] ml-1">Message</label>
          <textarea
            rows={4}
            name="message"
            className="w-full bg-white dark:bg-white/[0.02] border border-gray-100 dark:border-white/10 rounded-xl px-4 py-3 outline-none focus:border-[#7A578D] text-[13px] text-gray-900 dark:text-white transition-all placeholder:text-gray-300 dark:placeholder:text-gray-700 resize-none font-medium"
            placeholder="Tell us about your requirements..."
            required
          ></textarea>
        </div>

        <div className="pt-2">
          <button
            type="submit"
            disabled={loading}
            className="luxury-button rounded-xl w-full py-4 flex items-center justify-center gap-3 group text-[11px] disabled:opacity-50"
          >
            {loading ? 'SENDING...' : 'SEND MESSAGE'}
            <Send size={14} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
          </button>
        </div>
      </form>
    </motion.div>
  );
};

export default ContactForm;
