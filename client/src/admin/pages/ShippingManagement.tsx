
import { useState, useEffect, useRef } from 'react';
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

  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      fetchShipments();
    }
  }, []);

  const columns = [
    {
      name: "shipmentId",
      label: "Shipment ID",
      options: {
        customBodyRender: (val: string) => <span className="text-xs font-bold uppercase text-gray-900 tracking-wider block max-w-[120px] truncate" title={val}>{val || 'MOCK_PENDING'}</span>
      }
    },
    {
      name: "orderNumber",
      label: "Order ID",
      options: {
        customBodyRender: (val: string) => <span className="text-xs font-bold text-[#7A578D]">#{val.split('-')[2] || val}</span>
      }
    },
    {
      name: "user",
      label: "Customer",
      options: {
        customBodyRender: (user: any) => (
          <div className="flex flex-col">
            <span className="text-xs font-bold uppercase text-gray-900 truncate max-w-[150px]">{user?.name || 'Customer'}</span>
            <span className="text-xs font-medium text-gray-500 lowercase">{user?.email}</span>
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
               <span className="text-xs font-bold text-blue-700">{val || 'Processing...'}</span>
               <span className="text-xs font-bold text-gray-500 uppercase">{row?.courierName || 'Pending Assignment'}</span>
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
          <span className={`px-3 py-1.5 rounded-sm text-xs font-bold uppercase tracking-widest border shadow-sm ${
            val?.toLowerCase().includes('delivered') ? 'bg-green-50 text-green-700 border-green-100' :
            val?.toLowerCase().includes('transit') || val?.toLowerCase().includes('shipped') ? 'bg-blue-50 text-blue-700 border-blue-100' :
            'bg-orange-50 text-orange-700 border-orange-100'
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
            <a href={val} target="_blank" rel="noreferrer" className="p-2 hover:bg-[#7A578D]/10 rounded-sm text-[#7A578D] transition-colors flex items-center justify-center gap-1 border border-transparent hover:border-[#7A578D]/20 shadow-sm w-fit">
              <ExternalLink size={14} />
              <span className="text-xs font-bold uppercase tracking-wider">Track</span>
            </a>
          ) : <span className="text-xs font-bold text-gray-400 uppercase">N/A</span>
        )
      }
    },
    {
      name: "updatedAt",
      label: "Last Update",
      options: {
        customBodyRender: (val: string) => (
          <div className="flex items-center gap-2 text-gray-500">
             <Clock size={14} className="text-gray-400" />
             <span className="text-xs font-bold uppercase tracking-wide text-gray-900">
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
        <tr style={{ backgroundColor: '#fff' }}>
          <td colSpan={columns.length + 1} style={{ padding: '0', borderBottom: '1px solid #eee' }}>
            <div style={{ padding: '16px', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', fontFamily: '"Times New Roman", Times, serif', fontSize: '12px', color: '#333' }}>
              <div>
                <strong style={{ display: 'block', marginBottom: '4px' }}>Customer:</strong>
                <span>{order.address?.name || 'N/A'}</span>
              </div>
              <div>
                <strong style={{ display: 'block', marginBottom: '4px' }}>Phone:</strong>
                <span>{order.address?.phone || order.user?.phoneNumber || 'N/A'}</span>
              </div>
              <div>
                <strong style={{ display: 'block', marginBottom: '4px' }}>Address:</strong>
                <span>{order.address?.street}, {order.address?.city}, {order.address?.state} - {order.address?.pincode}</span>
              </div>
              <div>
                <strong style={{ display: 'block', marginBottom: '4px' }}>Courier:</strong>
                <span>{order.courierName || 'N/A'}</span>
              </div>
              <div>
                <strong style={{ display: 'block', marginBottom: '4px' }}>AWB Number:</strong>
                <span>{order.awbNumber || 'N/A'}</span>
              </div>
              <div>
                <strong style={{ display: 'block', marginBottom: '4px' }}>Order Number:</strong>
                <span>#{order.orderNumber || order.id}</span>
              </div>
              <div>
                <strong style={{ display: 'block', marginBottom: '4px' }}>Last Sync:</strong>
                <span>{new Date(order.updatedAt).toLocaleString()}</span>
              </div>
              <div>
                <strong style={{ display: 'block', marginBottom: '4px' }}>Internal ID:</strong>
                <span>{order.id}</span>
              </div>
            </div>
          </td>
        </tr>
      );
    }
  };


  return (
    <div className="space-y-2 animate-in fade-in duration-500 max-w-[1600px]">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-gray-100 pb-4 gap-2">
        <div>
          <h1 className="text-lg font-bold uppercase tracking-tight text-gray-900 leading-none">Shipping & Logistics</h1>
          <p className="text-gray-500 text-xs font-medium mt-2">Track orders, manage courier assignments, and monitor fulfillment status.</p>
        </div>
        <div className="flex items-center gap-2">
            <button onClick={fetchShipments} className="p-3 bg-white border border-gray-200 rounded-sm text-gray-500 hover:text-[#7A578D] hover:border-[#7A578D] transition-all shadow-sm active:scale-95" title="Refresh Shipments">
                <RefreshCw size={18} />
            </button>
        </div>
      </header>

      <div className="bg-white border border-gray-100 rounded-sm overflow-hidden shadow-sm relative min-h-[600px]">
        {loading && (
           <div className="absolute inset-0 bg-white/60 backdrop-blur-[1px] z-10 flex items-center justify-center">
              <div className="w-6 h-6 border-4 border-[#7A578D] border-t-transparent rounded-full animate-spin" />
           </div>
        )}
        <ThemeProvider theme={getMuiTheme()}>
          <MUIDataTable title="" data={shipments} columns={columns} options={options} />
        </ThemeProvider>
      </div>
    </div>
  );
};

export default ShippingManagement;
