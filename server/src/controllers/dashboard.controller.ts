import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { prisma } from "../config/prisma";
import { ApiResponse } from "../utils/ApiResponse";

export const getDashboardStats = asyncHandler(async (req: Request, res: Response) => {
  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  const [
    totalRevenueData,
    totalOrdersCount,
    totalUsersCount,
    totalProductsCount,
    todayOrdersCount,
    recentOrders,
    topProductsRaw,
    lowStockItems,
    lowStockCount,
    orderStatusCounts
  ] = await Promise.all([
    // 1. Total Revenue (Active orders only)
    prisma.order.aggregate({
      where: { status: { notIn: ['CANCELLED', 'REFUNDED'] }, isDeleted: false },
      _sum: { payableAmount: true }
    }),
    
    // 2. Count metrics
    prisma.order.count({ where: { isDeleted: false } }),
    prisma.user.count({ where: { role: 'USER', isDeleted: false } }),
    prisma.product.count({ where: { isDeleted: false } }),
    
    // 3. Today's orders
    prisma.order.count({ 
      where: { 
        createdAt: { gte: startOfToday },
        isDeleted: false 
      } 
    }),
    
    // 4. Latest transactions
    prisma.order.findMany({
      where: { isDeleted: false },
      take: 10, // Increased to 10 for better coverage
      orderBy: { createdAt: 'desc' },
      include: { 
        user: { select: { name: true, email: true, phoneNumber: true } },
        payment: { select: { status: true, paymentMethod: true } }
      }
    }),
    
    // 5. Best Sellers
    prisma.orderItem.groupBy({
      by: ['productId'],
      _sum: { quantity: true, price: true },
      orderBy: { _sum: { quantity: 'desc' } },
      take: 5
    }),
    
    // 6. Low stock items
    prisma.inventory.findMany({
      where: { stock: { lt: 10 } }, // Threshold set to 10 per request
      take: 5,
      include: {
        product: {
          select: {
            name: true,
            basePrice: true,
            images: { where: { isPrimary: true }, take: 1, select: { imageUrl: true } }
          }
        }
      }
    }),
    prisma.inventory.count({ where: { stock: { lt: 10 } } }),

    // 7. Order Status Distribution (Step 6)
    prisma.order.groupBy({
      by: ['status'],
      _count: { id: true },
      where: { isDeleted: false }
    })
  ]);

  // Transform order status counts into a cleaner object
  const statusStats = orderStatusCounts.reduce((acc: any, curr) => {
    acc[curr.status] = curr._count.id;
    return acc;
  }, {});

  // Fetch top selling product details in batch
  const productIds = topProductsRaw.map(item => item.productId);
  const productsData = await prisma.product.findMany({
    where: { id: { in: productIds } },
    select: {
      id: true,
      name: true,
      images: { where: { isPrimary: true }, take: 1, select: { imageUrl: true } }
    }
  });

  const topSellingProducts = topProductsRaw.map(item => {
    const p = productsData.find(pd => pd.id === item.productId);
    return {
      productId: item.productId,
      name: p?.name || "Unknown Product",
      image: p?.images?.[0]?.imageUrl || null,
      unitsSold: item._sum.quantity || 0,
      revenue: item._sum.price || 0
    };
  });

  // 7-day sales trend (Dynamic chart data)
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - i);
    d.setHours(0, 0, 0, 0);
    return d;
  }).reverse();

  const salesTrend = await Promise.all(
    last7Days.map(async (date) => {
      const nextDate = new Date(date);
      nextDate.setDate(date.getDate() + 1);
      
      const stats = await prisma.order.aggregate({
        where: {
          createdAt: { gte: date, lt: nextDate },
          status: { notIn: ['CANCELLED', 'REFUNDED'] },
          isDeleted: false
        },
        _sum: { payableAmount: true },
      });

      return {
        date: date.toLocaleDateString('en-US', { weekday: 'short' }),
        revenue: stats._sum.payableAmount || 0
      };
    })
  );

  return res.status(200).json(new ApiResponse(200, {
    summary: {
      totalRevenue: totalRevenueData._sum.payableAmount || 0,
      totalOrders: totalOrdersCount,
      totalCustomers: totalUsersCount,
      totalProducts: totalProductsCount,
      todayOrders: todayOrdersCount,
      lowStockAlerts: lowStockCount
    },
    orderStatusDistribution: {
      pending: statusStats['PENDING'] || 0,
      confirmed: statusStats['CONFIRMED'] || 0,
      shipped: statusStats['SHIPPED'] || 0,
      delivered: statusStats['DELIVERED'] || 0,
      cancelled: statusStats['CANCELLED'] || 0
    },
    recentOrders,
    topSellingProducts,
    lowStockItems,
    salesTrend
  }, "Dashboard intelligence synchronized."));
});

export const getLowStockItemsDetailed = asyncHandler(async (req: Request, res: Response) => {
  const lowStock = await prisma.inventory.findMany({
    where: { stock: { lt: 10 } },
    include: {
      product: {
        include: {
          images: { where: { isPrimary: true }, take: 1 }
        }
      }
    },
    orderBy: { stock: 'asc' }
  });

  return res.status(200).json(new ApiResponse(200, lowStock, "Full inventory alert list."));
});
