import { Mail, Phone, MapPin } from 'lucide-react';

const ContactInfo = () => {
  return (
    <div className="lg:col-span-5 space-y-4">
      <div className="bg-[#FAFAFA] dark:bg-white/[0.02] p-5 rounded-2xl border border-gray-100 dark:border-white/5 space-y-5">
        <div className="flex items-start gap-4">
          <div className="w-8 h-8 rounded-full bg-[#7A578D]/10 flex items-center justify-center text-[#7A578D] flex-shrink-0">
            <Mail size={16} />
          </div>
          <div>
            <h3 className="text-[10px] font-black uppercase tracking-widest text-[#7A578D] mb-0.5">Email Us</h3>
            <p className="text-[13px] font-black text-gray-900 dark:text-gray-100 italic">concierge@zavira.com</p>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tight mt-0.5">Response: ~4 Hours</p>
          </div>
        </div>

        <div className="flex items-start gap-4">
          <div className="w-8 h-8 rounded-full bg-[#7A578D]/10 flex items-center justify-center text-[#7A578D] flex-shrink-0">
            <Phone size={16} />
          </div>
          <div>
            <h3 className="text-[10px] font-black uppercase tracking-widest text-[#7A578D] mb-0.5">Call Us</h3>
            <p className="text-[13px] font-black text-gray-900 dark:text-gray-100 italic">+91 999 000 1122</p>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tight mt-0.5">Mon-Sat | 10am - 7pm</p>
          </div>
        </div>

        <div className="flex items-start gap-4">
          <div className="w-8 h-8 rounded-full bg-[#7A578D]/10 flex items-center justify-center text-[#7A578D] flex-shrink-0">
            <MapPin size={16} />
          </div>
          <div>
            <h3 className="text-[10px] font-black uppercase tracking-widest text-[#7A578D] mb-0.5">Visit Us</h3>
            <p className="text-[13px] font-black text-gray-900 dark:text-gray-100 italic">South Extension II</p>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tight mt-0.5">New Delhi, Bharat</p>
          </div>
        </div>
      </div>

      <div className="px-5">
        <p className="text-[11px] leading-relaxed text-gray-400 font-bold uppercase italic tracking-widest">
          Every query is handled with personal care by our boutique team.
        </p>
      </div>
    </div>
  );
};

export default ContactInfo;
