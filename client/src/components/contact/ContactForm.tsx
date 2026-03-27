import { useState } from 'react';
import { motion } from 'framer-motion';
import { Send } from 'lucide-react';
import { V, validateAll, inputCls } from '../../utils/validators';

interface ContactFormProps {
  onSubmit: (data: { name: string; email: string; subject: string; message: string }) => void;
  loading?: boolean;
}

const Err = ({ msg }: { msg?: string }) =>
  msg ? <p className="text-[9px] text-red-500 font-bold ml-1 mt-0.5">{msg}</p> : null;

const RULES = {
  name:    V.fullName,
  email:   V.email,
  subject: V.subject,
  message: V.message,
};

const ContactForm = ({ onSubmit, loading }: ContactFormProps) => {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: (RULES as any)[name]?.(value) || '' }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validateAll(form, RULES);
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    onSubmit(form);
  };

  return (
    <motion.div key="contact-form" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="space-y-1">
            <label className="text-[10px] uppercase font-black tracking-widest text-[#7A578D] ml-1">Full Name</label>
            <input type="text" name="name" value={form.name} onChange={handleChange} placeholder="John Doe"
              className={inputCls(errors.name, 'w-full border rounded-xl px-4 py-3 outline-none text-[13px] text-gray-900 dark:text-white transition-all placeholder:text-gray-300 dark:placeholder:text-gray-700 font-medium dark:bg-white/[0.02] dark:border-white/10')} />
            <Err msg={errors.name} />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] uppercase font-black tracking-widest text-[#7A578D] ml-1">Email Address</label>
            <input type="email" name="email" value={form.email} onChange={handleChange} placeholder="john@example.com"
              className={inputCls(errors.email, 'w-full border rounded-xl px-4 py-3 outline-none text-[13px] text-gray-900 dark:text-white transition-all placeholder:text-gray-300 dark:placeholder:text-gray-700 font-medium dark:bg-white/[0.02] dark:border-white/10')} />
            <Err msg={errors.email} />
          </div>
        </div>
        <div className="space-y-1">
          <label className="text-[10px] uppercase font-black tracking-widest text-[#7A578D] ml-1">Subject</label>
          <input type="text" name="subject" value={form.subject} onChange={handleChange} placeholder="How can we help?"
            className={inputCls(errors.subject, 'w-full border rounded-xl px-4 py-3 outline-none text-[13px] text-gray-900 dark:text-white transition-all placeholder:text-gray-300 dark:placeholder:text-gray-700 font-medium dark:bg-white/[0.02] dark:border-white/10')} />
          <Err msg={errors.subject} />
        </div>
        <div className="space-y-1">
          <label className="text-[10px] uppercase font-black tracking-widest text-[#7A578D] ml-1">Message</label>
          <textarea rows={4} name="message" value={form.message} onChange={handleChange} placeholder="Tell us about your requirements..."
            className={inputCls(errors.message, 'w-full border rounded-xl px-4 py-3 outline-none text-[13px] text-gray-900 dark:text-white transition-all placeholder:text-gray-300 dark:placeholder:text-gray-700 resize-none font-medium dark:bg-white/[0.02] dark:border-white/10')} />
          <Err msg={errors.message} />
        </div>
        <div className="pt-2">
          <button type="submit" disabled={loading}
            className="luxury-button rounded-xl w-full py-4 flex items-center justify-center gap-3 group text-[11px] disabled:opacity-50">
            {loading ? 'SENDING...' : 'SEND MESSAGE'}
            <Send size={14} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
          </button>
        </div>
      </form>
    </motion.div>
  );
};

export default ContactForm;
