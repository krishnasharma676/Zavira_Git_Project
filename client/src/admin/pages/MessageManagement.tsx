
import { Trash2, CheckCircle, Clock, Send, MessageSquare, User, RefreshCw, Mail, Activity, ShieldCheck, Zap, Info, ChevronRight, MessageCircle } from 'lucide-react';
import MUIDataTable from 'mui-datatables';
import { ThemeProvider } from '@mui/material/styles';
import { getMuiTheme } from '../utils/muiTableTheme';

// Hooks
import { useMessages } from '../hooks/useMessages';

// Components
import ManagementModal from '../components/ManagementModal';
import MessageDetailsExpanded from '../components/message/MessageDetailsExpanded';
import MessageReplyForm from '../components/message/MessageReplyForm';

const MessageManagement = () => {
    const {
        messages,
        loading,
        isReplyModalOpen,
        setIsReplyModalOpen,
        selectedMessage,
        replyText,
        setReplyText,
        isSubmitting,
        fetchMessages,
        handleReply,
        handleDelete,
        openReplyModal,
    } = useMessages();

    const columns = [
        {
            name: 'name',
            label: 'Registrant Profile',
            options: {
                customBodyRender: (val: string, tableMeta: any) => {
                    const msg = messages[tableMeta.rowIndex];
                    return (
                        <div className="flex items-center gap-4 text-left group">
                            <div className="w-10 h-10 bg-gray-50 border border-gray-100 rounded-sm flex items-center justify-center text-gray-400 group-hover:bg-black group-hover:text-white transition-all shadow-inner">
                                <User size={18} />
                            </div>
                            <div className="flex flex-col min-w-0">
                                <span className="text-[11px] font-black uppercase text-gray-900 tracking-tighter leading-none mb-1.5">{val}</span>
                                <div className="flex items-center gap-2 text-gray-400">
                                   <Mail size={10} className="text-[#7A578D]"/>
                                   <span className="text-[9px] font-mono font-black lowercase truncate max-w-[150px] opacity-60 leading-none">{msg.email}</span>
                                </div>
                            </div>
                        </div>
                    );
                }
            }
        },
        {
            name: 'subject',
            label: 'Communication Subject',
            options: {
                customBodyRender: (val: string) => (
                    <div className="flex items-center gap-3 text-left group">
                       <div className="w-1.5 h-6 bg-[#7A578D]/20 group-hover:bg-[#7A578D] transition-colors rounded-full" />
                       <span className="text-[10px] font-black text-gray-600 uppercase tracking-widest truncate max-w-[240px] block" title={val}>
                           {val || 'GENERAL_INQUIRY_Nexus'}
                       </span>
                    </div>
                )
            }
        },
        {
            name: 'status',
            label: 'Network State',
            options: {
                customBodyRender: (val: string) => {
                    const styles = {
                        PENDING: 'bg-orange-50 border-orange-100 text-orange-600 shadow-orange-500/5',
                        READ: 'bg-blue-50 border-blue-100 text-blue-600 shadow-blue-500/5',
                        REPLIED: 'bg-emerald-50 border-emerald-100 text-emerald-600 shadow-emerald-500/5'
                    };
                    const icons = {
                        PENDING: <Clock size={14} className="animate-pulse" />,
                        READ: <MessageSquare size={14} />,
                        REPLIED: <CheckCircle size={14} />
                    };
                    return (
                        <div className={`flex items-center gap-2 px-4 py-2 rounded-sm border text-[9px] font-black uppercase tracking-[0.2em] shadow-sm transition-all hover:scale-105 w-fit text-left ${styles[val as keyof typeof styles]}`}>
                            {icons[val as keyof typeof icons]}
                            <span>{val === 'PENDING' ? 'WAITING_SYNC' : val}</span>
                        </div>
                    );
                }
            }
        },
        {
            name: 'createdAt',
            label: 'Nexus Temporal Archive',
            options: {
                customBodyRender: (val: string) => (
                    <div className="flex flex-col gap-1 text-left">
                        <span className="text-[11px] font-black text-gray-900 uppercase tracking-tighter">
                            {new Date(val).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                        </span>
                        <span className="text-[9px] text-gray-400 font-black uppercase tracking-widest opacity-60 leading-none">
                            {new Date(val).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                    </div>
                )
            }
        },
        {
            name: 'id',
            label: 'Executive Command',
            options: {
                customBodyRender: (id: string, tableMeta: any) => {
                    const msg = messages[tableMeta.rowIndex];
                    return (
                        <div className="flex items-center justify-around gap-2 text-left" onClick={(e) => e.stopPropagation()}>
                            <button
                                onClick={() => openReplyModal(msg)}
                                className="px-4 py-2 bg-black text-white text-[10px] font-black uppercase tracking-widest rounded-sm transition-all hover:bg-[#7A578D] shadow-2xl shadow-black/10 active:scale-95 border-b-2 border-black/20 group"
                                title="Structure Resolution"
                            >
                                <div className="flex items-center gap-3">
                                   <Send size={16} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                                   <span>REPLY</span>
                                </div>
                            </button>
                            <button
                                onClick={() => handleDelete(id)}
                                className="w-10 h-10 bg-white text-gray-300 hover:text-white hover:bg-red-500 rounded-sm transition-all border border-gray-100 hover:border-red-500 shadow-sm active:scale-95 flex items-center justify-center group/delete"
                                title="Purge Artifact"
                            >
                                <Trash2 size={20} className="group-hover/delete:rotate-12 transition-transform" />
                            </button>
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
        rowsPerPageOptions: [10, 20, 50],
        download: false,
        print: false,
        viewColumns: false,
        expandableRows: true,
        expandableRowsOnClick: true,
        renderExpandableRow: (rowData: any, rowMeta: any) => {
            const msg = messages[rowMeta.rowIndex];
            return <MessageDetailsExpanded msg={msg} columnsLength={columns.length} />;
        },
        textLabels: { body: { noMatch: loading ? 'Synchronizing Support Communication Nexus...' : 'No communication artifacts detected in global archive' } }
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500 max-w-[1600px] pb-24">
            <header className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-gray-100 pb-8 gap-4">
                <div>
                   <h1 className="text-2xl font-black uppercase tracking-tighter text-gray-900 leading-none">Support_Nexus_Channel</h1>
                   <div className="flex items-center gap-3 mt-3">
                      <div className="flex items-center gap-2 bg-[#7A578D]/5 px-2 py-1 rounded-sm border border-[#7A578D]/10 shadow-xl shadow-[#7A578D]/5">
                         <span className="w-1.5 h-1.5 rounded-full bg-[#7A578D] animate-pulse"></span>
                         <span className="text-[10px] font-black uppercase tracking-widest text-[#7A578D] opacity-70 italic">Global Identity Inquiries Stream Active</span>
                      </div>
                      <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest">{messages.length} REGISTERED_COMMUNICATIONS</span>
                   </div>
                </div>
                <div className="flex items-center gap-4">
                  <button
                    onClick={fetchMessages}
                    className="w-12 h-12 bg-white border border-gray-200 rounded-sm text-gray-300 hover:text-[#7A578D] hover:border-[#7A578D] hover:rotate-180 transition-all duration-700 shadow-sm flex items-center justify-center group"
                    title="Synchronize Nexus Link"
                  >
                    <RefreshCw size={24} className={loading ? 'animate-spin' : ''} />
                  </button>
                  <div className="bg-black text-white p-6 rounded-sm shadow-2xl border-b-4 border-[#7A578D] hidden lg:flex items-center gap-6">
                     <div className="flex flex-col items-end">
                        <span className="text-[10px] font-black uppercase tracking-[0.4em] opacity-40 mb-1 leading-none">UNREAD_PULSE</span>
                        <span className="text-2xl font-black tracking-tighter leading-none">{messages.filter(m => m.status === 'PENDING').length}</span>
                     </div>
                     <MessageCircle size={32} className="text-[#7A578D] opacity-40" />
                  </div>
                </div>
            </header>

            <div className="bg-white border border-gray-100 rounded-sm overflow-hidden shadow-sm relative min-h-[500px]">
                {loading && (
                    <div className="absolute inset-0 z-30 bg-white/60 backdrop-blur-[2px] flex items-center justify-center">
                        <div className="w-12 h-12 border-4 border-[#7A578D] border-t-transparent rounded-full animate-spin shadow-2xl shadow-[#7A578D]/20" />
                    </div>
                )}
                <ThemeProvider theme={getMuiTheme()}>
                    <MUIDataTable title="" data={messages} columns={columns} options={options} />
                </ThemeProvider>
            </div>

            <ManagementModal
                isOpen={isReplyModalOpen}
                onClose={() => setIsReplyModalOpen(false)}
                title={`RESOLUTION_Nexus_FRAMEWORK: [${selectedMessage?.name || 'NULL'}]`}
            >
                <div className="p-2">
                   <MessageReplyForm
                     selectedMessage={selectedMessage}
                     replyText={replyText}
                     setReplyText={setReplyText}
                     handleReply={handleReply}
                     isSubmitting={isSubmitting}
                   />
                </div>
            </ManagementModal>
            
            <footer className="pt-20 border-t border-gray-100 flex items-center justify-center gap-12 opacity-30">
               <div className="flex items-center gap-3">
                  <ShieldCheck size={18} className="text-gray-400"/>
                  <span className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-400">Communication integrity confirmed</span>
               </div>
               <div className="flex items-center gap-3">
                  <Zap size={18} className="text-gray-400 animate-pulse"/>
                  <span className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-400">Live support sync active</span>
               </div>
               <div className="flex items-center gap-3">
                  <Info size={18} className="text-gray-400"/>
                  <span className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-400">Identity resolution 100% Correct</span>
               </div>
            </footer>
        </div>
    );
};

export default MessageManagement;
