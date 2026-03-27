import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { V, KB, validateAll, inputCls } from '../../utils/validators';

interface AddressModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => Promise<void>;
}

const Err = ({ msg }: { msg?: string }) =>
  msg ? <p className="text-[9px] text-red-500 font-bold ml-1 mt-0.5">{msg}</p> : null;

const RULES = {
  name:    V.fullName,
  street:  V.address,
  city:    V.city,
  state:   V.state,
  pincode: V.pincode,
  phone:   V.phone,
};

const AddressModal = ({ isOpen, onClose, onSubmit }: AddressModalProps) => {
  const [form, setForm] = useState({ type: 'HOME', name: '', street: '', city: '', state: '', pincode: '', phone: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name === 'pincode' && (!KB.numericOnly(value) || value.length > 6)) return;
    if (name === 'phone'   && (!KB.numericOnly(value) || value.length > 10)) return;
    if ((name === 'city' || name === 'state') && !KB.noDigits(value)) return;
    setForm(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: (RULES as any)[name]?.(value) || '' }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validateAll(form, RULES);
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setSaving(true);
    await onSubmit(form);
    setSaving(false);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
          <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} className="relative w-full max-w-lg bg-white dark:bg-[#0A0A0A] rounded-3xl overflow-hidden shadow-2xl border border-gray-100 dark:border-white/10">
            <div className="p-8">
              <div className="flex justify-between items-center mb-8">
                <h3 className="text-xl font-sans font-black uppercase italic tracking-tighter text-gray-900 dark:text-white">Add Address</h3>
                <button onClick={onClose} className="text-gray-400 hover:text-black dark:hover:text-white transition-colors p-2"><X size={20} /></button>
              </div>
              <form className="space-y-4" onSubmit={handleSubmit}>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[8px] font-black uppercase tracking-widest text-gray-400">Address Type</label>
                    <select name="type" value={form.type} onChange={handleChange} className="w-full bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 p-3 rounded-xl text-[10px] uppercase font-black tracking-widest outline-none focus:border-[#7A578D] dark:text-white">
                      <option value="HOME">HOME</option>
                      <option value="WORK">WORK</option>
                      <option value="OFFICE">OFFICE</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[8px] font-black uppercase tracking-widest text-gray-400">Receiver Name*</label>
                    <input name="name" value={form.name} onChange={handleChange} placeholder="Full Name" className={inputCls(errors.name, 'w-full border rounded-xl p-3 text-[10px] font-bold outline-none transition-all dark:text-white dark:bg-white/5 dark:border-white/10')} />
                    <Err msg={errors.name} />
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-[8px] font-black uppercase tracking-widest text-gray-400">Street / Area*</label>
                  <input name="street" value={form.street} onChange={handleChange} placeholder="Street Address..." className={inputCls(errors.street, 'w-full border rounded-xl p-3 text-[10px] font-bold outline-none transition-all dark:text-white dark:bg-white/5 dark:border-white/10')} />
                  <Err msg={errors.street} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[8px] font-black uppercase tracking-widest text-gray-400">City*</label>
                    <input name="city" value={form.city} onChange={handleChange} placeholder="City" className={inputCls(errors.city, 'w-full border rounded-xl p-3 text-[10px] font-bold outline-none transition-all dark:text-white dark:bg-white/5 dark:border-white/10')} />
                    <Err msg={errors.city} />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[8px] font-black uppercase tracking-widest text-gray-400">State*</label>
                    <input name="state" value={form.state} onChange={handleChange} placeholder="State" className={inputCls(errors.state, 'w-full border rounded-xl p-3 text-[10px] font-bold outline-none transition-all dark:text-white dark:bg-white/5 dark:border-white/10')} />
                    <Err msg={errors.state} />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[8px] font-black uppercase tracking-widest text-gray-400">Pincode*</label>
                    <input name="pincode" value={form.pincode} onChange={handleChange} placeholder="6 Digit Code" inputMode="numeric" maxLength={6} className={inputCls(errors.pincode, 'w-full border rounded-xl p-3 text-[10px] font-bold outline-none transition-all dark:text-white dark:bg-white/5 dark:border-white/10')} />
                    <Err msg={errors.pincode} />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[8px] font-black uppercase tracking-widest text-gray-400">Phone*</label>
                    <input name="phone" value={form.phone} onChange={handleChange} placeholder="10-digit number" inputMode="numeric" maxLength={10} className={inputCls(errors.phone, 'w-full border rounded-xl p-3 text-[10px] font-bold outline-none transition-all dark:text-white dark:bg-white/5 dark:border-white/10')} />
                    <Err msg={errors.phone} />
                  </div>
                </div>
                <button type="submit" disabled={saving} className="w-full bg-black dark:bg-white text-white dark:text-black py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-[#7A578D] dark:hover:bg-[#7A578D] dark:hover:text-white transition-all shadow-xl shadow-black/10 disabled:opacity-50">
                  {saving ? 'Saving...' : 'Save Address'}
                </button>
              </form>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default AddressModal;
