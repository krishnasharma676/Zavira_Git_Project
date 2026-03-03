import { motion } from 'framer-motion';

interface TrackFormProps {
  searchBy: string;
  setSearchBy: (value: string) => void;
}

const TrackForm = ({ searchBy, setSearchBy }: TrackFormProps) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-[#121212] w-full max-w-2xl rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.05)] dark:shadow-none border border-gray-100 dark:border-white/5 overflow-hidden"
    >
      <div className="p-8 lg:p-12">
        {/* Title with Icon */}
        <div className="flex items-center space-x-4 mb-8">
          <div className="w-12 h-12 flex items-center justify-center">
            <svg width="40" height="40" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M24 4L4 12V36L24 44L44 36V12L24 4Z" stroke="currentColor" className="text-[#7A578D]" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M4 12L24 20L44 12" stroke="currentColor" className="text-[#7A578D]" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M24 20V44" stroke="currentColor" className="text-[#7A578D]" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              <circle cx="34" cy="18" r="6" fill="white" className="dark:fill-black" stroke="currentColor" strokeWidth="2.5"/>
            </svg>
          </div>
          <div>
            <h2 className="text-xl font-sans font-black text-gray-900 dark:text-white uppercase tracking-tight leading-tight">Track Your Shipment</h2>
            <p className="text-[10px] text-gray-400 dark:text-gray-500 uppercase tracking-widest font-bold mt-1">Real-time update on your vault items</p>
          </div>
        </div>

        <div className="h-px bg-gray-50 dark:bg-white/5 w-full mb-10" />

        <form className="space-y-8">
          {/* Radio Selection */}
          <div className="flex items-center space-x-10">
            <span className="text-[11px] uppercase font-black tracking-widest text-[#7A578D]">Search By:</span>
            
            <label className="flex items-center space-x-3 cursor-pointer group">
              <div className="relative flex items-center justify-center">
                <input 
                  type="radio" 
                  name="searchType" 
                  checked={searchBy === 'orderId'}
                  onChange={() => setSearchBy('orderId')}
                  className="peer w-4 h-4 opacity-0 absolute cursor-pointer"
                />
                <div className="w-4 h-4 border-2 border-gray-300 dark:border-gray-700 rounded-full peer-checked:border-[#7A578D] transition-all"></div>
                <div className="w-2 h-2 bg-[#7A578D] rounded-full absolute opacity-0 peer-checked:opacity-100 transition-all"></div>
              </div>
              <span className="text-xs font-bold uppercase tracking-widest text-gray-600 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-gray-100 transition-colors">Order ID</span>
            </label>

            <label className="flex items-center space-x-3 cursor-pointer group">
              <div className="relative flex items-center justify-center">
                <input 
                  type="radio" 
                  name="searchType" 
                  checked={searchBy === 'awb'}
                  onChange={() => setSearchBy('awb')}
                  className="peer w-4 h-4 opacity-0 absolute cursor-pointer"
                />
                <div className="w-4 h-4 border-2 border-gray-300 dark:border-gray-700 rounded-full peer-checked:border-[#7A578D] transition-all"></div>
                <div className="w-2 h-2 bg-[#7A578D] rounded-full absolute opacity-0 peer-checked:opacity-100 transition-all"></div>
              </div>
              <span className="text-xs font-bold uppercase tracking-widest text-gray-600 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-gray-100 transition-colors">AWB</span>
            </label>
          </div>

          {/* Input Field */}
          <div className="relative group">
            <label className="text-[9px] uppercase font-black tracking-widest text-gray-400 dark:text-gray-500 mb-2 block ml-1">Identity Details</label>
            <input 
              type="text" 
              placeholder={`Enter ${searchBy === 'orderId' ? 'Order ID' : 'Tracking Number'} to search...`}
              className="w-full bg-gray-50 dark:bg-white/[0.03] border border-gray-100 dark:border-white/5 rounded-2xl px-5 py-4 focus:outline-none focus:border-[#7A578D] transition-all text-gray-900 dark:text-white text-xs font-medium placeholder:text-gray-300 dark:placeholder:text-gray-600"
            />
          </div>

          {/* Submit Button */}
          <div>
            <button 
              type="submit"
              className="w-full bg-[#7A578D] hover:bg-black text-white font-black py-4 rounded-xl transition-all text-xs uppercase tracking-[0.2em] shadow-lg shadow-[#7A578D]/20 hover:shadow-xl hover:shadow-[#7A578D]/30 transform active:scale-[0.99]"
            >
              Initiate Tracking
            </button>
          </div>
        </form>
      </div>
    </motion.div>
  );
};

export default TrackForm;
