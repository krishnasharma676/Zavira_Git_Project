
import { 
  LayoutDashboard, 
  Layers, 
  Image as ImageIcon, 
  Users, 
  ClipboardList, 
  FileText,
  Bell,
  Quote,
  MessageSquare,
  Settings,
  Package,
  BarChart2,
  ShoppingCart,
  Truck,
  Palette,
  Plus
} from 'lucide-react';

export const ADMIN_MODULES = [
  { label: 'Dashboard', icon: LayoutDashboard, path: '/admin/dashboard' },
  { label: 'Analytics', icon: BarChart2, path: '/admin/analytics' },
  { label: 'Inventory', icon: Package, path: '/admin/inventory' },
  { label: 'Bulk Products', icon: Layers, path: '/admin/bulk-products' },
  { label: 'Bulk Create', icon: Plus, path: '/admin/bulk-create' },
  { label: 'Colors', icon: Palette, path: '/admin/colors' },
  { label: 'Categories', icon: Layers, path: '/admin/categories' },
  { label: 'Banners', icon: ImageIcon, path: '/admin/banners' },
  { label: 'Announcements', icon: Bell, path: '/admin/announcements' },
  { label: 'Manage Orders', icon: ClipboardList, path: '/admin/orders' },
  { label: 'Shipping', icon: Truck, path: '/admin/shipping' },
  { label: 'Users', icon: Users, path: '/admin/users' },
  { label: 'Reviews', icon: FileText, path: '/admin/reviews' },
  { label: 'Testimonials', icon: Quote, path: '/admin/testimonials' },
  { label: 'Messages', icon: MessageSquare, path: '/admin/messages' },
  { label: 'Settings', icon: Settings, path: '/admin/settings' },
];
