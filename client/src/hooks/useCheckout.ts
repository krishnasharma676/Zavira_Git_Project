import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useCart } from '../store/useCart';
import { useAuth } from '../store/useAuth';
import { useUIStore } from '../store/useUIStore';
import { getCheckoutSuggestions, createAddress, createOrder } from '../services/checkoutService';

export const useCheckout = () => {
  const { items, clearCart, addItem } = useCart();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const openAuthModal = useUIStore((s) => s.openAuthModal);
  
  const [isSummaryOpen, setIsSummaryOpen] = useState(false);
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Form State
  const [formData, setFormData] = useState({
    pincode: '',
    firstName: '',
    lastName: '',
    address: '',
    area: '',
    city: '',
    state: '',
    email: user?.email || '',
    type: 'Home'
  });

  const subtotal = items.reduce((acc, item) => acc + (item.price || 0) * (item.quantity || 0), 0);
  const savings = subtotal * 0.15; // Mock savings
  const total = subtotal + (subtotal * 0.03) + (subtotal >= 1000 ? 0 : 49) - savings;

  useEffect(() => {
    if (!user) {
      navigate('/');
      openAuthModal('login');
      return;
    }
    getCheckoutSuggestions().then(setSuggestions).catch(() => {});
  }, [user, navigate, openAuthModal]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCompleteOrder = async () => {
    if (isSubmitting) return;
    if (!formData.pincode || !formData.address || !formData.firstName) {
      toast.error('Please fill in required shipping fields');
      return;
    }

    try {
      setIsSubmitting(true);
      
      const addressData = await createAddress({
        name: `${formData.firstName} ${formData.lastName}`,
        type: formData.type.toUpperCase(),
        street: formData.address,
        city: formData.city,
        state: formData.state,
        pincode: formData.pincode,
        phone: 'Not provided', // Placeholder
        isDefault: true
      });

      const orderData = await createOrder({
        addressId: addressData.id,
        paymentMethod: 'COD',
        items: items.map(item => ({
          productId: item.id,
          quantity: item.quantity,
          variantId: item.variantId,
          selectedSize: item.selectedSize
        }))
      });
      
      toast.success('Order placed successfully!');
      clearCart();
      navigate(`/order-success/${orderData.id}`);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to place order');
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    items,
    user,
    logout,
    navigate,
    addItem,
    isSummaryOpen,
    setIsSummaryOpen,
    suggestions,
    isAccountOpen,
    setIsAccountOpen,
    isSubmitting,
    formData,
    handleInputChange,
    handleCompleteOrder,
    total,
    savings
  };
};
