import { useState, useEffect } from 'react';
import { Package, Grid, MapPin, Heart, User, CheckCircle, Truck, Clock, RefreshCw } from 'lucide-react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../store/useAuth';
import { useWishlist } from '../store/useWishlist';
import { useUIStore } from '../store/useUIStore';

import ProfileSidebar from '../components/profile/ProfileSidebar';
import DashboardTab from '../components/profile/DashboardTab';
import OrdersTab from '../components/profile/OrdersTab';
import WishlistTab from '../components/profile/WishlistTab';
import AddressesTab from '../components/profile/AddressesTab';
import AccountTab from '../components/profile/AccountTab';
import AddressModal from '../components/profile/AddressModal';
import ReturnModal from '../components/profile/ReturnModal';


const ProfilePage = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const openAuthModal = useUIStore((s) => s.openAuthModal);
  const [orders, setOrders] = useState<any[]>([]);
  const [addresses, setAddresses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [returnModal, setReturnModal] = useState<{ open: boolean; orderId: string; orderNumber: string }>(
    { open: false, orderId: '', orderNumber: '' }
  );
  const { user, logout } = useAuth();

  const { items: wishlistItems } = useWishlist();
  const navigate = useNavigate();

  const fetchProfileData = async () => {
    try {
      const [ordersRes, addressesRes] = await Promise.all([
        api.get('/orders/my-orders'),
        api.get('/addresses')
      ]);
      setOrders(ordersRes.data.data);
      setAddresses(addressesRes.data.data);
    } catch {
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchProfileData();
    } else {
      navigate('/');
      openAuthModal('login');
    }
  }, [user, navigate]);


  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Grid },
    { id: 'orders', label: 'Orders', icon: Package },
    { id: 'addresses', label: 'Your addresses', icon: MapPin },
    { id: 'wishlist', label: 'Your Wishlist', icon: Heart },
    { id: 'account', label: 'Account details', icon: User },
  ];

  const handleLogout = () => {
    logout();
    toast.success('Successfully logged out');
    navigate('/');
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'DELIVERED': return <CheckCircle size={10} className="text-green-500" />;
      case 'SHIPPED': return <Truck size={10} className="text-blue-500" />;
      case 'RETURN_REQUESTED': return <RefreshCw size={10} className="text-orange-500" />;
      case 'RETURNED': return <RefreshCw size={10} className="text-gray-400" />;
      default: return <Clock size={10} className="text-orange-500" />;
    }
  };

  const handleDeleteAddress = async (id: string) => {
    try {
      await api.delete(`/addresses/${id}`);
      toast.success('Address removed');
      fetchProfileData();
    } catch (error) {
      toast.error('Failed to delete address');
    }
  };

  const handleSetDefaultAddress = async (id: string) => {
    try {
      await api.patch(`/addresses/${id}/default`);
      toast.success('Default address updated');
      fetchProfileData();
    } catch (error) {
      toast.error('Failed to update default address');
    }
  };

  const handleRequestReturn = (orderId: string, orderNumber: string) => {
    setReturnModal({ open: true, orderId, orderNumber });
  };

  const handleReturnSubmit = async (orderId: string, reason: string, files: File[]) => {
    const formData = new FormData();
    formData.append('reason', reason);
    files.forEach(f => formData.append('images', f));
    try {
      await api.post(`/orders/${orderId}/return`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      toast.success('Return request submitted successfully!');
      fetchProfileData();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to submit return request');
      throw error; // propagate so modal stays open on error
    }
  };


  const handleAddressSubmit = async (data: any) => {
    try {
      await api.post('/addresses', data);
      toast.success('Address added successfully');
      setIsAddressModalOpen(false);
      fetchProfileData();
    } catch (error) {
      toast.error('Failed to add address');
    }
  };

  if (!user) return null;

  return (
    <div className="bg-white dark:bg-[#0A0A0A] pt-[80px] pb-8 text-gray-800 dark:text-gray-100 min-h-screen transition-colors duration-300">
      <div className="container mx-auto px-6 max-w-6xl">
        <div className="flex flex-col lg:flex-row gap-8">
          <ProfileSidebar 
            user={user} 
            navItems={navItems} 
            activeTab={activeTab} 
            setActiveTab={setActiveTab} 
            handleLogout={handleLogout} 
          />

          <main className="lg:w-3/4">
            {activeTab === 'dashboard' && (
              <DashboardTab 
                user={user} 
                orders={orders} 
                wishlistCount={wishlistItems.length} 
                loading={loading} 
                getStatusIcon={getStatusIcon} 
                setActiveTab={setActiveTab} 
              />
            )}

            {activeTab === 'orders' && (
              <OrdersTab 
                orders={orders} 
                loading={loading} 
                getStatusIcon={getStatusIcon}
                onRequestReturn={(orderId, orderNumber) => handleRequestReturn(orderId, orderNumber)}
              />
            )}

            {activeTab === 'wishlist' && (
              <WishlistTab 
                wishlistItems={wishlistItems} 
              />
            )}

            {activeTab === 'addresses' && (
              <AddressesTab 
                addresses={addresses} 
                handleSetDefaultAddress={handleSetDefaultAddress} 
                handleDeleteAddress={handleDeleteAddress} 
                setIsAddressModalOpen={setIsAddressModalOpen} 
              />
            )}

            {activeTab === 'account' && (
              <AccountTab 
                user={user} 
              />
            )}
          </main>
        </div>
      </div>
      
      <AddressModal 
        isOpen={isAddressModalOpen} 
        onClose={() => setIsAddressModalOpen(false)} 
        onSubmit={handleAddressSubmit} 
      />

      <ReturnModal
        isOpen={returnModal.open}
        orderId={returnModal.orderId}
        orderNumber={returnModal.orderNumber}
        onClose={() => setReturnModal({ ...returnModal, open: false })}
        onSubmit={handleReturnSubmit}
      />
    </div>
  );
};

export default ProfilePage;

