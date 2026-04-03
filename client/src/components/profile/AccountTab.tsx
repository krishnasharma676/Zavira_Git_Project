import { motion } from 'framer-motion';
import { MapPin, Trash2, CheckCircle, Plus } from 'lucide-react';
import AddressModal from './AddressModal';

interface AccountTabProps {
  user: any;
  addresses: any[];
  onDeleteAddress: (id: string) => void;
  onSetDefault: (id: string) => void;
  onAddAddress: (data: any) => Promise<void>;
  isAddressModalOpen: boolean;
  setIsAddressModalOpen: (open: boolean) => void;
}

const AccountTab = ({ 
  user, 
  addresses, 
  onDeleteAddress, 
  onSetDefault, 
  onAddAddress,
  isAddressModalOpen,
  setIsAddressModalOpen
}: AccountTabProps) => {
  return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-8">
      {/* User Info */}
      <section className="space-y-4">
        <h2 className="text-xl font-sans font-black mb-6 uppercase tracking-tighter italic">Personal <span className="text-[#7A578D]">Aura_</span></h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Full Name</label>
            <div className="bg-gray-50 dark:bg-white/5 p-4 rounded-2xl border border-gray-100 dark:border-white/10 text-[11px] font-black uppercase tracking-wider text-gray-900 dark:text-white">
              {user.name}
            </div>
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Email Address</label>
            <div className="bg-gray-50 dark:bg-white/5 p-4 rounded-2xl border border-gray-100 dark:border-white/10 text-[11px] font-black uppercase tracking-wider text-gray-900 dark:text-white">
              {user.email}
            </div>
          </div>
        </div>
      </section>

      {/* Addresses */}
      <section className="space-y-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-sans font-black uppercase tracking-tighter italic">Delivery <span className="text-[#7A578D]">Coordinates_</span></h2>
          <button 
            onClick={() => setIsAddressModalOpen(true)}
            className="bg-black dark:bg-white text-white dark:text-black p-2 rounded-xl hover:bg-[#7A578D] dark:hover:bg-[#7A578D] dark:hover:text-white transition-all shadow-lg"
          >
            <Plus size={18} />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {addresses.map((addr) => (
            <div key={addr.id} className={`group relative bg-white dark:bg-white/[0.02] p-5 rounded-3xl border transition-all ${addr.isDefault ? 'border-[#7A578D] shadow-lg shadow-[#7A578D]/5' : 'border-gray-100 dark:border-white/10 hover:border-gray-200'}`}>
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-2">
                  <div className={`p-2 rounded-xl ${addr.isDefault ? 'bg-[#7A578D] text-white' : 'bg-gray-100 dark:bg-white/5 text-gray-400'}`}>
                    <MapPin size={14} />
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-widest">{addr.type}</span>
                </div>
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  {!addr.isDefault && (
                    <button onClick={() => onSetDefault(addr.id)} className="p-2 text-gray-400 hover:text-green-500 transition-colors">
                      <CheckCircle size={14} />
                    </button>
                  )}
                  <button onClick={() => onDeleteAddress(addr.id)} className="p-2 text-gray-400 hover:text-red-500 transition-colors">
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-[11px] font-black text-gray-900 dark:text-white uppercase">{addr.name}</p>
                <p className="text-[10px] font-bold text-gray-500 uppercase leading-relaxed">{addr.street}, {addr.city}, {addr.state} - {addr.pincode}</p>
                <p className="text-[10px] font-black text-[#7A578D] mt-2">{addr.phone}</p>
              </div>
              {addr.isDefault && (
                <span className="absolute top-4 right-4 bg-[#7A578D] text-white text-[7px] font-black px-2 py-0.5 rounded-full uppercase tracking-tighter">Default</span>
              )}
            </div>
          ))}
          {addresses.length === 0 && (
            <div className="col-span-full py-12 text-center bg-gray-50 dark:bg-white/[0.01] rounded-3xl border border-dashed border-gray-200 dark:border-white/10">
              <MapPin className="mx-auto text-gray-200 dark:text-white/5 mb-2" size={32} />
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">No coordinates locked_</p>
            </div>
          )}
        </div>
      </section>

      <div className="pt-6 border-t border-gray-50 dark:border-white/5">
        <p className="text-[10px] text-gray-400 font-black mb-4 uppercase tracking-widest italic">Encrypted // Verification Required</p>
        <button className="bg-black dark:bg-white dark:text-black text-white px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-[#7A578D] dark:hover:bg-[#7A578D] dark:hover:text-white transition-all shadow-xl shadow-black/10">Update Security Key</button>
      </div>

      <AddressModal 
        isOpen={isAddressModalOpen}
        onClose={() => setIsAddressModalOpen(false)}
        onSubmit={onAddAddress}
      />
    </motion.div>
  );
};

export default AccountTab;
