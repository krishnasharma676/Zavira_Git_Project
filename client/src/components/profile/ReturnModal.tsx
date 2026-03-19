import { useState, useRef } from 'react';
import { X, RotateCcw, Upload, ImagePlus, Loader2, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ReturnModalProps {
  isOpen: boolean;
  orderId: string;
  orderNumber: string;
  onClose: () => void;
  onSubmit: (orderId: string, reason: string, files: File[]) => Promise<void>;
}

const ReturnModal = ({ isOpen, orderId, orderNumber, onClose, onSubmit }: ReturnModalProps) => {
  const [reason, setReason] = useState('');
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = Array.from(e.target.files || []).slice(0, 4 - files.length);
    const newFiles = [...files, ...selected].slice(0, 4);
    setFiles(newFiles);
    const newPreviews = newFiles.map(f => URL.createObjectURL(f));
    setPreviews(newPreviews);
  };

  const removeImage = (index: number) => {
    const newFiles = files.filter((_, i) => i !== index);
    const newPreviews = previews.filter((_, i) => i !== index);
    setFiles(newFiles);
    setPreviews(newPreviews);
  };

  const handleSubmit = async () => {
    if (!reason.trim()) return;
    setLoading(true);
    try {
      await onSubmit(orderId, reason.trim(), files);
      setReason('');
      setFiles([]);
      setPreviews([]);
      onClose();
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.97 }}
          transition={{ duration: 0.2 }}
          className="relative bg-white dark:bg-[#111] rounded-2xl shadow-2xl w-full max-w-md overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-5 border-b border-gray-100 dark:border-white/5 bg-orange-50/50 dark:bg-orange-500/5">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-orange-100 dark:bg-orange-500/20 flex items-center justify-center text-orange-500">
                <RotateCcw size={15} />
              </div>
              <div>
                <h2 className="text-[11px] font-black uppercase tracking-widest text-gray-900 dark:text-white">Request Return</h2>
                <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Order #{orderNumber?.split('-').pop()}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-7 h-7 rounded-full bg-gray-100 dark:bg-white/5 flex items-center justify-center text-gray-400 hover:bg-gray-200 transition-colors"
            >
              <X size={13} />
            </button>
          </div>

          <div className="p-5 space-y-4">
            {/* Reason */}
            <div>
              <label className="text-[9px] font-black uppercase tracking-widest text-gray-500 block mb-2">
                Reason for Return <span className="text-orange-400">*</span>
              </label>
              <textarea
                value={reason}
                onChange={e => setReason(e.target.value)}
                placeholder="Describe why you want to return this order..."
                rows={4}
                className="w-full bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-xl p-3 text-[11px] font-bold text-gray-800 dark:text-gray-200 placeholder:text-gray-300 dark:placeholder:text-white/20 outline-none focus:border-orange-300 dark:focus:border-orange-500/40 transition-colors resize-none"
              />
              <div className="text-right mt-1">
                <span className={`text-[8px] font-black uppercase tracking-widest ${reason.length > 450 ? 'text-orange-400' : 'text-gray-300'}`}>
                  {reason.length}/500
                </span>
              </div>
            </div>

            {/* Image Upload */}
            <div>
              <label className="text-[9px] font-black uppercase tracking-widest text-gray-500 block mb-2">
                Upload Photos <span className="text-gray-300 font-bold">(Optional, max 4)</span>
              </label>

              <div className="grid grid-cols-4 gap-2">
                {previews.map((src, i) => (
                  <div key={i} className="relative aspect-square rounded-xl overflow-hidden border border-gray-100 dark:border-white/10 group">
                    <img src={src} alt={`Return photo ${i + 1}`} className="w-full h-full object-cover" />
                    <button
                      onClick={() => removeImage(i)}
                      className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                    >
                      <Trash2 size={14} className="text-white" />
                    </button>
                  </div>
                ))}

                {files.length < 4 && (
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="aspect-square border-2 border-dashed border-gray-200 dark:border-white/10 rounded-xl flex flex-col items-center justify-center gap-1 text-gray-300 hover:border-orange-200 hover:text-orange-300 transition-colors"
                  >
                    <ImagePlus size={18} />
                    <span className="text-[7px] font-black uppercase">Add</span>
                  </button>
                )}
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={handleFileChange}
              />
              {(previews.length === 0) && (
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="mt-2 w-full border-2 border-dashed border-gray-100 dark:border-white/5 rounded-xl py-4 flex items-center justify-center gap-2 text-gray-300 hover:border-orange-200 hover:text-orange-300 transition-colors"
                >
                  <Upload size={14} />
                  <span className="text-[9px] font-black uppercase tracking-widest">Choose Photos</span>
                </button>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-gray-50 dark:border-white/5 flex items-center gap-3">
            <button
              onClick={onClose}
              className="flex-1 py-2.5 text-[9px] font-black uppercase tracking-widest border border-gray-100 dark:border-white/10 rounded-xl text-gray-400 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={!reason.trim() || loading}
              className="flex-1 py-2.5 text-[9px] font-black uppercase tracking-widest bg-orange-500 text-white rounded-xl hover:bg-orange-600 transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-md"
            >
              {loading ? (
                <><Loader2 size={12} className="animate-spin" /><span>Submitting...</span></>
              ) : (
                <><RotateCcw size={11} /><span>Submit Return</span></>
              )}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default ReturnModal;
