import { prisma } from '../config/prisma';
import { ApiError } from '../utils/ApiError';

export class ColorService {
  async getAllColors() {
    return (prisma as any).color.findMany({
      orderBy: { name: 'asc' }
    });
  }

  async createColor(data: { name: string; hexCode: string }) {
    const existing = await (prisma as any).color.findUnique({
      where: { name: data.name }
    });
    if (existing) throw new ApiError(400, 'Color with this name already exists');

    return (prisma as any).color.create({
      data: {
        name: data.name,
        hexCode: data.hexCode
      }
    });
  }

  async deleteColor(id: string) {
    // Check if color is in use
    const inUse = await (prisma as any).productVariant.findFirst({
      where: { colorId: id }
    });
    if (inUse) throw new ApiError(400, 'Cannot delete color. It is currently used by product variants.');

    return (prisma as any).color.delete({
      where: { id }
    });
  }

  async getOrCreateColor(name: string, hexCode: string) {
    let color = await (prisma as any).color.findUnique({
      where: { name }
    });

    if (!color) {
      color = await (prisma as any).color.create({
        data: { name, hexCode }
      });
    } else if (color.hexCode !== hexCode) {
      color = await (prisma as any).color.update({
        where: { id: color.id },
        data: { hexCode }
      });
    }

    return color;
  }
}

export const colorService = new ColorService();
