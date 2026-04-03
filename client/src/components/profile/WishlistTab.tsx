import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';
import { Link } from 'react-router-dom';
import WishlistCard from './WishlistCard';

interface WishlistTabProps {
  items: any[];
}

const WishlistTab = ({ items }: WishlistTabProps) => {
  return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
       <h2 className="text-2xl font-sans font-black mb-8 italic uppercase tracking-tighter">Desired Masterpieces</h2>
       {items.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             {items.map((item: any) => (
                <WishlistCard key={item.id} item={item} />
             ))}
          </div>
       ) : (
          <div className="bg-[#7A578D]/5 border border-[#7A578D]/10 p-12 rounded-3xl text-center">
            <Heart className="mx-auto text-[#7A578D]/20 mb-4" size={48} />
            <p className="text-sm font-bold dark:text-gray-300 mb-6 uppercase tracking-widest">Aura currently neutral_</p>
            <Link to="/shop" className="luxury-button !py-3 !px-10 !text-[10px]">Populate List</Link>
          </div>
       )}
    </motion.div>
  );   
};

export default WishlistTab;