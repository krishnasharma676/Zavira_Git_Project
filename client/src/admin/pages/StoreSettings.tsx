
import { useState, useEffect, useRef } from 'react';
import { Save, Settings, ShieldCheck, Truck, Globe, Mail, Phone, CreditCard, ChevronRight, Info, Activity, Database, Cloud, Zap, Percent, MapPin, Hash } from 'lucide-react';
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
    free_shipping_threshold: '1000',
    cod_charge: '39',
    shiprocket_pickup_location: 'Primary',
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
      toast.error('Nexus_NULL: FAILED_TO_SYNC_GLOBAL_PREFERENCES');
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

  const isValidGstin = (gstin: string) => {
    if (!gstin) return true;
    return /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/.test(gstin.toUpperCase());
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (settings.store_gstin && !isValidGstin(settings.store_gstin)) {
      toast.error('INVALID_GSTIN_Nexus_FORMAT');
      return;
    }
    setSaving(true);
    try {
      await api.patch('/settings', { ...settings, store_gstin: settings.store_gstin.toUpperCase() });
      toast.success('STORE_CONFIGURATION_Nexus_SYNCHRONIZED');
    } catch (error) {
      toast.error('FAILED_TO_COMMIT_Nexus_UPDATES');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return (
    <div className="min-h-[400px] flex items-center justify-center animate-pulse">
      <div className="w-10 h-10 border-4 border-[#7A578D] border-t-transparent rounded-full animate-spin shadow-xl shadow-[#7A578D]/20" />
    </div>
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-500 max-w-[1600px] pb-24">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-gray-100 pb-8 gap-4">
        <div>
           <h1 className="text-2xl font-black uppercase tracking-tighter text-gray-900 leading-none">Global Config_Nexus</h1>
           <div className="flex items-center gap-3 mt-3">
              <div className="flex items-center gap-2 bg-[#7A578D]/5 px-2 py-1 rounded-sm border border-[#7A578D]/10">
                 <span className="w-1.5 h-1.5 rounded-full bg-[#7A578D] animate-pulse shadow-lg shadow-[#7A578D]/50"></span>
                 <span className="text-[9px] font-black uppercase tracking-widest text-[#7A578D] opacity-70 italic">Architectural Core Preferences Active</span>
              </div>
           </div>
        </div>
        <button 
          onClick={handleSave}
          disabled={saving}
          className="bg-black text-white h-12 px-8 rounded-sm text-[10px] font-black uppercase tracking-[0.4em] flex items-center gap-4 hover:bg-[#7A578D] transition-all shadow-2xl shadow-black/20 active:scale-95 border-b-4 border-black/30 disabled:opacity-50 group"
        >
          {saving ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <Save size={22} className="group-hover:-translate-y-0.5 transition-transform" />}
          <span>{saving ? 'SYNCHRONIZING...' : 'COMMIT_GLOBAL_Nexus'}</span>
        </button>
      </header>

      <form onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        <div className="lg:col-span-8 space-y-8">
          
          {/* GENERAL IDENTITY Nexus */}
          <div className="bg-white border border-gray-100 rounded-sm p-8 shadow-sm relative group overflow-hidden">
             <div className="absolute top-0 right-0 p-8 opacity-[0.02] group-hover:opacity-[0.05] transition-opacity">
                <Globe size={200} />
             </div>
             <header className="flex items-center gap-4 mb-10 border-b border-gray-50 pb-6 relative z-10">
                <div className="p-3 bg-black rounded-sm text-white shadow-xl">
                   <Globe size={24} />
                </div>
                <div>
                   <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest">Master Identity Archetype</h3>
                   <span className="text-[9px] font-black text-gray-400 uppercase tracking-[0.3em]">Core Brand Manifestation Hub</span>
                </div>
             </header>
             
             <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
                <div className="space-y-3">
                   <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Store Archetype Name</label>
                   <input 
                      value={settings.store_name} 
                      onChange={(e) => handleChange('store_name', e.target.value)} 
                      className="w-full bg-gray-50/50 border border-gray-200 rounded-sm py-4 px-5 outline-none focus:ring-4 focus:ring-[#7A578D]/5 focus:border-[#7A578D]/40 text-xs font-black uppercase tracking-widest transition-all shadow-inner" 
                   />
                </div>
                <div className="space-y-3">
                   <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Support Broadcast Email</label>
                   <div className="relative group/input">
                      <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within/input:text-[#7A578D] transition-colors" />
                      <input 
                         type="email" 
                         value={settings.store_email} 
                         onChange={(e) => handleChange('store_email', e.target.value)} 
                         className="w-full bg-gray-50/50 border border-gray-200 rounded-sm py-4 pl-12 pr-5 outline-none focus:ring-4 focus:ring-[#7A578D]/5 focus:border-[#7A578D]/40 text-xs font-mono font-black text-[#7A578D] lowercase tracking-tighter transition-all shadow-inner" 
                         placeholder="nexus@zavira.com" 
                      />
                   </div>
                </div>
                <div className="space-y-3">
                   <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Support Command Phone</label>
                   <div className="relative group/input">
                      <Phone size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within/input:text-[#7A578D] transition-colors" />
                      <input 
                         value={settings.store_phone} 
                         onChange={(e) => handleChange('store_phone', e.target.value)} 
                         className="w-full bg-gray-50/50 border border-gray-200 rounded-sm py-4 pl-12 pr-5 outline-none focus:ring-4 focus:ring-[#7A578D]/5 focus:border-[#7A578D]/40 text-xs font-black tracking-widest transition-all shadow-inner" 
                         placeholder="+91_Nexus_CONTACT" 
                      />
                   </div>
                </div>
                <div className="md:col-span-2 space-y-3">
                   <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                       <MapPin size={12}/> Archival Physical Address (Fiscal Invoices)
                   </label>
                   <textarea 
                      rows={3} 
                      value={settings.store_address} 
                      onChange={(e) => handleChange('store_address', e.target.value)} 
                      className="w-full bg-gray-50/50 border border-gray-200 rounded-sm py-4 px-5 outline-none focus:ring-4 focus:ring-[#7A578D]/5 focus:border-[#7A578D]/40 text-xs font-bold text-gray-700 resize-none transition-all shadow-inner placeholder:italic leading-relaxed tracking-tighter" 
                      placeholder="Structure the primary operational physical hub..." 
                   />
                </div>
             </div>
          </div>

          {/* SHIPPING & FISCAL Nexus */}
          <div className="bg-white border border-gray-100 rounded-sm p-8 shadow-sm relative group overflow-hidden">
             <div className="absolute bottom-0 right-0 p-8 opacity-[0.02] group-hover:opacity-[0.05] transition-opacity">
                <Truck size={200} />
             </div>
             <header className="flex items-center gap-4 mb-10 border-b border-gray-50 pb-6 relative z-10">
                <div className="p-3 bg-[#7A578D] rounded-sm text-white shadow-xl">
                   <Truck size={24} />
                </div>
                <div>
                   <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest">Logistics & Compliance Hub</h3>
                   <span className="text-[9px] font-black text-gray-400 uppercase tracking-[0.3em]">Fiscal Liabilities & Fulfillment Protocols</span>
                </div>
             </header>
             
             <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
                <div className="space-y-3">
                   <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Flat Shipping Liability (₹)</label>
                   <div className="relative">
                      <input type="number" value={settings.shipping_flat_rate} onChange={(e) => handleChange('shipping_flat_rate', e.target.value)} className="w-full bg-gray-50/50 border border-gray-200 rounded-sm py-4 px-5 outline-none focus:ring-4 focus:ring-[#7A578D]/5 focus:border-[#7A578D]/40 text-xs font-black tracking-tighter shadow-inner" />
                       <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300 font-black text-[9px]">INR_UNIT</div>
                   </div>
                </div>
                <div className="space-y-3">
                   <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Quasi-Free Threshold Above (₹)</label>
                   <div className="relative">
                      <input type="number" value={settings.free_shipping_threshold} onChange={(e) => handleChange('free_shipping_threshold', e.target.value)} className="w-full bg-[#7A578D]/5 border border-[#7A578D]/10 rounded-sm py-4 px-5 outline-none focus:ring-4 focus:ring-[#7A578D]/20 focus:border-[#7A578D] text-xs font-black tracking-tighter text-[#7A578D] shadow-inner" placeholder="1000" />
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 text-[#7A578D]/40 font-black text-[9px]">Nexus_LMT</div>
                   </div>
                </div>
                <div className="space-y-3">
                   <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                       <Zap size={12}/> COD Command Charge (₹)
                   </label>
                   <input type="number" value={settings.cod_charge} onChange={(e) => handleChange('cod_charge', e.target.value)} className="w-full bg-gray-50/50 border border-gray-200 rounded-sm py-4 px-5 outline-none focus:ring-4 focus:ring-[#7A578D]/5 focus:border-[#7A578D]/40 text-xs font-black tracking-tighter shadow-inner" />
                </div>
                <div className="space-y-3">
                   <label className="text-[10px] font-black text-orange-600 uppercase tracking-widest ml-1 flex items-center gap-2">
                       <MapPin size={12}/> Shiprocket Pickup_Nexus_Hub ⚠️
                   </label>
                   <input
                     value={settings.shiprocket_pickup_location}
                     onChange={(e) => handleChange('shiprocket_pickup_location', e.target.value)}
                     className="w-full bg-orange-50 border border-orange-100 rounded-sm py-4 px-5 outline-none focus:ring-4 focus:ring-orange-200 focus:border-orange-400 text-xs font-black uppercase tracking-widest shadow-inner placeholder:italic"
                     placeholder="e.g. PRIMARY_Nexus"
                   />
                   <p className="text-[9px] text-orange-500 font-bold ml-1 uppercase italic tracking-tighter animate-pulse">Exact match required with Shiprocket administrative hub</p>
                </div>
                <div className="md:col-span-2 space-y-3">
                    <label className="text-[10px] font-black text-[#7A578D] uppercase tracking-widest ml-1 flex items-center gap-2">
                       <Hash size={12}/> Master GSTIN_Nexus Compliance
                    </label>
                    <div className="relative group/gstin">
                       <input
                         value={settings.store_gstin}
                         onChange={(e) => handleChange('store_gstin', e.target.value.toUpperCase())}
                         maxLength={15}
                         className={`w-full bg-white border rounded-sm py-5 px-6 outline-none focus:ring-8 text-sm font-mono font-black uppercase tracking-[0.2em] transition-all shadow-2xl ${
                           settings.store_gstin && !isValidGstin(settings.store_gstin)
                             ? 'border-red-400 focus:ring-red-500/10 focus:border-red-500'
                             : 'border-gray-100 focus:ring-[#7A578D]/5 focus:border-[#7A578D]'
                         }`}
                         placeholder="07AABCU9603R1ZX"
                       />
                       <div className="mt-4 flex items-center justify-between px-2">
                          {settings.store_gstin ? (
                            isValidGstin(settings.store_gstin) ? (
                              <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest flex items-center gap-2">
                                 <ShieldCheck size={14}/> ARTIFACT_Nexus: VALID_COMPLIANCE_STATE
                              </p>
                            ) : (
                              <p className="text-[10px] font-black text-red-500 uppercase tracking-widest flex items-center gap-2 animate-pulse">
                                 <Activity size={14}/> Nexus_NULL: INVALID_COMPLIANCE_SYNTAX
                              </p>
                            )
                          ) : (
                            <p className="text-[9px] text-gray-400 font-black uppercase tracking-widest opacity-50 italic">Archive empty — Optional temporal compliance</p>
                          )}
                          <span className="text-[10px] font-mono text-gray-300 font-black">{settings.store_gstin?.length || 0}/15</span>
                       </div>
                    </div>
                 </div>
             </div>
          </div>

          {/* BRAND NARRATIVE Nexus */}
          <div className="bg-white border border-gray-100 rounded-sm p-8 shadow-sm group overflow-hidden relative">
             <header className="flex items-center gap-4 mb-10 border-b border-gray-50 pb-6 relative z-10">
                <div className="p-3 bg-gray-900 rounded-sm text-white shadow-xl">
                   <Settings size={24} />
                </div>
                <div>
                   <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest">Brand Narrative Elements</h3>
                   <span className="text-[9px] font-black text-gray-400 uppercase tracking-[0.3em]">Customer-Facing Communication Modules</span>
                </div>
             </header>
             
             <div className="space-y-8 relative z-10">
                <div className="space-y-3">
                   <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Global Terminal Copyright Nexus</label>
                   <textarea rows={1} value={settings.footer_text} onChange={(e) => handleChange('footer_text', e.target.value)} className="w-full bg-gray-50/50 border border-gray-200 rounded-sm py-4 px-5 outline-none focus:ring-4 focus:ring-[#7A578D]/5 focus:border-[#7A578D]/40 text-xs font-black uppercase tracking-widest resize-none shadow-inner" placeholder="© 2024 ZAVIRA. ALL RIGHTS RESERVED." />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-3">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Instagram Social Artifact hub</label>
                        <input value={settings.social_instagram} onChange={(e) => handleChange('social_instagram', e.target.value)} className="w-full bg-gray-50/50 border border-gray-200 rounded-sm py-4 px-5 outline-none focus:ring-4 focus:ring-[#7A578D]/5 focus:border-[#7A578D]/40 text-xs font-black tracking-tighter" placeholder="https://instagram.com/hub_nexus" />
                    </div>
                    <div className="space-y-3">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">WhatsApp Archive Broadcast</label>
                        <input value={settings.social_whatsapp} onChange={(e) => handleChange('social_whatsapp', e.target.value)} className="w-full bg-gray-50/50 border border-gray-200 rounded-sm py-4 px-5 outline-none focus:ring-4 focus:ring-[#7A578D]/5 focus:border-[#7A578D]/40 text-xs font-black tracking-tighter" placeholder="wa.me/broadcast_nexus" />
                    </div>
                </div>
             </div>
          </div>
        </div>

        {/* SECURITY & INFRASTRUCTURE GATEWAY */}
        <div className="lg:col-span-4 space-y-8">
           <div className="bg-gray-900 border border-black rounded-sm p-10 shadow-2xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-10 opacity-5 group-hover:opacity-10 transition-opacity rotate-12">
                 <ShieldCheck size={160} className="text-white" />
              </div>
              <header className="flex items-center gap-5 mb-12 border-b border-white/5 pb-8 relative z-10">
                 <div className="p-3 bg-white/5 rounded-sm text-emerald-400 shadow-2xl border border-white/10 ring-4 ring-white/5">
                    <ShieldCheck size={28} />
                 </div>
                 <div>
                    <h3 className="text-sm font-black uppercase tracking-[0.4em] text-white">Security Gateways</h3>
                    <span className="text-[8px] font-black text-white/30 uppercase tracking-[0.5em] mt-1 block italic animate-pulse">Secure Credential Nexus</span>
                 </div>
              </header>

              <div className="space-y-10 relative z-10">
                 <div className="space-y-4 group/input">
                    <div className="flex items-center justify-between px-1">
                       <label className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40 group-focus-within/input:text-emerald-400 transition-colors">Razorpay Gateway Key</label>
                       <CreditCard size={14} className="text-white/20" />
                    </div>
                    <input type="password" value={settings.razorpay_key_id} onChange={(e) => handleChange('razorpay_key_id', e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-sm py-5 px-6 outline-none focus:border-emerald-500 focus:ring-8 focus:ring-emerald-500/10 transition-all text-sm font-mono text-white tracking-[0.2em] shadow-inner" placeholder="Nexus_SECRET_KEY" />
                 </div>

                 <div className="space-y-4 group/input">
                    <div className="flex items-center justify-between px-1">
                       <label className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40 group-focus-within/input:text-blue-400 transition-colors">Shiprocket Command Authenticator</label>
                       <Truck size={14} className="text-white/20" />
                    </div>
                    <input value={settings.shiprocket_email} onChange={(e) => handleChange('shiprocket_email', e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-sm py-5 px-6 outline-none focus:border-blue-500 focus:ring-8 focus:ring-blue-500/10 transition-all text-sm font-mono text-white/70 lowercase tracking-tighter" placeholder="nexus_auth@shiprocket.hub" />
                 </div>

                 <div className="p-6 bg-white/5 rounded-sm border border-white/5 space-y-6 mt-12 shadow-2xl">
                    <header className="flex items-center justify-between">
                       <p className="text-[10px] font-black text-emerald-400 uppercase tracking-[0.4em] flex items-center gap-3">
                           <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-lg shadow-emerald-500/50" />
                           Infrastructure
                       </p>
                       <div className="text-[8px] font-black text-white/20 uppercase tracking-widest">Global Meta_Nexus</div>
                    </header>
                    <div className="space-y-4">
                       {[
                         { label: 'DATABASE_Nexus', value: 'POSTGRES_Artifact', icon: Database },
                         { label: 'ASSET_CDN_Nexus', value: 'CLOUDINARY_Archive', icon: Cloud },
                         { label: 'MESSAGE_BROKER', value: 'FIREBASE_Nexus', icon: Zap }
                       ].map((item, i) => (
                         <div key={i} className="flex items-center justify-between group/infra overflow-hidden">
                            <span className="text-[9px] font-black text-white/20 uppercase tracking-[0.2em] group-hover/infra:text-white/40 transition-colors flex items-center gap-2">
                               <item.icon size={10} /> {item.label}
                            </span>
                            <span className="text-[10px] font-black text-white uppercase tracking-widest">{item.value}</span>
                         </div>
                       ))}
                    </div>
                 </div>
              </div>
           </div>

           <div className="bg-white border border-gray-100 rounded-sm p-8 shadow-sm">
              <header className="flex items-center gap-4 border-b border-gray-50 pb-5 mb-6">
                 <div className="p-2 bg-gray-50 rounded-sm text-gray-400">
                    <Info size={18} />
                 </div>
                 <h4 className="text-[11px] font-black uppercase tracking-[0.3em] text-gray-900">Nexus Configuration Manual</h4>
              </header>
              <ul className="space-y-4">
                 {[
                    'Razorpay key ID is mandatory for secure financial handshakes.',
                    'Taxations are calculated as flat temporal liabilities against base artifact costs.',
                    'Global free shipping threshold overrides local artifact protocols.',
                    'Pickup location must align with Shiprocket administrative lattice.'
                 ].map((tip, i) => (
                    <li key={i} className="flex gap-4 group/tip">
                       <ChevronRight size={16} className="shrink-0 text-[#7A578D] mt-0.5 group-hover:translate-x-1 transition-transform" />
                       <p className="text-[11px] font-bold text-gray-500 leading-relaxed uppercase tracking-widest group-hover:text-gray-900 transition-colors">{tip}</p>
                    </li>
                 ))}
              </ul>
              <div className="mt-8 pt-6 border-t border-gray-50">
                 <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-sm border border-gray-100 opacity-50">
                    <Activity size={14} className="text-[#7A578D] animate-pulse"/>
                    <span className="text-[8px] font-black text-gray-400 uppercase tracking-widest">Global Preferences Sync 100% Correct</span>
                 </div>
              </div>
           </div>
        </div>

      </form>
    </div>
  );
};

export default StoreSettings;
