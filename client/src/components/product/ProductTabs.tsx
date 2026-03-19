import React from 'react';
import { motion } from 'framer-motion';
import { Truck, ShieldCheck, RotateCcw } from 'lucide-react';
import ReviewList from './ReviewList';
import ReviewForm from './ReviewForm';

interface ProductTabsProps {
  product: any;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  rating: number;
  setRating: (rating: number) => void;
  comment: string;
  setComment: (comment: string) => void;
  isSubmitting: boolean;
  handleReviewSubmit: (e: React.FormEvent) => Promise<void>;
}

const ProductTabs = ({
  product,
  activeTab,
  setActiveTab,
  rating,
  setRating,
  comment,
  setComment,
  isSubmitting,
  handleReviewSubmit
}: ProductTabsProps) => {
  return (
    <div className="space-y-4">
      <div className="flex space-x-8 border-b border-gray-100 dark:border-white/5">
        {['details', 'shipping', 'reviews'].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-3 text-[9px] uppercase tracking-[0.2em] font-black transition-all relative ${
              activeTab === tab ? 'text-[#7A578D]' : 'text-gray-400 dark:text-gray-600 hover:text-gray-900 dark:hover:text-gray-200'
            }`}
          >
            {tab}
            {activeTab === tab && (
              <motion.div layoutId="tab-underline" className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#7A578D]" />
            )}
          </button>
        ))}
      </div>

      <div className="py-4">
        {activeTab === 'details' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
             <p className="text-xs text-gray-500 font-medium leading-relaxed italic">{product.description}</p>
             <div className="grid grid-cols-1 gap-3 mt-4">
                <div className="flex justify-between border-b border-gray-50 dark:border-white/5 pb-2 text-[11px]">
                  <span className="text-gray-400 uppercase font-black tracking-widest">Category</span>
                  <span className="text-gray-900 dark:text-white font-bold">{product.category?.name}</span>
                </div>
             </div>
          </motion.div>
        )}

        {activeTab === 'reviews' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
            <ReviewList reviews={product.reviews} />
            <ReviewForm 
              rating={rating} 
              setRating={setRating} 
              comment={comment} 
              setComment={setComment} 
              isSubmitting={isSubmitting} 
              handleReviewSubmit={handleReviewSubmit} 
            />
          </motion.div>
        )}
        
        {activeTab === 'shipping' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-gray-500 font-medium text-xs leading-relaxed italic">
            <p className="mb-4">Complimentary express shipping on all orders domestically. Each Zavira masterpiece arrives in our signature vault packaging, insured and requiring a signature upon delivery.</p>
            <div className="p-4 bg-gray-50 dark:bg-white/[0.02] rounded-xl border border-gray-100 dark:border-white/5">
              <ul className="space-y-3">
                <li className="flex items-center space-x-3">
                  <Truck size={14} className="text-[#7A578D]" />
                  <span>Domestic: 3-5 business days</span>
                </li>
                <li className="flex items-center space-x-3">
                  <ShieldCheck size={14} className="text-[#7A578D]" />
                  <span>Insured Delivery with Signature</span>
                </li>
                <li className="flex items-center space-x-3">
                  <RotateCcw size={14} className="text-[#7A578D]" />
                  <span>14-Day Boutique Exchange</span>
                </li>
              </ul>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default ProductTabs;

