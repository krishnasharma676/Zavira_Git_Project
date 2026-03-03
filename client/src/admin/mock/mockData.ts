
export const mockProducts = [
  { id: '1', name: 'Celestial Diamond Ring', price: 2999, originalPrice: 9999, category: 'Rings', stock: 12, status: 'Active', image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=400' },
  { id: '2', name: 'Golden Aura Necklace', price: 1499, originalPrice: 4999, category: 'Necklaces', stock: 8, status: 'Active', image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=400' },
  { id: '3', name: 'Royal Emerald Studs', price: 1999, originalPrice: 6999, category: 'Earrings', stock: 0, status: 'Out of Stock', image: 'https://images.unsplash.com/photo-1635767790474-320d55e909ea?q=80&w=400' },
  { id: '4', name: 'Midnight Pearl Bracelet', price: 899, originalPrice: 2999, category: 'Bracelets', stock: 25, status: 'Active', image: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?q=80&w=400' },
];

export const mockCategories = [
  { id: '1', name: 'Earrings', itemCount: 120, status: 'Active', image: 'https://images.unsplash.com/photo-1630019852942-f89202989a59?q=80&w=500' },
  { id: '2', name: 'Necklace', itemCount: 85, status: 'Active', image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=500' },
  { id: '3', name: 'Rings', itemCount: 64, status: 'Active', image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=500' },
  { id: '4', name: 'Bracelets', itemCount: 42, status: 'Active', image: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?q=80&w=500' },
];

export const mockOrders = [
  { id: 'ORD-90821', customer: 'Rahul Sharma', date: '2024-02-23', total: 45000, status: 'Delivered', method: 'UPI' },
  { id: 'ORD-90822', customer: 'Sanya Gupta', date: '2024-02-23', total: 12500, status: 'Processing', method: 'COD' },
  { id: 'ORD-90823', customer: 'Amit Singh', date: '2024-02-22', total: 8900, status: 'Shipped', method: 'Card' },
];

export const mockBanners = [
  { id: '1', title: 'Limited Edition', subtitle: 'Elegance in Every Detail', type: 'Hero', status: 'Active', image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?q=80&w=2000' },
  { id: '2', title: 'Sale is Live Upto 70%', type: 'Marquee', status: 'Active' },
];

export const mockUsers = [
  { id: '1', name: 'Rahul Sharma', email: 'rahul@example.com', role: 'Customer', joinDate: '2023-11-12' },
  { id: '2', name: 'Admin User', email: 'admin@KrishJwel.com', role: 'Admin', joinDate: '2023-01-01' },
];
