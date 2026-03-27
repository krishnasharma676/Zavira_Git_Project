
import { useState, useEffect, useRef } from 'react';
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

  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      fetchSettings();
    }
  }, []);

  const handleChange = (key: string, value: string) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  // GSTIN format: 2 digit state code + 10 char PAN + 1 digit + Z + 1 char
  const isValidGstin = (gstin: string) => {
    if (!gstin) return true; // Empty is fine (optional)
    return /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/.test(gstin.toUpperCase());
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    // Validate GSTIN before saving
    if (settings.store_gstin && !isValidGstin(settings.store_gstin)) {
      toast.error('Invalid GSTIN format! Example: 07AABCU9603R1ZX');
      return;
    }
    setSaving(true);
    try {
      await api.patch('/settings', { ...settings, store_gstin: settings.store_gstin.toUpperCase() });
      toast.success('Store configuration updated');
    } catch (error) {
      toast.error('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return (
    <div className="min-h-[200px] flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-[#7A578D] border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="space-y-2 animate-in fade-in duration-500 max-w-[1600px]">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-gray-100 pb-4 gap-2">
        <div>
          <h1 className="text-lg font-bold text-gray-900 tracking-tight">Store Settings</h1>
          <p className="text-gray-500 text-xs mt-1">Configure global store preferences, API keys, and identity details.</p>
        </div>
        <button 
          onClick={handleSave}
          disabled={saving}
          className="bg-black text-white px-2 py-1 rounded-sm text-xs font-bold flex items-center gap-2 hover:bg-[#7A578D] transition-all shadow-md active:scale-95 disabled:opacity-50"
        >
          {saving ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <Save size={18} />}
          <span>{saving ? 'SAVING...' : 'SAVE CONFIGURATION'}</span>
        </button>
      </header>

      <form onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-12 gap-2 pb-12">
        
        <div className="lg:col-span-8 space-y-2">
          
          {/* GENERAL INFO */}
          <div className="bg-white border border-gray-100 rounded-sm p-2 shadow-sm">
             <div className="flex items-center gap-2 mb-6 border-b border-gray-100 pb-4">
                <div className="w-6 h-6 bg-[#7A578D]/5 rounded-sm flex items-center justify-center text-[#7A578D]">
                   <Globe size={20} />
                </div>
                <h3 className="text-base font-bold text-gray-900">General Identity</h3>
             </div>
             
             <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                <div className="space-y-2">
                   <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Store Name</label>
                   <input value={settings.store_name} onChange={(e) => handleChange('store_name', e.target.value)} className="w-full bg-gray-50 border border-gray-200 rounded-sm py-1 px-2 outline-none focus:ring-2 focus:ring-[#7A578D]/20 focus:border-[#7A578D] text-xs" />
                </div>
                <div className="space-y-2">
                   <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Support Email</label>
                   <div className="relative">
                      <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input type="email" value={settings.store_email} onChange={(e) => handleChange('store_email', e.target.value)} className="w-full bg-gray-50 border border-gray-200 rounded-sm py-1 pl-11 pr-4 outline-none focus:ring-2 focus:ring-[#7A578D]/20 focus:border-[#7A578D] text-xs lowercase" placeholder="help@zavira.com" />
                   </div>
                </div>
                <div className="space-y-2">
                   <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Support Contact</label>
                   <div className="relative">
                      <Phone size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input value={settings.store_phone} onChange={(e) => handleChange('store_phone', e.target.value)} className="w-full bg-gray-50 border border-gray-200 rounded-sm py-1 pl-11 pr-4 outline-none focus:ring-2 focus:ring-[#7A578D]/20 focus:border-[#7A578D] text-xs" placeholder="+91 ..." />
                   </div>
                </div>
                <div className="md:col-span-2 space-y-2">
                   <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Store Address (For Invoices)</label>
                   <textarea rows={2} value={settings.store_address} onChange={(e) => handleChange('store_address', e.target.value)} className="w-full bg-gray-50 border border-gray-200 rounded-sm py-1 px-2 outline-none focus:ring-2 focus:ring-[#7A578D]/20 focus:border-[#7A578D] text-xs resize-none" placeholder="123, Business Park, Delhi, India" />
                </div>
             </div>
          </div>

          {/* SHIPPING & TAX */}
          <div className="bg-white border border-gray-100 rounded-sm p-2 shadow-sm">
             <div className="flex items-center gap-2 mb-6 border-b border-gray-100 pb-4">
                <div className="w-6 h-6 bg-[#7A578D]/5 rounded-sm flex items-center justify-center text-[#7A578D]">
                   <Truck size={20} />
                </div>
                <h3 className="text-base font-bold text-gray-900">Shipping & Legal</h3>
             </div>
             
             <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                <div className="space-y-2">
                   <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Flat Rate (₹)</label>
                   <input type="number" value={settings.shipping_flat_rate} onChange={(e) => handleChange('shipping_flat_rate', e.target.value)} className="w-full bg-gray-50 border border-gray-200 rounded-sm py-1 px-2 outline-none focus:ring-2 focus:ring-[#7A578D]/20 focus:border-[#7A578D] text-xs font-bold" />
                </div>
                <div className="space-y-2">
                   <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Tax / VAT (%)</label>
                   <input type="number" value={settings.tax_percentage} onChange={(e) => handleChange('tax_percentage', e.target.value)} className="w-full bg-gray-50 border border-gray-200 rounded-sm py-1 px-2 outline-none focus:ring-2 focus:ring-[#7A578D]/20 focus:border-[#7A578D] text-xs font-bold" />
                </div>
                 <div className="space-y-2">
                    <label className="text-xs font-bold text-[#7A578D] uppercase tracking-wider ml-1">GSTIN Number</label>
                    <input
                      value={settings.store_gstin}
                      onChange={(e) => handleChange('store_gstin', e.target.value.toUpperCase())}
                      maxLength={15}
                      className={`w-full bg-[#7A578D]/5 border rounded-sm py-1 px-2 outline-none focus:ring-2 text-xs font-bold uppercase transition-all ${
                        settings.store_gstin && !isValidGstin(settings.store_gstin)
                          ? 'border-red-400 focus:ring-red-200 bg-red-50'
                          : 'border-[#7A578D]/20 focus:ring-[#7A578D]/20 focus:border-[#7A578D]'
                      }`}
                      placeholder="e.g. 07AABCU9603R1ZX"
                    />
                    {/* Live validation feedback */}
                    {settings.store_gstin ? (
                      isValidGstin(settings.store_gstin) ? (
                        <p className="text-xs font-bold text-green-600 ml-1 flex items-center gap-1">✅ Valid GSTIN format</p>
                      ) : (
                        <p className="text-xs font-bold text-red-500 ml-1">❌ Invalid format — 15 chars needed (e.g. 07AABCU9603R1ZX)</p>
                      )
                    ) : (
                      <p className="text-xs text-gray-400 ml-1">Optional — Leave blank if not registered yet</p>
                    )}
                 </div>
             </div>
          </div>

          {/* CMS / SOCIAL */}
          <div className="bg-white border border-gray-100 rounded-sm p-2 shadow-sm">
             <div className="flex items-center gap-2 mb-6 border-b border-gray-100 pb-4">
                <div className="w-6 h-6 bg-[#7A578D]/5 rounded-sm flex items-center justify-center text-[#7A578D]">
                   <Settings size={20} />
                </div>
                <h3 className="text-base font-bold text-gray-900">Brand Elements</h3>
             </div>
             
             <div className="space-y-2">
                <div className="space-y-2">
                   <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Footer Copyright Text</label>
                   <textarea rows={1} value={settings.footer_text} onChange={(e) => handleChange('footer_text', e.target.value)} className="w-full bg-gray-50 border border-gray-200 rounded-sm py-1 px-2 outline-none focus:ring-2 focus:ring-[#7A578D]/20 focus:border-[#7A578D] text-xs resize-none" placeholder="© 2024 ZAVIRA. ALL RIGHTS RESERVED." />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Instagram URL</label>
                        <input value={settings.social_instagram} onChange={(e) => handleChange('social_instagram', e.target.value)} className="w-full bg-gray-50 border border-gray-200 rounded-sm py-1 px-2 outline-none focus:ring-2 focus:ring-[#7A578D]/20 focus:border-[#7A578D] text-xs font-medium" placeholder="https://instagram.com/..." />
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">WhatsApp Broadcast</label>
                        <input value={settings.social_whatsapp} onChange={(e) => handleChange('social_whatsapp', e.target.value)} className="w-full bg-gray-50 border border-gray-200 rounded-sm py-1 px-2 outline-none focus:ring-2 focus:ring-[#7A578D]/20 focus:border-[#7A578D] text-xs font-medium" placeholder="wa.me/..." />
                    </div>
                </div>
             </div>
          </div>
        </div>

        {/* SIDEBAR API KEYS */}
        <div className="lg:col-span-4 space-y-2">
           <div className="bg-gray-900 text-white rounded-sm p-2 shadow-xl border border-white/5 h-fit">
              <div className="flex items-center gap-2 mb-6 border-b border-white/10 pb-4">
                 <div className="w-6 h-6 bg-white/10 rounded-sm flex items-center justify-center text-emerald-400">
                    <ShieldCheck size={20} />
                 </div>
                 <h3 className="text-xs font-bold uppercase tracking-widest text-gray-300">Security Gateways</h3>
              </div>

              <div className="space-y-2">
                 <div className="space-y-2">
                    <div className="flex items-center justify-between px-1">
                       <label className="text-xs font-bold uppercase tracking-wider text-gray-400">Razorpay Key ID</label>
                       <CreditCard size={14} className="text-gray-500" />
                    </div>
                    <input type="password" value={settings.razorpay_key_id} onChange={(e) => handleChange('razorpay_key_id', e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-sm py-1 px-2 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all text-xs font-mono" />
                 </div>

                 <div className="space-y-2">
                    <div className="flex items-center justify-between px-1">
                       <label className="text-xs font-bold uppercase tracking-wider text-gray-400">Shiprocket Email</label>
                       <Truck size={14} className="text-gray-500" />
                    </div>
                    <input value={settings.shiprocket_email} onChange={(e) => handleChange('shiprocket_email', e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-sm py-1 px-2 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all text-xs font-mono lowercase" />
                 </div>

                 <div className="p-2 bg-white/5 rounded-sm border border-white/5 space-y-1 mt-4">
                    <p className="text-xs font-bold text-emerald-400 uppercase tracking-widest flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        Infrastructure
                    </p>
                    <div className="space-y-2">
                       <div className="flex items-center justify-between text-xs font-bold text-gray-500 uppercase tracking-wider">
                          <span>DATABASE</span>
                          <span className="text-white">POSTGRES</span>
                       </div>
                       <div className="flex items-center justify-between text-xs font-bold text-gray-500 uppercase tracking-wider">
                          <span>CDN</span>
                          <span className="text-white">CLOUDINARY</span>
                       </div>
                       <div className="flex items-center justify-between text-xs font-bold text-gray-500 uppercase tracking-wider">
                          <span>SMS</span>
                          <span className="text-white">FIREBASE</span>
                       </div>
                    </div>
                 </div>
              </div>
           </div>

           <div className="bg-white border border-gray-100 rounded-sm p-2 shadow-sm">
              <h4 className="text-xs font-bold uppercase tracking-wider text-gray-900 mb-3 px-1 flex items-center gap-2">
                 <Info size={14} className="text-[#7A578D]" /> Quick Tips
              </h4>
              <ul className="space-y-1">
                 {[
                    'Razorpay ID is required for frontend handshakes.',
                    'Tax is calculated as a flat percentage of base price.'
                 ].map((tip, i) => (
                    <li key={i} className="flex gap-2 text-xs font-medium text-gray-500 leading-relaxed">
                       <ChevronRight size={14} className="shrink-0 text-[#7A578D] mt-0.5" />
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
