import { useState, useEffect } from 'react';
import { Mail, Trash2, CheckCircle, Clock, Send, MessageSquare, User, Calendar, ExternalLink } from 'lucide-react';
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

    useEffect(() => {
        fetchMessages();
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
                            <div className="w-8 h-8 bg-gray-50 flex items-center justify-center rounded-lg border border-gray-100">
                                <User size={14} className="text-gray-400" />
                            </div>
                            <div className="flex flex-col">
                                <span className="text-[10px] font-black uppercase text-gray-900 leading-tight">{val}</span>
                                <span className="text-[8px] text-gray-400 lowercase font-bold italic">{msg.email}</span>
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
                    <span className="text-[10px] font-bold text-gray-600 truncate max-w-[200px] block">{val}</span>
                )
            }
        },
        {
            name: "status",
            label: "STATUS",
            options: {
                customBodyRender: (val: string) => {
                    const styles = {
                        PENDING: 'bg-amber-50 text-amber-600 border-amber-100',
                        READ: 'bg-blue-50 text-blue-600 border-blue-100',
                        REPLIED: 'bg-green-50 text-green-600 border-green-100'
                    };
                    const icons = {
                        PENDING: <Clock size={10} />,
                        READ: <MessageSquare size={10} />,
                        REPLIED: <CheckCircle size={10} />
                    };
                    return (
                        <div className={`flex items-center space-x-1 px-2 py-0.5 rounded border text-[8px] font-black uppercase w-fit ${styles[val as keyof typeof styles]}`}>
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
                        <span className="text-[9px] font-bold text-gray-500">{new Date(val).toLocaleDateString()}</span>
                        <span className="text-[8px] text-gray-400 font-medium">{new Date(val).toLocaleTimeString()}</span>
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
                        <div className="flex space-x-1">
                            <button 
                                onClick={() => openReplyModal(msg)}
                                className="p-1 px-2 hover:bg-[#7A578D]/5 text-[#7A578D] rounded transition-colors"
                                title="Reply/View"
                            >
                                <Send size={12} />
                            </button>
                            <button 
                                onClick={() => handleDelete(id)}
                                className="p-1 px-2 hover:bg-red-50 text-red-500 rounded transition-colors"
                                title="Delete"
                            >
                                <Trash2 size={12} />
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
        viewColumns: false
    };

    return (
        <div className="space-y-4 animate-in fade-in duration-500">
            <header className="flex justify-between items-center border-b border-gray-100 pb-4">
                <div>
                    <h1 className="text-xl font-sans font-black uppercase tracking-tight text-gray-900 leading-none">Messages</h1>
                    <p className="text-gray-400 text-[8px] font-bold uppercase tracking-widest mt-1.5">User inquiries & support requests</p>
                </div>
                <div className="flex items-center space-x-2 text-[8px] font-black uppercase text-gray-400 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100">
                    <MessageSquare size={10} />
                    <span>Total {messages.length} inquiries</span>
                </div>
            </header>

            <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm relative min-h-[400px]">
                {loading && (
                    <div className="absolute inset-0 z-10 bg-white/50 backdrop-blur-[2px] flex items-center justify-center">
                        <div className="w-8 h-8 border-2 border-[#7A578D] border-t-transparent rounded-full animate-spin" />
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
                    <div className="space-y-6">
                        <div className="bg-[#7A578D]/5 border border-[#7A578D]/10 rounded-2xl p-5 space-y-4">
                            <div className="flex justify-between items-start">
                                <div className="space-y-1">
                                    <h4 className="text-[12px] font-black uppercase tracking-tight text-gray-900">{selectedMessage.subject}</h4>
                                    <div className="flex items-center space-x-2 text-[9px] font-bold text-gray-500 italic">
                                        <User size={10} />
                                        <span>{selectedMessage.name}</span>
                                        <span>•</span>
                                        <Mail size={10} />
                                        <span className="lowercase">{selectedMessage.email}</span>
                                    </div>
                                </div>
                                <span className="text-[8px] font-black text-gray-400">{new Date(selectedMessage.createdAt).toLocaleString()}</span>
                            </div>
                            <div className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm italic">
                                <p className="text-xs text-gray-600 leading-relaxed font-medium">"{selectedMessage.message}"</p>
                            </div>
                        </div>

                        {selectedMessage.status === 'REPLIED' ? (
                            <div className="space-y-3">
                                <div className="flex items-center space-x-2 text-[9px] font-black uppercase text-green-600">
                                    <CheckCircle size={12} />
                                    <span>Sent Reply:</span>
                                </div>
                                <div className="bg-green-50/50 border border-green-100/50 rounded-xl p-4 text-[11px] text-gray-600 font-medium italic">
                                    {selectedMessage.reply}
                                </div>
                            </div>
                        ) : (
                            <form onSubmit={handleReply} className="space-y-3 pt-2">
                                <div className="space-y-1.5">
                                    <label className="text-[9px] font-black uppercase tracking-widest text-[#7A578D] ml-1 flex items-center space-x-1.5">
                                        <Send size={10} />
                                        <span>Your Response</span>
                                    </label>
                                    <textarea
                                        value={replyText}
                                        onChange={(e) => setReplyText(e.target.value)}
                                        rows={4}
                                        className="w-full bg-gray-50 border border-gray-100 rounded-xl py-3 px-4 outline-none focus:border-[#7A578D] text-xs font-bold transition-all resize-none"
                                        placeholder="Type your reply here..."
                                        required
                                    />
                                </div>
                                <button 
                                    type="submit" 
                                    disabled={isSubmitting || !replyText.trim()}
                                    className="w-full luxury-button py-3.5 rounded-xl font-black uppercase tracking-[0.2em] text-[10px] disabled:opacity-50"
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
