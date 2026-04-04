
import { useState } from 'react';
import { Download, RefreshCw, Printer, ArrowLeft, Package, Truck, User, CreditCard, Activity, Layers, Activity as Pulse, Zap, ShieldCheck, Box, ChevronRight, Info } from 'lucide-react';
import MUIDataTable from 'mui-datatables';
import { ThemeProvider } from '@mui/material/styles';
import { getMuiTheme } from '../utils/muiTableTheme';

// Hooks
import { useOrders } from '../hooks/useOrders';
import { useSettings } from '../../store/useSettings';

// Components
import ManagementModal from '../components/ManagementModal';
import OrderInvoice from '../components/OrderInvoice';
import OrderDetailsExpanded from '../components/order/OrderDetailsExpanded';
import OrderDetailsModal from '../components/order/OrderDetailsModal';
import OrderStats from '../components/order/OrderStats';
import OrderTabs from '../components/order/OrderTabs';

const OrderManagement = () => {
    const { settings } = useSettings();
    const [activeTab, setActiveTab] = useState('ALL');

    const {
        page, setPage,
        totalOrders,
        rowsPerPage, setRowsPerPage,
        isModalOpen, setIsModalOpen,
        isInvoiceOpen, setIsInvoiceOpen,
        selectedOrder, setSelectedOrder,
        isDetailsLoading,
        orders,
        stats,
        isSubmitting,
        isLabelLoading,
        fetchOrders,
        viewOrder,
        handleRefund,
        handleNoteUpdate,
        handleTriggerShipment,
        handleGenerateAWB,
        handleCancelShipment,
        handleApproveReturn,
        handleSyncSingleOrder,
        handleGenerateLabel,
        handleForceDeliver,
        handleResetReship,
        syncShiprocketStatus,
    } = useOrders(activeTab);

    const columns = [
        {
            name: 'orderNumber',
            label: 'Order_Nexus',
            options: {
                customBodyRender: (val: string, meta: any) => {
                    const orderId = orders[meta.rowIndex]?.publicId?.toUpperCase();
                    return (
                        <div className="flex flex-col text-left group">
                            <span className="text-[11px] font-black uppercase tracking-tighter text-gray-900 leading-none mb-1 group-hover:text-[#7A578D] transition-colors">{val}</span>
                            <span className="text-[8px] text-gray-400 font-mono font-black tracking-widest opacity-60 leading-none">ID: {orderId}</span>
                        </div>
                    );
                }
            }
        },
        {
            name: 'address',
            label: 'Registrant Archetype',
            options: {
                customBodyRender: (val: any, meta: any) => {
                    const user = orders[meta.rowIndex]?.user;
                    return (
                        <div className="flex items-center gap-3 text-left">
                           <div className="w-8 h-8 bg-gray-50 border border-gray-100 rounded-full flex items-center justify-center text-gray-400 group-hover:bg-black group-hover:text-white transition-all shadow-inner">
                              <User size={14} />
                           </div>
                           <div className="flex flex-col">
                              <span className="text-[10px] font-black uppercase text-gray-800 tracking-widest truncate block max-w-[140px] leading-none mb-1">{val?.name || user?.name || 'Nexus_NULL'}</span>
                              <span className="text-[9px] font-black text-gray-400 lowercase truncate block max-w-[150px] opacity-60 leading-none">{user?.email || 'Archive_EMPTY'}</span>
                           </div>
                        </div>
                    );
                }
            }
        },
        {
            name: 'address',
            label: 'Logistics Pivot',
            options: {
                customBodyRender: (val: any) => (
                    <div className="flex items-start gap-3 text-left">
                        <div className="p-2 bg-[#7A578D]/5 text-[#7A578D] rounded-sm transition-all shadow-sm">
                           <Truck size={14} />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-[10px] font-black text-gray-900 leading-none mb-1">{val?.phone || 'NULL_SIGNAL'}</span>
                            <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest leading-none">{val?.city || 'ZONE_NULL'}</span>
                        </div>
                    </div>
                )
            }
        },
        {
            name: 'items',
            label: 'Manifest Registry',
            options: {
                customBodyRender: (items: any[]) => (
                    <div className="flex flex-col gap-3 py-2 min-w-[200px] text-left">
                        {items?.slice(0, 2).map((item, i) => (
                            <div key={i} className="flex items-center gap-3 group/item">
                                <div className="relative">
                                    <div className="w-10 h-14 bg-white border border-gray-100 rounded-sm overflow-hidden shadow-2xl transition-all group-hover/item:scale-110">
                                       <img 
                                           src={item.variant?.images?.[0]?.imageUrl || item.product?.images?.[0]?.imageUrl || 'https://via.placeholder.com/100?text=NP'} 
                                           className="w-full h-full object-cover grayscale opacity-80 group-hover/item:grayscale-0 group-hover/item:opacity-100 transition-all duration-700" 
                                       />
                                    </div>
                                    <span className="absolute -top-2 -right-2 bg-black text-white text-[8px] font-black w-5 h-5 flex items-center justify-center rounded-full border-2 border-white shadow-xl animate-in zoom-in-50">
                                        {item.quantity}
                                    </span>
                                </div>
                                <div className="flex flex-col min-w-0">
                                    <span className="text-[10px] font-black text-gray-900 uppercase truncate max-w-[140px] tracking-tighter leading-none mb-1.5" title={item.product?.name}>
                                        {item.product?.name}
                                    </span>
                                    <div className="flex items-center gap-1.5 text-blue-600 bg-blue-50 px-2 py-0.5 rounded-sm uppercase tracking-widest w-fit border border-blue-100 shadow-sm">
                                       <Box size={10} />
                                       <span className="text-[8px] font-black">SKU: {item.sku || item.variant?.sku || 'NULL'}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                        {items?.length > 2 && (
                            <div className="flex items-center gap-3 ml-12 border-t border-dashed border-gray-100 pt-2 group cursor-pointer hover:opacity-100 transition-opacity opacity-40">
                               <Layers size={12} className="text-[#7A578D]"/>
                               <span className="text-[9px] font-black text-[#7A578D] uppercase tracking-widest leading-none">
                                   Archive: +{items.length - 2} Artifacts
                               </span>
                            </div>
                        )}
                    </div>
                )
            }
        },
        {
            name: 'payableAmount',
            label: 'Fiscal Liability',
            options: {
                customBodyRender: (val: number, meta: any) => {
                    const method = orders[meta.rowIndex]?.paymentMethod;
                    return (
                        <div className="flex flex-col text-left bg-gray-50/50 p-3 rounded-sm border border-gray-100 shadow-inner group">
                            <span className="text-[13px] font-black text-gray-900 tracking-tighter leading-none mb-2">₹{val.toLocaleString()}</span>
                            <div className={`flex items-center gap-1.5 px-2 py-1 rounded-sm border w-fit shadow-xl ${method === 'ONLINE' ? 'bg-black text-white border-black' : 'bg-white text-orange-600 border-orange-100'}`}>
                                <CreditCard size={10} className={method === 'ONLINE' ? 'text-emerald-400' : 'text-orange-400'}/>
                                <span className="text-[8px] font-black uppercase tracking-widest">{method}</span>
                            </div>
                        </div>
                    );
                }
            }
        },
        {
            name: 'status',
            label: 'Nexus State',
            options: {
                customBodyRender: (val: string) => (
                    <div className="flex items-center text-left">
                       <span className={`px-4 py-2 rounded-sm text-[9px] font-black uppercase tracking-[0.3em] shadow-2xl border w-full text-center transition-all group-hover:scale-105 ${
                         val === 'DELIVERED' ? 'bg-emerald-500 border-emerald-400 text-white shadow-emerald-500/20' :
                         val === 'SHIPPED' ? 'bg-blue-600 border-blue-500 text-white shadow-blue-500/20' :
                         val === 'CANCELLED' ? 'bg-red-500 border-red-400 text-white shadow-red-500/20 opacity-40' :
                         'bg-orange-500 border-orange-400 text-white shadow-orange-500/20'
                       }`}>
                          {val === 'PENDING' ? 'INITIALIZING' : val}
                       </span>
                    </div>
                )
            }
        },
        {
            name: 'id',
            label: 'Executive Command',
            options: {
                customBodyRender: (id: string, meta: any) => {
                    const order = orders[meta.rowIndex];
                    if (!order) return null;
                    return (
                        <div className="flex items-center justify-around gap-2 text-left" onClick={(e) => e.stopPropagation()}>
                            <button 
                                onClick={() => viewOrder(id)} 
                                className="px-4 py-2 bg-black text-white text-[10px] font-black uppercase tracking-widest rounded-sm transition-all hover:bg-[#7A578D] shadow-2xl shadow-black/10 active:scale-95 border-b-2 border-black/20 group"
                            >
                                AUDIT
                            </button>
                            <button 
                                onClick={() => { setSelectedOrder(order); setIsInvoiceOpen(true); }}
                                className="px-4 py-2 bg-white text-gray-400 text-[10px] font-black uppercase tracking-widest rounded-sm transition-all hover:text-[#7A578D] hover:border-[#7A578D] border border-gray-100 shadow-sm active:scale-95"
                            >
                                BILL
                            </button>
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
        rowsPerPageOptions: [10, 20, 50, 100],
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
            const order = orders[rowMeta.rowIndex];
            return <OrderDetailsExpanded order={order} columnsLength={columns.length} />;
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
        },
        textLabels: { body: { noMatch: isDetailsLoading ? 'Synchronizing Transaction Architecture...' : 'No transaction artifacts detected in global archive' } }
    };

    if (isInvoiceOpen && selectedOrder) {
        return (
            <div className="fixed inset-0 z-[200] bg-white overflow-auto no-scrollbar p-0 md:p-8 animate-in fade-in duration-700">
                <div className="print:hidden sticky top-8 mb-12 flex justify-center gap-6">
                    <button 
                        onClick={() => setIsInvoiceOpen(false)}
                        className="bg-black text-white h-12 px-8 rounded-sm text-[11px] font-black uppercase tracking-[0.4em] shadow-2xl shadow-black/20 flex items-center gap-4 transition-all hover:bg-[#7A578D] active:scale-95 border-b-4 border-black/30 group"
                    >
                        <ArrowLeft size={22} className="group-hover:-translate-x-1 transition-transform"/> BACK_TO_Nexus
                    </button>
                    <button 
                        onClick={() => window.print()}
                        className="bg-[#7A578D] text-white h-12 px-8 rounded-sm text-[11px] font-black uppercase tracking-[0.4em] shadow-2xl shadow-[#7A578D]/20 flex items-center gap-4 transition-all hover:bg-black active:scale-95 border-b-4 border-[#7A578D]/30 group"
                    >
                        <Printer size={22} className="group-hover:scale-110 transition-transform"/> PRINT_Nexus_ARTIFACT
                    </button>
                </div>
                <div className="max-w-5xl mx-auto bg-white shadow-[0_40px_100px_-20px_rgba(0,0,0,0.1)] border border-gray-50 rounded-sm">
                   <OrderInvoice order={selectedOrder} settings={settings} />
                </div>
                <div className="print:hidden mt-20 text-center text-gray-300 max-w-xl mx-auto border-t border-dashed border-gray-100 pt-12 mb-20 relative">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-12 p-3 bg-white border border-gray-50 text-gray-400">
                       <Info size={24} />
                    </div>
                    <p className="text-[11px] font-black uppercase tracking-[0.5em] mb-4 text-gray-400">Authoritative Printer Protocol</p>
                    <div className="flex flex-col gap-2">
                       <p className="text-[9px] font-black uppercase tracking-widest leading-relaxed opacity-60">Enable "Background Graphics" in browser print manifest</p>
                       <p className="text-[9px] font-black uppercase tracking-widest leading-relaxed opacity-60">Margins: "Default" | Orientation: "Portrait"</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-500 max-w-[1600px] pb-24">
            <header className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-gray-100 pb-8 gap-4">
                <div>
                    <h1 className="text-2xl font-black uppercase tracking-tighter text-gray-900 leading-none">Order_Nexus_Auditor</h1>
                    <div className="flex items-center gap-3 mt-3">
                        <div className="flex items-center gap-2 bg-emerald-50 px-2 py-1 rounded-sm border border-emerald-100 shadow-xl shadow-emerald-500/5">
                           <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shadow-lg shadow-emerald-500/50"></span>
                           <span className="text-[10px] font-black uppercase tracking-widest text-emerald-700">Transactional Integrity Link Active</span>
                        </div>
                        <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest">{totalOrders} REGISTERED_Nexus_EVENTS</span>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <button 
                      onClick={syncShiprocketStatus} 
                      disabled={isSubmitting} 
                      className="h-12 px-6 bg-blue-600 text-white rounded-sm transition-all shadow-2xl shadow-blue-500/20 flex items-center gap-4 text-[10px] font-black uppercase tracking-[0.3em] disabled:opacity-50 active:scale-95 border-b-4 border-black/30 group"
                    >
                        <Pulse size={22} className={isSubmitting ? 'animate-spin' : 'group-hover:scale-110 transition-transform'} />
                        <span>SYNC_Nexus_LOGISTICS</span>
                    </button>
                    <button 
                      onClick={() => fetchOrders()} 
                      className="w-12 h-12 bg-white border border-gray-200 rounded-sm text-gray-300 hover:text-[#7A578D] hover:border-[#7A578D] hover:rotate-180 transition-all duration-700 shadow-sm flex items-center justify-center group"
                    >
                        <RefreshCw size={24} className={isDetailsLoading ? 'animate-spin' : ''} />
                    </button>
                    <button className="bg-black text-white h-12 px-8 rounded-sm text-[10px] font-black uppercase tracking-[0.4em] flex items-center gap-4 hover:bg-[#7A578D] transition-all shadow-2xl shadow-black/10 active:scale-95 border-b-4 border-black/30 group">
                        <Download size={22} className="group-hover:translate-y-0.5 transition-transform" />
                        <span>EXPORT_Nexus</span>
                    </button>
                </div>
            </header>

            <OrderTabs activeTab={activeTab} setActiveTab={setActiveTab} setPage={setPage} />

            <div className="animate-in slide-in-from-top-4 duration-700">
               <OrderStats stats={stats} />
            </div>

            <div className="bg-white border border-gray-100 rounded-sm overflow-hidden shadow-sm relative min-h-[500px]">
                {(isDetailsLoading && !selectedOrder) && (
                    <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px] z-30 flex items-center justify-center">
                        <div className="w-12 h-12 border-4 border-[#7A578D] border-t-transparent rounded-full animate-spin shadow-2xl shadow-[#7A578D]/20" />
                    </div>
                )}
                <ThemeProvider theme={getMuiTheme()}>
                    <MUIDataTable title="" data={orders} columns={columns} options={options} />
                </ThemeProvider>
            </div>

            <ManagementModal 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)} 
                title={`ARTIFACT_AUDIT: [${selectedOrder?.orderNumber.split('-')[2] || selectedOrder?.orderNumber}]`}
            >
                <div className="p-2">
                   <OrderDetailsModal 
                     selectedOrder={selectedOrder}
                     isDetailsLoading={isDetailsLoading}
                     isLabelLoading={isLabelLoading}
                     settings={settings}
                     handleTriggerShipment={handleTriggerShipment}
                     handleGenerateAWB={handleGenerateAWB}
                     handleCancelShipment={handleCancelShipment}
                     handleForceDeliver={handleForceDeliver}
                     handleResetReship={handleResetReship}
                     handleGenerateLabel={handleGenerateLabel}
                     setIsInvoiceOpen={setIsInvoiceOpen}
                     handleNoteUpdate={handleNoteUpdate}
                   />
                </div>
            </ManagementModal>
            
            <footer className="pt-20 border-t border-gray-100 flex items-center justify-center gap-12 opacity-30">
               <div className="flex items-center gap-3">
                  <ShieldCheck size={18} className="text-gray-400"/>
                  <span className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-400">Temporal Transaction integrity confirmed</span>
               </div>
               <div className="flex items-center gap-3">
                  <Zap size={18} className="text-gray-400 animate-pulse"/>
                  <span className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-400">Live API stream active</span>
               </div>
            </footer>
        </div>
    );
};

export default OrderManagement;
