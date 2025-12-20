import apiClient from './client';
import type { Order, OrderDetail, CreateOrderRequest, CreateOrderResponse } from '@/types';

export const ordersApi = {
  getAll: async (): Promise<Order[]> => {
    const response = await apiClient.get<Order[]>('/orders');
    return response.data;
  },

  getById: async (id: number): Promise<OrderDetail> => {
    const response = await apiClient.get<OrderDetail>(`/orders/${id}`);
    return response.data;
  },

  create: async (data: CreateOrderRequest): Promise<CreateOrderResponse> => {
    const response = await apiClient.post<CreateOrderResponse>('/orders', data);
    return response.data;
  },

  cancel: async (orderId: number): Promise<{ message: string }> => {
    const response = await apiClient.delete<{ message: string }>(`/orders/${orderId}/cancel`);
    return response.data;
  },
};

