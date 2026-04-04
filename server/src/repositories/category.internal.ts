import { prisma } from "../config/prisma";

export class CategoryRepository {
  async findAll() {
    return await prisma.category.findMany({
      where: { isDeleted: false }
    });
  }

  async findById(id: string) {
    return await prisma.category.findFirst({
      where: { id, isDeleted: false }
    });
  }

  async findBySlug(slug: string) {
    return await prisma.category.findFirst({
      where: { slug, isDeleted: false }
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

