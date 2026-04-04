
import { Truck, ExternalLink, RefreshCw, Clock, Activity, ShieldCheck, Zap, Info, ChevronRight, MapPin, Box, User } from 'lucide-react';
import MUIDataTable from 'mui-datatables';
import { ThemeProvider } from '@mui/material/styles';
import { getMuiTheme } from '../utils/muiTableTheme';

// Hooks
import { useShipments } from '../hooks/useShipments';

// Components
import ShipmentDetailsExpanded from '../components/shipping/ShipmentDetailsExpanded';

const ShippingManagement = () => {
  const { loading, shipments, fetchShipments } = useShipments();

  const columns = [
    {
      name: 'shipmentId',
      label: 'Logistics Artifact ID',
      options: {
        customBodyRender: (val: string) => (
          <div className="flex flex-col text-left group">
             <span
               className="text-[10px] font-mono font-black uppercase text-[#7A578D] tracking-widest block max-w-[140px] truncate bg-[#7A578D]/5 px-3 py-1.5 rounded-sm border border-[#7A578D]/10 shadow-inner"
               title={val}
             >
               #{val || 'MOCK_PENDING_Nexus'}
             </span>
          </div>
        )
      }
    },
    {
      name: 'orderNumber',
      label: 'Parent Nexus',
      options: {
        customBodyRender: (val: string) => (
          <div className="flex items-center gap-2 text-left group cursor-pointer">
             <Box size={14} className="text-gray-400 group-hover:text-[#7A578D] transition-colors" />
             <span className="text-[11px] font-black text-gray-900 uppercase tracking-tighter border-b-2 border-transparent group-hover:border-[#7A578D] transition-all">
               {val.split('-')[2] || val}
             </span>
          </div>
        )
      }
    },
    {
      name: 'user',
      label: 'Consignee Archetype',
      options: {
        customBodyRender: (user: any) => (
          <div className="flex items-center gap-3 text-left group">
             <div className="w-8 h-8 bg-gray-50 border border-gray-100 rounded-full flex items-center justify-center text-gray-400 group-hover:bg-black group-hover:text-white transition-all shadow-inner">
                <User size={14} />
             </div>
             <div className="flex flex-col">
               <span className="text-[10px] font-black uppercase text-gray-800 tracking-widest truncate max-w-[150px] leading-none mb-1">
                 {user?.name || 'ROOT_CLIENT'}
               </span>
               <span className="text-[9px] font-mono font-black text-gray-400 lowercase opacity-60 leading-none">
                 {user?.email || 'NULL_SIGNAL'}
               </span>
             </div>
          </div>
        )
      }
    },
    {
      name: 'awbNumber',
      label: 'Carrier Matrix',
      options: {
        customBodyRender: (val: string, tableMeta: any) => {
          const row = shipments[tableMeta.rowIndex];
          return (
            <div className="flex items-start gap-3 text-left group">
               <div className="p-2 bg-blue-50 text-blue-600 rounded-sm shadow-sm border border-blue-100">
                  <Truck size={14} />
               </div>
               <div className="flex flex-col">
                  <span className={`text-[11px] font-black uppercase tracking-tighter leading-none mb-1 ${
                    val ? 'text-gray-900 ' : 'text-gray-300 italic'
                  }`}>
                    {val || 'Nexus_WAITING...'}
                  </span>
                  <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest opacity-60">
                    {row?.courierName || 'PENDING_ASSIGNMENT'}
                  </span>
               </div>
            </div>
          );
        }
      }
    },
    {
      name: 'shippingStatus',
      label: 'Protocol State',
      options: {
        customBodyRender: (val: string) => {
          const s = val?.toLowerCase() || '';
          const isDelivered = s.includes('delivered');
          const isTransit = s.includes('transit') || s.includes('shipped');

          return (
            <div className="flex items-center text-left">
               <div className={`px-4 py-2 rounded-sm text-[9px] font-black uppercase tracking-[0.3em] border shadow-2xl transition-all hover:scale-105 ${
                 isDelivered ? 'bg-emerald-500 border-emerald-400 text-white shadow-emerald-500/20' :
                 isTransit ? 'bg-blue-600 border-blue-500 text-white shadow-blue-500/20' :
                 'bg-orange-500 border-orange-400 text-white shadow-orange-500/20'
               }`}>
                 <div className="flex items-center gap-2">
                    <div className={`w-1.5 h-1.5 rounded-full bg-white ${!isDelivered && 'animate-pulse shadow-lg shadow-white/50'}`} />
                    <span>{val || 'INITIATED_Nexus'}</span>
                 </div>
               </div>
            </div>
          );
        }
      }
    },
    {
      name: 'trackingUrl',
      label: 'Spatial Tracking',
      options: {
        customBodyRender: (val: string) => (
          val ? (
            <a
              href={val}
              target="_blank"
              rel="noreferrer"
              className="px-5 py-2.5 bg-black text-white hover:bg-[#7A578D] transition-all flex items-center justify-center gap-3 rounded-sm shadow-2xl shadow-black/10 text-[9px] font-black uppercase tracking-[0.3em] active:scale-95 group w-fit text-left border-b-2 border-black/20"
            >
              <ExternalLink size={16} className="group-hover:scale-110 group-hover:rotate-12 transition-transform" />
              <span>LINK_Nexus</span>
            </a>
          ) : (
            <div className="flex items-center gap-2 opacity-20 text-gray-400 grayscale">
               <Info size={14} />
               <span className="text-[9px] font-black uppercase tracking-widest">OFFLINE</span>
            </div>
          )
        )
      }
    },
    {
      name: 'updatedAt',
      label: 'Log Audit temporal',
      options: {
        customBodyRender: (val: string) => (
          <div className="flex items-center gap-4 text-left group">
            <div className="p-2 bg-gray-50 border border-gray-100 rounded-sm text-gray-300 group-hover:text-[#7A578D] transition-colors shadow-inner">
               <Clock size={16} />
            </div>
            <div className="flex flex-col">
              <span className="text-[11px] font-black uppercase tracking-tighter text-gray-900 leading-none mb-1">
                {new Date(val).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}
              </span>
              <span className="text-[8px] font-black uppercase tracking-widest text-gray-400 opacity-60">
                Nexus_SYNC: {new Date(val).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          </div>
        )
      }
    },
  ];

  const options = {
    selectableRows: 'none' as const,
    elevation: 0,
    responsive: 'standard' as const,
    rowsPerPage: 20,
    rowsPerPageOptions: [20, 50, 100],
    download: false,
    print: false,
    filter: false,
    viewColumns: false,
    search: true,
    expandableRows: true,
    expandableRowsOnClick: true,
    renderExpandableRow: (rowData: any, rowMeta: any) => {
      const order = shipments[rowMeta.rowIndex];
      return <ShipmentDetailsExpanded order={order} columnsLength={columns.length} />;
    },
    textLabels: { body: { noMatch: loading ? 'Synchronizing Logistics Manifest Stream...' : 'No active shipment artifacts detected in global archive' } }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-[1600px] pb-24">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-gray-100 pb-8 gap-4">
        <div>
           <h1 className="text-2xl font-black uppercase tracking-tighter text-gray-900 leading-none">Logistics_Nexus_Matrix</h1>
           <div className="flex items-center gap-3 mt-3">
              <div className="flex items-center gap-2 bg-[#7A578D]/5 px-2 py-1 rounded-sm border border-[#7A578D]/10 shadow-xl shadow-[#7A578D]/5">
                 <span className="w-1.5 h-1.5 rounded-full bg-[#7A578D] animate-pulse shadow-lg shadow-[#7A578D]/50"></span>
                 <span className="text-[10px] font-black uppercase tracking-widest text-[#7A578D] opacity-70 italic">Global Courier Link Active</span>
              </div>
              <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest">{shipments.length} ACTIVE_MANIFESTS</span>
           </div>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={fetchShipments}
            className="w-12 h-12 bg-white border border-gray-200 rounded-sm text-gray-300 hover:text-[#7A578D] hover:border-[#7A578D] hover:rotate-180 transition-all duration-700 shadow-sm flex items-center justify-center group"
            title="Synchronize Logistics Stream"
          >
            <RefreshCw size={24} className={loading ? 'animate-spin' : ''} />
          </button>
          
          <div className="bg-black text-white p-6 rounded-sm shadow-2xl border-b-4 border-[#7A578D] hidden lg:flex items-center gap-6">
             <div className="flex flex-col items-end">
                <span className="text-[10px] font-black uppercase tracking-[0.4em] opacity-40 mb-1 leading-none">IN_TRANSIT_Nexus</span>
                <span className="text-2xl font-black tracking-tighter leading-none">{shipments.filter(s => s.shippingStatus?.toLowerCase().includes('transit')).length}</span>
             </div>
             <Truck size={32} className="text-[#7A578D] opacity-40" />
          </div>
        </div>
      </header>

      <div className="bg-white border border-gray-100 rounded-sm overflow-hidden shadow-sm relative min-h-[600px]">
        {loading && (
          <div className="absolute inset-0 z-30 bg-white/60 backdrop-blur-[2px] flex items-center justify-center">
            <div className="w-12 h-12 border-4 border-[#7A578D] border-t-transparent rounded-full animate-spin shadow-2xl shadow-[#7A578D]/20" />
          </div>
        )}
        <ThemeProvider theme={getMuiTheme()}>
          <MUIDataTable title="" data={shipments} columns={columns} options={options} />
        </ThemeProvider>
      </div>
      
      <footer className="pt-20 border-t border-gray-100 flex items-center justify-center gap-12 opacity-30">
         <div className="flex items-center gap-3">
            <ShieldCheck size={18} className="text-gray-400"/>
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-400">Logistics integrity confirmed</span>
         </div>
         <div className="flex items-center gap-3">
            <MapPin size={18} className="text-gray-400 animate-pulse"/>
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-400">Spatial telemetry active</span>
         </div>
         <div className="flex items-center gap-3">
            <Zap size={18} className="text-gray-400"/>
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-400">Carrier sync 100% Correct</span>
         </div>
      </footer>
    </div>
  );
};

export default ShippingManagement;
