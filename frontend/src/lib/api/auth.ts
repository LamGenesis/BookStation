import apiClient, { setTokens, clearTokens, getRefreshToken } from './client';
import type { AuthResponse, LoginRequest, RegisterRequest } from '@/types';

export const authApi = {
  login: async (data: LoginRequest): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>('/auth/login', data);
    const { accessToken, refreshToken } = response.data;
    setTokens(accessToken, refreshToken);
    return response.data;
  },

  register: async (data: RegisterRequest): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>('/auth/register', data);
    const { accessToken, refreshToken } = response.data;
    setTokens(accessToken, refreshToken);
    return response.data;
  },

  refreshToken: async (): Promise<AuthResponse> => {
    const refreshToken = getRefreshToken();
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }
    const response = await apiClient.post<AuthResponse>('/auth/refresh', {
      refreshToken,
    });
    const { accessToken, refreshToken: newRefreshToken } = response.data;
    setTokens(accessToken, newRefreshToken);
    return response.data;
  },

  logout: async (): Promise<void> => {
    try {
      const refreshToken = getRefreshToken();
      if (refreshToken) {
        await apiClient.post('/auth/logout', { refreshToken });
      }
    } finally {
      clearTokens();
    }
  },
};

