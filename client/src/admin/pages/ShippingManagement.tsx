
import { useState, useEffect } from 'react';
import { Truck, ExternalLink, RefreshCw, Clock, MapPin, ShieldCheck, ShoppingBag } from 'lucide-react';
import api from '../../api/axios';
import toast from 'react-hot-toast';
import MUIDataTable from "mui-datatables";
import { ThemeProvider } from '@mui/material/styles';
import { getMuiTheme } from '../utils/muiTableTheme';

const ShippingManagement = () => {
  const [loading, setLoading] = useState(true);
  const [shipments, setShipments] = useState<any[]>([]);

  const fetchShipments = async () => {
    setLoading(true);
    try {
      // In this system, shipments are orders with shipmentId
      const { data: res } = await api.get('/orders/admin/all', { params: { limit: 100 } });
      const allOrders = res.data.orders;
      
      // Filter for orders that have a shipment ID
      const shippedOrders = allOrders.filter((order: any) => order.shipmentId || order.awbNumber);
      setShipments(shippedOrders);
    } catch (error) {
      toast.error('Failed to load shipments');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchShipments();
  }, []);

  const columns = [
    {
      name: "shipmentId",
      label: "Shipment ID",
      options: {
        customBodyRender: (val: string) => <span className="text-[10px] font-black uppercase text-gray-900 tracking-tighter">{val || 'MOCK_PENDING'}</span>
      }
    },
    {
      name: "orderNumber",
      label: "Order ID",
      options: {
        customBodyRender: (val: string) => <span className="text-[10px] font-bold text-[#7A578D]">#{val.split('-')[2] || val}</span>
      }
    },
    {
      name: "user",
      label: "Customer",
      options: {
        customBodyRender: (user: any) => (
          <div className="flex flex-col">
            <span className="text-[10px] font-black uppercase text-gray-900 truncate max-w-[120px]">{user?.name || 'Customer'}</span>
            <span className="text-[8px] font-bold text-gray-400 lowercase">{user?.email}</span>
          </div>
        )
      }
    },
    {
      name: "awbNumber",
      label: "AWB / Courier",
      options: {
        customBodyRender: (val: string, tableMeta: any) => {
          const row = shipments[tableMeta.rowIndex];
          return (
            <div className="flex flex-col">
               <span className="text-[10px] font-black text-blue-600">{val || 'Processing...'}</span>
               <span className="text-[8px] font-bold text-gray-400 uppercase">{row?.courierName || 'Pending Assignment'}</span>
            </div>
          )
        }
      }
    },
    {
      name: "shippingStatus",
      label: "Status",
      options: {
        customBodyRender: (val: string) => (
          <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest ${
            val?.toLowerCase().includes('delivered') ? 'bg-green-50 text-green-600' :
            val?.toLowerCase().includes('transit') || val?.toLowerCase().includes('shipped') ? 'bg-blue-50 text-blue-600' :
            'bg-orange-50 text-orange-600'
          }`}>{val || 'INITIATED'}</span>
        )
      }
    },
    {
      name: "trackingUrl",
      label: "Tracking",
      options: {
        customBodyRender: (val: string) => (
          val ? (
            <a href={val} target="_blank" rel="noreferrer" className="p-1.5 hover:bg-gray-100 rounded text-[#7A578D] transition-colors flex items-center gap-1">
              <ExternalLink size={12} />
              <span className="text-[8px] font-black uppercase">Track</span>
            </a>
          ) : <span className="text-[8px] font-bold text-gray-300 uppercase">N/A</span>
        )
      }
    },
    {
      name: "updatedAt",
      label: "Last Update",
      options: {
        customBodyRender: (val: string) => (
          <div className="flex items-center gap-2 text-gray-500">
             <Clock size={10} className="text-gray-400" />
             <span className="text-[9px] font-bold uppercase tracking-tight">
                {new Date(val).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}
             </span>
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
    viewColumns: false,
    search: true,
    expandableRows: true, // USER REQ
    expandableRowsOnClick: true, // USER REQ
    renderExpandableRow: (rowData: any, rowMeta: any) => {
      const order = shipments[rowMeta.rowIndex];
      if (!order) return null;
      return (
        <tr className="bg-gray-50/50">
          <td colSpan={columns.length + 1} className="p-0 border-b border-gray-100">
            <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6 animate-in slide-in-from-top-2 duration-300">
               {/* Destination Hub */}
               <div className="space-y-4">
                  <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-[#7A578D] flex items-center gap-2">
                     <MapPin size={12} /> Target Destination
                  </h3>
                  <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm space-y-3">
                     <div className="flex flex-col">
                        <span className="text-[7px] font-black text-gray-400 uppercase tracking-widest mb-1.5">Recipient Identity</span>
                        <div className="flex items-center gap-2">
                           <div className="w-6 h-6 bg-gray-50 rounded-full flex items-center justify-center text-[#7A578D] border border-gray-100 uppercase text-[9px] font-black">
                              {order.address?.name?.[0] || 'U'}
                           </div>
                           <div className="flex flex-col">
                              <span className="text-[10px] font-black uppercase text-gray-900 leading-none">{order.address?.name || 'Anonymous'}</span>
                              <span className="text-[8px] font-bold text-gray-400 lowercase">{order.user?.email}</span>
                           </div>
                        </div>
                     </div>
                     <div className="pt-2 border-t border-gray-50">
                        <span className="text-[7px] font-black text-gray-400 uppercase tracking-widest block mb-1">Shipping Log</span>
                        <p className="text-[9px] font-black text-gray-800 uppercase leading-relaxed">{order.address?.street}</p>
                        <p className="text-[9px] font-black text-gray-800 uppercase">{order.address?.city}, {order.address?.state} - {order.address?.pincode}</p>
                        <p className="text-[#7A578D] font-black italic mt-1 text-[9px]">{order.address?.phone || order.user?.phoneNumber}</p>
                     </div>
                  </div>
               </div>

               {/* Logistics Ledger */}
               <div className="space-y-4 border-l border-gray-100 pl-6">
                  <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-900 flex items-center gap-2">
                     <Truck size={12} /> Fulfillment Ledger
                  </h3>
                  <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm space-y-4">
                     <div className="grid grid-cols-2 gap-4">
                        <div className="flex flex-col">
                           <span className="text-[7px] font-black text-gray-400 uppercase">Courier Hub</span>
                           <span className="text-[10px] font-black text-gray-900 uppercase mt-0.5">{order.courierName || 'NOT_ASSIGNED'}</span>
                        </div>
                        <div className="flex flex-col">
                           <span className="text-[7px] font-black text-gray-400 uppercase">AWB Master</span>
                           <span className="text-[10px] font-black text-[#7A578D] uppercase mt-0.5 underline decoration-dotted">{order.awbNumber || 'PENDING'}</span>
                        </div>
                     </div>
                     <div className="pt-3 border-t border-gray-50 flex flex-col gap-2">
                        <span className="text-[7px] font-black text-gray-400 uppercase">Operational Status</span>
                        <div className={`p-2 rounded-xl border flex items-center justify-between group ${
                           order.shippingStatus?.toLowerCase().includes('delivered') ? 'bg-green-50/50 border-green-100' : 'bg-[#7A578D]/5 border-[#7A578D]/10'
                        }`}>
                           <span className={`text-[10px] font-black uppercase ${
                              order.shippingStatus?.toLowerCase().includes('delivered') ? 'text-green-700' : 'text-[#7A578D]'
                           }`}>
                              {order.shippingStatus || 'INITIATED'}
                           </span>
                           {order.trackingUrl && (
                              <a href={order.trackingUrl} target="_blank" rel="noreferrer" className="bg-white p-1 rounded-lg border border-gray-100 shadow-sm text-[#7A578D] hover:scale-110 transition-transform">
                                 <ExternalLink size={12} />
                              </a>
                           )}
                        </div>
                     </div>
                  </div>
               </div>

               {/* System Activity */}
               <div className="space-y-4 border-l border-gray-100 pl-6">
                  <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-900 flex items-center gap-2">
                     <ShieldCheck size={12} /> Security Archive
                  </h3>
                  <div className="space-y-3">
                     <div className="bg-gray-50 p-3 rounded-xl border border-gray-100 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                           <ShoppingBag size={12} className="text-gray-400" />
                           <span className="text-[8px] font-black text-gray-400 uppercase">Order Ref</span>
                        </div>
                        <span className="text-[10px] font-black text-gray-900 uppercase">#{order.orderNumber || order.id}</span>
                     </div>
                     <div className="bg-gray-50 p-3 rounded-xl border border-gray-100 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                           <Clock size={12} className="text-gray-400" />
                           <span className="text-[8px] font-black text-gray-400 uppercase">Last Sync</span>
                        </div>
                        <span className="text-[9px] font-black text-gray-900 uppercase">{new Date(order.updatedAt).toLocaleTimeString()}</span>
                     </div>
                     <div className="mt-4 p-3 bg-indigo-50/50 border border-indigo-100 rounded-2xl flex flex-col items-center justify-center text-center">
                        <span className="text-[7px] font-black text-indigo-400 uppercase tracking-widest leading-none">Internal Registry</span>
                        <span className="text-[8px] font-mono text-indigo-800 mt-1 uppercase select-all break-all overflow-hidden max-w-full">#{order.id}</span>
                     </div>
                  </div>
               </div>
            </div>
          </td>
        </tr>
      );
    }
  };


  return (
    <div className="space-y-3 animate-in fade-in duration-500">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-gray-100 pb-2 gap-4">
        <div>
          <h1 className="text-lg font-sans font-black uppercase tracking-tight text-gray-900 leading-none">Shipping Rates</h1>
          <p className="text-gray-400 text-[8px] font-black uppercase tracking-[0.2em] mt-1 flex items-center gap-2">
            <Truck size={11} className="text-[#7A578D]" /> Operational Hub
          </p>
        </div>
        <div className="flex items-center gap-2 w-full md:w-auto">
            <button onClick={fetchShipments} className="flex-1 md:flex-none p-1.5 bg-white border border-gray-100 rounded-lg text-gray-400 hover:text-[#7A578D] transition-all active:scale-95 shadow-sm flex items-center justify-center">
                <RefreshCw size={14} />
            </button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
         <div className="lg:col-span-4">
            <div className="bg-white border border-gray-100 rounded-xl overflow-hidden shadow-sm relative min-h-[600px]">
              {loading && (
                 <div className="absolute inset-0 bg-white/50 backdrop-blur-[1px] z-10 flex items-center justify-center">
                    <div className="w-8 h-8 border-2 border-[#7A578D] border-t-transparent rounded-full animate-spin" />
                 </div>
              )}
              <ThemeProvider theme={getMuiTheme()}>
                <MUIDataTable title="" data={shipments} columns={columns} options={options} />
              </ThemeProvider>
            </div>
         </div>
      </div>
    </div>
  );
};

export default ShippingManagement;
