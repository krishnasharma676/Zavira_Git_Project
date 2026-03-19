import { prisma } from "../config/prisma";

export class InventoryRepository {
  async findAll(query: any = {}) {
    const { search, limit = 50, skip = 0 } = query;

    const where: any = {
      isDeleted: false
    };

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { inventory: { sku: { contains: search, mode: 'insensitive' } } }
      ];
    }

    const products = await prisma.product.findMany({
      where,
      include: {
        inventory: true,
        images: { where: { isPrimary: true }, take: 1 }
      },
      take: Number(limit),
      skip: Number(skip),
      orderBy: { name: 'asc' }
    });

    const total = await prisma.product.count({ where });

    return { products, total };
  }

  async updateStock(productId: string, stock: number) {
    return await prisma.inventory.upsert({
      where: { productId },
      update: { stock },
      create: { productId, stock }
    });
  }

  async updateSKU(productId: string, sku: string) {
    return await prisma.inventory.upsert({
      where: { productId },
      update: { sku },
      create: { productId, sku }
    });
  }

  async bulkUpdateStock(updates: { productId: string, stock: number }[]) {
    return await prisma.$transaction(
      updates.map(u => prisma.inventory.update({
        where: { productId: u.productId },
        data: { stock: u.stock }
      }))
    );
  }
}

export const inventoryRepository = new InventoryRepository();
