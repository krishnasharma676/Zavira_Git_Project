import { prisma } from "../config/prisma";

export class BannerRepository {
  async findAll(onlyActive: boolean = true) {
    return await prisma.banner.findMany({
      where: { 
        isDeleted: false,
        ...(onlyActive && { isActive: true })
      },
      orderBy: { createdAt: 'desc' }
    });
  }

  async findById(id: string) {
    return await prisma.banner.findFirst({
      where: { id, isDeleted: false }
    });
  }

  async create(data: any) {
    return await (prisma as any).banner.create({
      data
    });
  }

  async update(id: string, data: any) {
    return await (prisma as any).banner.update({
      where: { id },
      data
    });
  }

  async softDelete(id: string) {
    return await prisma.banner.update({
      where: { id },
      data: { isDeleted: true, isActive: false }
    });
  }

  async incrementClicks(id: string) {
    return await prisma.banner.update({
      where: { id },
      data: {
        clickCount: {
          increment: 1
        }
      }
    });
  }
}

export const bannerRepository = new BannerRepository();
