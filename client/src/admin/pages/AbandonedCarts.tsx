
import { useState, useEffect } from 'react';
import { ShoppingCart, Clock, Mail, Phone, RefreshCw, ArrowRight } from 'lucide-react';
import api from '../../api/axios';
import toast from 'react-hot-toast';
import MUIDataTable from "mui-datatables";
import { ThemeProvider } from '@mui/material/styles';
import { getMuiTheme } from '../utils/muiTableTheme';

const AbandonedCarts = () => {
  const [loading, setLoading] = useState(true);
  const [carts, setCarts] = useState<any[]>([]);

  const fetchAbandonedCarts = async () => {
    setLoading(true);
    try {
      const { data: res } = await api.get('/cart/admin/abandoned');
      setCarts(res.data);
    } catch (error) {
      toast.error('Failed to load abandoned carts');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAbandonedCarts();
  }, []);

  const columns = [
    {
      name: "user",
      label: "Customer Profile",
      options: {
        customBodyRender: (user: any) => (
          <div className="flex items-center gap-3">
             <div className="w-8 h-8 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center text-[10px] font-black border border-amber-100 uppercase">
                {user?.name?.[0] || 'U'}
             </div>
             <div className="flex flex-col">
                <span className="text-[10px] font-black uppercase text-gray-900 truncate max-w-[150px]">{user?.name || 'Anonymous'}</span>
                <span className="text-[8px] font-bold text-gray-400 lowercase truncate">{user?.email}</span>
             </div>
          </div>
        )
      }
    },
    {
       name: "items",
       label: "Cart Value",
       options: {
         customBodyRender: (items: any[]) => {
           const total = items.reduce((sum: number, item: any) => sum + (item.product.basePrice * item.quantity), 0);
           return (
             <div className="flex flex-col">
                <span className="text-[11px] font-black text-gray-900">₹{total.toLocaleString()}</span>
                <span className="text-[8px] font-bold text-[#7A578D] uppercase tracking-widest">{items.length} Unique Items</span>
             </div>
           )
         }
       }
    },
    {
      name: "updatedAt",
      label: "Idle Since",
      options: {
        customBodyRender: (val: string) => {
          const date = new Date(val);
          const diffInHours = Math.floor((new Date().getTime() - date.getTime()) / (1000 * 60 * 60));
          return (
            <div className="flex items-center gap-2 text-gray-500">
               <Clock size={10} className="text-amber-500" />
               <span className="text-[9px] font-black uppercase tracking-tight">
                  {diffInHours} Hours Ago
               </span>
            </div>
          )
        }
      }
    },
    {
      name: "user",
      label: "Contact",
      options: {
        customBodyRender: (user: any) => (
          <div className="flex items-center gap-2">
             <a href={`mailto:${user.email}`} className="p-1.5 hover:bg-gray-100 rounded text-gray-400 transition-colors"><Mail size={12} /></a>
             <a href={`tel:${user.phoneNumber}`} className="p-1.5 hover:bg-gray-100 rounded text-gray-400 transition-colors"><Phone size={12} /></a>
          </div>
        )
      }
    },
    {
      name: "items",
      label: "Preview",
      options: {
        customBodyRender: (items: any[]) => (
          <div className="flex -space-x-2">
             {items.slice(0, 3).map((item, i) => (
                <div key={i} className="w-7 h-9 rounded bg-white border border-gray-100 overflow-hidden shadow-sm relative group">
                   <img src={item.product.images?.[0]?.imageUrl} className="w-full h-full object-cover" />
                </div>
             ))}
             {items.length > 3 && (
                <div className="w-7 h-9 rounded bg-gray-50 border border-gray-100 flex items-center justify-center text-[7px] font-bold text-gray-400">
                   +{items.length - 3}
                </div>
             )}
          </div>
        )
      }
    }
  ];

  const options = {
    selectableRows: 'none' as const,
    elevation: 0,
    responsive: 'standard' as const,
    rowsPerPage: 20,
    download: false,
    print: false,
    filter: false,
    viewColumns: false
  };

  return (
    <div className="space-y-4 animate-in fade-in duration-500 max-w-[1400px]">
      <header className="flex justify-between items-center border-b border-gray-100 pb-2">
        <div>
          <h1 className="text-lg font-sans font-black uppercase tracking-tight text-gray-900 leading-none">Abandoned Carts</h1>
          <p className="text-gray-400 text-[8px] font-black uppercase tracking-[0.2em] mt-1 flex items-center gap-2">
            <ShoppingCart size={11} className="text-amber-500" /> Loss Prevention & Recovery Monitor
          </p>
        </div>
        <button onClick={fetchAbandonedCarts} className="p-1.5 bg-white border border-gray-100 rounded-lg text-gray-400 hover:text-[#7A578D] transition-all active:scale-95 shadow-sm">
           <RefreshCw size={14} />
        </button>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
         <div className="lg:col-span-3">
            <div className="bg-white border border-gray-100 rounded-xl overflow-hidden shadow-sm relative min-h-[500px]">
              {loading && (
                 <div className="absolute inset-0 bg-white/50 backdrop-blur-[1px] z-10 flex items-center justify-center">
                    <div className="w-8 h-8 border-2 border-[#7A578D] border-t-transparent rounded-full animate-spin" />
                 </div>
              )}
              <ThemeProvider theme={getMuiTheme()}>
                <MUIDataTable title="" data={carts} columns={columns} options={options} />
              </ThemeProvider>
            </div>
         </div>

         <div className="space-y-4">
            <div className="bg-gray-900 text-white rounded-xl p-4 shadow-xl border border-white/5 relative overflow-hidden">
               <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500 opacity-20 blur-[80px] -mr-16 -mt-16" />
               <h3 className="text-[9px] font-black uppercase tracking-[0.2em] text-amber-500 mb-4 italic">Recovery Stats</h3>
               
               <div className="space-y-5 relative z-10">
                  <div>
                     <p className="text-[8px] font-black text-gray-500 uppercase tracking-widest mb-1">Potential Loss</p>
                     <h4 className="text-2xl font-black italic text-white flex items-center gap-2 text-nowrap leading-none">
                        ₹{carts.reduce((sum, cart) => sum + cart.items.reduce((s:number, i:any) => s + (i.product.basePrice * i.quantity), 0), 0).toLocaleString()}
                     </h4>
                  </div>
                  
                  <div>
                     <p className="text-[8px] font-black text-gray-500 uppercase tracking-widest mb-1">Active Leaks</p>
                     <h4 className="text-2xl font-black italic text-amber-500 leading-none">{carts.length} <span className="text-[9px] opacity-60">CARTS</span></h4>
                  </div>

                  <div className="pt-4 border-t border-white/10">
                     <p className="text-[9px] font-bold text-gray-400 leading-tight uppercase tracking-tight italic">
                        Most items abandoned: <span className="text-white">Casual Sneakers</span>. Consider a "Special Discount" popup.
                     </p>
                  </div>
               </div>
            </div>

            <div className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm">
               <h4 className="text-[9px] font-black uppercase tracking-widest text-[#7A578D] mb-3 italic">Next Steps</h4>
               <ul className="space-y-4">
                  <li className="flex gap-3 text-[9px] font-bold text-gray-500 uppercase leading-relaxed tracking-tight group cursor-pointer hover:text-black">
                     <div className="w-5 h-5 bg-purple-50 rounded-lg flex items-center justify-center text-[#7A578D] shrink-0 group-hover:bg-[#7A578D] group-hover:text-white transition-all">
                        <ArrowRight size={10} />
                     </div>
                     Send 10% Coupon to all abandoned users manually via Email.
                  </li>
                  <li className="flex gap-3 text-[9px] font-bold text-gray-500 uppercase leading-relaxed tracking-tight group cursor-pointer hover:text-black">
                     <div className="w-5 h-5 bg-purple-50 rounded-lg flex items-center justify-center text-[#7A578D] shrink-0 group-hover:bg-[#7A578D] group-hover:text-white transition-all">
                        <ArrowRight size={10} />
                     </div>
                     Enable "Cart Reminder" WhatsApp Bot (Requires Setting sync).
                  </li>
               </ul>
            </div>
         </div>
      </div>
    </div>
  );
};

export default AbandonedCarts;
