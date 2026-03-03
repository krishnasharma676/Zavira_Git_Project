import { prisma } from "../config/prisma";

export class CartRepository {
  async getCart(userId: string) {
    return await prisma.cart.findUnique({
      where: { userId },
      include: {
        items: {
          include: {
            product: {
              include: { images: { where: { isPrimary: true } } }
            }
          }
        }
      }
    });
  }

  async addItem(userId: string, productId: string, quantity: number) {
    let cart = await prisma.cart.findUnique({ where: { userId } });
    if (!cart) cart = await prisma.cart.create({ data: { userId } });

    return await prisma.cartItem.upsert({
      where: { cartId_productId: { cartId: cart.id, productId } },
      update: { quantity: { increment: quantity } },
      create: { cartId: cart.id, productId, quantity },
    });
  }

  async updateQuantity(userId: string, productId: string, quantity: number) {
    const cart = await prisma.cart.findUnique({ where: { userId } });
    if (!cart) return null;

    if (quantity <= 0) {
      return await prisma.cartItem.delete({
        where: { cartId_productId: { cartId: cart.id, productId } }
      });
    }

    return await prisma.cartItem.update({
      where: { cartId_productId: { cartId: cart.id, productId } },
      data: { quantity }
    });
  }

  async removeItem(userId: string, productId: string) {
    const cart = await prisma.cart.findUnique({ where: { userId } });
    if (!cart) return null;

    return await prisma.cartItem.delete({
      where: { cartId_productId: { cartId: cart.id, productId } }
    });
  }

  async clearCart(userId: string) {
    const cart = await prisma.cart.findUnique({ where: { userId } });
    if (!cart) return null;

    return await prisma.cartItem.deleteMany({
      where: { cartId: cart.id }
    });
  }
}

export const cartRepository = new CartRepository();
