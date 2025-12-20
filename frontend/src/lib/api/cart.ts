import apiClient from './client';
import type { Cart, CartItem, AddCartItemRequest, UpdateCartItemRequest } from '@/types';

export const cartApi = {
  get: async (): Promise<Cart> => {
    const response = await apiClient.get<Cart>('/cart');
    return response.data;
  },

  addItem: async (data: AddCartItemRequest): Promise<CartItem> => {
    const response = await apiClient.post<CartItem>('/cart/items', data);
    return response.data;
  },

  updateItem: async (id: number, data: UpdateCartItemRequest): Promise<CartItem> => {
    const response = await apiClient.put<CartItem>(`/cart/items/${id}`, data);
    return response.data;
  },

  removeItem: async (id: number): Promise<void> => {
    await apiClient.delete(`/cart/items/${id}`);
  },

  clear: async (): Promise<void> => {
    await apiClient.delete('/cart');
  },

  merge: async (items: AddCartItemRequest[]): Promise<Cart> => {
    const response = await apiClient.post<Cart>('/cart/merge', { items });
    return response.data;
  },
};

