import { motion } from 'framer-motion';
import { MapPin, Plus, CheckCircle } from 'lucide-react';

interface AddressSectionProps {
  addresses: any[];
  selectedAddressId: string;
  setSelectedAddressId: (id: string) => void;
  setIsAddressModalOpen: (isOpen: boolean) => void;
}

const AddressSection = ({ addresses, selectedAddressId, setSelectedAddressId, setIsAddressModalOpen }: AddressSectionProps) => {
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-10">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-[11px] font-black uppercase tracking-widest text-gray-400">Available Nodes</h3>
          <button 
            onClick={() => setIsAddressModalOpen(true)}
            className="text-[9px] font-black uppercase tracking-widest text-[#7A578D] flex items-center space-x-1 hover:underline"
          >
            <Plus size={12} />
            <span>New Coordinates</span>
          </button>
        </div>

        {addresses.length > 0 ? (
          <div className="grid grid-cols-1 gap-4">
            {addresses.map((address) => (
              <div 
                key={address.id}
                onClick={() => setSelectedAddressId(address.id)}
                className={`p-6 rounded-2xl border cursor-pointer transition-all ${
                  selectedAddressId === address.id 
                    ? 'border-[#7A578D] bg-[#7A578D]/5 shadow-lg shadow-[#7A578D]/5' 
                    : 'border-gray-100 dark:border-white/10 hover:border-gray-300 dark:hover:border-white/20'
                }`}
              >
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center space-x-3">
                     <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${selectedAddressId === address.id ? 'bg-[#7A578D] text-white' : 'bg-gray-100 dark:bg-white/5 text-gray-400'}`}>
                        <MapPin size={14} />
                     </div>
                     <span className="text-[10px] font-black uppercase tracking-widest">{address.type}</span>
                  </div>
                  {selectedAddressId === address.id && (
                    <CheckCircle size={16} className="text-[#7A578D]" />
                  )}
                </div>
                <div className="space-y-1">
                  <p className="text-[11px] font-black uppercase">{address.name}</p>
                  <p className="text-[10px] text-gray-500 font-medium">{address.street}, {address.city}, {address.state} - {address.pincode}</p>
                  <p className="text-[9px] text-gray-400 font-bold italic mt-2">Signal: {address.phone}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div 
            onClick={() => setIsAddressModalOpen(true)}
            className="border-2 border-dashed border-gray-100 dark:border-white/10 rounded-2xl p-12 text-center cursor-pointer hover:border-[#7A578D]/50 transition-all group"
          >
            <MapPin size={32} className="mx-auto text-gray-200 dark:text-white/10 mb-4 group-hover:text-[#7A578D] transition-colors" />
            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white">Initialize delivery coordinates</p>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default AddressSection;
