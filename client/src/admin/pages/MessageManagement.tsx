import { useState, useEffect, useRef } from 'react';
import { Mail, Trash2, CheckCircle, Clock, Send, MessageSquare, User } from 'lucide-react';
import api from '../../api/axios';
import ManagementModal from '../components/ManagementModal';
import toast from 'react-hot-toast';
import MUIDataTable from "mui-datatables";
import { ThemeProvider } from '@mui/material/styles';
import { getMuiTheme } from '../utils/muiTableTheme';

const MessageManagement = () => {
    const [messages, setMessages] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isReplyModalOpen, setIsReplyModalOpen] = useState(false);
    const [selectedMessage, setSelectedMessage] = useState<any>(null);
    const [replyText, setReplyText] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const fetchMessages = async () => {
        setLoading(true);
        try {
            const { data } = await api.get('/contact/all');
            setMessages(data.data);
        } catch (error) {
            toast.error('Failed to load messages');
        } finally {
            setLoading(false);
        }
    };

    const isFirstRender = useRef(true);

    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false;
            fetchMessages();
        }
    }, []);

    const handleMarkAsRead = async (id: string) => {
        try {
            await api.post(`/contact/${id}/read`);
            fetchMessages();
        } catch (error) {
            console.error(error);
        }
    };

    const handleReply = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!replyText.trim()) return;

        setIsSubmitting(true);
        try {
            await api.post(`/contact/${selectedMessage.id}/reply`, { reply: replyText });
            toast.success('Reply sent successfully');
            setIsReplyModalOpen(false);
            setReplyText('');
            fetchMessages();
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to send reply');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm('Are you sure you want to delete this message?')) return;
        try {
            await api.delete(`/contact/${id}`);
            toast.success('Message deleted');
            fetchMessages();
        } catch (error) {
            toast.error('Failed to delete message');
        }
    };

    const openReplyModal = (msg: any) => {
        setSelectedMessage(msg);
        setIsReplyModalOpen(true);
        if (msg.status === 'PENDING') {
            handleMarkAsRead(msg.id);
        }
    };

    const columns = [
        {
            name: "name",
            label: "SENDER",
            options: {
                customBodyRender: (val: string, tableMeta: any) => {
                    const msg = messages[tableMeta.rowIndex];
                    return (
                        <div className="flex items-center space-x-3">
                            <div className="w-6 h-6 bg-gray-50 flex items-center justify-center rounded-sm border border-gray-100 shadow-sm">
                                <User size={16} className="text-[#7A578D]" />
                            </div>
                            <div className="flex flex-col">
                                <span className="text-xs font-bold uppercase text-gray-900 tracking-wider leading-tight">{val}</span>
                                <span className="text-xs text-gray-500 lowercase font-medium">{msg.email}</span>
                            </div>
                        </div>
                    );
                }
            }
        },
        {
            name: "subject",
            label: "SUBJECT",
            options: {
                customBodyRender: (val: string) => (
                    <span className="text-xs font-bold text-gray-700 truncate max-w-[250px] block" title={val}>{val}</span>
                )
            }
        },
        {
            name: "status",
            label: "STATUS",
            options: {
                customBodyRender: (val: string) => {
                    const styles = {
                        PENDING: 'bg-amber-50 text-amber-700 border-amber-100',
                        READ: 'bg-blue-50 text-blue-700 border-blue-100',
                        REPLIED: 'bg-green-50 text-green-700 border-green-100'
                    };
                    const icons = {
                        PENDING: <Clock size={14} />,
                        READ: <MessageSquare size={14} />,
                        REPLIED: <CheckCircle size={14} />
                    };
                    return (
                        <div className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-sm border text-xs font-bold uppercase tracking-widest shadow-sm w-fit ${styles[val as keyof typeof styles]}`}>
                            {icons[val as keyof typeof icons]}
                            <span>{val}</span>
                        </div>
                    );
                }
            }
        },
        {
            name: "createdAt",
            label: "DATE",
            options: {
                customBodyRender: (val: string) => (
                    <div className="flex flex-col">
                        <span className="text-xs font-bold text-gray-900">{new Date(val).toLocaleDateString()}</span>
                        <span className="text-xs text-gray-500 font-medium">{new Date(val).toLocaleTimeString()}</span>
                    </div>
                )
            }
        },
        {
            name: "id",
            label: "ACTIONS",
            options: {
                customBodyRender: (id: string, tableMeta: any) => {
                    const msg = messages[tableMeta.rowIndex];
                    return (
                        <div className="flex space-x-2">
                            <button 
                                onClick={() => openReplyModal(msg)}
                                className="p-2 hover:bg-[#7A578D]/10 text-[#7A578D] rounded-sm transition-colors border border-transparent hover:border-[#7A578D]/20 shadow-sm"
                                title="Reply/View"
                            >
                                <Send size={16} />
                            </button>
                            <button 
                                onClick={() => handleDelete(id)}
                                className="p-2 hover:bg-red-50 text-red-600 rounded-sm transition-colors border border-transparent hover:border-red-200 shadow-sm"
                                title="Delete"
                            >
                                <Trash2 size={16} />
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
        download: false,
        print: false,
        viewColumns: false,
        expandableRows: true,
        expandableRowsOnClick: true,
        renderExpandableRow: (rowData: any, rowMeta: any) => {
            const msg = messages[rowMeta.rowIndex];
            if (!msg) return null;
            return (
                <tr style={{ backgroundColor: '#fff' }}>
                    <td colSpan={columns.length + 1} style={{ padding: '0', borderBottom: '1px solid #eee' }}>
                        <div style={{ padding: '16px', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', fontFamily: '"Times New Roman", Times, serif', fontSize: '12px', color: '#333' }}>
                            <div style={{ gridColumn: 'span 4' }}>
                                <strong style={{ display: 'block', marginBottom: '4px' }}>Inquiry Message:</strong>
                                <span>{msg.message}</span>
                            </div>
                            <div style={{ gridColumn: 'span 4' }}>
                                <strong style={{ display: 'block', marginBottom: '4px' }}>Support Reply:</strong>
                                <span>{msg.reply || 'Pending Staff Response'}</span>
                            </div>
                            <div>
                                <strong style={{ display: 'block', marginBottom: '4px' }}>Sender Name:</strong>
                                <span>{msg.name}</span>
                            </div>
                            <div>
                                <strong style={{ display: 'block', marginBottom: '4px' }}>Sender Email:</strong>
                                <span>{msg.email}</span>
                            </div>
                            <div>
                                <strong style={{ display: 'block', marginBottom: '4px' }}>Received On:</strong>
                                <span>{new Date(msg.createdAt).toLocaleString()}</span>
                            </div>
                            <div>
                                <strong style={{ display: 'block', marginBottom: '4px' }}>System ID:</strong>
                                <span>{msg.id}</span>
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
                    <h1 className="text-lg font-bold uppercase tracking-tight text-gray-900 leading-none">Messages</h1>
                    <p className="text-gray-500 text-xs mt-1 font-medium">User inquiries & support requests</p>
                </div>
                <div className="flex items-center gap-2 text-xs font-bold uppercase text-[#7A578D] bg-[#7A578D]/5 px-2 py-1 rounded-sm border border-[#7A578D]/20 shadow-sm">
                    <MessageSquare size={16} />
                    <span>Total {messages.length} inquiries</span>
                </div>
            </header>

            <div className="bg-white border border-gray-100 rounded-sm overflow-hidden shadow-sm relative min-h-[200px]">
                {loading && (
                    <div className="absolute inset-0 z-10 bg-white/60 backdrop-blur-[1px] flex items-center justify-center">
                        <div className="w-6 h-6 border-4 border-[#7A578D] border-t-transparent rounded-full animate-spin" />
                    </div>
                )}
                <ThemeProvider theme={getMuiTheme()}>
                    <MUIDataTable title="" data={messages} columns={columns} options={options} />
                </ThemeProvider>
            </div>

            <ManagementModal 
                isOpen={isReplyModalOpen} 
                onClose={() => setIsReplyModalOpen(false)}
                title="Message Details"
            >
                {selectedMessage && (
                    <div className="space-y-2">
                        <div className="bg-[#7A578D]/5 border border-[#7A578D]/10 rounded-sm p-2 space-y-1">
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                                <div className="space-y-1.5">
                                    <h4 className="text-xs font-bold uppercase tracking-wider text-gray-900">{selectedMessage.subject}</h4>
                                    <div className="flex flex-wrap items-center gap-2 text-xs font-bold text-gray-500">
                                        <User size={12} />
                                        <span>{selectedMessage.name}</span>
                                        <span className="text-gray-300">•</span>
                                        <Mail size={12} />
                                        <span className="lowercase">{selectedMessage.email}</span>
                                    </div>
                                </div>
                                <span className="text-xs font-bold text-gray-400 bg-white px-3 py-1 rounded-sm border border-gray-200">{new Date(selectedMessage.createdAt).toLocaleString()}</span>
                            </div>
                            <div className="bg-white border border-gray-200 rounded-sm p-2 shadow-sm italic">
                                <p className="text-xs text-gray-700 leading-relaxed font-medium">"{selectedMessage.message}"</p>
                            </div>
                        </div>

                        {selectedMessage.status === 'REPLIED' ? (
                            <div className="space-y-1">
                                <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-widest text-green-700 ml-1">
                                    <CheckCircle size={14} />
                                    <span>Sent Reply:</span>
                                </div>
                                <div className="bg-green-50/50 border border-green-100/50 rounded-sm p-2 text-xs text-green-800 font-medium italic shadow-sm">
                                    {selectedMessage.reply}
                                </div>
                            </div>
                        ) : (
                            <form onSubmit={handleReply} className="space-y-2">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase tracking-widest text-[#7A578D] ml-1 flex items-center gap-2">
                                        <Send size={14} />
                                        <span>Your Response</span>
                                    </label>
                                    <textarea
                                        value={replyText}
                                        onChange={(e) => setReplyText(e.target.value)}
                                        rows={4}
                                        className="w-full bg-gray-50 border border-gray-200 rounded-sm py-1 px-2 outline-none focus:ring-2 focus:ring-[#7A578D]/20 focus:border-[#7A578D] text-xs font-medium transition-all resize-none shadow-sm"
                                        placeholder="Type your reply here..."
                                        required
                                    />
                                </div>
                                <button 
                                    type="submit" 
                                    disabled={isSubmitting || !replyText.trim()}
                                    className="w-full bg-black text-white py-1 rounded-sm text-xs font-bold uppercase tracking-widest transition-all shadow-md active:scale-95 disabled:opacity-50 hover:bg-[#7A578D]"
                                >
                                    {isSubmitting ? 'SENDING REPLY...' : 'SEND REPLY TO USER'}
                                </button>
                            </form>
                        )}
                    </div>
                )}
            </ManagementModal>
        </div>
    );
};

export default MessageManagement;
