import { motion, AnimatePresence } from 'framer-motion';
import { useLoading } from '../store/useLoading';

const GlobalLoader = () => {
  const { isLoading, message } = useLoading();

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-white/80 dark:bg-black/80 backdrop-blur-md"
        >
          {/* Main Logo Loader */}
          <div className="relative">
            <motion.div
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.3, 1, 0.3],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="w-24 h-24 rounded-full border border-[#7A578D]/20 flex items-center justify-center"
            >
              <div className="text-[#7A578D] font-sans font-black text-2xl tracking-tighter">ZV</div>
            </motion.div>

            {/* Orbiting Ring */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "linear",
              }}
              className="absolute inset-0 rounded-full border-t-2 border-[#7A578D]"
            />
          </div>

          {/* Luxury Text */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-8 flex flex-col items-center"
          >
            <p className="text-[10px] uppercase font-black tracking-[0.6em] text-gray-900 dark:text-white mb-2">
              The Vault
            </p>
            <div className="w-12 h-[1px] bg-[#7A578D]" />
            {message && (
              <p className="mt-4 text-[9px] uppercase font-bold text-gray-400 tracking-widest italic animate-pulse">
                {message}
              </p>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default GlobalLoader;
