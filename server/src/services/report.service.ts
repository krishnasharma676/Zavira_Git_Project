import { reportRepository } from "../repositories/report.internal";
import { prisma } from "../config/prisma";

export class ReportService {
  async getAdvancedAnalytics() {
    const sales = await reportRepository.getSalesReport(30);
    const categoryRaw = await reportRepository.getCategorySales();
    const topCustomersRaw = await reportRepository.getTopCustomers();

    // Map top customers to their names
    const topCustomers = await Promise.all(
      topCustomersRaw.map(async (c) => {
        const user = await prisma.user.findUnique({
          where: { id: c.userId },
          select: { name: true, email: true }
        });
        return {
          id: c.userId,
          name: user?.name || "Anonymous",
          email: user?.email,
          totalSpent: c._sum.payableAmount || 0,
          ordersCount: c._count.id
        };
      })
    );

    return {
      sales,
      topCustomers
    };
  }
}

export const reportService = new ReportService();
