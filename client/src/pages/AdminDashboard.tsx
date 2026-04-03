import { Package, ShoppingBag, Users, DollarSign } from 'lucide-react';
import { useAdminDashboard } from '../hooks/useAdminDashboard';

const iconMap: Record<string, any> = {
    'Total Revenue': DollarSign,
    'Active Orders': ShoppingBag,
    'Total Products': Package,
    'New Customers': Users
};

const AdminDashboard = () => {
    const { stats, recentTransactions, inventoryAlerts } = useAdminDashboard();

    return (
        <div className="pt-[170px] px-10 min-h-screen bg-white dark:bg-[#121212] transition-colors duration-300">
            <h1 className="text-3xl font-sans mb-10 uppercase tracking-widest text-gray-900 dark:text-white">Management Hub</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                {/* Stats Cards */}
                {stats.map((stat, i) => {
                    const Icon = iconMap[stat.label];
                    return (
                        <div key={i} className="bg-white dark:bg-[#1A1A1A] border border-gray-100 dark:border-white/5 p-6 rounded-2xl shadow-sm">
                            <div className="flex items-center justify-between mb-4">
                                <Icon size={20} className={stat.color} />
                                <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Monthly Stats</span>
                            </div>
                            <p className="text-2xl font-black text-gray-900 dark:text-gray-100">{stat.value}</p>
                            <p className="text-[10px] uppercase font-bold text-gray-400 mt-1 tracking-widest">{stat.label}</p>
                        </div>
                    );
                })}
            </div>
            <div className="mt-20 grid grid-cols-1 lg:grid-cols-2 gap-10">
                <div className="bg-white border border-gray-100 p-8 shadow-sm">
                    <h3 className="text-sm uppercase tracking-widest mb-6 font-black border-b border-gray-100 dark:border-white/5 pb-4 text-gray-900 dark:text-white">Recent Transactions</h3>
                    {/* Table Placeholder */}
                    <div className="space-y-4">
                        {recentTransactions.map((tx, i) => (
                            <div key={i} className="flex justify-between items-center text-[11px] font-bold uppercase tracking-widest py-3 border-b border-gray-50 dark:border-white/5 last:border-0 text-gray-600 dark:text-gray-400">
                                <span>{tx.id}</span>
                                <span className="text-gray-400 italic normal-case font-medium">{tx.time}</span>
                                <span className="font-black text-emerald-600">{tx.amount}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-white border border-gray-100 p-8 shadow-sm">
                    <h3 className="text-sm uppercase tracking-widest mb-6 font-semibold border-b pb-4">Inventory Alerts</h3>
                    <div className="space-y-4 text-xs font-light">
                        {inventoryAlerts.map((alert, i) => (
                            <p key={i} className={alert.type === 'critical' ? 'text-red-500 underline' : ''}>{alert.message}</p>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AdminDashboard;
