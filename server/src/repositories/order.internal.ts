import { prisma } from "../config/prisma";
import { OrderStatus, PaymentStatus } from "@prisma/client";

export class OrderRepository {
  async createOrder(orderData: any, items: any[]) {
    const { paymentMethod, ...data } = orderData;
    return await prisma.$transaction(async (tx) => {
      // 1. Create order
      const order = await (tx as any).order.create({
        data: {
          ...data,
          items: {
            create: items.map(item => ({
              productId: item.productId,
              quantity: item.quantity,
              price: item.price,
              selectedSize: item.selectedSize || undefined,
              variantId: item.variantId || undefined,
            }))
          },
          payment: {
            create: {
              amount: orderData.payableAmount,
              paymentMethod: paymentMethod,
              status: PaymentStatus.PENDING
            }
          }
        },
        include: { items: true, payment: true }
      });

      // 2. Deduct inventory
      for (const item of items) {
        if (item.variantId && item.selectedSize) {
          // Update variant size stock directly
          await (tx as any).productVariantSize.updateMany({
            where: { 
              variantId: item.variantId, 
              size: item.selectedSize 
            },
            data: { 
              stock: { decrement: item.quantity } 
            }
          });
        }
        
        await (tx as any).inventory.update({
          where: { productId: item.productId },
          data: { stock: { decrement: item.quantity } }
        });
      }

      return order;
    }, {
      timeout: 30000 // Increase timeout to 30 seconds for complex orders
    });
  }

  async findByUserId(userId: string) {
    return await prisma.order.findMany({
      where: { userId, isDeleted: false },
      include: {
        items: { include: { product: { include: { images: true } } } },
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
        items: { 
          include: { 
            product: { include: { images: true } }, 
            variant: { include: { images: true, sizes: true } } 
          } 
        },
        payment: true,
        address: true,
        user: { select: { name: true, email: true, phoneNumber: true } }
      }
    });
  }

  async findByShipmentId(shipmentId: string) {
    return await prisma.order.findFirst({
      where: { shipmentId, isDeleted: false },
      include: { payment: true }
    });
  }

  async updateStatus(id: string, status: OrderStatus) {
    return await prisma.order.update({
      where: { id },
      data: { status }
    });
  }

  async updateAdminNotes(id: string, adminNotes: string) {
    return await prisma.order.update({
      where: { id },
      data: { adminNotes }
    });
  }

  async updateReturnInfo(id: string, returnReason: string, returnImages: string[], status: OrderStatus) {
    return await prisma.order.update({
      where: { id },
      data: { returnReason, returnImages, status }
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

  async updateShipmentDetails(id: string, details: any) {
    return await prisma.order.update({
      where: { id },
      data: details
    });
  }

  async findAllAdmin(filters: any) {
    const status = filters.status;
    const page = parseInt(filters.page) || 1;
    const limit = parseInt(filters.limit) || 10;
    const skip = (page - 1) * limit;

    const where = {
      isDeleted: false,
      ...(status && { status })
    };

    // 1. Total Count
    const total = await prisma.order.count({ where });

    // 2. Fetch Orders
    const orders = await prisma.order.findMany({
        where,
        include: { 
           user: { select: { name: true, email: true, phoneNumber: true } }, 
           payment: true, 
           address: true,
           items: { 
             include: { 
               product: { include: { images: true } }, 
               variant: { include: { images: true, sizes: true } } 
             } 
           }
        },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' }
    });

    // 3. Stats by GroupBy
    const statusStats = await prisma.order.groupBy({
        by: ['status'],
        where: { isDeleted: false },
        _count: { _all: true }
    });

    const stats = statusStats.reduce((acc: any, curr: any) => {
      acc[curr.status.toLowerCase()] = curr._count._all;
      return acc;
    }, { pending: 0, confirmed: 0, shipped: 0, delivered: 0, cancelled: 0 });

    return { total, orders, stats, page, totalPages: Math.ceil(total / limit) };
  }
}

export const orderRepository = new OrderRepository();
