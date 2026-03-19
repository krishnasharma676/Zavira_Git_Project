import { settingRepository } from "../repositories/setting.internal";
import { ApiError } from "../utils/ApiError";

export class SettingService {
  async getAllSettings() {
    const settings = await settingRepository.getSettings();
    // Transform to simple object
    return settings.reduce((acc: any, curr: any) => {
      acc[curr.key] = curr.value;
      return acc;
    }, {});
  }

  async updateSettings(settings: Record<string, string>) {
    const updates = Object.entries(settings).map(([key, value]) => ({
      key,
      value: String(value)
    }));
    return await settingRepository.updateMultiple(updates);
  }

  async getSetting(key: string, defaultValue?: string) {
    const setting = await settingRepository.getSettingByKey(key);
    return setting?.value || defaultValue;
  }
}

export const settingService = new SettingService();
