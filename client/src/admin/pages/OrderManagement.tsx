
import { useState, useEffect } from 'react';
import { Eye, Download } from 'lucide-react';
import api from '../../api/axios';
import ManagementModal from '../components/ManagementModal';
import toast from 'react-hot-toast';
import MUIDataTable from "mui-datatables";
import { ThemeProvider } from '@mui/material/styles';
import { getMuiTheme } from '../utils/muiTableTheme';

const OrderManagement = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    pending: 0,
    shipped: 0,
    delivered: 0,
    total: 0
  });

  const fetchOrders = async () => {
    try {
      const { data } = await api.get('/orders/admin/all', { params: { limit: 100 } });
      const fetchedOrders = data.data.orders;
      setOrders(fetchedOrders);
      
      const s = fetchedOrders.reduce((acc: any, curr: any) => {
        if (curr.status === 'PENDING') acc.pending++;
        if (curr.status === 'SHIPPED') acc.shipped++;
        if (curr.status === 'DELIVERED') acc.delivered++;
        return acc;
      }, { pending: 0, shipped: 0, delivered: 0 });
      
      setStats({ ...s, total: fetchedOrders.length });
    } catch (error) {
      toast.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const viewOrder = async (id: string) => {
    try {
      const { data } = await api.get(`/orders/${id}`);
      setSelectedOrder(data.data);
      setIsModalOpen(true);
    } catch (error) {
      toast.error('Failed to load order details');
    }
  };

  const handleStatusUpdate = async (id: string, newStatus: string) => {
    try {
      await api.patch(`/orders/admin/${id}/status`, { status: newStatus });
      toast.success('Status updated');
      fetchOrders();
      if (selectedOrder?.id === id) {
        viewOrder(id);
      }
    } catch (error) {
      toast.error('Failed to update status');
    }
  };




  const columns = [
    {
      name: "orderNumber",
      label: "Order#",
      options: {
        customBodyRender: (val: string) => <span className="tracking-tighter">#{val.split('-')[2] || val.slice(-6)}</span>
      }
    },
    {
      name: "user",
      label: "Customer",
      options: {
        customBodyRender: (val: any) => (
          <div className="flex flex-col truncate max-w-[120px]">
             <span>{val?.name || 'N/A'}</span>
             <span className="text-[8px] text-gray-400 lowercase">{val?.email}</span>
          </div>
        )
      }
    },
    {
      name: "createdAt",
      label: "Date",
      options: {
        customBodyRender: (val: string) => <span>{new Date(val).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }).toUpperCase()}</span>
      }
    },
    {
      name: "payableAmount",
      label: "Total",
      options: {
        customBodyRender: (val: number) => <span className="italic">₹{val.toLocaleString()}</span>
      }
    },
    {
      name: "status",
      label: "Status",
      options: {
        customBodyRender: (val: string) => (
          <span className={`px-2 py-0.5 rounded text-[8px] ${
            val === 'DELIVERED' ? 'bg-green-50 text-green-600' :
            val === 'SHIPPED' ? 'bg-blue-50 text-blue-600' :
            'bg-orange-50 text-orange-600'
          }`}>{val}</span>
        )
      }
    },
    {
      name: "id",
      label: "Actions",
      options: {
        customBodyRender: (id: string) => (
          <button onClick={() => viewOrder(id)} className="p-1.5 hover:bg-[#7A578D]/10 text-[#7A578D] rounded transition-colors"><Eye size={14} /></button>
        )
      }
    }
  ];

  const options = {
    selectableRows: 'none' as const,
    elevation: 0,
    responsive: 'standard' as const,
    rowsPerPage: 10,
    download: false,
    print: false,
    viewColumns: false
  };

  return (
    <div className="space-y-4 animate-in fade-in duration-500">
      <header className="flex justify-between items-center border-b border-gray-100 pb-4">
        <div>
          <h1 className="text-xl font-sans font-black uppercase tracking-tight text-gray-900 leading-none">Orders</h1>
          <p className="text-gray-400 text-[8px] font-bold uppercase tracking-widest mt-1.5">Manage and fulfill orders</p>
        </div>
        <button className="bg-white border border-gray-200 px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest flex items-center space-x-2 hover:bg-black hover:text-white transition-all">
          <Download size={12} />
          <span>Export</span>
        </button>
      </header>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: 'Pending', value: stats.pending, color: 'text-orange-600', bg: 'bg-orange-50' },
          { label: 'Shipped', value: stats.shipped, color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: 'Delivered', value: stats.delivered, color: 'text-green-600', bg: 'bg-green-50' },
          { label: 'Total', value: stats.total, color: 'text-[#7A578D]', bg: 'bg-red-50' },
        ].map((chip) => (
          <div key={chip.label} className="bg-white border border-gray-100 p-3 rounded-xl flex items-center space-x-3 shadow-sm italic text-[11px] font-black uppercase tracking-widest">
            <div className={`w-8 h-8 rounded-lg ${chip.bg} flex items-center justify-center ${chip.color} shadow-inner`}>
               <span>{chip.value}</span>
            </div>
            <span className="text-gray-400 text-[9px]">{chip.label}</span>
          </div>
        ))}
      </div>

      <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
        <ThemeProvider theme={getMuiTheme()}>
          <MUIDataTable title="" data={orders} columns={columns} options={options} />
        </ThemeProvider>
      </div>

      <ManagementModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title={`Order: ${selectedOrder?.orderNumber.split('-')[2]}`}
      >
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
             <div className="bg-gray-50 border border-gray-50 p-3 rounded-xl italic">
                <span className="text-[9px] font-black uppercase tracking-widest text-[#7A578D] mb-1 block">Customer</span>
                <p className="text-[11px] font-black text-gray-900 uppercase truncate">{selectedOrder?.user?.name}</p>
                <p className="text-[9px] text-gray-400 lowercase truncate">{selectedOrder?.user?.email}</p>
             </div>
             <div className="bg-gray-50 border border-gray-50 p-3 rounded-xl italic">
                <span className="text-[9px] font-black uppercase tracking-widest text-[#7A578D] mb-1 block">Update Status</span>
                <div className="flex gap-1.5">
                  {['PENDING', 'SHIPPED', 'DELIVERED'].map(s => (
                    <button 
                      key={s}
                      onClick={() => handleStatusUpdate(selectedOrder.id, s)}
                      className={`text-[8px] font-black px-2 py-1 rounded border transition-all ${selectedOrder?.status === s ? 'bg-[#7A578D] border-[#7A578D] text-white' : 'bg-white border-gray-100 text-gray-400'}`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
             </div>
          </div>

          <div className="p-3 bg-gray-50 rounded-xl border border-gray-50 italic">
            <span className="text-[9px] font-black uppercase tracking-widest text-[#7A578D] mb-2 block">Order Items</span>
            <div className="space-y-2">
              {selectedOrder?.items?.map((item: any) => (
                <div key={item.id} className="flex items-center justify-between text-[10px] font-black uppercase tracking-tight">
                   <div className="flex items-center space-x-3">
                      <img src={item.product?.images?.[0]?.imageUrl || 'https://via.placeholder.com/100'} className="w-8 h-10 object-cover rounded shadow-sm border border-gray-100" />
                      <div>
                        <p className="text-gray-900">{item.product?.name}</p>
                        <p className="text-gray-400">Qty: {item.quantity} × ₹{item.price}</p>
                      </div>
                   </div>
                   <span className="text-[#7A578D]">₹{(item.price * item.quantity).toLocaleString()}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </ManagementModal>
    </div>
  );
};

export default OrderManagement;
