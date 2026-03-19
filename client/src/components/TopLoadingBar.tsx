import { useEffect, useState } from 'react';
import { useLoading } from '../store/useLoading';
import { motion, AnimatePresence } from 'framer-motion';

const TopLoadingBar = () => {
  const isLoading = useLoading((state) => state.isLoading);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let interval: any;
    if (isLoading) {
      setProgress(10);
      interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 90) return prev;
          return prev + Math.random() * 10;
        });
      }, 500);
    } else {
      setProgress(100);
      const timer = setTimeout(() => {
        setProgress(0);
      }, 500);
      return () => clearTimeout(timer);
    }

    return () => clearInterval(interval);
  }, [isLoading]);

  return (
    <AnimatePresence>
      {progress > 0 && progress < 100 && (
        <motion.div
          initial={{ scaleX: 0, opacity: 0 }}
          animate={{ scaleX: progress / 100, opacity: 1 }}
          exit={{ opacity: 0 }}
          style={{ originX: 0 }}
          className="fixed top-0 left-0 right-0 h-1 bg-[#7A578D] z-[10000] shadow-[0_0_10px_rgba(122,87,141,0.5)]"
        />
      )}
    </AnimatePresence>
  );
};

export default TopLoadingBar;
