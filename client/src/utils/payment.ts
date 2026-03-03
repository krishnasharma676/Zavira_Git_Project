export const loadRazorpay = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => {
        resolve(true);
      };
      script.onerror = () => {
        resolve(false);
      };
      document.body.appendChild(script);
    });
  };
  
  export const displayRazorpay = async (order: any, user: any, onPaymentSuccess: (resp: any) => void) => {
    const res = await loadRazorpay();
  
    if (!res) {
      alert('Razorpay SDK failed to load. Are you online?');
      return;
    }
  
    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY || 'rzp_test_placeholder',
      amount: order.totalAmount * 100, // in paise
      currency: 'INR',
      name: 'Verve Fine Jewelry',
      description: 'Transaction for Order ' + order.id,
      image: '/logo.png',
      order_id: order.paymentId, // This should come from backend
      handler: function (response: any) {
        onPaymentSuccess(response);
      },
      prefill: {
        name: user?.name,
        email: user?.email,
        contact: user?.phone,
      },
      theme: {
        color: '#121212',
      },
    };
  
    const paymentObject = new (window as any).Razorpay(options);
    paymentObject.open();
  };
