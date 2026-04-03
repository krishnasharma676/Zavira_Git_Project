import { useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../store/useAuth';
import { useWishlist } from '../store/useWishlist';
import { useUIStore } from '../store/useUIStore';
import { getMyOrders, getMyAddresses, deleteAddress, updateDefaultAddress, addAddress, requestOrderReturn } from '../services/profileService';

export const useProfile = () => {
  const [activeTab, setActiveTab] = useState('orders');
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

  const fetchProfileData = useCallback(async () => {
    try {
      const [ordersData, addressesData] = await Promise.all([
        getMyOrders(),
        getMyAddresses()
      ]);
      setOrders(ordersData);
      setAddresses(addressesData);
    } catch {
      // Error handled implicitly or can add toast
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (user) {
      fetchProfileData();
    } else {
      navigate('/');
      openAuthModal('login');
    }
  }, [user, navigate, openAuthModal, fetchProfileData]);

  const handleLogout = () => {
    logout();
    toast.success('Successfully logged out');
    navigate('/');
  };

  const handleDeleteAddress = async (id: string) => {
    try {
      await deleteAddress(id);
      toast.success('Address removed');
      fetchProfileData();
    } catch (error) {
      toast.error('Failed to delete address');
    }
  };

  const handleSetDefaultAddress = async (id: string) => {
    try {
      await updateDefaultAddress(id);
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
      await requestOrderReturn(orderId, formData);
      toast.success('Return request submitted successfully!');
      fetchProfileData();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to submit return request');
      throw error;
    }
  };

  const handleAddressSubmit = async (data: any) => {
    try {
      await addAddress(data);
      toast.success('Address added successfully');
      setIsAddressModalOpen(false);
      fetchProfileData();
    } catch (error) {
      toast.error('Failed to add address');
    }
  };

  return {
    user,
    loading,
    activeTab,
    setActiveTab,
    orders,
    addresses,
    wishlistItems,
    isAddressModalOpen,
    setIsAddressModalOpen,
    returnModal,
    setReturnModal,
    handleLogout,
    handleDeleteAddress,
    handleSetDefaultAddress,
    handleAddressSubmit,
    handleRequestReturn,
    handleReturnSubmit
  };
};
