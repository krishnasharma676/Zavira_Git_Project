import { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import StickyFooter from './components/StickyFooter';
import CartDrawer from './components/CartDrawer';
import ScrollToTop from './components/ScrollToTop';
import { Toaster } from 'react-hot-toast';
import CheckoutModal from './components/checkout/CheckoutModal';

// Customer Pages
const HomePage = lazy(() => import('./pages/HomePage'));
const ShopPage = lazy(() => import('./pages/ShopPage'));
const ProductDetailPage = lazy(() => import('./pages/ProductDetailPage'));
const CartPage = lazy(() => import('./pages/CartPage'));
const ProfilePage = lazy(() => import('./pages/ProfilePage'));
const OrderSuccessPage = lazy(() => import('./pages/OrderSuccessPage'));
const CollectionsPage = lazy(() => import('./pages/CollectionsPage'));
const AboutPage = lazy(() => import('./pages/AboutPage'));
const WishlistPage = lazy(() => import('./pages/WishlistPage'));
const ContactPage = lazy(() => import('./pages/ContactPage'));
const PolicyPage = lazy(() => import('./pages/PolicyPage'));
const ReturnsExchangePage = lazy(() => import('./pages/ReturnsExchangePage'));
const TrackOrderPage = lazy(() => import('./pages/TrackOrderPage'));
const NotFound = lazy(() => import('./pages/NotFound'));

// Admin Pages
const ProtectedRoute = lazy(() => import('./admin/components/ProtectedRoute'));
const AdminLayout = lazy(() => import('./admin/layouts/AdminLayout'));
const AdminLogin = lazy(() => import('./admin/pages/AdminLogin'));
const AdminDashboard = lazy(() => import('./admin/pages/AdminDashboard'));
const ProductManagement = lazy(() => import('./admin/pages/ProductManagement'));
const CategoryManagement = lazy(() => import('./admin/pages/CategoryManagement'));
const BannerManagement = lazy(() => import('./admin/pages/BannerManagement'));
const AnnouncementManagement = lazy(() => import('./admin/pages/AnnouncementManagement'));
const OrderManagement = lazy(() => import('./admin/pages/OrderManagement'));
const UserManagement = lazy(() => import('./admin/pages/UserManagement'));
const ReviewManagement = lazy(() => import('./admin/pages/ReviewManagement'));
const BrandManagement = lazy(() => import('./admin/pages/BrandManagement'));
const TestimonialManagement = lazy(() => import('./admin/pages/TestimonialManagement'));
const MessageManagement = lazy(() => import('./admin/pages/MessageManagement'));

const PageLoader = () => (
  <div className="min-h-[60vh] flex flex-col items-center justify-center">
    <div className="w-12 h-12 border-4 border-[#7A578D] border-t-transparent rounded-full animate-spin mb-4" />
    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">Loading...</p>
  </div>
);

const AppContent = () => {
  const location = useLocation();
  const isAdminPath = location.pathname.startsWith('/admin');
  const isTrackPath = location.pathname === '/track-order';
  const hideLayout = isAdminPath || isTrackPath;

  return (
    <div className="flex flex-col min-h-screen">
      {!hideLayout && <Navbar />}
      <main className="flex-grow">
        <Suspense fallback={<PageLoader />}>
          <Routes>
            {/* Customer Routes */}
            <Route path="/" element={<HomePage />} />
            <Route path="/shop" element={<ShopPage />} />
            <Route path="/hot-deals" element={<ShopPage />} />
            <Route path="/product/:slug" element={<ProductDetailPage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/collections" element={<CollectionsPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/wishlist" element={<WishlistPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/shipping" element={<PolicyPage />} />
            <Route path="/faqs" element={<PolicyPage />} />
            <Route path="/size-guide" element={<PolicyPage />} />
            <Route path="/privacy" element={<PolicyPage />} />
            <Route path="/returns" element={<ReturnsExchangePage />} />
            <Route path="/track-order" element={<TrackOrderPage />} />
            <Route path="/terms" element={<PolicyPage />} />
            <Route path="/order-success/:id" element={<OrderSuccessPage />} />

            {/* Admin Routes */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin" element={<ProtectedRoute />}>
              <Route element={<AdminLayout />}>
                <Route path="dashboard" element={<AdminDashboard />} />
                <Route path="products" element={<ProductManagement />} />
                <Route path="categories" element={<CategoryManagement />} />
                <Route path="brands" element={<BrandManagement />} />
                <Route path="banners" element={<BannerManagement />} />
                <Route path="announcements" element={<AnnouncementManagement />} />
                <Route path="orders" element={<OrderManagement />} />
                <Route path="users" element={<UserManagement />} />
                <Route path="reviews" element={<ReviewManagement />} />
                <Route path="testimonials" element={<TestimonialManagement />} />
                <Route path="messages" element={<MessageManagement />} />
                <Route index element={<AdminDashboard />} />
              </Route>
            </Route>

            {/* 404 Route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </main>
      {!hideLayout && <Footer />}
      {!hideLayout && <StickyFooter />}
      {!hideLayout && <CartDrawer />}
      {!hideLayout && <CheckoutModal />}
      <Toaster position="bottom-right" toastOptions={{ style: { marginBottom: '80px' } }} />
    </div>
  );
};

function App() {
  return (
    <Router>
      <ScrollToTop />
      <AppContent />
    </Router>
  );
}

export default App;

