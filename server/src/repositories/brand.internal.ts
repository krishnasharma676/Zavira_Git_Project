import { prisma } from "../config/prisma";

export class BrandRepository {
  async findAll() {
    return await prisma.brand.findMany({
      where: { isDeleted: false },
      orderBy: { name: 'asc' }
    });
  }

  async findById(id: string) {
    return await prisma.brand.findFirst({
      where: { id, isDeleted: false }
    });
  }

  async findBySlug(slug: string) {
    return await prisma.brand.findFirst({
      where: { slug, isDeleted: false }
    });
  }

  async create(data: any) {
    return await prisma.brand.create({
      data
    });
  }

  async update(id: string, data: any) {
    return await prisma.brand.update({
      where: { id },
      data
    });
  }

  async softDelete(id: string) {
    return await prisma.brand.update({
      where: { id },
      data: { isDeleted: true }
    });
  }
}

export const brandRepository = new BrandRepository();
