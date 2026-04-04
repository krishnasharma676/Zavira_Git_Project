
import { useState, useEffect } from 'react';
import api from '../../api/axios';
import toast from 'react-hot-toast';
import { useSettings } from '../../store/useSettings';

export const useOrders = (activeTab: string) => {
    const { fetchSettings: fetchGlobalSettings } = useSettings();
    
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
    const [isLabelLoading, setIsLabelLoading] = useState(false);

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
            
            setStats({
                total: total,
                pending: fetchedStats.pending + (fetchedStats.confirmed || 0),
                shipped: fetchedStats.shipped,
                delivered: fetchedStats.delivered
            });
        } catch (error) {
            toast.error('Failed to load orders');
        }
    };

    useEffect(() => {
        fetchOrders(page, rowsPerPage);
        fetchGlobalSettings(); 
    }, [page, rowsPerPage, activeTab]);

    const viewOrder = (id: string) => {
        const order = orders.find(o => o.id === id);
        if (order) {
            setSelectedOrder(order);
            setIsModalOpen(true);
        }
    };

    const handleRefund = async (id: string, notes: string) => {
        try {
            await api.post(`/orders/admin/${id}/refund`, { notes });
            toast.success('Refund processed successfully');
            fetchOrders();
            if (selectedOrder?.id === id) viewOrder(id);
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
            if (!window.confirm("Trigger Shiprocket for this order?")) return;
            setIsSubmitting(true);
            await api.post(`/orders/admin/${id}/trigger-shipment`);
            toast.success('Shipment created. Now generate AWB.');
            await fetchOrders();
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to trigger shipment');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleGenerateAWB = async (id: string) => {
        if (isSubmitting) return;
        try {
            setIsSubmitting(true);
            await api.post(`/orders/admin/${id}/generate-awb`);
            toast.success('AWB Generated Successfully');
            await fetchOrders();
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to generate AWB');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleCancelShipment = async (id: string) => {
        if (isSubmitting) return;
        try {
            if (!window.confirm("CANCEL the Shiprocket shipment?")) return;
            setIsSubmitting(true);
            await api.post(`/orders/admin/${id}/cancel-shipment`);
            toast.success('Shipment cancelled successfully');
            await fetchOrders();
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to cancel shipment');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleApproveReturn = async (id: string) => {
        try {
            if (!window.confirm("Approve return request?")) return;
            await api.post(`/orders/admin/${id}/approve-return`);
            toast.success('Return Approved');
            fetchOrders();
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to approve return');
        }
    };

    const handleSyncSingleOrder = async (id: string) => {
        try {
            await api.get(`/orders/${id}`); 
            toast.success('Refreshed');
            await fetchOrders();
        } catch (error) {
            toast.error('Failed to sync');
        }
    };

    const handleGenerateLabel = async (id: string) => {
        if (isLabelLoading) return;
        try {
            setIsLabelLoading(true);
            const { data } = await api.post(`/orders/admin/${id}/generate-label`);
            if (data.data.labelUrl) {
                window.open(data.data.labelUrl, '_blank');
                toast.success('Label generated in new tab');
            } else {
                toast.error('Label URL not found');
            }
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to generate label');
        } finally {
            setIsLabelLoading(false);
        }
    };

    const handleForceDeliver = async (id: string) => {
        try {
            if (!window.confirm("FORCE DELIVER: MARK AS DELIVERED?")) return;
            await api.patch(`/orders/admin/${id}/status`, { status: 'DELIVERED' });
            toast.success('Simulation: Order marked as Delivered');
            fetchOrders();
            if (selectedOrder?.id === id) {
                const { data } = await api.get(`/orders/${id}`);
                setSelectedOrder(data.data);
            }
        } catch (error: any) {
            toast.error('Simulation failed');
        }
    };

    const handleResetReship = async (id: string) => {
        try {
            if (!window.confirm("Reset order status for re-shipping?")) return;
            await api.post(`/orders/admin/${id}/reset-reship`);
            toast.success('Order status reset. You can now re-ship it.');
            fetchOrders();
            if (selectedOrder?.id === id) {
                const { data } = await api.get(`/orders/${id}`);
                setSelectedOrder(data.data);
            }
        } catch (error: any) {
            toast.error('Failed to reset order');
        }
    };

    const syncShiprocketStatus = async () => {
        try {
            setIsSubmitting(true);
            await api.post('/orders/admin/sync-shiprocket');
            toast.success('Sync initiated. Wait 10s.');
            await fetchOrders();
        } catch (error: any) {
            toast.error('Sync failed');
        } finally {
            setIsSubmitting(false);
        }
    };

    return {
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
    };
};
