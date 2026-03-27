import { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import api from '../api/axios';
import toast from 'react-hot-toast';

import ContactInfo from '../components/contact/ContactInfo';
import ContactForm from '../components/contact/ContactForm';
import ContactSuccess from '../components/contact/ContactSuccess';

const ContactPage = () => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (data: { name: string; email: string; subject: string; message: string }) => {
    setLoading(true);
    try {
      await api.post('/contact/submit', data);
      setIsSubmitted(true);
      toast.success('Message sent successfully!');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to send message');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-[#0A0A0A] pt-12 pb-10 transition-colors duration-300">
      <div className="container mx-auto px-6 max-w-5xl">
        {/* Header Section */}
        <div className="text-center mb-6">

          <h1 className="text-xl md:text-2xl text-gray-900 dark:text-white uppercase font-black tracking-[0.2em] leading-none mb-3">
            Contact <span className="text-[#7A578D]">Us_</span>
          </h1>
          <p className="text-[11px] text-gray-400 uppercase tracking-widest font-black">
            Our team is here to help you
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          <ContactInfo />

          {/* Contact Form Area */}
          <div className="lg:col-span-7">
            <AnimatePresence mode="wait">
              {!isSubmitted ? (
                <ContactForm key="form" onSubmit={handleSubmit} loading={loading} />
              ) : (
                <ContactSuccess key="success" onReset={() => setIsSubmitted(false)} />
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;

