import apiClient from './client';
import type { Product, ProductDetail, ProductQueryParams, PaginatedResponse } from '@/types';

export const productsApi = {
  getAll: async (params?: ProductQueryParams): Promise<PaginatedResponse<Product>> => {
    const response = await apiClient.get<PaginatedResponse<Product>>('/api/products', {
      params: {
        page: params?.page || 1,
        pageSize: params?.pageSize || 12,
        search: params?.search || undefined,
        categoryId: params?.categoryId || undefined,
        sort: params?.sort || undefined,
      },
    });
    return response.data;
  },

  getById: async (id: number): Promise<ProductDetail> => {
    const response = await apiClient.get<ProductDetail>(`/api/products/${id}`);
    return response.data;
  },

  getNewArrivals: async (limit: number = 8): Promise<Product[]> => {
    const response = await apiClient.get<PaginatedResponse<Product>>('/api/products', {
      params: {
        page: 1,
        pageSize: limit,
        sort: 'newest',
      },
    });
    return response.data.items;
  },
};

