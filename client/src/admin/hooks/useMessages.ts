
import { useState, useEffect, useRef } from 'react';
import api from '../../api/axios';
import toast from 'react-hot-toast';

export const useMessages = () => {
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

    return {
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
    };
};
