import apiClient from './client';
import type { VnPayUrlRequest, VnPayUrlResponse, VnPayReturnResponse } from '@/types';

export const paymentsApi = {
  getVnPayUrl: async (data: VnPayUrlRequest): Promise<VnPayUrlResponse> => {
    const response = await apiClient.post<VnPayUrlResponse>('/payments/vnpay/create', data);
    return response.data;
  },

  processReturn: async (queryParams: URLSearchParams): Promise<VnPayReturnResponse> => {
    // Convert URLSearchParams to query string
    const queryString = queryParams.toString();
    const response = await apiClient.get<VnPayReturnResponse>(`/payments/vnpay/return?${queryString}`);
    return response.data;
  },
};

