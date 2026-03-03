import { prisma } from "../config/prisma";

export class CategoryRepository {
  async findAll() {
    return await prisma.category.findMany({
      where: { isDeleted: false },
      include: { subCategories: true },
    });
  }

  async findById(id: string) {
    return await prisma.category.findFirst({
      where: { id, isDeleted: false },
      include: { subCategories: true },
    });
  }

  async findBySlug(slug: string) {
    return await prisma.category.findFirst({
      where: { slug, isDeleted: false },
      include: { subCategories: true },
    });
  }

  async create(data: any) {
    return await prisma.category.create({ data });
  }

  async update(id: string, data: any) {
    return await prisma.category.update({ where: { id }, data });
  }

  async softDelete(id: string) {
    return await prisma.category.update({ where: { id }, data: { isDeleted: true } });
  }
}

export const categoryRepository = new CategoryRepository();

