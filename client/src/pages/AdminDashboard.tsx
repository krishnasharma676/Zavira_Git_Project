import { useEffect } from 'react';
import { Package, ShoppingBag, Users, DollarSign } from 'lucide-react';

const AdminDashboard = () => {
    useEffect(() => {
        // Fetch real stats here from /admin/stats if available
    }, []);

    return (
        <div className="pt-[170px] px-10 min-h-screen bg-white dark:bg-[#121212] transition-colors duration-300">
            <h1 className="text-3xl font-sans mb-10 uppercase tracking-widest text-gray-900 dark:text-white">Management Hub</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                {/* Stats Cards */}
                {[
                    { label: 'Total Revenue', value: '₹12,45,000', icon: DollarSign, color: 'text-green-500' },
                    { label: 'Active Orders', value: '48', icon: ShoppingBag, color: 'text-blue-500' },
                    { label: 'Total Products', value: '156', icon: Package, color: 'text-purple-500' },
                    { label: 'New Customers', value: '12', icon: Users, color: 'text-pink-500' }
                ].map((stat, i) => (
                    <div key={i} className="bg-white dark:bg-[#1A1A1A] border border-gray-100 dark:border-white/5 p-6 rounded-2xl shadow-sm">
                        <div className="flex items-center justify-between mb-4">
                            <stat.icon size={20} className={stat.color} />
                            <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Monthly Stats</span>
                        </div>
                        <p className="text-2xl font-black text-gray-900 dark:text-gray-100">{stat.value}</p>
                        <p className="text-[10px] uppercase font-bold text-gray-400 mt-1 tracking-widest">{stat.label}</p>
                    </div>
                ))}
            </div>
            <div className="mt-20 grid grid-cols-1 lg:grid-cols-2 gap-10">
                <div className="bg-white border border-gray-100 p-8 shadow-sm">
                    <h3 className="text-sm uppercase tracking-widest mb-6 font-semibold border-b pb-4">Recent Transactions</h3>
                    {/* Table Placeholder */}
                    <div className="space-y-4">
                        {[1,2,3,4].map(i => (
                            <div key={i} className="flex justify-between items-center text-xs py-2 border-b border-gray-50 last:border-0">
                                <span>#ORD-9082{i}</span>
                                <span className="text-gray-400 italic">2 mins ago</span>
                                <span className="font-semibold text-green-600">+₹45,000</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-white border border-gray-100 p-8 shadow-sm">
                    <h3 className="text-sm uppercase tracking-widest mb-6 font-semibold border-b pb-4">Inventory Alerts</h3>
                    <div className="space-y-4 text-xs font-light">
                        <p className="text-red-500 underline">Aurelia Diamond Ring: 2 left</p>
                        <p>Nocturnal Pearl Necklace: Restocked</p>
                        <p className="text-red-500 underline">Solaris Gold Bracelet: Out of stock</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AdminDashboard;
