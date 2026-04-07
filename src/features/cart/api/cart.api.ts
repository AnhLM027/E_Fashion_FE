import axios from "@/lib/axiosClient";
import { API_ENDPOINTS } from '../../../config/api.config';
import type { CartResponse } from "../types/cart.type";

export const cartApi = {
  async addItem(productVariantSizeId: string, quantity: number): Promise<CartResponse> {
    const res = await axios.post<CartResponse>(API_ENDPOINTS.CUSTOMER.CART_ITEMS, {
      productVariantSizeId,
      quantity,
    });
    return res;
  },

  async getCart(): Promise<CartResponse> {
    const res = await axios.get<CartResponse>(API_ENDPOINTS.CUSTOMER.CARTS);
    return res;
  },

  async updateQuantity(productVariantSizeId: string, quantity: number) {
    const res = await axios.put<CartResponse>(API_ENDPOINTS.CUSTOMER.CART_ITEM(productVariantSizeId),
      null,
      {
        params: { quantity },
      });
    return res;
  },

  async changeVariant(
    oldVariantSizeId: string,
    newVariantSizeId: string
  ): Promise<CartResponse> {
    const res = await axios.put<CartResponse>(
      API_ENDPOINTS.CUSTOMER.CART_ITEMS_CHANGE,
      {
        oldVariantSizeId,
        newVariantSizeId,
      }
    );

    return res;
  },

  async removeItem(productVariantSizeId: string) {
    const res = await axios.delete(API_ENDPOINTS.CUSTOMER.CART_ITEM(productVariantSizeId));
    return res;
  },
};
