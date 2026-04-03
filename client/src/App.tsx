import { lazy, Suspense, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import StickyFooter from './components/StickyFooter';
import { Toaster } from 'react-hot-toast';
import { useAuth } from './store/useAuth';
import { useCart } from './store/useCart';
import { useCatalogStore } from './store/useCatalogStore';
import ScrollToTop from './components/ScrollToTop';

const CartDrawer = lazy(() => import('./components/CartDrawer'));
const CheckoutModal = lazy(() => import('./components/checkout/CheckoutModal'));

// Customer Pages
const HomePage = lazy(() => import('./pages/HomePage'));
const ShopPage = lazy(() => import('./pages/ShopPage'));
const ProductDetailPage = lazy(() => import('./pages/ProductDetailPage'));
const ProductReviewsPage = lazy(() => import('./pages/ProductReviewsPage'));
const CartPage = lazy(() => import('./pages/CartPage'));
const ProfilePage = lazy(() => import('./pages/ProfilePage'));
const OrderSuccessPage = lazy(() => import('./pages/OrderSuccessPage'));
const CollectionsPage = lazy(() => import('./pages/CollectionsPage'));
const AboutPage = lazy(() => import('./pages/AboutPage'));
const WishlistPage = lazy(() => import('./pages/WishlistPage'));
const ContactPage = lazy(() => import('./pages/ContactPage'));
const PolicyPage = lazy(() => import('./pages/PolicyPage'));
const TrackOrderPage = lazy(() => import('./pages/TrackOrderPage'));
const NotFound = lazy(() => import('./pages/NotFound'));

// Admin Pages
const ProtectedRoute = lazy(() => import('./admin/components/ProtectedRoute'));
const AdminLayout = lazy(() => import('./admin/layouts/AdminLayout'));
const AdminLogin = lazy(() => import('./admin/pages/AdminLogin'));
const InventoryManagement = lazy(() => import('./admin/pages/InventoryManagement'));
const BulkProductManagement = lazy(() => import('./admin/pages/BulkProductManagement'));
const VariantManager = lazy(() => import('./admin/pages/VariantManager'));
const BulkProductCreate = lazy(() => import('./admin/pages/BulkProductCreate'));
const ColorManagement = lazy(() => import('./admin/pages/ColorManagement'));
const CategoryManagement = lazy(() => import('./admin/pages/CategoryManagement'));
const BannerManagement = lazy(() => import('./admin/pages/BannerManagement'));
const AnnouncementManagement = lazy(() => import('./admin/pages/AnnouncementManagement'));
const OrderManagement = lazy(() => import('./admin/pages/OrderManagement'));
const UserManagement = lazy(() => import('./admin/pages/UserManagement'));
const ReviewManagement = lazy(() => import('./admin/pages/ReviewManagement'));
const TestimonialManagement = lazy(() => import('./admin/pages/TestimonialManagement'));
const MessageManagement = lazy(() => import('./admin/pages/MessageManagement'));
const StoreSettings = lazy(() => import('./admin/pages/StoreSettings'));
const ShippingManagement = lazy(() => import('./admin/pages/ShippingManagement'));
const SkuLookup = lazy(() => import('./admin/pages/SkuLookup'));
const DemoData = lazy(() => import('./admin/pages/DemoData'));

const AppContent = () => {
  const location = useLocation();
  const isAdminPath = location.pathname.startsWith('/admin');
  const isTrackPath = location.pathname === '/track-order';
  const hideLayout = isAdminPath || isTrackPath;
  const isAuthenticated = useAuth((s) => s.isAuthenticated);

  const { loadCatalog } = useCatalogStore();

  useEffect(() => {
    // Only load consumer catalog on public/customer paths
    if (!isAdminPath) {
      loadCatalog();
    }
    
    const isAdmin = useAuth.getState().user?.role === 'ADMIN' || useAuth.getState().user?.role === 'SUPER_ADMIN';
    
    // Only sync cart for customers on public/customer paths and non-admin users
    if (isAuthenticated && !isAdminPath && !isAdmin) {
      useCart.getState().syncCart();
    }
  }, [isAuthenticated, isAdminPath, loadCatalog]);

  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-zavira-blackDeep transition-colors duration-300">
      {!hideLayout && <Navbar />}
      
      <main className="flex-grow flex flex-col relative overflow-hidden">
        {/* Removed complex skeleton from here, back to null for lazy bundles */}
        <Suspense fallback={null}>
          <Routes>
            {/* Customer Routes */}
            <Route path="/" element={<HomePage />} />
            <Route path="/shop" element={<ShopPage />} />
            <Route path="/hot-deals" element={<ShopPage />} />
            <Route path="/product/:slug" element={<ProductDetailPage />} />
            <Route path="/product/:slug/reviews" element={<ProductReviewsPage />} />
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
            <Route path="/track-order" element={<TrackOrderPage />} />
            <Route path="/terms" element={<PolicyPage />} />
            <Route path="/order-success/:id" element={<OrderSuccessPage />} />

            {/* Admin Routes */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin" element={<ProtectedRoute />}>
              <Route element={<AdminLayout />}>
                <Route path="inventory" element={<InventoryManagement />} />
                <Route path="bulk-products" element={<BulkProductManagement />} />
                <Route path="bulk-products/manage/:id" element={<VariantManager />} />
                <Route path="bulk-products/edit/:id" element={<BulkProductCreate />} />
                <Route path="bulk-create" element={<BulkProductCreate />} />
                <Route path="colors" element={<ColorManagement />} />
                <Route path="categories" element={<CategoryManagement />} />
                <Route path="banners" element={<BannerManagement />} />
                <Route path="announcements" element={<AnnouncementManagement />} />
                <Route path="orders" element={<OrderManagement />} />
                <Route path="users" element={<UserManagement />} />
                <Route path="reviews" element={<ReviewManagement />} />
                <Route path="testimonials" element={<TestimonialManagement />} />
                <Route path="messages" element={<MessageManagement />} />
                <Route path="settings" element={<StoreSettings />} />
                <Route path="shipping" element={<ShippingManagement />} />
                <Route path="sku-lookup" element={<SkuLookup />} />
                <Route path="demo-data" element={<DemoData />} />
                <Route index element={<InventoryManagement />} />
              </Route>
            </Route>

            {/* 404 Route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </main>

      {!hideLayout && <Footer />}
      {!hideLayout && <StickyFooter />}
      
      <Suspense fallback={null}>
        {!hideLayout && <CartDrawer />}
        {!hideLayout && <CheckoutModal />}
      </Suspense>
      
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
