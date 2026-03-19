
import { useState, useEffect } from 'react';
import { Save, Settings, ShieldCheck, Truck, Globe, Mail, Phone, CreditCard, ChevronRight, Info } from 'lucide-react';
import api from '../../api/axios';
import toast from 'react-hot-toast';

const StoreSettings = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState<Record<string, string>>({
    store_name: 'Zavira',
    store_email: '',
    store_phone: '',
    shipping_free_threshold: '500',
    shipping_flat_rate: '50',
    tax_percentage: '3',
    razorpay_key_id: '',
    shiprocket_email: '',
    social_instagram: '',
    social_whatsapp: '',
    footer_text: '',
    store_gstin: '',
    store_address: ''
  });

  const fetchSettings = async () => {
    try {
      const { data } = await api.get('/settings');
      if (data.data) {
        setSettings(prev => ({ ...prev, ...data.data }));
      }
    } catch (error) {
      toast.error('Failed to load settings');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleChange = (key: string, value: string) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.patch('/settings', settings);
      toast.success('Store configuration updated');
    } catch (error) {
      toast.error('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return (
    <div className="min-h-[400px] flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-[#7A578D] border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="space-y-4 animate-in fade-in duration-500 max-w-[1200px]">
      <header className="flex justify-between items-center border-b border-gray-100 pb-2.5">
        <div>
          <h1 className="text-xl font-sans font-black uppercase tracking-tight text-gray-900 leading-none">Store Settings</h1>
          <p className="text-gray-400 text-[8px] font-black uppercase tracking-widest mt-1 flex items-center gap-2">
            <Info size={10} className="text-[#7A578D]" /> Global configuration & API parameters
          </p>
        </div>
        <button 
          onClick={handleSave}
          disabled={saving}
          className="bg-[#7A578D] text-white px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest flex items-center space-x-1.5 hover:bg-black transition-all shadow-lg active:scale-95 disabled:opacity-50"
        >
          {saving ? <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <Save size={12} />}
          <span>{saving ? 'Syncing...' : 'Save Config'}</span>
        </button>
      </header>

      <form onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        <div className="lg:col-span-8 space-y-4">
          
          {/* GENERAL INFO */}
          <div className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm">
             <div className="flex items-center gap-2 mb-4 border-b border-gray-50 pb-2">
                <div className="w-8 h-8 bg-gray-50 rounded-lg flex items-center justify-center text-[#7A578D]">
                   <Globe size={16} />
                </div>
                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-900">General Identity</h3>
             </div>
             
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                   <label className="text-[8px] font-black uppercase tracking-widest text-gray-400 ml-1">Store Name</label>
                   <input value={settings.store_name} onChange={(e) => handleChange('store_name', e.target.value)} className="w-full bg-gray-50 border border-gray-100 rounded-lg py-1.5 px-3 outline-none focus:border-[#7A578D] text-[11px] font-black uppercase" />
                </div>
                <div className="space-y-1">
                   <label className="text-[8px] font-black uppercase tracking-widest text-gray-400 ml-1">Support Email</label>
                   <div className="relative">
                      <Mail size={12} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300" />
                      <input type="email" value={settings.store_email} onChange={(e) => handleChange('store_email', e.target.value)} className="w-full bg-gray-50 border border-gray-100 rounded-lg py-1.5 pl-9 pr-3 outline-none focus:border-[#7A578D] text-[11px] font-black lowercase" placeholder="help@zavira.com" />
                   </div>
                </div>
                <div className="space-y-1">
                   <label className="text-[8px] font-black uppercase tracking-widest text-gray-400 ml-1">Support Contact</label>
                   <div className="relative">
                      <Phone size={12} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300" />
                      <input value={settings.store_phone} onChange={(e) => handleChange('store_phone', e.target.value)} className="w-full bg-gray-50 border border-gray-100 rounded-lg py-1.5 pl-9 pr-3 outline-none focus:border-[#7A578D] text-[11px] font-black" placeholder="+91 ..." />
                   </div>
                </div>
                <div className="md:col-span-2 space-y-1">
                   <label className="text-[8px] font-black uppercase tracking-widest text-gray-400 ml-1">Store Address (For Invoices)</label>
                   <textarea rows={2} value={settings.store_address} onChange={(e) => handleChange('store_address', e.target.value)} className="w-full bg-gray-50 border border-gray-100 rounded-lg py-1.5 px-3 outline-none focus:border-[#7A578D] text-[11px] font-black uppercase resize-none" placeholder="123, Business Park, Delhi, India" />
                </div>
             </div>
          </div>

          {/* SHIPPING & TAX */}
          <div className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm">
             <div className="flex items-center gap-2 mb-4 border-b border-gray-50 pb-2">
                <div className="w-8 h-8 bg-gray-50 rounded-lg flex items-center justify-center text-[#7A578D]">
                   <Truck size={16} />
                </div>
                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-900">Shipping & Legal</h3>
             </div>
             
             <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-1">
                   <label className="text-[8px] font-black uppercase tracking-widest text-gray-400 ml-1 text-nowrap">Free Shipping (₹)</label>
                   <input type="number" value={settings.shipping_free_threshold} onChange={(e) => handleChange('shipping_free_threshold', e.target.value)} className="w-full bg-gray-50 border border-gray-100 rounded-lg py-1.5 px-3 outline-none focus:border-[#7A578D] text-[12px] font-black" />
                </div>
                <div className="space-y-1">
                   <label className="text-[8px] font-black uppercase tracking-widest text-gray-400 ml-1">Flat Rate (₹)</label>
                   <input type="number" value={settings.shipping_flat_rate} onChange={(e) => handleChange('shipping_flat_rate', e.target.value)} className="w-full bg-gray-50 border border-gray-100 rounded-lg py-1.5 px-3 outline-none focus:border-[#7A578D] text-[12px] font-black" />
                </div>
                <div className="space-y-1">
                   <label className="text-[8px] font-black uppercase tracking-widest text-gray-400 ml-1">Tax/VAT (%)</label>
                   <input type="number" value={settings.tax_percentage} onChange={(e) => handleChange('tax_percentage', e.target.value)} className="w-full bg-gray-50 border border-gray-100 rounded-lg py-1.5 px-3 outline-none focus:border-[#7A578D] text-[12px] font-black" />
                </div>
                <div className="space-y-1">
                   <label className="text-[8px] font-black uppercase tracking-widest text-[#7A578D] ml-1 font-bold">GSTIN Number</label>
                   <input value={settings.store_gstin} onChange={(e) => handleChange('store_gstin', e.target.value)} className="w-full bg-[#7A578D]/5 border border-[#7A578D]/20 rounded-lg py-1.5 px-3 outline-none focus:border-[#7A578D] text-[12px] font-black uppercase" placeholder="GSTIN (e.g. 07AAAAA0000A1Z5)" />
                </div>
             </div>
          </div>

          {/* CMS / SOCIAL */}
          <div className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm">
             <div className="flex items-center gap-2 mb-4 border-b border-gray-50 pb-2">
                <div className="w-8 h-8 bg-gray-50 rounded-lg flex items-center justify-center text-[#7A578D]">
                   <Settings size={16} />
                </div>
                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-900">Brand Elements</h3>
             </div>
             
             <div className="space-y-4">
                <div className="space-y-1">
                   <label className="text-[8px] font-black uppercase tracking-widest text-gray-400 ml-1">Footer Copyright Text</label>
                   <textarea rows={1} value={settings.footer_text} onChange={(e) => handleChange('footer_text', e.target.value)} className="w-full bg-gray-50 border border-gray-100 rounded-lg py-1.5 px-3 outline-none focus:border-[#7A578D] text-[10px] font-black uppercase resize-none" placeholder="© 2024 ZAVIRA. ALL RIGHTS RESERVED." />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                        <label className="text-[8px] font-black uppercase tracking-widest text-gray-400 ml-1">Instagram URL</label>
                        <input value={settings.social_instagram} onChange={(e) => handleChange('social_instagram', e.target.value)} className="w-full bg-gray-50 border border-gray-100 rounded-lg py-1.5 px-3 outline-none focus:border-[#7A578D] text-[10px] font-bold tracking-tight" placeholder="https://instagram.com/..." />
                    </div>
                    <div className="space-y-1">
                        <label className="text-[8px] font-black uppercase tracking-widest text-gray-400 ml-1">WhatsApp Broadcast</label>
                        <input value={settings.social_whatsapp} onChange={(e) => handleChange('social_whatsapp', e.target.value)} className="w-full bg-gray-50 border border-gray-100 rounded-lg py-1.5 px-3 outline-none focus:border-[#7A578D] text-[10px] font-bold tracking-tight" placeholder="wa.me/..." />
                    </div>
                </div>
             </div>
          </div>
        </div>

        {/* SIDEBAR API KEYS */}
        <div className="lg:col-span-4 space-y-4">
           <div className="bg-gray-900 text-white rounded-xl p-4 shadow-xl border border-white/5 h-fit">
              <div className="flex items-center gap-2 mb-4 border-b border-white/5 pb-2">
                 <div className="w-8 h-8 bg-white/5 rounded-lg flex items-center justify-center text-emerald-400">
                    <ShieldCheck size={16} />
                 </div>
                 <h3 className="text-[9px] font-black uppercase tracking-[0.2em] text-gray-400">Security Gateways</h3>
              </div>

              <div className="space-y-4">
                 <div className="space-y-1.5">
                    <div className="flex items-center justify-between px-1">
                       <label className="text-[8px] font-black uppercase tracking-widest text-gray-500">Razorpay Key ID</label>
                       <CreditCard size={10} className="text-gray-500" />
                    </div>
                    <input type="password" value={settings.razorpay_key_id} onChange={(e) => handleChange('razorpay_key_id', e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-lg py-1.5 px-3 outline-none focus:border-emerald-500 transition-all text-[11px] font-mono" />
                 </div>

                 <div className="space-y-1.5">
                    <div className="flex items-center justify-between px-1">
                       <label className="text-[8px] font-black uppercase tracking-widest text-gray-500">Shiprocket Email</label>
                       <Truck size={10} className="text-gray-500" />
                    </div>
                    <input value={settings.shiprocket_email} onChange={(e) => handleChange('shiprocket_email', e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-lg py-1.5 px-3 outline-none focus:border-blue-500 transition-all text-[11px] font-mono lowercase" />
                 </div>

                 <div className="p-3 bg-white/5 rounded-lg border border-white/5 space-y-2">
                    <p className="text-[8px] font-black text-emerald-400 uppercase tracking-widest flex items-center gap-1.5">
                        <div className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse" />
                        Infrastructure
                    </p>
                    <div className="space-y-1.5">
                       <div className="flex items-center justify-between text-[7px] font-bold text-gray-500 uppercase tracking-tighter">
                          <span>DATABASE</span>
                          <span className="text-white font-black">POSTGRES</span>
                       </div>
                       <div className="flex items-center justify-between text-[7px] font-bold text-gray-500 uppercase tracking-tighter">
                          <span>CDN</span>
                          <span className="text-white font-black">CLOUDINARY</span>
                       </div>
                       <div className="flex items-center justify-between text-[7px] font-bold text-gray-500 uppercase tracking-tighter">
                          <span>SMS</span>
                          <span className="text-white font-black">FIREBASE</span>
                       </div>
                    </div>
                 </div>
              </div>
           </div>

           <div className="bg-white border border-gray-100 rounded-xl p-3.5 shadow-sm">
              <h4 className="text-[8px] font-black uppercase tracking-widest text-gray-900 mb-2.5 px-1 italic flex items-center gap-1.5">
                 <Info size={11} className="text-[#7A578D]" /> Quick Tips
              </h4>
              <ul className="space-y-2">
                 {[
                    'Free shipping threshold applies to final payable amount.',
                    'Razorpay ID is required for frontend handshakes.',
                    'Tax is calculated as a flat percentage of base price.'
                 ].map((tip, i) => (
                    <li key={i} className="flex gap-1.5 text-[7px] font-bold text-gray-500 leading-relaxed uppercase tracking-tight">
                       <ChevronRight size={9} className="shrink-0 text-[#7A578D] mt-0.5" />
                       {tip}
                    </li>
                 ))}
              </ul>
           </div>
        </div>

      </form>
    </div>
  );
};

export default StoreSettings;
