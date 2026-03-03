import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { prisma } from "../config/prisma";
import { ApiResponse } from "../utils/ApiResponse";

export const getDashboardStats = asyncHandler(async (req: Request, res: Response) => {
  const [
    totalSales,
    totalOrders,
    totalUsers,
    totalProducts,
    recentOrders,
    topProducts
  ] = await Promise.all([
    prisma.order.aggregate({
      where: { status: { notIn: ['CANCELLED', 'REFUNDED'] } },
      _sum: { payableAmount: true }
    }),
    prisma.order.count(),
    prisma.user.count({ where: { role: 'USER' } }),
    prisma.product.count({ where: { isDeleted: false } }),
    prisma.order.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: { user: { select: { name: true } } }
    }),
    // Aggregation for top products
    prisma.orderItem.groupBy({
      by: ['productId'],
      _sum: { quantity: true },
      orderBy: { _sum: { quantity: 'desc' } },
      take: 5
    })
  ]);

  // Enhance top products with details
  const topSellingProductsWithDetails = await Promise.all(
    topProducts.map(async (item) => {
      const product = await prisma.product.findUnique({
        where: { id: item.productId },
        select: {
          name: true,
          images: {
            where: { isPrimary: true },
            take: 1,
            select: { imageUrl: true }
          }
        }
      });
      return {
        ...item,
        name: product?.name || "Unknown Product",
        image: product?.images?.[0]?.imageUrl || null
      };
    })
  );

  return res.status(200).json(new ApiResponse(200, {
    stats: {
      totalRevenue: totalSales._sum.payableAmount || 0,
      totalOrders,
      totalUsers,
      totalProducts
    },
    recentOrders,
    topSellingProducts: topSellingProductsWithDetails
  }, "Dashboard stats fetched"));
});
