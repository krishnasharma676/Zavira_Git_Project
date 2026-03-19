import { prisma } from "../config/prisma";

export class ReportRepository {
  async getSalesReport(days: number = 30) {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const orders = await prisma.order.findMany({
      where: {
        createdAt: { gte: startDate },
        status: { notIn: ['CANCELLED', 'REFUNDED'] },
        isDeleted: false
      },
      select: {
        createdAt: true,
        payableAmount: true,
        status: true,
        payment: { select: { paymentMethod: true } }
      }
    });

    // Group by day
    const dailySales: Record<string, number> = {};
    const paymentMethods: Record<string, number> = {};

    orders.forEach(order => {
      const date = order.createdAt.toISOString().split('T')[0];
      dailySales[date] = (dailySales[date] || 0) + order.payableAmount;
      
      const method = order.payment?.paymentMethod || 'UNKNOWN';
      paymentMethods[method] = (paymentMethods[method] || 0) + 1;
    });

    return { dailySales, paymentMethods, totalOrders: orders.length };
  }

  async getCategorySales() {
    return await prisma.orderItem.groupBy({
      by: ['productId'],
      _sum: { quantity: true, price: true },
    });
  }

  async getTopCustomers() {
    return await prisma.order.groupBy({
      by: ['userId'],
      _sum: { payableAmount: true },
      _count: { id: true },
      orderBy: { _sum: { payableAmount: 'desc' } },
      take: 10
    });
  }
}

export const reportRepository = new ReportRepository();
