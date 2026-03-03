import { prisma } from "../config/prisma";

export class ProductRepository {
  async findAll(filters: any, page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;
    const { category, brand, minPrice, maxPrice, search, featured, trending, sortBy, sortOrder } = filters;

    const where: any = {
      isDeleted: false,
      ...(category && { category: { slug: category } }),
      ...(brand && { brand: { slug: brand } }),
      ...(featured && { featured: true }),
      ...(trending && { trending: true }),
      ...(minPrice || maxPrice ? {
        basePrice: {
          ...(minPrice && { gte: parseFloat(minPrice) }),
          ...(maxPrice && { lte: parseFloat(maxPrice) }),
        }
      } : {}),
      ...(search && {
        OR: [
          { name: { contains: search, mode: 'insensitive' } },
          { description: { contains: search, mode: 'insensitive' } },
        ]
      }),
    };

    const [total, products] = await Promise.all([
      prisma.product.count({ where }),
      prisma.product.findMany({
        where,
        include: {
          images: { where: { isDeleted: false } },
          category: true,
          brand: true,
          inventory: true,
        },
        skip,
        take: limit,
        orderBy: sortBy ? { [sortBy]: sortOrder || 'asc' } : { createdAt: 'desc' },
      }),
    ]);

    return { total, products, page, totalPages: Math.ceil(total / limit) };
  }

  async findBySlug(slug: string) {
    return await prisma.product.findFirst({
      where: { slug, isDeleted: false },
      include: {
        images: { where: { isDeleted: false } },
        category: true,
        brand: true,
        inventory: true,
        reviews: {
          where: { isApproved: true, isDeleted: false },
          include: { user: { select: { name: true, avatar: true } } },
          orderBy: { createdAt: 'desc' },
        },
      },
    });
  }

  async findById(id: string) {
    return await prisma.product.findFirst({
      where: { id, isDeleted: false },
      include: {
        images: { where: { isDeleted: false } },
        inventory: true,
      },
    });
  }

  async create(data: any) {
    const { stock, sku, images, ...productData } = data;
    return await prisma.product.create({
      data: {
        ...productData,
        inventory: { create: { stock: stock || 0, sku: sku } },
      },
      include: { images: true, inventory: true },
    });
  }

  async update(id: string, data: any) {
    const { stock, sku, images, ...productData } = data;
    return await prisma.product.update({
      where: { id },
      data: {
        ...productData,
        ...(stock !== undefined || sku ? {
          inventory: {
            update: {
              ...(stock !== undefined && { stock }),
              ...(sku && { sku }),
            }
          }
        } : {}),
      },
      include: { images: true, inventory: true },
    });
  }

  async addImage(productId: string, imageData: any) {
    return await prisma.productImage.create({
      data: {
        ...imageData,
        productId,
      },
    });
  }

  async deleteImage(imageId: string) {
    return await prisma.productImage.update({
      where: { id: imageId },
      data: { isDeleted: true },
    });
  }

  async setPrimaryImage(productId: string, imageId: string) {
    await prisma.productImage.updateMany({
      where: { productId },
      data: { isPrimary: false },
    });
    return await prisma.productImage.update({
      where: { id: imageId },
      data: { isPrimary: true },
    });
  }

  async softDelete(id: string) {
    return await prisma.product.update({
      where: { id },
      data: { isDeleted: true },
    });
  }
}

export const productRepository = new ProductRepository();
