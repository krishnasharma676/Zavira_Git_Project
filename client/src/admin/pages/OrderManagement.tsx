
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

const OrderManagement = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isInvoiceOpen, setIsInvoiceOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [settings, setSettings] = useState<any>(null);
  const [orders, setOrders] = useState<any[]>([]);
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
    }
  };

  const fetchSettings = async () => {
    try {
      const { data } = await api.get('/settings');
      setSettings(data.data);
    } catch (e) {}
  };

  useEffect(() => {
    fetchOrders();
    fetchSettings();
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
    try {
      if (!window.confirm("Are you sure you want to trigger Shiprocket for this order?")) return;
      await api.post(`/orders/admin/${id}/trigger-shipment`);
      toast.success('Shipment triggered successfully');
      fetchOrders();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to trigger shipment');
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
          const orderId = orders[meta.rowIndex]?.publicId?.slice(-6).toUpperCase();
          return (
            <div className="flex flex-col">
               <span className="text-[10px] font-black">#{val.split('-')[2] || val.slice(-6)}</span>
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
            <div className="flex flex-col leading-tight">
               <span className="text-[9px] font-black text-[#7A578D]">{val?.phone || user?.phoneNumber || 'N/A'}</span>
               <span className="text-[8px] font-bold text-gray-500 uppercase">{val?.city || 'N/A'}</span>
            </div>
          )
        }
      }
    },
    {
      name: "items",
      label: "Product Details",
      options: {
        customBodyRender: (items: any[]) => (
          <div className="flex flex-col gap-0 py-0.5">
             {items?.slice(0, 1).map((item, i) => (
                <div key={i} className="flex items-center gap-2">
                   <img src={item.product?.images?.[0]?.imageUrl} className="w-5 h-6 object-cover rounded shadow-sm border border-gray-100" />
                   <div className="flex flex-col leading-none">
                      <span className="text-[10px] font-black text-gray-800 uppercase truncate max-w-[110px]">{item.product?.name}</span>
                      <span className="text-[7px] font-bold text-gray-400">Qty: {item.quantity}</span>
                   </div>
                </div>
             ))}
             {items?.length > 1 && <span className="text-[8px] font-black text-[#7A578D] ml-7 leading-none">+{items.length - 1} more</span>}
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
            <div className="flex items-center gap-1.5">
              <button 
                 onClick={() => viewOrder(id)} 
                 title="View Details"
                 className="p-1.5 bg-gray-50 hover:bg-gray-100 text-gray-500 rounded-lg transition-all"
              >
                 <Eye size={12} />
              </button>
              
              <button 
                 onClick={() => { setSelectedOrder(order); setIsInvoiceOpen(true); }}
                 title="Print Bill"
                 className="p-1.5 bg-gray-50 hover:bg-gray-100 text-gray-500 rounded-lg transition-all"
              >
                 <Printer size={12} />
              </button>

              {['PENDING', 'CONFIRMED'].includes(order.status) && !order.shipmentId && (
                <button 
                   onClick={() => handleTriggerShipment(id)}
                   title="Ship via Shiprocket"
                   className="p-1.5 bg-blue-50 text-blue-500 hover:bg-blue-100 rounded-lg transition-all border border-blue-50"
                >
                   <Truck size={12} />
                </button>
              )}

              {order.status === 'RETURN_REQUESTED' && (
                <button 
                   onClick={() => handleApproveReturn(id)}
                   title="Approve Return"
                   className="p-1.5 bg-orange-50 text-orange-500 hover:bg-orange-100 rounded-lg transition-all"
                >
                   <RefreshCw size={12} />
                </button>
              )}
            </div>
          );
        }
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
    viewColumns: false,
    filter: false,
    search: true,
  };

  if (isInvoiceOpen && selectedOrder) {
     return (
        <div className="fixed inset-0 z-[200] bg-white overflow-auto no-scrollbar p-0 md:p-8 animate-in fade-in duration-300">
           {/* Controls overlay (hidden on print) */}
           <div className="print:hidden sticky top-4 mb-4 flex justify-center gap-4">
              <button 
                 onClick={() => setIsInvoiceOpen(false)}
                 className="bg-black text-white px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest shadow-xl flex items-center gap-2"
              >
                 <ArrowLeft size={14}/> BACK TO HUB
              </button>
              <button 
                 onClick={() => window.print()}
                 className="bg-[#7A578D] text-white px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest shadow-xl flex items-center gap-2"
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
    <div className="space-y-3 animate-in fade-in duration-500 max-w-[1400px]">
      <header className="flex justify-between items-center border-b border-gray-100 pb-1.5">
        <div>
           <h1 className="text-base font-sans font-black uppercase tracking-tighter text-gray-900 leading-none">Manage Orders</h1>
           <div className="flex items-center gap-1.5 mt-0.5">
              <span className="w-1 h-1 rounded-full bg-orange-400 animate-pulse"></span>
              <span className="text-[7px] font-black uppercase tracking-widest text-[#7A578D]">Live System</span>
           </div>
        </div>
        <div className="flex items-center space-x-1.5">
           <button onClick={fetchOrders} className="p-1 px-2.5 bg-white border border-gray-100 rounded-lg text-gray-400 hover:text-[#7A578D] hover:rotate-180 transition-all duration-500 shadow-sm flex items-center gap-1">
              <RefreshCw size={11} />
              <span className="text-[7px] font-black uppercase tracking-widest">Refresh</span>
           </button>
           <button className="bg-black text-white px-2.5 py-1.5 rounded-lg text-[7px] font-black uppercase tracking-widest flex items-center space-x-1.5 hover:bg-[#7A578D] transition-all shadow-xl shadow-black/10">
              <Download size={9} />
              <span>Export</span>
           </button>
        </div>
      </header>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-2.5">
        {[
          { label: 'Unfulfilled', value: stats.pending, color: 'text-orange-600', bg: 'bg-orange-50', icon: Clock },
          { label: 'In Transit', value: stats.shipped, color: 'text-blue-600', bg: 'bg-blue-50', icon: Package },
          { label: 'Delivered', value: stats.delivered, color: 'text-green-600', bg: 'bg-green-50', icon: CheckCircle },
          { label: 'Total Volume', value: stats.total, color: 'text-[#7A578D]', bg: 'bg-[#7A578D]/5', icon: Activity },
        ].map((chip) => (
          <div key={chip.label} className="bg-white border border-gray-100 p-1.5 md:p-2.5 rounded-lg md:rounded-xl flex items-center space-x-2.5 shadow-sm group hover:border-[#7A578D]/20 transition-all">
            <div className={`w-7 h-7 md:w-9 md:h-9 rounded-md ${chip.bg} flex items-center justify-center ${chip.color} shadow-inner group-hover:scale-110 transition-transform`}>
               <chip.icon size={14} />
            </div>
            <div className="flex flex-col">
               <span className="text-base md:text-lg font-black text-gray-900 leading-none mb-0.5">{chip.value}</span>
               <span className="text-gray-400 text-[6px] md:text-[7px] font-black uppercase tracking-widest truncate">{chip.label}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white border border-gray-100 rounded-xl overflow-hidden shadow-sm">
        <ThemeProvider theme={getMuiTheme()}>
          <MUIDataTable title="" data={orders} columns={columns} options={options} />
        </ThemeProvider>
      </div>

      <ManagementModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title={`Order: ${selectedOrder?.orderNumber.split('-')[2] || selectedOrder?.orderNumber}`}
      >
        {selectedOrder && (
           <div className="space-y-3 animate-in fade-in duration-300">
              
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-gray-50/50 p-3 rounded-xl border border-gray-100 gap-3">
                 <div>
                    <h2 className="text-[11px] font-black uppercase tracking-[0.2em] text-[#7A578D]">
                       Order #{selectedOrder.orderNumber.split('-')[2] || selectedOrder.orderNumber}
                    </h2>
                    <div className="flex items-center text-[8px] font-bold text-gray-400 tracking-widest mt-0.5 gap-2">
                       <Calendar size={9}/> {new Date(selectedOrder.createdAt).toLocaleString()}
                    </div>
                 </div>
                 <div className="flex items-center gap-1.5">
                     <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest ${
                        selectedOrder.status === 'DELIVERED' ? 'bg-green-100 text-green-700' :
                        selectedOrder.status === 'SHIPPED' ? 'bg-blue-100 text-blue-700' :
                        selectedOrder.status === 'CANCELLED' ? 'bg-red-100 text-red-700' :
                        selectedOrder.status === 'REFUNDED' ? 'bg-indigo-100 text-indigo-700' :
                        'bg-orange-100 text-orange-700'
                     }`}>
                        {selectedOrder.status}
                     </span>
                     <div className="flex items-center gap-1 bg-gray-100 px-2 py-0.5 rounded">
                        <CreditCard size={9} className="text-gray-400" />
                        <span className="text-[8px] font-black uppercase tracking-widest text-gray-600">
                           {selectedOrder.payment?.status || 'PENDING'}
                        </span>
                     </div>
                 </div>
              </div>

              <div className="flex flex-wrap gap-1.5 items-center bg-[#7A578D]/5 p-1.5 rounded-lg border border-[#7A578D]/10">
                 <span className="text-[8px] font-black uppercase tracking-widest text-[#7A578D] px-1.5 border-r border-[#7A578D]/20 leading-none">STATUS</span>
                 <select
                    value={selectedOrder.status}
                    onChange={(e) => handleStatusUpdate(selectedOrder.id, e.target.value)}
                    className="text-[8px] font-black uppercase tracking-widest bg-white border border-gray-200 text-gray-900 px-1.5 py-1 rounded-md outline-none focus:border-[#7A578D] cursor-pointer"
                 >
                    <option value="PENDING">PENDING</option>
                    <option value="CONFIRMED">CONFIRMED</option>
                    <option value="SHIPPED">SHIPPED</option>
                    <option value="DELIVERED">DELIVERED</option>
                    <option value="CANCELLED">CANCELLED</option>
                    <option value="REFUNDED">REFUNDED</option>
                 </select>

                 {!selectedOrder.shipmentId && !['CANCELLED', 'REFUNDED'].includes(selectedOrder.status) && (
                    <button 
                       onClick={async () => {
                          try {
                            await api.post(`/orders/admin/${selectedOrder.id}/trigger-shipment`);
                            toast.success('Shipment Created');
                            viewOrder(selectedOrder.id);
                          } catch (e: any) {
                            toast.error(e.response?.data?.message || 'Failed');
                          }
                       }}
                       className="flex items-center gap-1 text-[8px] font-black uppercase tracking-widest bg-[#7A578D] text-white px-2 py-1 rounded-md hover:bg-black transition-colors"
                    >
                       <Package size={9} /> SHIPROCKET
                    </button>
                 )}

                 {selectedOrder.status !== 'DELIVERED' && !['CANCELLED', 'REFUNDED'].includes(selectedOrder.status) && (
                     <button 
                        onClick={() => handleStatusUpdate(selectedOrder.id, 'DELIVERED')}
                        className="flex items-center gap-1 text-[8px] font-black uppercase tracking-widest bg-green-500 text-white px-2 py-1 rounded-md hover:bg-green-600 transition-colors"
                     >
                        <CheckCircle size={9} /> DELIVER
                     </button>
                 )}

                 {selectedOrder.status !== 'REFUNDED' && (
                     <button 
                        onClick={() => handleRefund(selectedOrder.id)}
                        className="flex items-center gap-1 text-[8px] font-black uppercase tracking-widest bg-red-100 text-red-600 px-2 py-1 rounded-md hover:bg-red-200 transition-colors"
                     >
                        <RefreshCw size={9} /> REFUND
                     </button>
                 )}

                 <button 
                     onClick={() => setIsInvoiceOpen(true)}
                     className="flex items-center gap-1 text-[8px] font-black uppercase tracking-widest bg-black text-white px-2 py-1 rounded-md hover:bg-[#7A578D] transition-colors ml-auto shadow-sm"
                 >
                     <FileText size={9} /> PRINT BILL
                 </button>
              </div>

              <div className="grid grid-cols-12 gap-3">
                 
                 <div className="col-span-12 lg:col-span-8 space-y-3">
                    
                    <div className="bg-white rounded-xl border border-gray-100 overflow-hidden shadow-sm">
                       <div className="bg-gray-50/50 px-3 py-1.5 border-b border-gray-100 flex justify-between items-center">
                          <h3 className="text-[9px] font-black uppercase tracking-[0.2em] text-[#7A578D] flex items-center gap-2">
                             <ShoppingBag size={11} /> Items Ledger
                          </h3>
                       </div>
                       <div className="p-1.5 space-y-1">
                          {selectedOrder.items?.map((item: any) => (
                              <div key={item.id} className="flex items-center gap-2.5 bg-gray-50/30 p-1.5 rounded-lg border border-transparent hover:border-gray-100 hover:bg-white transition-all">
                                 <img src={item.product?.images?.[0]?.imageUrl || 'https://via.placeholder.com/100'} className="w-8 h-10 object-cover rounded-md bg-gray-100 shadow-sm" />
                                 <div className="flex-1">
                                    <h4 className="text-[9px] font-black uppercase tracking-tight text-gray-900 truncate max-w-[200px]">{item.product?.name}</h4>
                                    <p className="text-[7px] font-black text-[#7A578D] mt-0.5 uppercase tracking-widest">Qty: {item.quantity} | SKU: {item.product?.inventory?.sku || 'N/A'}</p>
                                 </div>
                                 <div className="text-right">
                                    <span className="text-[10px] font-black text-gray-900 block leading-none">₹{(item.price * item.quantity).toLocaleString()}</span>
                                    <span className="text-[7px] font-bold text-gray-400">@ ₹{item.price.toLocaleString()}</span>
                                 </div>
                              </div>
                          ))}
                       </div>
                       
                       <div className="bg-gray-50/50 p-3 flex justify-end border-t border-gray-50">
                           <div className="w-56 space-y-1.5">
                              <div className="flex justify-between text-[8px] font-black text-gray-500 uppercase tracking-widest">
                                 <span>Sub-Total</span><span>₹{selectedOrder.totalAmount?.toLocaleString()}</span>
                              </div>
                              {selectedOrder.discountAmount > 0 && (
                                  <div className="flex justify-between text-[8px] font-black text-green-500 uppercase tracking-widest">
                                     <span>Voucher</span><span>-₹{selectedOrder.discountAmount?.toLocaleString()}</span>
                                  </div>
                              )}
                              <div className="flex justify-between text-gray-600">
                                 <span>Shipping</span><span>₹{selectedOrder.shippingCharges?.toLocaleString()}</span>
                              </div>
                              <div className="flex justify-between font-black pt-2 text-[10px] border-t border-gray-100">
                                 <span>Total Amount</span><span className="text-[#7A578D]">₹{selectedOrder.payableAmount?.toLocaleString()}</span>
                              </div>
                           </div>
                       </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div className="bg-white p-3 rounded-xl border border-gray-100 shadow-sm">
                           <h3 className="text-[9px] font-black uppercase tracking-[0.2em] text-[#7A578D] flex items-center gap-1.5 mb-2">
                              <User size={11} /> Customer Info
                           </h3>
                           <div className="space-y-1">
                              <p className="text-[10px] font-black text-gray-900 uppercase truncate">{selectedOrder.address?.name}</p>
                              <p className="text-[8px] font-bold text-gray-400 truncate lowercase">{selectedOrder.user?.email}</p>
                              <div className="text-[8px] font-bold text-gray-600 uppercase tracking-widest leading-relaxed mt-1.5 pt-1.5 border-t border-gray-50">
                                 <p className="line-clamp-2">{selectedOrder.address?.street}</p>
                                 <p>{selectedOrder.address?.city}, {selectedOrder.address?.pincode}</p>
                                 <p className="text-[#7A578D] font-black mt-0.5">{selectedOrder.address?.phone}</p>
                              </div>
                           </div>
                        </div>

                        <div className="bg-white p-3 rounded-xl border border-gray-100 shadow-sm">
                           <h3 className="text-[9px] font-black uppercase tracking-[0.2em] text-[#7A578D] flex items-center gap-1.5 mb-2">
                              <Activity size={11} /> Order Progress
                           </h3>
                           <div className="relative border-l-2 border-gray-50 ml-1.5 space-y-3 py-1">
                               {getTimelineEvents(selectedOrder).slice(-3).map((event, i) => (
                                  <div key={i} className={`pl-3.5 relative ${event.done ? 'opacity-100' : 'opacity-40'}`}>
                                     <div className={`absolute w-1.5 h-1.5 rounded-full -left-[4px] top-1 border border-white ${event.done ? 'bg-[#7A578D]' : 'bg-gray-300'}`} />
                                     <p className="text-[9px] font-black uppercase tracking-widest text-gray-900 leading-none">{event.label}</p>
                                     {event.time && <p className="text-[7px] font-bold text-gray-400 mt-0.5">{new Date(event.time).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>}
                                  </div>
                               ))}
                           </div>
                        </div>
                    </div>
                 </div>

                 <div className="col-span-12 lg:col-span-4 space-y-3">
                    <div className="bg-white p-3 rounded-xl border border-gray-100 shadow-sm">
                       <h3 className="text-[9px] font-black uppercase tracking-[0.2em] text-[#7A578D] flex items-center gap-1.5 mb-2.5">
                          <CreditCard size={11} /> Payment Details
                       </h3>
                       <div className="space-y-2">
                           <div className="flex justify-between items-center bg-gray-50/50 p-1.5 rounded-md border border-gray-100">
                               <span className="text-[7px] font-black text-gray-400 uppercase tracking-widest">Mode</span>
                               <span className="text-[8px] font-black text-gray-900 uppercase tracking-tighter">{selectedOrder.payment?.paymentMethod || 'COD'}</span>
                           </div>
                           <div className="flex justify-between items-center bg-gray-50/50 p-1.5 rounded-md border border-gray-100">
                               <span className="text-[7px] font-black text-gray-400 uppercase tracking-widest">Gateway</span>
                               <span className="text-[8px] font-black text-[#7A578D] uppercase tracking-tighter">RAZORPAY</span>
                           </div>
                           {selectedOrder.payment?.transactionId && (
                               <div className="space-y-0.5 pt-0.5">
                                   <span className="text-[7px] font-black text-gray-400 uppercase tracking-widest block ml-1">Ref ID</span>
                                   <span className="text-[8px] font-mono text-gray-900 break-all bg-gray-50/50 p-1.5 rounded-md block border border-gray-100 leading-tight">
                                      {selectedOrder.payment.transactionId}
                                   </span>
                               </div>
                           )}
                       </div>
                    </div>

                    <div className="bg-white p-3 rounded-xl border border-gray-100 shadow-sm">
                       <h3 className="text-[9px] font-black uppercase tracking-[0.2em] text-[#7A578D] flex items-center gap-1.5 mb-2.5">
                          <Truck size={11} /> Shipping Hub
                       </h3>
                       <div className="space-y-1.5">
                           <div className="flex justify-between items-center text-[8px] font-black uppercase tracking-widest">
                               <span className="text-gray-400">Tracking ID</span>
                               <span className="text-[#7A578D] flex items-center gap-1">
                                  {selectedOrder.awbNumber || 'WAITING'}
                                  {selectedOrder.trackingUrl && <ExternalLink size={9}/>}
                               </span>
                           </div>
                           <div className="flex justify-between items-center text-[8px] font-black uppercase tracking-widest">
                               <span className="text-gray-400">Courier</span>
                               <span className="text-gray-900 uppercase truncate max-w-[80px] text-right">{selectedOrder.courierName || 'PENDING'}</span>
                           </div>
                           <div className="flex justify-between items-center text-[8px] font-black uppercase tracking-widest pt-1.5 border-t border-gray-50">
                               <span className="text-gray-400 text-nowrap">Status</span>
                               <span className="text-gray-900 truncate max-w-[100px] text-right">{selectedOrder.shippingStatus || 'UNFULFILLED'}</span>
                           </div>
                       </div>
                    </div>

                    {selectedOrder.returnReason && (
                       <div className="bg-orange-50/50 p-3 rounded-xl border border-orange-100 shadow-sm">
                          <h3 className="text-[9px] font-black uppercase tracking-[0.2em] text-orange-600 flex items-center gap-1.5 mb-2.5">
                             <RotateCcw size={11} /> Return Request
                          </h3>
                          <div className="space-y-2">
                              <div>
                                 <p className="text-[8px] font-black text-orange-400 uppercase tracking-widest mb-1">Reason</p>
                                 <p className="text-[10px] text-gray-800 bg-white p-2 rounded border border-orange-100/50 italic leading-relaxed">
                                     "{selectedOrder.returnReason}"
                                 </p>
                              </div>
                              
                              {selectedOrder.returnImages && selectedOrder.returnImages.length > 0 && (
                                  <div>
                                     <p className="text-[8px] font-black text-orange-400 uppercase tracking-widest mb-1">Attached Photos</p>
                                     <div className="grid grid-cols-4 gap-1.5 mt-1">
                                        {selectedOrder.returnImages.map((img: string, i: number) => (
                                            <a key={i} href={img} target="_blank" rel="noopener noreferrer" className="block aspect-square rounded overflow-hidden border border-orange-200 hover:border-orange-400 transition-colors">
                                               <img src={img} className="w-full h-full object-cover" alt="Return attachment" />
                                            </a>
                                        ))}
                                     </div>
                                  </div>
                              )}
                          </div>
                          {selectedOrder.status === 'RETURN_REQUESTED' && (
                              <button 
                                 onClick={() => {
                                     handleApproveReturn(selectedOrder.id);
                                     setIsModalOpen(false);
                                     fetchOrders();
                                 }}
                                 className="w-full mt-3 py-2 bg-orange-500 hover:bg-orange-600 text-white text-[9px] font-black uppercase tracking-widest rounded-lg transition-colors flex items-center justify-center gap-1.5 shadow-sm"
                              >
                                  <CheckCircle size={11} /> Approve Return
                              </button>
                          )}
                       </div>
                    )}

                    <div className="bg-indigo-50/30 p-3 rounded-xl border border-indigo-100">
                       <h3 className="text-[9px] font-black uppercase tracking-[0.2em] text-indigo-600 flex items-center gap-1.5 mb-1.5">
                          <FileText size={11} /> Admin Notes
                       </h3>
                       <textarea 
                          className="w-full bg-white border border-indigo-100 rounded-lg p-2 text-[9px] font-black uppercase tracking-widest text-indigo-700 outline-none focus:border-indigo-400 resize-none shadow-sm placeholder:text-indigo-200"
                          rows={2}
                          placeholder="Note for warehouse..."
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
