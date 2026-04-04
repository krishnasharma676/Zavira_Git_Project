
import React from 'react';
import { User, Phone, MapPin, Truck, Hash, Clock, ShieldCheck, Mail } from 'lucide-react';

interface ShipmentDetailsExpandedProps {
  order: any;
  columnsLength: number;
}

const ShipmentDetailsExpanded: React.FC<ShipmentDetailsExpandedProps> = ({
  order,
  columnsLength,
}) => {
  if (!order) return null;

  return (
    <tr className="bg-gray-50/50">
      <td colSpan={columnsLength + 1} className="p-0 border-b border-gray-100">
        <div className="p-6 grid grid-cols-1 md:grid-cols-4 gap-6 animate-in slide-in-from-top-2 duration-300">
          {/* Customer Profile */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-2.5 h-8 bg-[#7A578D] rounded-full shadow-md" />
              <h3 className="text-[11px] font-black uppercase tracking-widest text-gray-900 flex items-center gap-2">
                <User size={18} className="text-[#7A578D]" /> Consignee Profile
              </h3>
            </div>
            <div className="space-y-4 pl-6 border-l-2 border-gray-200">
              <div className="flex flex-col">
                <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Name</span>
                <span className="text-xs font-black text-gray-900">{order.address?.name || 'Anonymous User'}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Contact</span>
                <span className="text-xs font-black text-gray-900 flex items-center gap-2">
                   <Phone size={14} className="text-[#7A578D]" /> 
                   {order.address?.phone || order.user?.phoneNumber || 'N/A'}
                </span>
                <span className="text-[9px] font-mono font-bold text-gray-400 mt-1 flex items-center gap-2 lowercase">
                   <Mail size={12} /> {order.user?.email || 'N/A'}
                </span>
              </div>
            </div>
          </div>

          {/* Logistics Route */}
          <div className="space-y-4">
            <h3 className="text-[11px] font-black uppercase tracking-widest text-gray-400">Logistics Route</h3>
            <div className="p-4 bg-white border border-gray-200 rounded-sm shadow-sm hover:shadow-md transition-shadow relative overflow-hidden">
               <div className="flex items-start gap-3">
                  <MapPin size={18} className="text-[#7A578D] shrink-0 mt-1" />
                  <div className="flex flex-col gap-1">
                     <span className="text-xs font-semibold text-gray-600 leading-tight">
                        {order.address?.street}, {order.address?.city}
                     </span>
                     <span className="text-xs font-black text-gray-900">
                        {order.address?.state} - {order.address?.pincode}
                     </span>
                  </div>
               </div>
               <div className="absolute top-0 right-0 w-8 h-8 bg-[#7A578D]/5 rotate-45 translate-x-4 -translate-y-4" />
            </div>
          </div>

          {/* Carrier Framework */}
          <div className="space-y-4">
             <h3 className="text-[11px] font-black uppercase tracking-widest text-gray-400">Carrier Framework</h3>
             <div className="space-y-4">
                <div className="flex items-center gap-3">
                   <div className="p-2 bg-white rounded-sm border border-gray-100 shadow-sm text-gray-400 flex items-center justify-center">
                      <Truck size={18} />
                   </div>
                   <div className="flex flex-col">
                      <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Assigned Courier</span>
                      <span className="text-xs font-black text-[#7A578D] uppercase tracking-wider">{order.courierName || 'Unassigned'}</span>
                   </div>
                </div>

                <div className="flex items-center gap-3">
                   <div className="p-2 bg-white rounded-sm border border-gray-100 shadow-sm text-gray-400 flex items-center justify-center">
                      <ShieldCheck size={18} />
                   </div>
                   <div className="flex flex-col">
                      <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">AWB Identity</span>
                      <span className="text-xs font-mono font-black text-gray-900">{order.awbNumber || 'PENDING_REGISTRATION'}</span>
                   </div>
                </div>
             </div>
          </div>

          {/* Audit Ledger */}
          <div className="space-y-4">
             <h3 className="text-[11px] font-black uppercase tracking-widest text-gray-400">Audit Ledger</h3>
             <div className="space-y-4">
                <div className="flex items-center gap-3">
                   <div className="p-2 bg-white rounded-sm border border-gray-100 shadow-sm text-gray-400 flex items-center justify-center">
                      <Hash size={18} />
                   </div>
                   <div className="flex flex-col">
                      <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Order Number</span>
                      <span className="text-xs font-black text-gray-900 border-b border-[#7A578D]/20">#{order.orderNumber || order.id}</span>
                   </div>
                </div>

                <div className="flex items-center gap-3">
                   <div className="p-2 bg-white rounded-sm border border-gray-100 shadow-sm text-gray-400 flex items-center justify-center">
                      <Clock size={18} />
                   </div>
                   <div className="flex flex-col">
                      <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Sync Timestamp</span>
                      <span className="text-xs font-black text-gray-900 uppercase">
                        {new Date(order.updatedAt).toLocaleDateString()}
                      </span>
                      <span className="text-[9px] font-medium text-gray-400">{new Date(order.updatedAt).toLocaleTimeString()}</span>
                   </div>
                </div>
             </div>
          </div>
        </div>
      </td>
    </tr>
  );
};

export default ShipmentDetailsExpanded;
