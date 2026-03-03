import { prisma } from "../config/prisma";
import { OrderStatus, PaymentStatus } from "@prisma/client";

export class OrderRepository {
  async createOrder(orderData: any, items: any[]) {
    return await prisma.$transaction(async (tx) => {
      // 1. Create order
      const order = await tx.order.create({
        data: {
          ...orderData,
          items: {
            create: items.map(item => ({
              productId: item.productId,
              quantity: item.quantity,
              price: item.price,
            }))
          },
          payment: {
            create: {
              amount: orderData.payableAmount,
              paymentMethod: orderData.paymentMethod,
              status: PaymentStatus.PENDING
            }
          }
        },
        include: { items: true, payment: true }
      });

      // 2. Deduct inventory
      for (const item of items) {
        await tx.inventory.update({
          where: { productId: item.productId },
          data: { stock: { decrement: item.quantity } }
        });
      }

      return order;
    });
  }

  async findByUserId(userId: string) {
    return await prisma.order.findMany({
      where: { userId, isDeleted: false },
      include: {
        items: { include: { product: { include: { images: { where: { isPrimary: true } } } } } },
        payment: true,
        address: true
      },
      orderBy: { createdAt: 'desc' }
    });
  }

  async findById(id: string) {
    return await prisma.order.findFirst({
      where: { id, isDeleted: false },
      include: {
        items: { include: { product: true } },
        payment: true,
        address: true,
        user: { select: { name: true, email: true, phoneNumber: true } }
      }
    });
  }

  async updateStatus(id: string, status: OrderStatus) {
    return await prisma.order.update({
      where: { id },
      data: { status }
    });
  }

  async updatePaymentStatus(orderId: string, status: PaymentStatus, transactionId?: string, gatewayResponse?: any) {
    return await prisma.payment.update({
      where: { orderId },
      data: { 
        status, 
        ...(transactionId && { transactionId }),
        ...(gatewayResponse && { gatewayResponse })
      }
    });
  }

  async findAllAdmin(filters: any) {
    const { status, page = 1, limit = 10 } = filters;
    const skip = (page - 1) * limit;

    const where = {
      isDeleted: false,
      ...(status && { status })
    };

    const [total, orders] = await Promise.all([
      prisma.order.count({ where }),
      prisma.order.findMany({
        where,
        include: { user: { select: { name: true, email: true } }, payment: true },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' }
      })
    ]);

    return { total, orders, page, totalPages: Math.ceil(total / limit) };
  }
}

export const orderRepository = new OrderRepository();
