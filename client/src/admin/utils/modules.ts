
import { 
  LayoutDashboard, 
  ShoppingBag, 
  Layers, 
  Image as ImageIcon, 
  Users, 
  ClipboardList, 
  FileText,
  Award,
  Bell,
  Monitor
} from 'lucide-react';

export const ADMIN_MODULES = [
  { label: 'Dashboard', icon: LayoutDashboard, path: '/admin/dashboard' },
  { label: 'Products', icon: ShoppingBag, path: '/admin/products' },
  { label: 'Categories', icon: Layers, path: '/admin/categories' },
  { label: 'Manage Brands', icon: Award, path: '/admin/brands' },
  { label: 'Banners', icon: ImageIcon, path: '/admin/banners' },
  { label: 'Announcements', icon: Bell, path: '/admin/announcements' },
  { label: 'Pages', icon: Monitor, path: '/admin/pages' },
  { label: 'Manage Orders', icon: ClipboardList, path: '/admin/orders' },
  { label: 'Users', icon: Users, path: '/admin/users' },
  { label: 'Reviews', icon: FileText, path: '/admin/reviews' },
];

