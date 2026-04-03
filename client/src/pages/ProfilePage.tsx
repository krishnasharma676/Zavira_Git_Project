import { Package, Heart, User, CheckCircle, Truck, Clock, RefreshCw } from 'lucide-react';
import { useProfile } from '../hooks/useProfile';

import ProfileSidebar from '../components/profile/ProfileSidebar';
import OrdersTab from '../components/profile/OrdersTab';
import WishlistTab from '../components/profile/WishlistTab';
import AccountTab from '../components/profile/AccountTab';
import ReturnModal from '../components/profile/ReturnModal';

const navItems = [
  { id: 'orders', label: 'Orders', icon: Package },
  { id: 'wishlist', label: 'Your Wishlist', icon: Heart },
  { id: 'account', label: 'Account details', icon: User },
];

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'DELIVERED': return <CheckCircle size={10} className="text-green-500" />;
    case 'SHIPPED': return <Truck size={10} className="text-blue-500" />;
    case 'RETURN_REQUESTED': return <RefreshCw size={10} className="text-orange-500" />;
    case 'RETURNED': return <RefreshCw size={10} className="text-gray-400" />;
    default: return <Clock size={10} className="text-orange-500" />;
  }
};

const ProfilePage = () => {
  const {
    user, loading, activeTab, setActiveTab, orders, addresses, wishlistItems,
    isAddressModalOpen, setIsAddressModalOpen, returnModal, setReturnModal,
    handleLogout, handleDeleteAddress, handleSetDefaultAddress, handleAddressSubmit,
    handleRequestReturn, handleReturnSubmit
  } = useProfile();

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
            {activeTab === 'orders' && (
              <OrdersTab 
                orders={orders} 
                loading={loading} 
                getStatusIcon={getStatusIcon} 
                onRequestReturn={handleRequestReturn} 
              />
            )}
            {activeTab === 'wishlist' && (
              <WishlistTab 
                items={wishlistItems} 
              />
            )}
            {activeTab === 'account' && (
              <AccountTab 
                user={user} 
                addresses={addresses}
                onDeleteAddress={handleDeleteAddress}
                onSetDefault={handleSetDefaultAddress}
                onAddAddress={handleAddressSubmit}
                isAddressModalOpen={isAddressModalOpen}
                setIsAddressModalOpen={setIsAddressModalOpen}
              />
            )}
          </main>
        </div>
      </div>
      
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

