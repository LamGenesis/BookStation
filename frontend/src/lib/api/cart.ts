import apiClient from './client';
import type { Cart, CartItem, AddCartItemRequest, UpdateCartItemRequest } from '@/types';

export const cartApi = {
  get: async (): Promise<Cart> => {
    const response = await apiClient.get<Cart>('/api/cart');
    return response.data;
  },

  addItem: async (data: AddCartItemRequest): Promise<CartItem> => {
    const response = await apiClient.post<CartItem>('/api/cart/items', data);
    return response.data;
  },

  updateItem: async (id: number, data: UpdateCartItemRequest): Promise<CartItem> => {
    const response = await apiClient.put<CartItem>(`/api/cart/items/${id}`, data);
    return response.data;
  },

  removeItem: async (id: number): Promise<void> => {
    await apiClient.delete(`/api/cart/items/${id}`);
  },

  clear: async (): Promise<void> => {
    await apiClient.delete('/api/cart');
  },

  merge: async (items: AddCartItemRequest[]): Promise<Cart> => {
    const response = await apiClient.post<Cart>('/api/cart/merge', { items });
    return response.data;
  },
};

