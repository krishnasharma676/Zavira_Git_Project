
import React from 'react';
import { User, Mail, Send, CheckCircle, Clock } from 'lucide-react';

interface MessageReplyFormProps {
  selectedMessage: any;
  replyText: string;
  setReplyText: (text: string) => void;
  handleReply: (e: React.FormEvent) => void;
  isSubmitting: boolean;
}

const MessageReplyForm: React.FC<MessageReplyFormProps> = ({
  selectedMessage,
  replyText,
  setReplyText,
  handleReply,
  isSubmitting,
}) => {
  if (!selectedMessage) return null;

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div className="bg-[#7A578D]/5 border border-[#7A578D]/10 rounded-sm p-4 space-y-4 shadow-inner">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="space-y-1.5 flex flex-col">
            <h4 className="text-[11px] font-black uppercase tracking-[0.2em] text-gray-900 border-l-4 border-[#7A578D] pl-3">
              {selectedMessage.subject || 'GENERAL_QUERY'}
            </h4>
            <div className="flex flex-wrap items-center gap-3 text-[10px] font-black text-gray-400 uppercase tracking-widest pl-4">
               <User size={14} className="text-[#7A578D]" />
               <span>{selectedMessage.name}</span>
               <span className="text-gray-200">/</span>
               <Mail size={14} className="text-[#7A578D]" />
               <span className="lowercase font-mono text-[#7A578D]">{selectedMessage.email}</span>
            </div>
          </div>
          <span className="text-[9px] font-black text-gray-400 bg-white px-3 py-1.5 rounded-sm border border-gray-100 shadow-sm uppercase tracking-widest flex items-center gap-2">
             <Clock size={12} /> {new Date(selectedMessage.createdAt).toLocaleString()}
          </span>
        </div>
        <div className="bg-white border border-gray-100 rounded-sm p-4 shadow-sm italic relative group overflow-hidden">
           <div className="absolute top-0 right-0 p-4 text-gray-50 group-hover:text-gray-100 transition-colors pointer-events-none">
              <Mail size={48} fill="currentColor" />
           </div>
           <p className="text-xs text-gray-700 leading-relaxed font-semibold relative z-10">
             "{selectedMessage.message}"
           </p>
        </div>
      </div>

      {selectedMessage.status === 'REPLIED' ? (
        <div className="space-y-3 p-4 bg-emerald-50/20 border border-emerald-100/30 rounded-sm shadow-sm animate-in zoom-in-95 duration-300">
          <div className="flex items-center space-x-2 text-[10px] font-black uppercase tracking-[0.3em] text-emerald-700 ml-1">
             <CheckCircle size={16} />
             <span>Resolution Archive Sent</span>
          </div>
          <p className="text-xs text-emerald-800 font-bold leading-relaxed italic block p-4 bg-white/50 border border-emerald-100/20 rounded-sm">
             {selectedMessage.reply}
          </p>
        </div>
      ) : (
        <form onSubmit={handleReply} className="space-y-4">
          <div className="space-y-3">
            <label className="text-[10px] font-black uppercase tracking-[0.3em] text-[#7A578D] ml-1 flex items-center gap-2">
              <Send size={16} />
              <span>Identity Response Nexus</span>
            </label>
            <textarea
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              rows={6}
              className="w-full bg-gray-50 border border-gray-200 rounded-sm py-4 px-4 outline-none focus:ring-2 focus:ring-[#7A578D]/20 focus:border-[#7A578D] text-xs font-semibold transition-all resize-none shadow-inner leading-relaxed italic placeholder:opacity-30"
              placeholder="Structure identity resolution manifest..."
              required
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting || !replyText.trim()}
            className="w-full bg-black text-white h-12 rounded-sm text-[11px] font-black uppercase tracking-[0.3em] transition-all shadow-xl shadow-black/10 active:scale-95 disabled:opacity-50 hover:bg-[#7A578D] border-b-2 border-black/20"
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center gap-2">
                <div className="w-3 h-3 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                TRANSMITTING_SUPPORT_FRAG...
              </span>
            ) : (
              'TRANSMIT_RESOLUTION_ Nexus'
            )}
          </button>
        </form>
      )}
    </div>
  );
};

export default MessageReplyForm;
