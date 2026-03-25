import { prisma } from "../config/prisma";

export class CartRepository {
  async getCart(userId: string) {
    return await (prisma as any).cart.findUnique({
      where: { userId },
      include: {
        items: {
          include: {
            product: {
              include: { 
                images: { where: { isPrimary: true } },
                inventory: true 
              }
            },
            variant: {
              include: { images: true }
            }
          }
        }

      }
    });
  }

  async addItem(userId: string, productId: string, quantity: number, variantId?: string | null, selectedSize?: string | null) {
    let cart = await (prisma as any).cart.findUnique({ where: { userId } });
    if (!cart) cart = await (prisma as any).cart.create({ data: { userId } });

    const existingItem = await (prisma as any).cartItem.findFirst({
      where: { cartId: cart.id, productId, variantId: variantId || null, selectedSize: selectedSize || null }
    });

    if (existingItem) {
      return await (prisma as any).cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: { increment: quantity } },
      });
    }

    return await (prisma as any).cartItem.create({
      data: { 
        cartId: cart.id, 
        productId, 
        quantity, 
        variantId: variantId || undefined, 
        selectedSize: selectedSize || undefined 
      },
    });
  }

  async updateQuantity(userId: string, cartItemId: string, quantity: number) {
    const cart = await (prisma as any).cart.findUnique({ where: { userId } });
    if (!cart) return null;

    if (quantity <= 0) {
      return await (prisma as any).cartItem.delete({
        where: { id: cartItemId }
      });
    }

    return await (prisma as any).cartItem.update({
      where: { id: cartItemId },
      data: { quantity }
    });
  }

  async removeItem(userId: string, cartItemId: string) {
    const cart = await (prisma as any).cart.findUnique({ where: { userId } });
    if (!cart) return null;

    return await (prisma as any).cartItem.delete({
      where: { id: cartItemId }
    });
  }

  async clearCart(userId: string) {
    const cart = await (prisma as any).cart.findUnique({ where: { userId } });
    if (!cart) return null;

    return await (prisma as any).cartItem.deleteMany({
      where: { cartId: cart.id }
    });
  }

  async findAbandonedCarts(hours: number = 24) {
    const thresholdDate = new Date();
    thresholdDate.setHours(thresholdDate.getHours() - hours);

    return await prisma.cart.findMany({
      where: {
        updatedAt: { lte: thresholdDate },
        items: { some: {} } // Has at least one item
      },
      include: {
        user: { select: { name: true, email: true, phoneNumber: true } },
        items: {
          include: {
            product: {
              select: { name: true, basePrice: true, images: { where: { isPrimary: true } } }
            }
          }
        }
      },
      orderBy: { updatedAt: 'desc' }
    });
  }
}

export const cartRepository = new CartRepository();
