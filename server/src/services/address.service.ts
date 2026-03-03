import { addressRepository } from "../repositories/address.internal";
import { ApiError } from "../utils/ApiError";

export class AddressService {
  async addAddress(userId: string, data: any) {
    return await addressRepository.create(userId, data);
  }

  async getMyAddresses(userId: string) {
    return await addressRepository.findByUserId(userId);
  }

  async setDefaultAddress(userId: string, addressId: string) {
    const address = await addressRepository.findById(addressId);
    if (!address || address.userId !== userId) {
      throw new ApiError(404, "Address not found");
    }
    return await addressRepository.setAsDefault(userId, addressId);
  }

  async deleteAddress(userId: string, addressId: string) {
    const address = await addressRepository.findById(addressId);
    if (!address || address.userId !== userId) {
      throw new ApiError(404, "Address not found");
    }
    return await addressRepository.delete(addressId);
  }
}

export const addressService = new AddressService();
