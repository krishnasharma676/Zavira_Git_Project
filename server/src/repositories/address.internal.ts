import { prisma } from "../config/prisma";

export class AddressRepository {
  async create(userId: string, data: any) {
    const count = await prisma.address.count({ where: { userId } });
    
    return await (prisma.address as any).create({
      data: {
        userId,
        name:      data.name,
        phone:     data.phone,
        type:      data.type     || 'HOME',
        street:    data.street,
        area:      data.area     || null,
        landmark:  data.landmark || null,
        city:      data.city,
        state:     data.state,
        pincode:   data.pincode,
        country:   data.country  || 'India',
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
