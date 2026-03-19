import { prisma } from '../config/prisma';
import { ApiError } from '../utils/ApiError';
import cloudinary from '../config/cloudinary';
import { colorService } from './color.service';

export class VariantService {
  // ─── Create multiple variants for a product (bulk create) ───────────────────
  async createVariants(productId: string, variantsData: any[], files: { [fieldname: string]: Express.Multer.File[] }) {
    // Verify product exists
    const product = await prisma.product.findUnique({ where: { id: productId } });
    if (!product) throw new ApiError(404, 'Product not found');

    const createdVariants = [];

    for (let i = 0; i < variantsData.length; i++) {
      const variantData = variantsData[i];
      const { color, colorCode, colorId, sizes } = variantData;

      if (!color && !colorId) throw new ApiError(400, `Variant ${i + 1}: color or colorId is required`);

      let finalColorId = colorId;
      let finalColorName = color;
      let finalColorCode = colorCode;

      if (colorId) {
        const c = await (prisma as any).color.findUnique({ where: { id: colorId } });
        if (c) {
          finalColorName = c.name;
          finalColorCode = c.hexCode;
        }
      } else if (color && colorCode) {
        const c = await colorService.getOrCreateColor(color, colorCode);
        finalColorId = c.id;
      }

      // Upload images for this variant
      const variantImageFiles = files[`variant_${i}_images`] || [];
      const uploadedImages: { cloudinaryPublicId: string; imageUrl: string; isPrimary: boolean; sortOrder: number }[] = [];

      for (let j = 0; j < variantImageFiles.length; j++) {
        const file = variantImageFiles[j];
        const result = await new Promise<any>((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            { folder: 'zavira/variants', resource_type: 'image' },
            (err, res) => { if (err) reject(err); else resolve(res); }
          );
          stream.end(file.buffer);
        });
        uploadedImages.push({
          cloudinaryPublicId: result.public_id,
          imageUrl: result.secure_url,
          isPrimary: j === 0,
          sortOrder: j,
        });
      }

      // Parse sizes
      let parsedSizes: { size: string; stock: number; sku?: string }[] = [];
      if (sizes) {
        if (typeof sizes === 'string') {
          try { parsedSizes = JSON.parse(sizes); } catch { parsedSizes = []; }
        } else if (Array.isArray(sizes)) {
          parsedSizes = sizes;
        }
      }

      // Total stock = sum of all sizes
      const totalStock = parsedSizes.reduce((sum: number, s: any) => sum + (Number(s.stock) || 0), 0);

      // Auto-generate SKU
      const skuBase = `ZVR-${product.name.substring(0, 4).toUpperCase()}-${(finalColorName || 'VAR').substring(0, 3).toUpperCase()}`;
      const sku = `${skuBase}-${Date.now().toString(36).toUpperCase()}`;

      // Create variant with images and sizes
      const variant = await (prisma as any).productVariant.create({
        data: {
          productId,
          color: finalColorName,
          colorCode: finalColorCode || null,
          colorId: finalColorId,
          stock: totalStock,
          sku,
          images: { create: uploadedImages },
          sizes: {
            create: parsedSizes.map((s: any) => ({
              size: s.size,
              stock: Number(s.stock) || 0,
              sku: s.sku || `${skuBase}-${s.size}-${Date.now().toString(36).toUpperCase()}`,
            })),
          },
        },
        include: { images: true, sizes: true },
      });

      createdVariants.push(variant);
    }

    // Update total product stock = sum of all variant stocks
    const totalStock = createdVariants.reduce((sum: number, v: any) => sum + v.stock, 0);
    await prisma.inventory.upsert({
      where: { productId },
      create: { productId, stock: totalStock },
      update: { stock: { increment: totalStock } },
    });

    return createdVariants;
  }

  // ─── Get all variants for a product ─────────────────────────────────────────
  async getVariants(productId: string) {
    return (prisma as any).productVariant.findMany({
      where: { productId },
      include: { images: { orderBy: { sortOrder: 'asc' } }, sizes: true },
      orderBy: { createdAt: 'asc' },
    });
  }

  // ─── Delete a variant ────────────────────────────────────────────────────────
  async deleteVariant(variantId: string) {
    const variant = await (prisma as any).productVariant.findUnique({
      where: { id: variantId },
      include: { images: true },
    });
    if (!variant) throw new ApiError(404, 'Variant not found');

    // Delete images from Cloudinary
    for (const img of variant.images) {
      try { await cloudinary.uploader.destroy(img.cloudinaryPublicId); } catch {}
    }

    // Decrement product stock
    await prisma.inventory.updateMany({
      where: { productId: variant.productId },
      data: { stock: { decrement: variant.stock } },
    });

    return (prisma as any).productVariant.delete({ where: { id: variantId } });
  }

  // ─── Update variant size stock ──────────────────────────────────────────────
  async updateSizeStock(sizeId: string, stock: number) {
    const size = await (prisma as any).productVariantSize.findUnique({
      where: { id: sizeId },
      include: { variant: true },
    });
    if (!size) throw new ApiError(404, 'Size not found');

    const updated = await (prisma as any).productVariantSize.update({
      where: { id: sizeId },
      data: { stock },
    });

    // Recalculate variant total stock
    const allSizes = await (prisma as any).productVariantSize.findMany({ where: { variantId: size.variantId } });
    const variantStock = allSizes.reduce((sum: number, s: any) => sum + s.stock, 0);
    await (prisma as any).productVariant.update({ where: { id: size.variantId }, data: { stock: variantStock } });

    // Recalculate product total stock
    const allVariants = await (prisma as any).productVariant.findMany({ where: { productId: size.variant.productId } });
    const productStock = allVariants.reduce((sum: number, v: any) => sum + v.stock, 0);
    await prisma.inventory.updateMany({ where: { productId: size.variant.productId }, data: { stock: productStock } });

    return updated;
  }
}

export const variantService = new VariantService();
