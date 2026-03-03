import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

interface CollectionCardProps {
  col: {
    title: string;
    subtitle: string;
    image: string;
    size: string;
  };
  idx: number;
  onClick: () => void;
}

const CollectionCard = ({ col, idx, onClick }: CollectionCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay: idx * 0.1 }}
      viewport={{ once: true }}
      className={`group relative overflow-hidden cursor-pointer ${col.size === 'large' ? 'md:col-span-2 aspect-[21/7]' : 'aspect-square'}`}
      onClick={onClick}
    >
      <img 
        src={col.image} 
        className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110 brightness-75 group-hover:brightness-50" 
        alt={col.title} 
      />
      <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-6">
        <p className="text-[9px] uppercase tracking-[0.3em] mb-2 opacity-0 group-hover:opacity-100 transition-all translate-y-4 group-hover:translate-y-0 font-bold">Explore</p>
        <h2 className="text-2xl md:text-3xl font-sans uppercase tracking-widest text-center">{col.title}</h2>
        <p className="mt-2 text-xs font-light italic text-gray-200 opacity-0 group-hover:opacity-100 transition-all translate-y-4 group-hover:translate-y-0 duration-500 delay-100 text-center">{col.subtitle}</p>
        <div className="mt-6 p-2.5 border border-white/30 rounded-full opacity-0 group-hover:opacity-100 transition-all scale-50 group-hover:scale-100 duration-500 delay-200">
          <ArrowRight size={18} />
        </div>
      </div>
    </motion.div>
  );
};

export default CollectionCard;
