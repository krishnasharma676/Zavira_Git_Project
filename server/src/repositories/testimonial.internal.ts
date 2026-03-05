import { prisma } from "../config/prisma";

export class TestimonialRepository {
  async create(data: any) {
    return await prisma.testimonial.create({ data });
  }

  async findAllAdmin() {
    return await prisma.testimonial.findMany({
      where: { isDeleted: false },
      orderBy: { createdAt: 'desc' }
    });
  }

  async findAllPublic() {
    return await prisma.testimonial.findMany({
      where: { isDeleted: false, isActive: true },
      orderBy: { createdAt: 'desc' }
    });
  }

  async findById(id: string) {
    return await prisma.testimonial.findUnique({
      where: { id }
    });
  }

  async update(id: string, data: any) {
    return await prisma.testimonial.update({
      where: { id },
      data
    });
  }

  async delete(id: string) {
    return await prisma.testimonial.update({
      where: { id },
      data: { isDeleted: true }
    });
  }
}

export const testimonialRepository = new TestimonialRepository();
