import { prisma } from '../config/prisma';
import { uploadOnCloudinary, deleteFromCloudinary } from '../utils/cloudinary';
import { ApiError } from '../utils/ApiError';

export class BannerService {
  async getActiveBanners() {
    return await prisma.banner.findMany({
      where: { isActive: true, isDeleted: false },
      orderBy: { createdAt: 'desc' }
    });
  }

  async getAllBanners() {
    return await prisma.banner.findMany({
      where: { isDeleted: false },
      orderBy: { createdAt: 'desc' }
    });
  }

  async createBanner(data: any, file?: Express.Multer.File) {
    const { title, subtitle, description, link, type, isActive } = data;

    let imageUrl = '';
    let imagePublicId = '';

    if (file) {
      const result = await uploadOnCloudinary(file.buffer, 'banners') as any;
      imageUrl = result.secure_url;
      imagePublicId = result.public_id;
    }

    return await prisma.banner.create({
      data: {
        title,
        subtitle,
        description,
        link,
        imageUrl,
        imagePublicId,
        type: type || 'HERO',
        isActive: isActive === 'true' || isActive === true
      }
    });
  }

  async updateBanner(id: string, data: any, file?: Express.Multer.File) {
    const banner = await prisma.banner.findUnique({ where: { id } });
    if (!banner) throw new ApiError(404, 'Banner not found');

    const { title, subtitle, description, link, type, isActive } = data;
    const updateData: any = {
      title,
      subtitle,
      description,
      link,
      type,
      isActive: isActive !== undefined ? (isActive === 'true' || isActive === true) : undefined
    };

    if (file) {
      if (banner.imagePublicId) {
        await deleteFromCloudinary(banner.imagePublicId);
      }
      const result = await uploadOnCloudinary(file.buffer, 'banners') as any;
      updateData.imageUrl = result.secure_url;
      updateData.imagePublicId = result.public_id;
    }

    return await prisma.banner.update({
      where: { id },
      data: updateData
    });
  }

  async deleteBanner(id: string) {
    const banner = await prisma.banner.findUnique({ where: { id } });
    if (!banner) throw new ApiError(404, 'Banner not found');

    if (banner.imagePublicId) {
      await deleteFromCloudinary(banner.imagePublicId);
    }

    return await prisma.banner.update({ where: { id }, data: { isDeleted: true } });
  }

  async trackClick(id: string) {
    const banner = await prisma.banner.findUnique({ where: { id } });
    if (!banner) throw new ApiError(404, 'Banner not found');

    return await prisma.banner.update({
      where: { id },
      data: { clickCount: { increment: 1 } }
    });
  }
}

export const bannerService = new BannerService();
