import { prisma } from '../config/prisma';
import slugify from 'slugify';
import { uploadOnCloudinary, deleteFromCloudinary } from '../utils/cloudinary';
import { ApiError } from '../utils/ApiError';

export class BrandService {
  async getAllBrands() {
    return await prisma.brand.findMany({
      where: { isDeleted: false },
      include: {
        _count: {
          select: { products: true }
        }
      },
      orderBy: { name: 'asc' }
    });
  }

  async createBrand(data: any, file?: Express.Multer.File) {
    const { name, description, website, imageUrl: providedImageUrl, isActive } = data;
    const slug = slugify(name, { lower: true });

    // Check if brand already exists (including soft-deleted)
    const existingBrand = await prisma.brand.findFirst({
      where: { OR: [{ name }, { slug }] }
    });

    if (existingBrand) {
      if (existingBrand.isDeleted) {
        // Re-activate and update soft-deleted brand
        let imageUrl = providedImageUrl || existingBrand.imageUrl || '';
        let imagePublicId = existingBrand.imagePublicId || '';

        if (file) {
          if (imagePublicId) {
            await deleteFromCloudinary(imagePublicId);
          }
          const result = await uploadOnCloudinary(file.buffer, 'brands') as any;
          imageUrl = result.secure_url;
          imagePublicId = result.public_id;
        }

        return await prisma.brand.update({
          where: { id: existingBrand.id },
          data: {
            name,
            slug,
            description,
            website,
            imageUrl,
            imagePublicId,
            isDeleted: false,
            isActive: isActive !== undefined ? (isActive === 'true' || isActive === true) : true
          }
        });
      } else {
        throw new ApiError(400, 'Brand with this name or slug already exists');
      }
    }

    let imageUrl = providedImageUrl || '';
    let imagePublicId = '';

    if (file) {
      const result = await uploadOnCloudinary(file.buffer, 'brands') as any;
      imageUrl = result.secure_url;
      imagePublicId = result.public_id;
    }

    return await prisma.brand.create({
      data: {
        name,
        slug,
        description,
        website,
        imageUrl,
        imagePublicId,
        isActive: isActive !== undefined ? (isActive === 'true' || isActive === true) : true
      }
    });
  }

  async updateBrand(id: string, data: any, file?: Express.Multer.File) {
    const brand = await prisma.brand.findUnique({ where: { id } });
    if (!brand) throw new ApiError(404, 'Brand not found');

    const { name, description, website, imageUrl, isActive } = data;
    const updateData: any = { description, website };

    if (name) {
      updateData.name = name;
      updateData.slug = slugify(name, { lower: true });

      // Check for duplicates
      const duplicate = await prisma.brand.findFirst({
        where: {
          id: { not: id },
          OR: [{ name: updateData.name }, { slug: updateData.slug }]
        }
      });
      if (duplicate) throw new ApiError(400, 'Another brand with this name already exists');
    }

    if (isActive !== undefined) {
      updateData.isActive = isActive === 'true' || isActive === true;
    }

    if (imageUrl) {
      updateData.imageUrl = imageUrl;
    }

    if (file) {
      if (brand.imagePublicId) {
        await deleteFromCloudinary(brand.imagePublicId);
      }
      const result = await uploadOnCloudinary(file.buffer, 'brands') as any;
      updateData.imageUrl = result.secure_url;
      updateData.imagePublicId = result.public_id;
    }

    return await prisma.brand.update({
      where: { id },
      data: updateData
    });
  }

  async deleteBrand(id: string) {
    const brand = await prisma.brand.findUnique({
      where: { id },
      include: { _count: { select: { products: true } } }
    });

    if (!brand) throw new ApiError(404, 'Brand not found');
    if (brand._count.products > 0) {
      throw new ApiError(400, 'Cannot delete brand with associated products');
    }

    if (brand.imagePublicId) {
      await deleteFromCloudinary(brand.imagePublicId);
    }

    return await prisma.brand.update({ where: { id }, data: { isDeleted: true } });
  }
}

export const brandService = new BrandService();
