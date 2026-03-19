import { inventoryRepository } from "../repositories/inventory.internal";

export class InventoryService {
  async getInventory(query: any) {
    return await inventoryRepository.findAll(query);
  }

  async updateSingleStock(productId: string, stock: number) {
    return await inventoryRepository.updateStock(productId, stock);
  }

  async updateSingleSKU(productId: string, sku: string) {
    return await inventoryRepository.updateSKU(productId, sku);
  }

  async bulkSyncStock(updates: { productId: string, stock: number }[]) {
    return await inventoryRepository.bulkUpdateStock(updates);
  }
}

export const inventoryService = new InventoryService();
