import apiClient from './client';
import type { Order, OrderDetail, CreateOrderRequest, CreateOrderResponse } from '@/types';

export const ordersApi = {
  getAll: async (): Promise<Order[]> => {
    const response = await apiClient.get<Order[]>('/api/orders');
    return response.data;
  },

  getById: async (id: number): Promise<OrderDetail> => {
    const response = await apiClient.get<OrderDetail>(`/api/orders/${id}`);
    return response.data;
  },

  create: async (data: CreateOrderRequest): Promise<CreateOrderResponse> => {
    const response = await apiClient.post<CreateOrderResponse>('/api/orders', data);
    return response.data;
  },

  cancel: async (orderId: number): Promise<{ message: string }> => {
    const response = await apiClient.delete<{ message: string }>(`/api/orders/${orderId}/cancel`);
    return response.data;
  },
};

