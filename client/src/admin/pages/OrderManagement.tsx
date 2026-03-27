
import { useState, useEffect } from 'react';
import { Eye, Download, RefreshCw, Clock, Package, CheckCircle, Activity, ExternalLink, Printer, ShoppingBag, User, CreditCard, Truck, FileText, Calendar, ArrowLeft, RotateCcw } from 'lucide-react';
import api from '../../api/axios';
import ManagementModal from '../components/ManagementModal';
import toast from 'react-hot-toast';
import MUIDataTable from "mui-datatables";
import { ThemeProvider } from '@mui/material/styles';
import { getMuiTheme } from '../utils/muiTableTheme';
import OrderInvoice from '../components/OrderInvoice';
import { useUIStore } from '../../store/useUIStore';
import { useSettings } from '../../store/useSettings';
import { useNavigate } from 'react-router-dom';

const OrderManagement = () => {
    const navigate = useNavigate();
    const { settings, fetchSettings: fetchGlobalSettings } = useSettings();
    
    // Pagination state
    const [page, setPage] = useState(0);
    const [totalOrders, setTotalOrders] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(20);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isInvoiceOpen, setIsInvoiceOpen] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState<any>(null);
    const [isDetailsLoading, setIsDetailsLoading] = useState(false);
    const [orders, setOrders] = useState<any[]>([]);
    const [stats, setStats] = useState({
        pending: 0,
        shipped: 0,
        delivered: 0,
        total: 0
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [activeTab, setActiveTab] = useState('ALL');

  const tabs = [
    { label: 'All Orders', value: 'ALL' },
    { label: 'Unfulfilled', value: 'PENDING' },
    { label: 'In Transit', value: 'SHIPPED' },
    { label: 'Delivered', value: 'DELIVERED' },
    { label: 'Returns', value: 'RETURNS' },
  ];

  const fetchOrders = async (targetPage = page, targetLimit = rowsPerPage) => {
    try {
      const { data } = await api.get('/orders/admin/all', { 
        params: { 
          page: targetPage + 1, 
          limit: targetLimit,
          status: activeTab === 'ALL' ? undefined : (activeTab === 'RETURNS' ? 'RETURN_REQUESTED' : activeTab)
        } 
      });
      
      const { orders: fetchedOrders, total, stats: fetchedStats } = data.data;
      setOrders(fetchedOrders);
      setTotalOrders(total);
      
      // Update stats from server-side aggregation
      setStats({
        total: total,
        pending: fetchedStats.pending + (fetchedStats.confirmed || 0),
        shipped: fetchedStats.shipped,
        delivered: fetchedStats.delivered
      });
    } catch (error) {
      toast.error('Failed to load orders');
    } finally {
      // Done
    }
  };

  useEffect(() => {
    fetchOrders(page, rowsPerPage);
    fetchGlobalSettings(); // Only fetches once per session thanks to store logic
  }, [page, rowsPerPage, activeTab]);

  const viewOrder = (id: string) => {
    const order = orders.find(o => o.id === id);
    if (order) {
      setSelectedOrder(order);
      setIsModalOpen(true);
    }
  };


  const handleRefund = async (id: string) => {
    const reason = window.prompt('Enter reason for refund:');
    if (reason === null) return;
    
    try {
      await api.post(`/orders/admin/${id}/refund`, { notes: reason });
      toast.success('Refund processed successfully');
      fetchOrders();
      if (selectedOrder?.id === id) {
        viewOrder(id);
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Refund failed');
    }
  };

  const handleNoteUpdate = async (id: string, notes: string) => {
    try {
      await api.patch(`/orders/admin/${id}/notes`, { adminNotes: notes });
      toast.success('Notes updated');
      fetchOrders();
    } catch (error) {
      toast.error('Failed to update notes');
    }
  };

  const handleTriggerShipment = async (id: string) => {
    if (isSubmitting) return;
    try {
      if (!window.confirm("Are you sure you want to trigger Shiprocket for this order?")) return;
      setIsSubmitting(true);
      await api.post(`/orders/admin/${id}/trigger-shipment`);
      toast.success('Shipment triggered successfully');
      await fetchOrders();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to trigger shipment');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleApproveReturn = async (id: string) => {
    try {
      if (!window.confirm("Approve this return request?")) return;
      await api.post(`/orders/admin/${id}/approve-return`);
      toast.success('Return Approved');
      fetchOrders();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to approve return');
    }
  };

  const handleSyncSingleOrder = async (id: string) => {
    try {
      await api.get(`/orders/${id}`); // Refresh single order info
      toast.success('Refreshed');
      await fetchOrders();
    } catch (error) {
       toast.error('Failed to sync');
    } finally {
       // Done
    }
  };

  const syncShiprocketStatus = async () => {
    try {
      await api.post('/orders/admin/sync-shiprocket');
      toast.success('Wait for 5-10 sec all status will be sync');
      await fetchOrders();
    } catch (error: any) {
      toast.error('Sync failed');
    } finally {
      // Done
    }
  };

  const filteredOrders = orders.filter(order => {
    if (activeTab === 'ALL') return true;
    if (activeTab === 'RETURNS') return order.status === 'RETURN_REQUESTED' || order.status === 'RETURNED';
    return order.status === activeTab;
  });

  const getTimelineEvents = (order: any) => {
    const events = [];
    events.push({ label: 'Order Created', time: order.createdAt, done: true });
    
    const isPaymentDone = order.payment?.status === 'COMPLETED';
    events.push({ label: 'Payment Successful', time: isPaymentDone ? order.payment?.updatedAt : null, done: isPaymentDone });
    
    events.push({ label: 'Shipment Created', time: order.shipmentId ? order.updatedAt : null, done: !!order.shipmentId });
    
    const shipped = ['SHIPPED', 'DELIVERED'].includes(order.status);
    events.push({ label: 'Shipped', time: shipped ? order.updatedAt : null, done: shipped });
    
    const delivered = order.status === 'DELIVERED';
    events.push({ label: 'Delivered', time: delivered ? order.updatedAt : null, done: delivered });
    
    if (order.status === 'CANCELLED') {
      events.push({ label: 'Cancelled', time: order.updatedAt, done: true });
    }
    
    return events;
  };

  const columns = [
    {
      name: "orderNumber",
      label: "Order#",
      options: {
        customBodyRender: (val: string, meta: any) => {
          const orderId = orders[meta.rowIndex]?.publicId?.toUpperCase();
          return (
            <div className="flex flex-col">
               <span className="text-[10px] font-black">#{val}</span>
               <span className="text-[7px] text-gray-400 font-mono tracking-tighter">ID: {orderId}</span>
            </div>
          )

        }
      }
    },
    {
      name: "address",
      label: "Customer",
      options: {
        customBodyRender: (val: any, meta: any) => {
          const user = orders[meta.rowIndex]?.user;
          return (
             <div className="flex flex-col leading-tight">
                <span className="text-[10px] font-black uppercase text-gray-900 truncate block max-w-[100px]">{val?.name || user?.name || 'N/A'}</span>
                <span className="text-[8px] font-bold text-gray-400 lowercase truncate block max-w-[120px]">{user?.email || 'N/A'}</span>
             </div>
          )
        }
      }
    },
    {
      name: "address",
      label: "Contact",
      options: {
        customBodyRender: (val: any, meta: any) => {
          const user = orders[meta.rowIndex]?.user;
          return (
            <div className="flex flex-col leading-tight min-w-[100px]">
               <span className="text-[9px] font-black text-[#7A578D]">{val?.phone || user?.phoneNumber || 'N/A'}</span>
               <span className="text-[8px] font-bold text-gray-500 uppercase">{val?.city || 'N/A'}</span>
            </div>
          )
        }
      }
    },
    {
      name: "address",
      label: "Full Address",
      options: {
        customBodyRender: (val: any) => (
          <div className="flex flex-col leading-tight min-w-[200px]">
            <span className="text-[8px] font-bold text-gray-600 uppercase tracking-tighter truncate max-w-[200px]">{val?.street || 'N/A'}</span>
            <span className="text-[7px] font-black text-gray-400 uppercase tracking-widest">{val?.city}, {val?.state} - {val?.pincode}</span>
          </div>
        )
      }
    },
    {
      name: "items",
      label: "Product Details",
      options: {
        customBodyRender: (items: any[]) => (
          <div className="flex flex-col gap-1 py-1 min-w-[180px]">
             {items?.map((item, i) => (
                <div key={i} className="flex items-start gap-2 group">
                   <div className="relative">
                      <img 
                        src={item.variant?.images?.[0]?.imageUrl || item.product?.images?.[0]?.imageUrl || 'https://via.placeholder.com/50?text=NP'} 
                        className="w-7 h-9 object-cover rounded shadow-sm border border-gray-100 group-hover:scale-105 transition-transform" 
                      />
                      <span className="absolute -top-1 -right-1 bg-[#7A578D] text-white text-[6px] font-black w-3 h-3 flex items-center justify-center rounded-full border border-white">
                        {item.quantity}
                      </span>
                   </div>
                   <div className="flex flex-col leading-tight pt-0.5">
                      <span className="text-[9px] font-black text-gray-800 uppercase truncate max-w-[140px] block" title={item.product?.name}>
                        {item.product?.name}
                      </span>
                      <div className="flex flex-wrap gap-1 items-center mt-1">
                         <span className="text-[7px] font-black text-blue-600 bg-blue-50 px-1 rounded uppercase tracking-tighter">
                            SKU: {
                              item.variant?.sizes?.find((s: any) => s.size === item.selectedSize)?.sku || 
                              item.variant?.sku || 
                              item.product?.inventory?.sku || 
                              'N/A'
                            }
                         </span>
                         {item.selectedSize && (
                            <span className="text-[7px] font-black text-[#7A578D] bg-[#7A578D]/5 px-1 rounded uppercase tracking-tighter">
                               Size: {item.selectedSize}
                            </span>
                         )}
                         {item.variant?.color && (
                            <span className="text-[7px] font-black text-gray-500 bg-gray-50 px-1 rounded uppercase tracking-tighter">
                               Col: {item.variant.color}
                            </span>
                         )}
                      </div>
                   </div>
                </div>
             )).slice(0, 2)}
             {items?.length > 2 && (
                <span className="text-[7px] font-black text-[#7A578D] ml-9 border-t border-dashed border-[#7A578D]/20 pt-0.5">
                   +{items.length - 2} more items in this order
                </span>
             )}
          </div>
        )
      }
    },
    {
      name: "payableAmount",
      label: "Amount",
      options: {
        customBodyRender: (val: number, meta: any) => {
          const method = orders[meta.rowIndex]?.paymentMethod;
          return (
            <div className="flex flex-col">
               <span className="text-[11px] font-black text-gray-900">₹{val.toLocaleString()}</span>
               <span className={`text-[7px] font-black uppercase tracking-widest ${method === 'ONLINE' ? 'text-blue-500' : 'text-orange-500'}`}>{method}</span>
            </div>
          )
        }
      }
    },
    {
      name: "status",
      label: "Delivery",
      options: {
        customBodyRender: (val: string) => (
          <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest ${
            val === 'DELIVERED' ? 'bg-green-50 text-green-600' :
            val === 'SHIPPED' ? 'bg-blue-50 text-blue-600' :
            val === 'CANCELLED' ? 'bg-red-50 text-red-600' :
            'bg-orange-50 text-orange-600'
          }`}>{val}</span>
        )
      }
    },
    {
      name: "createdAt",
      label: "Time",
      options: {
        customBodyRender: (val: string) => (
          <div className="flex flex-col">
             <span className="text-[9px] font-black text-gray-700">{new Date(val).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }).toUpperCase()}</span>
             <span className="text-[7px] font-bold text-gray-400">{new Date(val).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
          </div>
        )
      }
    },
    {
      name: "id",
      label: "Actions",
      options: {
        customBodyRender: (id: string, meta: any) => {
          const order = orders[meta.rowIndex];
          if (!order) return null;
          
          return (
            <div className="flex items-center gap-1">
              <button 
                 onClick={() => viewOrder(id)} 
                 className="px-2 py-1 bg-[#7A578D]/5 hover:bg-[#7A578D]/10 text-[#7A578D] text-[8px] font-black uppercase tracking-widest rounded transition-all border border-[#7A578D]/10"
              >
                 VIEW
              </button>
              
              <button 
                 onClick={() => { setSelectedOrder(order); setIsInvoiceOpen(true); }}
                 className="px-2 py-1 bg-gray-50 hover:bg-gray-100 text-gray-600 text-[8px] font-black uppercase tracking-widest rounded transition-all border border-gray-100"
              >
                 BILL
              </button>

              {['PENDING', 'CONFIRMED'].includes(order.status) && !order.shipmentId && (
                <button 
                   onClick={() => handleTriggerShipment(id)}
                   className="px-2 py-1 bg-green-500 text-white hover:bg-black text-[8px] font-black uppercase tracking-widest rounded transition-all border border-green-500 shadow-lg shadow-green-200"
                >
                   SHIP NOW
                </button>
              )}

              {order.shipmentId && order.status !== 'DELIVERED' && (
                 <button 
                    onClick={() => handleSyncSingleOrder(id)}
                    className="px-2 py-1 bg-blue-50 text-blue-600 hover:bg-blue-100 text-[8px] font-black uppercase tracking-widest rounded transition-all border border-blue-100"
                 >
                    SYNC
                 </button>
              )}

              {order.status === 'RETURN_REQUESTED' && (
                <button 
                   onClick={() => handleApproveReturn(id)}
                   className="px-2 py-1 bg-orange-50 text-orange-600 hover:bg-orange-100 text-[8px] font-black uppercase tracking-widest rounded transition-all border border-orange-100"
                >
                   APPROVE
                </button>
              )}
            </div>
          );
        }
      }
    }
  ];

  const options = {
    serverSide: true,
    count: totalOrders,
    page: page,
    rowsPerPage: rowsPerPage,
    selectableRows: 'none' as const,
    elevation: 0,
    responsive: 'standard' as const,
    download: true,
    print: false,
    filter: true,
    search: true,
    expandableRows: true,
    expandableRowsOnClick: true,
    renderExpandableRow: (rowData: any, rowMeta: any) => {
      const order = filteredOrders[rowMeta.rowIndex];
      if (!order) return null;
      return (
        <tr style={{ backgroundColor: '#fff' }}>
          <td colSpan={columns.length + 1} style={{ padding: '0', borderBottom: '1px solid #eee' }}>
            <div style={{ padding: '20px', display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px', fontFamily: '"Times New Roman", Times, serif', fontSize: '13px', color: '#333' }}>
               <div style={{ gridColumn: 'span 1' }}>
                <strong style={{ display: 'block', marginBottom: '4px', textTransform: 'uppercase', fontSize: '11px', color: '#7A578D' }}>Internal Order ID:</strong>
                <span>{order.id}</span>
               </div>
              <div style={{ gridColumn: 'span 1' }}>
                <strong style={{ display: 'block', marginBottom: '4px', textTransform: 'uppercase', fontSize: '11px', color: '#7A578D' }}>Placed On:</strong>
                <span>{new Date(order.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' })} at {new Date(order.createdAt).toLocaleTimeString()}</span>
              </div>

              <div style={{ gridColumn: 'span 1' }}>
                <strong style={{ display: 'block', marginBottom: '4px', textTransform: 'uppercase', fontSize: '11px', color: '#7A578D' }}>Amount Payable:</strong>
                <span style={{ fontWeight: 'black', fontSize: '14px' }}>₹{order.payableAmount?.toLocaleString()}</span>
              </div>
              <div style={{ gridColumn: 'span 1' }}>
                <strong style={{ display: 'block', marginBottom: '4px', textTransform: 'uppercase', fontSize: '11px', color: '#7A578D' }}>Payment Method & Status:</strong>
                <span className="uppercase">{order.paymentMethod} - {order.payment?.status || 'PENDING'}</span>
              </div>
              
              <div style={{ gridColumn: 'span 1' }}>
                <strong style={{ display: 'block', marginBottom: '4px', textTransform: 'uppercase', fontSize: '11px', color: '#7A578D' }}>Payment Trans ID:</strong>
                <span>{order.payment?.transactionId || 'N/A (COD/Pending)'}</span>
              </div>
              <div style={{ gridColumn: 'span 1' }}>
                <strong style={{ display: 'block', marginBottom: '4px', textTransform: 'uppercase', fontSize: '11px', color: '#7A578D' }}>Tracking / AWB Number:</strong>
                <span>{order.awbNumber || 'Awaiting Shipment Trigger'}</span>
              </div>

              <div style={{ gridColumn: 'span 2', padding: '12px', background: '#f9f9f9', border: '1px solid #eee' }}>
                <strong style={{ display: 'block', marginBottom: '4px', textTransform: 'uppercase', fontSize: '11px', color: '#7A578D' }}>Full Delivery Address (Customer Dossier):</strong>
                <span className="uppercase" style={{ lineHeight: '1.6' }}>
                  {order.address?.street}, {order.address?.area}, {order.address?.city}, {order.address?.state} - {order.address?.pincode}
                </span>
              </div>

              <div style={{ gridColumn: 'span 1' }}>
                <strong style={{ display: 'block', marginBottom: '4px', textTransform: 'uppercase', fontSize: '11px', color: '#7A578D' }}>Customer Email:</strong>
                <span className="lowercase">{order.user?.email || 'N/A'}</span>
              </div>
              <div style={{ gridColumn: 'span 1' }}>
                <strong style={{ display: 'block', marginBottom: '4px', textTransform: 'uppercase', fontSize: '11px', color: '#7A578D' }}>Courier Partner:</strong>
                <span className="uppercase">{order.courierName || 'Pending Assignment'}</span>
              </div>

              <div style={{ gridColumn: 'span 2' }}>
                <strong style={{ display: 'block', marginBottom: '4px', textTransform: 'uppercase', fontSize: '11px', color: '#7A578D' }}>Admin Operational Notes:</strong>
                <p style={{ margin: 0, fontStyle: order.adminNotes ? 'normal' : 'italic', color: order.adminNotes ? '#333' : '#999', lineHeight: '1.5' }}>
                   {order.adminNotes || 'No internal notes found for this order dossier.'}
                </p>
              </div>
            </div>
          </td>
        </tr>
      );
    },
    onTableChange: (action: string, tableState: any) => {
      switch (action) {
        case 'changePage':
          setPage(tableState.page);
          break;
        case 'changeRowsPerPage':
          setRowsPerPage(tableState.rowsPerPage);
          setPage(0);
          break;
      }
    }
  };


  if (isInvoiceOpen && selectedOrder) {
     return (
        <div className="fixed inset-0 z-[200] bg-white overflow-auto no-scrollbar p-0 md:p-2 animate-in fade-in duration-300">
           {/* Controls overlay (hidden on print) */}
           <div className="print:hidden sticky top-2 mb-4 flex justify-center gap-2">
              <button 
                 onClick={() => setIsInvoiceOpen(false)}
                 className="bg-black text-white px-2 py-1 rounded-full text-[10px] font-black uppercase tracking-widest shadow-xl flex items-center gap-2"
              >
                 <ArrowLeft size={14}/> BACK TO HUB
              </button>
              <button 
                 onClick={() => window.print()}
                 className="bg-[#7A578D] text-white px-2 py-1 rounded-full text-[10px] font-black uppercase tracking-widest shadow-xl flex items-center gap-2"
              >
                 <Printer size={14}/> PRINT INVOICE
              </button>
           </div>
           
           {/* The actual invoice */}
           <OrderInvoice order={selectedOrder} settings={settings} />
           
           {/* Print instructions for user */}
           <div className="print:hidden mt-8 text-center text-gray-400 max-w-md mx-auto">
              <p className="text-[10px] font-black uppercase tracking-widest">Printer Settings</p>
              <p className="text-[8px] font-bold mt-1 uppercase">For best results, enable 'Background Graphics' and set 'Margins' to Default in your browser's print dialog.</p>
           </div>
        </div>
     );
  }

  return (
    <div className="space-y-2 animate-in fade-in duration-500 max-w-[1600px]">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-gray-100 pb-4 gap-2">
        <div>
           <h1 className="text-lg font-bold text-gray-900 tracking-tight">Order Management</h1>
           <div className="flex items-center gap-2 mt-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="text-xs font-medium text-gray-500">Live synchronization active</span>
           </div>
        </div>
        <div className="flex items-center space-x-3">
           <button onClick={syncShiprocketStatus} disabled={isSubmitting} className="px-2 py-1 bg-blue-50 border border-blue-100 rounded-sm text-blue-600 hover:bg-blue-100 transition-all shadow-sm flex items-center gap-2 font-bold text-xs disabled:opacity-50">
              <RefreshCw size={16} className={isSubmitting ? 'animate-spin' : ''} />
              <span>SYNC STATUS</span>
           </button>
           <button onClick={() => fetchOrders()} className="p-2.5 bg-white border border-gray-200 rounded-sm text-gray-500 hover:text-[#7A578D] hover:border-[#7A578D] hover:rotate-180 transition-all duration-500 shadow-sm flex items-center gap-2">
              <RefreshCw size={18} />
           </button>
           <button className="bg-black text-white px-2 py-1 rounded-sm text-xs font-bold flex items-center gap-2 hover:bg-[#7A578D] transition-all shadow-md active:scale-95">
              <Download size={16} />
              <span>EXPORT</span>
           </button>
        </div>
      </header>

      <div className="flex items-center gap-2 p-1.5 bg-gray-50/80 rounded-sm overflow-x-auto no-scrollbar w-fit border border-gray-100">
         {tabs.map((tab) => (
            <button
               key={tab.value}
               onClick={() => setActiveTab(tab.value)}
               className={`px-2 py-1 rounded-sm text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap ${
                  activeTab === tab.value 
                  ? 'bg-white text-[#7A578D] shadow-sm border border-gray-200' 
                  : 'text-gray-500 hover:text-gray-800 hover:bg-white/50'
               }`}
            >
               {tab.label}
            </button>
         ))}
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
        {[
          { label: 'Unfulfilled Orders', value: stats.pending, color: 'text-orange-600', bg: 'bg-orange-50', icon: Clock },
          { label: 'In Transit', value: stats.shipped, color: 'text-blue-600', bg: 'bg-blue-50', icon: Package },
          { label: 'Successfully Delivered', value: stats.delivered, color: 'text-emerald-600', bg: 'bg-emerald-50', icon: CheckCircle },
          { label: 'Total Volume', value: stats.total, color: 'text-[#7A578D]', bg: 'bg-[#7A578D]/5', icon: Activity },
        ].map((chip) => (
          <div key={chip.label} className="bg-white border border-gray-100 p-2 rounded-sm flex items-center space-x-4 shadow-sm group hover:border-[#7A578D]/30 transition-all">
            <div className={`w-6 h-6 rounded-sm ${chip.bg} flex items-center justify-center ${chip.color} group-hover:scale-110 transition-transform`}>
               <chip.icon size={24} />
            </div>
            <div className="flex flex-col">
               <span className="text-lg font-bold text-gray-900 leading-none mb-1">{chip.value}</span>
               <span className="text-gray-500 text-xs font-medium">{chip.label}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white border border-gray-100 rounded-sm overflow-hidden shadow-sm relative min-h-[200px]">
        {isDetailsLoading && !selectedOrder && (
           <div className="absolute inset-0 bg-white/60 backdrop-blur-[1px] z-10 flex items-center justify-center">
              <div className="w-6 h-6 border-4 border-[#7A578D] border-t-transparent rounded-full animate-spin" />
           </div>
        )}
        <ThemeProvider theme={getMuiTheme()}>
          <MUIDataTable title="" data={filteredOrders} columns={columns} options={options} />
        </ThemeProvider>
      </div>

      <ManagementModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title={`Order: ${selectedOrder?.orderNumber.split('-')[2] || selectedOrder?.orderNumber}`}
      >
        {isDetailsLoading && !selectedOrder && (
           <div className="flex flex-col items-center justify-center py-1 gap-2">
              <RefreshCw className="w-8 h-8 text-[#7A578D] animate-spin" />
              <p className="text-[10px] font-black uppercase tracking-widest text-[#7A578D]">Retrieving Secure Dossier...</p>
           </div>
        )}
        {selectedOrder && (
           <div className={`space-y-2 animate-in fade-in duration-300`}>
              
              {/* Order Header / Action Bar */}
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-gray-50 p-2 rounded-sm border border-gray-100 gap-2">
                 <div>
                    <div className="flex items-center gap-2">
                       <h2 className="text-lg font-black text-gray-900">
                          ORDER #{selectedOrder.orderNumber.split('-')[2] || selectedOrder.orderNumber}
                       </h2>
                       <span className={`px-2.5 py-1 rounded-sm text-[10px] font-black uppercase tracking-widest ${
                          selectedOrder.status === 'DELIVERED' ? 'bg-green-100 text-green-700' :
                          selectedOrder.status === 'SHIPPED' ? 'bg-blue-100 text-blue-700' :
                          selectedOrder.status === 'CANCELLED' ? 'bg-red-100 text-red-700' :
                          'bg-orange-100 text-orange-700'
                       }`}>
                          {selectedOrder.status}
                       </span>
                    </div>
                    <p className="text-xs font-medium text-gray-500 mt-1">Placed on {new Date(selectedOrder.createdAt).toLocaleString()}</p>
                 </div>

                 <div className="flex flex-wrap gap-2 items-center">
                    {!selectedOrder.shipmentId && !['CANCELLED', 'REFUNDED', 'SHIPPED', 'DELIVERED'].includes(selectedOrder.status) && (
                       <button 
                          onClick={() => handleTriggerShipment(selectedOrder.id)}
                          className="flex items-center gap-2 text-xs font-bold bg-black text-white px-3 py-1.5 rounded-sm hover:bg-[#7A578D] transition-all shadow-lg shadow-gray-200"
                       >
                          <Package size={16} /> SHIP ORDER (Shiprocket)
                       </button>
                    )}



                    <button 
                        onClick={() => setIsInvoiceOpen(true)}
                        className="flex items-center gap-2 text-xs font-bold bg-white border border-gray-200 text-gray-700 px-2 py-1 rounded-sm hover:bg-gray-50 transition-all"
                    >
                        <Printer size={16} /> PRINT INVOICE
                    </button>
                 </div>
              </div>

              {/* Status Management (Simplified) */}
              <div className="bg-white p-2 rounded-sm border border-gray-100 flex items-center justify-between">
                 <div className="flex items-center gap-2">
                    <div className="p-2 bg-blue-50 rounded-sm text-blue-600">
                       <Activity size={20} />
                    </div>
                    <div>
                       <p className="text-xs font-bold text-gray-900 uppercase tracking-widest">Tracking Status</p>
                       <p className="text-xs font-medium text-gray-500">{selectedOrder.shippingStatus || 'Awaiting Logistics Initialization'}</p>
                    </div>
                 </div>
                 {selectedOrder.awbNumber && (
                    <div className="text-right">
                       <p className="text-[10px] font-black text-gray-400 uppercase">AWB ID</p>
                       <p className="text-xs font-mono font-bold text-[#7A578D]">{selectedOrder.awbNumber}</p>
                    </div>
                 )}
              </div>

              <div className="grid grid-cols-12 gap-2">
                 
                 <div className="col-span-12 lg:col-span-8 space-y-1">
                                        <div className="bg-white rounded-sm border border-gray-100 overflow-hidden shadow-sm">
                       <div className="bg-gray-50 px-2 py-1 border-b border-gray-100 flex justify-between items-center">
                          <h3 className="text-xs font-black uppercase tracking-widest text-gray-900 flex items-center gap-2">
                             <ShoppingBag size={14} /> Items Ledger
                          </h3>
                       </div>
                       <div className="p-2 space-y-1">
                          {selectedOrder.items?.map((item: any) => (
                              <div key={item.id} className="flex items-center gap-2 bg-gray-50/50 p-3 rounded-sm border border-transparent hover:border-gray-200 hover:bg-white transition-all">
                                 <img src={item.variant?.images?.[0]?.imageUrl || item.product?.images?.[0]?.imageUrl || 'https://via.placeholder.com/100'} 
                                    className="w-6 h-16 object-cover rounded-sm bg-gray-100 shadow-sm" />
                                 <div className="flex-1">
                                    <h4 className="text-xs font-black uppercase text-gray-900 truncate max-w-[300px]">{item.product?.name}</h4>
                                    <div className="flex flex-wrap gap-2 mt-1">
                                       <span className="text-[10px] font-bold text-gray-500">QTY: {item.quantity}</span>
                                       {item.selectedSize && <span className="text-[10px] font-black text-[#7A578D] bg-[#7A578D]/5 px-2 py-0.5 rounded uppercase">SIZE: {item.selectedSize}</span>}
                                       {item.variant?.color && <span className="text-[10px] font-black text-gray-500 bg-gray-100 px-2 py-0.5 rounded uppercase">COLOR: {item.variant.color}</span>}
                                       <span className="text-[10px] font-black text-blue-600 uppercase ml-auto">
                                          SKU: {
                                            item.variant?.sizes?.find((s: any) => s.size === item.selectedSize)?.sku || 
                                            item.variant?.sku || 
                                            item.product?.inventory?.sku || 
                                            'N/A'
                                          }
                                       </span>
                                    </div>
                                 </div>
                                 <div className="text-right">
                                    <span className="text-xs font-black text-gray-900 block leading-none">₹{(item.price * item.quantity).toLocaleString()}</span>
                                    <span className="text-[10px] font-bold text-gray-400">@ ₹{item.price.toLocaleString()}</span>
                                 </div>
                              </div>
                          ))}
                       </div>
                       
                       <div className="bg-gray-50 p-2 flex justify-end border-t border-gray-100">
                           <div className="w-64 space-y-2">
                              <div className="flex justify-between text-xs font-bold text-gray-500 uppercase tracking-widest">
                                 <span>Sub-Total</span><span>₹{selectedOrder.totalAmount?.toLocaleString()}</span>
                              </div>
                              {selectedOrder.discountAmount > 0 && (
                                  <div className="flex justify-between text-xs font-bold text-green-600 uppercase tracking-widest">
                                     <span>Voucher</span><span>-₹{selectedOrder.discountAmount?.toLocaleString()}</span>
                                  </div>
                              )}
                              <div className="flex justify-between text-xs font-bold text-gray-500 uppercase tracking-widest">
                                 <span>Shipping</span><span>₹{selectedOrder.shippingCharges?.toLocaleString()}</span>
                              </div>
                              <div className="flex justify-between font-black pt-2 text-base border-t border-gray-200">
                                 <span className="text-gray-900">Total</span><span className="text-[#7A578D]">₹{selectedOrder.payableAmount?.toLocaleString()}</span>
                              </div>
                           </div>
                       </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                        <div className="bg-white p-2 rounded-sm border border-gray-100 shadow-sm">
                           <h3 className="text-xs font-black uppercase tracking-widest text-[#7A578D] flex items-center gap-2 mb-3">
                              <User size={14} /> Customer Info
                           </h3>
                           <div className="space-y-2">
                              <p className="text-xs font-black text-gray-900 uppercase">{selectedOrder.address?.name}</p>
                              <p className="text-xs font-medium text-gray-500 lowercase">{selectedOrder.user?.email}</p>
                              <div className="text-xs font-bold text-gray-700 uppercase leading-relaxed mt-2 pt-2 border-t border-gray-100">
                                 <p className="mb-1 text-gray-500 font-medium normal-case">{selectedOrder.address?.street}</p>
                                 <p>{selectedOrder.address?.city}, {selectedOrder.address?.pincode}</p>
                                 <p className="text-[#7A578D] font-black mt-2">{selectedOrder.address?.phone}</p>
                              </div>
                           </div>
                        </div>

                        <div className="bg-white p-2 rounded-sm border border-gray-100 shadow-sm">
                           <h3 className="text-xs font-black uppercase tracking-widest text-[#7A578D] flex items-center gap-2 mb-3">
                              <Clock size={14} /> Order Timeline
                           </h3>
                           <div className="relative border-l-2 border-gray-100 ml-2 space-y-1 py-1">
                               {getTimelineEvents(selectedOrder).slice(-3).map((event, i) => (
                                  <div key={i} className={`pl-4 relative ${event.done ? 'opacity-100' : 'opacity-30'}`}>
                                     <div className={`absolute w-2 h-2 rounded-full -left-[5px] top-1 border-2 border-white ${event.done ? 'bg-[#7A578D]' : 'bg-gray-300'}`} />
                                     <p className="text-xs font-bold uppercase tracking-widest text-gray-900 leading-none">{event.label}</p>
                                     {event.time && <p className="text-[10px] font-medium text-gray-400 mt-1">{new Date(event.time).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>}
                                  </div>
                               ))}
                           </div>
                        </div>
                    </div>
                 </div>
                 <div className="col-span-12 lg:col-span-4 space-y-1">
                    <div className="bg-white p-2 rounded-sm border border-gray-100 shadow-sm">
                       <h3 className="text-xs font-black uppercase tracking-widest text-[#7A578D] flex items-center gap-2 mb-4">
                          <CreditCard size={14} /> Settlement
                       </h3>
                       <div className="space-y-1">
                           <div className="flex justify-between items-center bg-gray-50 p-2.5 rounded-sm border border-gray-100">
                               <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Mode</span>
                               <span className="text-xs font-black text-gray-900 uppercase">{selectedOrder.payment?.paymentMethod || 'COD'}</span>
                           </div>
                           <div className="flex justify-between items-center bg-gray-50 p-2.5 rounded-sm border border-gray-100">
                               <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Merchant</span>
                               <span className="text-xs font-black text-[#7A578D] uppercase">{selectedOrder.payment?.paymentMethod === 'COD' ? 'CASH' : 'RAZORPAY'}</span>
                           </div>
                           {selectedOrder.payment?.transactionId && (
                               <div className="space-y-1 mt-2">
                                   <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest block ml-1">Reference ID</span>
                                   <span className="text-xs font-mono font-bold text-gray-900 break-all bg-gray-50 p-2.5 rounded-sm block border border-gray-100 leading-tight">
                                      {selectedOrder.payment.transactionId}
                                   </span>
                               </div>
                           )}
                       </div>
                    </div>

                    <div className="bg-white p-2 rounded-sm border border-gray-100 shadow-sm">
                       <h3 className="text-xs font-black uppercase tracking-widest text-[#7A578D] flex items-center gap-2 mb-4">
                          <Truck size={14} /> Shipping Hub
                       </h3>
                       <div className="space-y-1">
                           <div className="flex justify-between items-center text-xs font-bold uppercase tracking-widest">
                               <span className="text-gray-400">Carrier</span>
                               <span className="text-gray-900 uppercase text-right">{selectedOrder.courierName || 'Pending Assignment'}</span>
                           </div>
                           <div className="flex justify-between items-center text-xs font-bold uppercase tracking-widest py-1 border-y border-gray-50">
                               <span className="text-gray-400">Status</span>
                               <span className="text-emerald-600 font-black text-right uppercase">{selectedOrder.shippingStatus || 'Unfulfilled'}</span>
                           </div>
                           <div className="pt-1">
                               <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-1.5 ml-1">Tracking Number</span>
                               <div className="flex items-center justify-between bg-gray-50 p-2.5 rounded-sm border border-gray-100">
                                  <span className="text-xs font-mono font-black text-[#7A578D]">
                                     {selectedOrder.awbNumber || 'WAITING FOR PACKUP'}
                                  </span>
                                  {selectedOrder.trackingUrl && (
                                     <a href={selectedOrder.trackingUrl} target="_blank" rel="noreferrer" className="text-[#7A578D] hover:text-black">
                                        <ExternalLink size={14}/>
                                     </a>
                                  )}
                               </div>
                           </div>
                       </div>
                    </div>

                    <div className="bg-[#7A578D]/5 p-2 rounded-sm border border-[#7A578D]/10">
                       <h3 className="text-xs font-black uppercase tracking-widest text-[#7A578D] flex items-center gap-2 mb-3">
                          <FileText size={14} /> Internal Dossier
                       </h3>
                       <textarea 
                          className="w-full bg-white border border-[#7A578D]/20 rounded-sm p-3 text-xs font-medium text-gray-700 outline-none focus:border-[#7A578D] resize-none shadow-sm placeholder:text-gray-300"
                          rows={3}
                          placeholder="Internal notes for operations..."
                          defaultValue={selectedOrder.adminNotes || ''}
                          onBlur={(e) => {
                            if (e.target.value !== selectedOrder.adminNotes) {
                              handleNoteUpdate(selectedOrder.id, e.target.value);
                            }
                          }}
                       />
                    </div>
                 </div>
              </div>
           </div>
        )}
      </ManagementModal>
    </div>
  );
};

export default OrderManagement;
