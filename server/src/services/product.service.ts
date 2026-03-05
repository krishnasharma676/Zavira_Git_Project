import { PrismaClient } from '@prisma/client';
import slugify from 'slugify';
import { uploadOnCloudinary, deleteFromCloudinary } from '../utils/cloudinary';
import { ApiError } from '../utils/ApiError';

const prisma = new PrismaClient();

export class ProductService {
  async getAllProducts(query: any) {
    const { 
      page = 1, 
      limit = 10, 
      search, 
      category, 
      brand, 
      minPrice, 
      maxPrice, 
      sortBy,
      sortOrder,
      sort,
      hotDeals,
      featured,
      trending,
      stockStatus
    } = query;

    const skip = (Number(page) - 1) * Number(limit);
    const where: any = { isDeleted: false };

    if (hotDeals === 'true' || hotDeals === true) where.hotDeals = true;
    if (featured === 'true' || featured === true) where.featured = true;
    if (trending === 'true' || trending === true) where.trending = true;
    
    if (stockStatus === 'inStock') {
      where.inventory = { stock: { gt: 0 } };
    } else if (stockStatus === 'outOfStock') {
       where.inventory = { stock: { lte: 0 } };
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } }
      ];
    }

    if (category) {
      where.category = {
        OR: [
          { id: category },
          { slug: category }
        ]
      };
    }
    
    if (brand) {
      where.brand = {
        OR: [
          { id: brand },
          { slug: brand }
        ]
      };
    }

    if (minPrice || maxPrice) {
      const min = minPrice ? Number(minPrice) : 0;
      const max = maxPrice ? Number(maxPrice) : 9999999;
      
      where.OR = [
        ...(where.OR || []),
        {
          AND: [
             { discountedPrice: null },
             { basePrice: { gte: min, lte: max } }
          ]
        },
        {
          AND: [
             { discountedPrice: { not: null } },
             { discountedPrice: { gte: min, lte: max } }
          ]
        }
      ];
    }

    // Dynamic Attribute Filtering
    if (query.attributes) {
      try {
        const attrFilters = typeof query.attributes === 'string' ? JSON.parse(query.attributes) : query.attributes;
        Object.keys(attrFilters).forEach(key => {
          where.attributes = {
            path: [key],
            equals: attrFilters[key]
          };
        });
      } catch (e) {
        console.error('Failed to parse attributes filter:', e);
      }
    }

    let orderBy: any = { createdAt: 'desc' };
    
    // Support sortBy/sortOrder from frontend
    if (sortBy) {
        orderBy = { [sortBy]: sortOrder || 'desc' };
    } 
    // Fallback to legacy sort format field:order
    else if (sort) {
      const parts = sort.split(':');
      if (parts.length === 2) {
        orderBy = { [parts[0]]: parts[1] };
      }
    }

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        skip,
        take: Number(limit),
        orderBy,
        include: {
          category: true,
          brand: true,
          images: true,
          inventory: true,
          _count: {
            select: { reviews: true }
          }
        }
      }),
      prisma.product.count({ where })
    ]);

    return {
      products,
      pagination: {
        total,
        pages: Math.ceil(total / Number(limit)),
        page: Number(page),
        limit: Number(limit)
      }
    };
  }

  async getProductBySlug(slug: string) {
    const product = await prisma.product.findUnique({
      where: { slug },
      include: {
        category: true,
        brand: true,
        images: true,
        inventory: true,
        reviews: {
          where: { isApproved: true, isDeleted: false },
          include: {
            user: {
              select: { name: true, avatar: true }
            }
          }
        }
      }
    });

    if (!product || product.isDeleted) throw new ApiError(404, 'Product not found');
    return product;
  }

  // Generates a slug that is guaranteed unique in the DB
  private async generateUniqueSlug(name: string, excludeId?: string): Promise<string> {
    const base = slugify(name, { lower: true, strict: true });
    let slug = base;
    let counter = 1;

    while (true) {
      const existing = await prisma.product.findUnique({ where: { slug } });
      // No conflict, or the only conflict is the product being updated (excludeId)
      if (!existing || existing.id === excludeId) break;
      counter++;
      slug = `${base}-${counter}`;
    }

    return slug;
  }

  async createProduct(data: any, files: Express.Multer.File[]) {
    const { name, basePrice, discountedPrice, categoryId, brandId, description, stock, sku, hotDeals, featured, trending, attributes } = data;
    const slug = await this.generateUniqueSlug(name);

    let parsedAttributes = attributes;
    if (typeof attributes === 'string') {
      try { parsedAttributes = JSON.parse(attributes); } catch { parsedAttributes = null; }
    }

    const product = await prisma.product.create({
      data: {
        name,
        slug,
        basePrice: Number(basePrice),
        discountedPrice: discountedPrice ? Number(discountedPrice) : null,
        description,
        categoryId,
        brandId: brandId || null,
        hotDeals: hotDeals === 'true' || hotDeals === true,
        featured: featured === 'true' || featured === true,
        trending: trending === 'true' || trending === true,
        attributes: parsedAttributes,
        inventory: {
          create: {
            stock: Number(stock) || 0,
            sku: sku || null
          }
        }
      } as any
    });

    if (files && files.length > 0) {
      await this.uploadProductImages(product.id, files);
    }

    return await this.getProductById(product.id);
  }

  async updateProduct(id: string, data: any, files?: Express.Multer.File[]) {
    // sku belongs to Inventory, not Product — extract it separately
    const { name, basePrice, discountedPrice, stock, sku, attributes, ...updateData } = data;
    
    if (name) {
      updateData.name = name;
      updateData.slug = await this.generateUniqueSlug(name, id);  // exclude self
    }

    if (attributes !== undefined) {
      if (typeof attributes === 'string') {
        try { updateData.attributes = JSON.parse(attributes); } catch { updateData.attributes = null; }
      } else {
        updateData.attributes = attributes;
      }
    }

    if (basePrice !== undefined) updateData.basePrice = Number(basePrice);
    if (discountedPrice !== undefined) updateData.discountedPrice = discountedPrice ? Number(discountedPrice) : null;
    
    // Parse booleans from multipart form
    if (data.hotDeals !== undefined) updateData.hotDeals = data.hotDeals === 'true' || data.hotDeals === true;
    if (data.featured !== undefined) updateData.featured = data.featured === 'true' || data.featured === true;
    if (data.trending !== undefined) updateData.trending = data.trending === 'true' || data.trending === true;

    // Build inventory update — use upsert in case the row doesn't exist yet
    const inventoryUpdate = (stock !== undefined || sku !== undefined) ? {
      upsert: {
        create: { stock: Number(stock) || 0, sku: sku || null },
        update: {
          ...(stock !== undefined ? { stock: Number(stock) } : {}),
          ...(sku !== undefined ? { sku: sku || null } : {}),
        }
      }
    } : undefined;

    await prisma.product.update({
      where: { id },
      data: {
        ...updateData,
        inventory: inventoryUpdate
      } as any
    });

    if (files && files.length > 0) {
      await this.uploadProductImages(id, files);
    }

    return await this.getProductById(id);
  }

  async deleteProduct(id: string) {
    const product = await prisma.product.findUnique({
      where: { id },
      include: { images: true }
    });

    if (!product) throw new ApiError(404, 'Product not found');

    // Soft delete
    return await prisma.product.update({
      where: { id },
      data: { isDeleted: true }
    });
  }

  async uploadProductImages(productId: string, files: Express.Multer.File[]) {
    const uploadPromises = files.map(file => uploadOnCloudinary(file.buffer, 'products'));
    const results = await Promise.all(uploadPromises);

    const imageData = results.map((result: any, index) => ({
      productId,
      imageUrl: result.secure_url,
      cloudinaryPublicId: result.public_id,
      isPrimary: index === 0
    }));

    await prisma.productImage.createMany({
      data: imageData
    });

    return await this.getProductById(productId);
  }

  async deleteProductImage(productId: string, imageId: string) {
    const image = await prisma.productImage.findUnique({
      where: { id: imageId }
    });

    if (!image) throw new ApiError(404, 'Image not found');

    // Field is cloudinaryPublicId on ProductImage, not publicId
    if (image.cloudinaryPublicId) {
      await deleteFromCloudinary(image.cloudinaryPublicId);
    }

    return await prisma.productImage.delete({
      where: { id: imageId }
    });
  }

  private async getProductById(id: string) {
    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        category: true,
        brand: true,
        images: true,
        inventory: true
      }
    });
    if (!product || product.isDeleted) throw new ApiError(404, 'Product not found');
    return product;
  }
}

export const productService = new ProductService();
