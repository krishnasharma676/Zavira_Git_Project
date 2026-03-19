
import { useState, useEffect } from 'react';
import { Truck, ExternalLink, RefreshCw, Clock } from 'lucide-react';
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
    search: true
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
