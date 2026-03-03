import { prisma } from "../config/prisma";

export class AddressRepository {
  async create(userId: string, data: any) {
    // If this is the first address, make it default
    const count = await prisma.address.count({ where: { userId } });
    
    return await prisma.address.create({
      data: {
        ...data,
        userId,
        isDefault: count === 0
      }
    });
  }

  async findByUserId(userId: string) {
    return await prisma.address.findMany({
      where: { userId },
      orderBy: { isDefault: 'desc' }
    });
  }

  async findById(id: string) {
    return await prisma.address.findUnique({
      where: { id }
    });
  }

  async setAsDefault(userId: string, addressId: string) {
    return await prisma.$transaction([
      prisma.address.updateMany({
        where: { userId },
        data: { isDefault: false }
      }),
      prisma.address.update({
        where: { id: addressId },
        data: { isDefault: true }
      })
    ]);
  }

  async delete(id: string) {
    return await prisma.address.delete({
      where: { id }
    });
  }
}

export const addressRepository = new AddressRepository();
