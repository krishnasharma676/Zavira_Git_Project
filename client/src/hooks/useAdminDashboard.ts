import { useEffect, useState } from 'react';

export const useAdminDashboard = () => {
    // In a real application, you would fetch these from an API
    // e.g., const { data } = await api.get('/admin/stats');
    
    useEffect(() => {
        // Fetch real stats here from /admin/stats if available
    }, []);

    const stats = [
        { label: 'Total Revenue', value: '₹12,45,000', color: 'text-green-500' },
        { label: 'Active Orders', value: '48', color: 'text-blue-500' },
        { label: 'Total Products', value: '156', color: 'text-purple-500' },
        { label: 'New Customers', value: '12', color: 'text-pink-500' }
    ];

    const recentTransactions = [
        { id: 'ZV-240401-A9B1', time: '2 mins ago', amount: '+₹45,000' },
        { id: 'ZV-240401-A9B2', time: '15 mins ago', amount: '+₹12,500' },
        { id: 'ZV-240401-A9B3', time: '1 hour ago', amount: '+₹89,000' },
        { id: 'ZV-240401-A9B4', time: '3 hours ago', amount: '+₹8,400' }
    ];

    const inventoryAlerts = [
        { message: 'Aurelia Diamond Ring: 2 left', type: 'critical' },
        { message: 'Nocturnal Pearl Necklace: Restocked', type: 'info' },
        { message: 'Solaris Gold Bracelet: Out of stock', type: 'critical' }
    ];

    return {
        stats,
        recentTransactions,
        inventoryAlerts
    };
};
