import { settingRepository } from "../repositories/setting.internal";
import { ApiError } from "../utils/ApiError";

export class SettingService {
  async getAllSettings() {
    const settings = await settingRepository.getSettings();
    return this.transformSettings(settings);
  }

  async getPublicSettings() {
    const settings = await settingRepository.getSettings();
    const publicKeys = [
      'store_name', 'store_email', 'store_logo', 'store_favicon',
      'shipping_flat_rate', 'free_shipping_threshold', 'cod_charge', 'tax_percentage',
      'razorpay_key_id', 'shiprocket_pickup_location', 'store_address', 'store_gstin',
      'shiprocket_test_mode'
    ];
    
    const filtered = settings.filter((s: any) => publicKeys.includes(s.key));
    const result = this.transformSettings(filtered);
    
    // Inject current environment setting if not overridden in DB
    if (!result.shiprocket_test_mode) {
      result.shiprocket_test_mode = process.env.SHIPROCKET_TEST_MODE || 'false';
    }
    
    return result;
  }

  private transformSettings(settings: any[]) {
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
