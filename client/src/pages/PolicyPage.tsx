import { motion } from 'framer-motion';
import { useLocation } from 'react-router-dom';

const PolicyPage = () => {
  const { pathname } = useLocation();
  const title = pathname.split('/').pop()?.replace('-', ' ') || 'Policy';

  const content: Record<string, any> = {
    'shipping-returns': {
      title: 'Shipping & Returns',
      text: 'Our logistics are as refined as our jewelry. We offer complimentary white-glove delivery on all acquisitions within India. International shipments are handled by our dedicated global partners with full insurance coverage. Returns are accepted within 14 days for standard collection pieces, provided the security seal remains intact.'
    },
    'faqs': {
      title: 'Frequently Asked Questions',
      text: 'Discover answers to our most common inquiries regarding diamond certification, metal purity, and custom calibration. For specific artisan questions, our concierge is always available for a private consultation.'
    },
    'size-guide': {
      title: 'Size Guide',
      text: 'At Verve, precision is paramount. We provide professional sizing tools and virtual consultations to ensure your masterpiece fits with perfect calibration. Our ateliers also offer complimentary resizing for all bridal collection pieces.'
    },
    'privacy-policy': {
      title: 'Privacy Policy',
      text: 'Your privacy is our highest commitment. We utilize bank-level 256-bit encryption for all transactions and handle your personal data with the same care we give to our rarest gemstones.'
    },
    'terms-of-service': {
      title: 'Terms of Service',
      text: 'Governing the acquisition and ownership of Verve masterpieces. Our terms ensure a transparent and secure relationship between the artisan and the collector.'
    }
  };

  const currentPolicy = content[pathname.replace('/', '')] || { title: title, text: 'This section is currently being calibrated by our artisan team.' };

  return (
    <div className="bg-white dark:bg-[#121212] pt-8 pb-12 text-luxury-black dark:text-gray-100 min-h-screen transition-colors duration-300">
      <div className="container mx-auto px-6 max-w-3xl">
        <motion.div
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
        >
          <p className="text-[#7A578D] uppercase tracking-[0.4em] text-[8px] mb-4 font-bold">Information Vault</p>
          <h1 className="text-3xl lg:text-4xl font-sans uppercase tracking-widest mb-8 dark:text-white transition-colors">{currentPolicy.title}</h1>
          <div className="prose prose-luxury">
            <p className="text-gray-600 dark:text-gray-300 font-light leading-relaxed text-base mb-6 italic transition-colors">
              {currentPolicy.text}
            </p>
            <div className="space-y-6 text-gray-500 dark:text-gray-400 font-light leading-relaxed transition-colors text-sm">
              <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
              <p>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
              <h3 className="text-luxury-black dark:text-white font-sans uppercase tracking-widest text-base mt-8 mb-4 transition-colors">Our Commitment</h3>
              <p>Curabitur pretium tincidunt lacus. Nulla gravida orci a odio. Nullam varius, turpis et commodo pharetra, est eros bibendum elit, nec luctus magna felis sollicitudin mauris. Integer in mauris eu nibh euismod gravida. Duis ac tellus et risus vulputate vehicula.</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default PolicyPage;
