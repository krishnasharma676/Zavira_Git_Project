import { useNavigate } from 'react-router-dom';
import CollectionCard from '../components/collection/CollectionCard';

const CollectionsPage = () => {
  const navigate = useNavigate();
  const collections = [
    { title: 'The Bridal Suite', subtitle: 'Timeless pieces for your forever moment', image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=1000', size: 'large' },
    { title: 'Eternal Gold', subtitle: 'Crafted in 18k and 24k solid gold', image: 'https://images.unsplash.com/photo-1617038220319-276d33162232?q=80&w=1000', size: 'small' },
    { title: 'The Diamond Vault', subtitle: 'Rare cuts and exceptional brilliance', image: 'https://images.unsplash.com/photo-1635767790474-320d55e909ea?q=80&w=1000', size: 'small' },
    { title: 'Modern Heritage', subtitle: 'Traditional motifs reimagined', image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=1000', size: 'medium' },
  ];

  return (
    <div className="bg-white dark:bg-[#121212] pt-8 pb-12 text-luxury-black dark:text-white transition-colors duration-300 min-h-screen">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <p className="text-luxury-gold uppercase tracking-[0.4em] text-[8px] mb-3 font-bold">Curated Narratives</p>
          <h1 className="text-3xl lg:text-4xl font-sans uppercase tracking-widest leading-tight">The Collections</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {collections.map((col, idx) => (
            <CollectionCard 
              key={col.title} 
              col={col} 
              idx={idx} 
              onClick={() => navigate('/shop')} 
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default CollectionsPage;

