import { useState, useEffect } from 'react';
import { ArrowRight, ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../store/useCart';
import { useAuth } from '../store/useAuth';
import { useUIStore } from '../store/useUIStore';
import api from '../api/axios';
import toast from 'react-hot-toast';

import AddressSection from '../components/checkout/AddressSection';
import PaymentSection from '../components/checkout/PaymentSection';
import OrderSummary from '../components/checkout/OrderSummary';
import AddressModal from '../components/profile/AddressModal';

const CheckoutPage = () => {
  const { items, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const openAuthModal = useUIStore((s) => s.openAuthModal);
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [addresses, setAddresses] = useState<any[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string>('');
  const [paymentMethod, setPaymentMethod] = useState<'COD' | 'ONLINE'>('COD');
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);

  const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const shipping = subtotal >= 1000 ? 0 : 49;
  const tax = subtotal * 0.03;
  const total = subtotal + tax + shipping;

  useEffect(() => {
    if (!user) {
      navigate('/');
      openAuthModal('login');
      return;
    }
    fetchAddresses();
  }, [user, navigate]);


  const fetchAddresses = async () => {
    try {
      const { data } = await api.get('/addresses');
      setAddresses(data.data);
      const defaultAddress = data.data.find((a: any) => a.isDefault);
      if (defaultAddress) setSelectedAddressId(defaultAddress.id);
      else if (data.data.length > 0) setSelectedAddressId(data.data[0].id);
    } catch {
    }
  };

  const handleCompleteOrder = async () => {
    if (!selectedAddressId) {
      toast.error('Please select a delivery node');
      return;
    }

    setLoading(true);
    try {
      const response = await api.post('/orders/checkout', {
        addressId: selectedAddressId,
        paymentMethod,
        couponCode: '', // Placeholder
        items: items.map(item => ({
          productId: item.id,
          quantity: item.quantity
        }))
      });
      
      toast.success('Protocol Complete: Order archived in registry');
      clearCart();
      navigate(`/order-success/${response.data.data.id}`);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Logistic failure');
    } finally {
      setLoading(false);
    }
  };

  const handleAddressSubmit = async (data: any) => {
    try {
      await api.post('/addresses', data);
      toast.success('Coordinates locked');
      setIsAddressModalOpen(false);
      fetchAddresses();
    } catch (error) {
      toast.error('Input failure');
    }
  };

  if (items.length === 0) {
    return (
      <div className="pt-8 pb-20 text-center">
        <h2 className="text-xl font-sans font-black mb-4">Cart empty_</h2>
        <button onClick={() => navigate('/shop')} className="luxury-button !py-2 !px-8">Back to Shop</button>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-[#0A0A0A] pt-8 pb-20 text-gray-900 dark:text-gray-100 transition-colors duration-300 min-h-screen">
      <div className="container mx-auto px-6 max-w-6xl">
        <div className="grid lg:grid-cols-2 gap-20">
          {/* Form Side */}
          <div className="space-y-12">
            <button 
              onClick={() => step > 1 ? setStep(step - 1) : navigate('/cart')}
              className="flex items-center space-x-2 text-[10px] uppercase tracking-[0.2em] font-black text-gray-400 hover:text-[#7A578D] transition-colors"
            >
              <ChevronLeft size={16} />
              <span>Back to {step === 1 ? 'Collection' : 'Logistics'}</span>
            </button>

            <div className="space-y-2">
              <p className="text-[#7A578D] uppercase tracking-[0.4em] text-[10px] font-black">Secure Pipeline</p>
              <h1 className="text-4xl font-sans font-black uppercase italic tracking-tighter">
                {step === 1 ? 'Dispatch_Node' : 'Financial_Authorization'}
              </h1>
            </div>

            {step === 1 ? (
              <div className="space-y-10">
                <AddressSection 
                  addresses={addresses}
                  selectedAddressId={selectedAddressId}
                  setSelectedAddressId={setSelectedAddressId}
                  setIsAddressModalOpen={setIsAddressModalOpen}
                />

                <button 
                  onClick={() => selectedAddressId ? setStep(2) : toast.error('Selection required')}
                  className="luxury-button w-full rounded-2xl flex items-center justify-center space-x-4"
                >
                  <span>AUTHORIZE LOGISTICS</span>
                  <ArrowRight size={18} />
                </button>
              </div>
            ) : (
              <PaymentSection 
                paymentMethod={paymentMethod}
                setPaymentMethod={setPaymentMethod}
                handleCompleteOrder={handleCompleteOrder}
                loading={loading}
              />
            )}
          </div>

          {/* Summary Side - Stay relatively fixed or sticky */}
          <OrderSummary 
            items={items}
            subtotal={subtotal}
            shipping={shipping}
            tax={tax}
            total={total}
          />
        </div>
      </div>

      <AddressModal 
        isOpen={isAddressModalOpen}
        onClose={() => setIsAddressModalOpen(false)}
        onSubmit={handleAddressSubmit}
      />
    </div>
  );
};

export default CheckoutPage;

