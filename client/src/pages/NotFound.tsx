import React from 'react';
import { Link } from 'react-router-dom';
import { Home, ArrowLeft } from 'lucide-react';

const NotFound: React.FC = () => {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="relative mb-8">
          <h1 className="text-[120px] font-black text-[#7A578D]/10 leading-none">404</h1>
          <div className="absolute inset-0 flex items-center justify-center">
            <h2 className="text-4xl font-black text-[#7A578D] tracking-tighter uppercase">Lost in Style?</h2>
          </div>
        </div>
        
        <p className="text-gray-600 mb-10 text-lg leading-relaxed">
          The page you're looking for seems to have vanished from our collection. 
          Don't worry, even the best treasures are sometimes hidden.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/"
            className="flex items-center justify-center gap-2 px-8 py-4 bg-[#7A578D] text-white rounded-full font-black text-xs uppercase tracking-[0.2em] hover:bg-[#664975] transition-all duration-300 shadow-lg shadow-[#7A578D]/20"
          >
            <Home size={16} />
            Back to Home
          </Link>
          <button
            onClick={() => window.history.back()}
            className="flex items-center justify-center gap-2 px-8 py-4 border-2 border-gray-200 text-gray-800 rounded-full font-black text-xs uppercase tracking-[0.2em] hover:border-[#7A578D] hover:text-[#7A578D] transition-all duration-300"
          >
            <ArrowLeft size={16} />
            Go Back
          </button>
        </div>

        <div className="mt-16 pt-8 border-t border-gray-100">
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 mb-4">Popular Categories</p>
          <div className="flex flex-wrap justify-center gap-6 text-[11px] font-bold text-gray-600 uppercase tracking-widest">
            <Link to="/shop?category=new-arrivals" className="hover:text-[#7A578D] transition-colors">New Arrivals</Link>
            <Link to="/shop?category=best-sellers" className="hover:text-[#7A578D] transition-colors">Best Sellers</Link>
            <Link to="/collections" className="hover:text-[#7A578D] transition-colors">Collections</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
