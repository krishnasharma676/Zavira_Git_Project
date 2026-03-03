import { MapPin, Trash2 } from 'lucide-react';

interface AddressCardProps {
  address: any;
  handleSetDefaultAddress: (id: string) => void;
  handleDeleteAddress: (id: string) => void;
}

const AddressCard = ({ address, handleSetDefaultAddress, handleDeleteAddress }: AddressCardProps) => {
  return (
    <div className={`bg-white dark:bg-white/[0.02] border ${address.isDefault ? 'border-[#7A578D]/30 shadow-sm' : 'border-gray-100 dark:border-white/10'} p-5 rounded-2xl relative group transition-all`}>
      {address.isDefault && (
        <div className="absolute top-4 right-4 bg-[#7A578D] text-white text-[7px] font-black uppercase px-2 py-0.5 rounded-full tracking-widest">Default</div>
      )}
      <div className="flex items-center space-x-3 mb-4">
        <div className="w-8 h-8 bg-gray-50 dark:bg-white/5 rounded-xl flex items-center justify-center">
          <MapPin size={14} className={address.isDefault ? 'text-[#7A578D]' : 'text-gray-400'} />
        </div>
        <h4 className="text-[10px] font-black uppercase tracking-widest text-[#7A578D]">{address.type}</h4>
      </div>
      <div className="space-y-1 mb-4">
        <p className="text-[11px] font-black dark:text-white uppercase tracking-tight">{address.name}</p>
        <p className="text-[11px] text-gray-500 font-medium leading-relaxed italic">{address.street}, {address.city}</p>
        <p className="text-[11px] text-gray-500 font-medium italic">{address.state} - {address.pincode}</p>
        <p className="text-[10px] text-gray-400 font-bold mt-2 uppercase tracking-tight">PH: {address.phone}</p>
      </div>
      <div className="flex items-center space-x-4 border-t border-gray-50 dark:border-white/5 pt-4">
        {!address.isDefault && (
          <button onClick={() => handleSetDefaultAddress(address.id)} className="text-[9px] font-black uppercase tracking-widest text-[#7A578D] hover:underline">Set Default</button>
        )}
        <button onClick={() => handleDeleteAddress(address.id)} className="text-[9px] font-black uppercase tracking-widest text-gray-400 hover:text-red-500 flex items-center space-x-1 transition-colors">
          <Trash2 size={10} />
          <span>Remove</span>
        </button>
      </div>
    </div>
  );
};

export default AddressCard;
