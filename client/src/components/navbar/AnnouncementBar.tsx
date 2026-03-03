import { motion } from 'framer-motion';

interface Announcement {
  title: string;
}

interface AnnouncementBarProps {
  announcements: Announcement[];
}

const AnnouncementBar = ({ announcements }: AnnouncementBarProps) => {
  if (!announcements || announcements.length === 0) return null;

  return (
    <div className="bg-black text-white py-2 overflow-hidden whitespace-nowrap text-[11px] uppercase tracking-[0.05em] font-bold">
      <motion.div 
        animate={{ x: [0, -1000] }}
        transition={{ duration: announcements.length > 5 ? announcements.length * 6 : 40, repeat: Infinity, ease: 'linear' }}
        className="flex inline-block"
      >
        {/* Duplicate multiple times for smooth seamless transition */}
        {[...Array(3)].map((_, groupIdx) => (
          <div key={groupIdx} className="flex items-center">
            {announcements.map((ann, idx) => (
              <div key={idx} className="flex items-center">
                <span className="px-6">{ann.title}</span>
                <span className="text-white/30 truncate">————</span>
              </div>
            ))}
          </div>
        ))}
      </motion.div>
    </div>
  );
};

export default AnnouncementBar;
