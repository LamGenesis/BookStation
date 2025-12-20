import apiClient from './client';
import type { Post, PostDetail } from '@/types';

export const postsApi = {
  getAll: async (): Promise<Post[]> => {
    const response = await apiClient.get<Post[]>('/api/posts');
    return response.data;
  },

  getById: async (id: number): Promise<PostDetail> => {
    const response = await apiClient.get<PostDetail>(`/api/posts/${id}`);
    return response.data;
  },

  getLatest: async (limit: number = 4): Promise<Post[]> => {
    const response = await apiClient.get<Post[]>('/api/posts', {
      params: { limit },
    });
    return response.data.slice(0, limit);
  },
};

