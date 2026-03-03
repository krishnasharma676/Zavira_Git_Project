import { prisma } from '../config/prisma';
import slugify from 'slugify';
import { uploadOnCloudinary, deleteFromCloudinary } from '../utils/cloudinary';
import { ApiError } from '../utils/ApiError';

export class CategoryService {
  async getAllCategories() {
    return await prisma.category.findMany({
      where: { isDeleted: false },
      include: {
        subCategories: true,
        _count: {
          select: { products: true }
        }
      },
      orderBy: { name: 'asc' }
    });
  }

  async createCategory(data: any, file?: Express.Multer.File) {
    const { name, description, imageUrl: providedImageUrl, isActive } = data;
    const slug = slugify(name, { lower: true });

    // Check if category already exists (including soft-deleted)
    const existingCategory = await prisma.category.findFirst({
      where: { OR: [{ name }, { slug }] }
    });

    if (existingCategory) {
      if (existingCategory.isDeleted) {
        // Re-activate and update soft-deleted category
        let imageUrl = providedImageUrl || existingCategory.imageUrl || '';
        let imagePublicId = existingCategory.imagePublicId || '';

        if (file) {
          if (imagePublicId) {
            await deleteFromCloudinary(imagePublicId);
          }
          const result = await uploadOnCloudinary(file.buffer, 'categories') as any;
          imageUrl = result.secure_url;
          imagePublicId = result.public_id;
        }

        return await prisma.category.update({
          where: { id: existingCategory.id },
          data: {
            name,
            slug,
            description,
            imageUrl,
            imagePublicId,
            isDeleted: false,
            isActive: isActive !== undefined ? (isActive === 'true' || isActive === true) : true
          }
        });
      } else {
        throw new ApiError(400, 'Category with this name or slug already exists');
      }
    }

    let imageUrl = providedImageUrl || '';
    let imagePublicId = '';

    if (file) {
      const result = await uploadOnCloudinary(file.buffer, 'categories') as any;
      imageUrl = result.secure_url;
      imagePublicId = result.public_id;
    }

    return await prisma.category.create({
      data: {
        name,
        slug,
        description,
        imageUrl,
        imagePublicId,
        isActive: isActive !== undefined ? (isActive === 'true' || isActive === true) : true
      }
    });
  }

  async updateCategory(id: string, data: any, file?: Express.Multer.File) {
    const category = await prisma.category.findUnique({ where: { id } });
    if (!category) throw new ApiError(404, 'Category not found');

    const { name, description, imageUrl, isActive } = data;
    const updateData: any = { description };

    if (name) {
      updateData.name = name;
      updateData.slug = slugify(name, { lower: true });
      
      // Check if another category has the same name/slug
      const duplicate = await prisma.category.findFirst({
        where: {
          id: { not: id },
          OR: [{ name: updateData.name }, { slug: updateData.slug }]
        }
      });
      if (duplicate) throw new ApiError(400, 'Another category with this name already exists');
    }

    if (isActive !== undefined) {
      updateData.isActive = isActive === 'true' || isActive === true;
    }

    if (imageUrl) {
      updateData.imageUrl = imageUrl;
    }

    if (file) {
      if (category.imagePublicId) {
        await deleteFromCloudinary(category.imagePublicId);
      }
      const result = await uploadOnCloudinary(file.buffer, 'categories') as any;
      updateData.imageUrl = result.secure_url;
      updateData.imagePublicId = result.public_id;
    }

    return await prisma.category.update({
      where: { id },
      data: updateData
    });
  }

  async deleteCategory(id: string) {
    const category = await prisma.category.findUnique({
      where: { id },
      include: { _count: { select: { products: true } } }
    });

    if (!category) throw new ApiError(404, 'Category not found');
    if (category._count.products > 0) {
      throw new ApiError(400, 'Cannot delete category with associated products');
    }

    if (category.imagePublicId) {
      await deleteFromCloudinary(category.imagePublicId);
    }

    return await prisma.category.update({ where: { id }, data: { isDeleted: true } });
  }
}

export const categoryService = new CategoryService();
