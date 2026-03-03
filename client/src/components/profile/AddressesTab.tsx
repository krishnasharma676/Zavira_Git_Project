import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';
import AddressCard from './AddressCard';

interface AddressTabProps {
  addresses: any[];
  handleSetDefaultAddress: (id: string) => void;
  handleDeleteAddress: (id: string) => void;
  setIsAddressModalOpen: (isOpen: boolean) => void;
}

const AddressesTab = ({ addresses, handleSetDefaultAddress, handleDeleteAddress, setIsAddressModalOpen }: AddressTabProps) => {
  return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
      <h2 className="text-xl font-sans font-black mb-6 uppercase tracking-tighter">My <span className="text-[#7A578D]">Addresses_</span></h2>
      <div className="grid md:grid-cols-2 gap-4">
        {addresses.map((address) => (
          <AddressCard 
            key={address.id}
            address={address}
            handleSetDefaultAddress={handleSetDefaultAddress}
            handleDeleteAddress={handleDeleteAddress}
          />
        ))}
        <button 
          onClick={() => setIsAddressModalOpen(true)}
          className="bg-gray-50/50 dark:bg-white/[0.01] border border-gray-100 dark:border-white/10 p-6 rounded-2xl border-dashed border-2 flex flex-col items-center justify-center text-center group cursor-pointer hover:border-[#7A578D]/50 transition-all min-h-[160px]"
        >
          <div className="w-10 h-10 bg-gray-100 dark:bg-white/5 rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
            <Plus size={18} className="text-gray-400 group-hover:text-[#7A578D]" />
          </div>
          <p className="text-[10px] font-black uppercase tracking-[0.1em] text-gray-400 mb-2">New Address</p>
          <span className="text-[#7A578D] font-black text-[9px] uppercase tracking-widest bg-[#7A578D]/5 px-3 py-1 rounded-full border border-[#7A578D]/10">
            Add New
          </span>
        </button>
      </div>
    </motion.div>
  );
};

export default AddressesTab;
