import { useState } from 'react';
import { AnimatePresence } from 'framer-motion';

import ContactInfo from '../components/contact/ContactInfo';
import ContactForm from '../components/contact/ContactForm';
import ContactSuccess from '../components/contact/ContactSuccess';

const ContactPage = () => {
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
    setTimeout(() => setIsSubmitted(false), 5000);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-[#0A0A0A] pt-[100px] pb-10 transition-colors duration-300">
      <div className="container mx-auto px-6 max-w-5xl">
        {/* Header Section */}
        <div className="text-center mb-10">
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
                <ContactForm key="form" onSubmit={handleSubmit} />
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

