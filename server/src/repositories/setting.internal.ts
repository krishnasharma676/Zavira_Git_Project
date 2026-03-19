import { prisma } from "../config/prisma";

export class SettingRepository {
  private get model() {
    // Handle both 'setting' and 'Setting' keys just in case
    return (prisma as any).setting || (prisma as any).Setting;
  }

  async getSettings() {
    const m = this.model;
    if (!m) throw new Error("Prisma model 'setting' not found");
    return await m.findMany();
  }

  async getSettingByKey(key: string) {
    const m = this.model;
    if (!m) throw new Error("Prisma model 'setting' not found");
    return await m.findUnique({
      where: { key }
    });
  }

  async updateSetting(key: string, value: string) {
    const m = this.model;
    if (!m) throw new Error("Prisma model 'setting' not found");
    return await m.upsert({
      where: { key },
      update: { value },
      create: { key, value }
    });
  }

  async updateMultiple(settings: { key: string, value: string }[]) {
    const m = this.model;
    if (!m) throw new Error("Prisma model 'setting' not found");
    
    return await prisma.$transaction(
      settings.map(s => m.upsert({
        where: { key: s.key },
        update: { value: s.value },
        create: { key: s.key, value: s.value }
      }))
    );
  }
}

export const settingRepository = new SettingRepository();
