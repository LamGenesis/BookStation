import apiClient from './client';

// ==== ADMIN STATISTICS ====
export interface SalesStatisticItem {
  date: string;
  totalSales: number;
  ordersCount: number;
}

export interface SalesStatisticResponse {
  dailyStatistics: SalesStatisticItem[];
  totalRevenue: number;
  totalOrders: number;
  totalCustomers: number;
}

export const adminStatisticsApi = {
  getSales: async (from: string, to: string): Promise<SalesStatisticResponse> => {
    const response = await apiClient.get<SalesStatisticResponse>('/api/admin/statistics/sales', {
      params: { from, to },
    });
    return response.data;
  },
};

// ==== ADMIN ORDERS ====
export interface AdminOrderSummary {
  id: number;
  userEmail: string | null;
  userId: number | null;
  userFullName: string | null;
  totalAmount: number;
  status: string;
  paymentStatus: string;
  createdAt: string;
}

export interface UpdateOrderStatusRequest {
  status: string;
}

export const adminOrdersApi = {
  getAll: async (): Promise<AdminOrderSummary[]> => {
    const response = await apiClient.get<AdminOrderSummary[]>('/api/orders');
    return response.data;
  },

  updateStatus: async (orderId: number, data: UpdateOrderStatusRequest) => {
    const response = await apiClient.put(`/api/orders/${orderId}/status`, data);
    return response.data;
  },
};

// ==== ADMIN PRODUCTS ====
export interface AdminProductFormData {
  name: string;
  description?: string;
  price: number;
  discountPrice?: number | null;
  quantity: number;
  status: number;
  categoryId: number | null;
  images?: FileList | null;
}

export const adminProductsApi = {
  create: async (data: AdminProductFormData) => {
    const formData = new FormData();
    formData.append('name', data.name);
    formData.append('price', String(data.price));
    formData.append('quantity', String(data.quantity));
    formData.append('status', String(data.status));
    formData.append('categoryId', String(data.categoryId));
    if (data.description) formData.append('description', data.description);
    if (data.discountPrice != null) {
      formData.append('discountPrice', String(data.discountPrice));
    }
    if (data.images) {
      Array.from(data.images).forEach((file) => {
        formData.append('images', file);
      });
    }
    const response = await apiClient.post('/api/products', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  update: async (id: number, data: AdminProductFormData) => {
    const formData = new FormData();
    formData.append('name', data.name);
    formData.append('price', String(data.price));
    formData.append('quantity', String(data.quantity));
    formData.append('status', String(data.status));
    if (data.categoryId != null) {
      formData.append('categoryId', String(data.categoryId));
    }
    if (data.description) formData.append('description', data.description);
    if (data.discountPrice != null) {
      formData.append('discountPrice', String(data.discountPrice));
    }
    if (data.images) {
      Array.from(data.images).forEach((file) => {
        formData.append('images', file);
      });
    }
    const response = await apiClient.put(`/api/products/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  delete: async (id: number) => {
    await apiClient.delete(`/api/products/${id}`);
  },
};

// ==== ADMIN CATEGORIES ====
export interface AdminCategoryFormData {
  name: string;
  slug: string;
}

export const adminCategoriesApi = {
  create: async (data: AdminCategoryFormData) => {
    const response = await apiClient.post('/api/categories', data);
    return response.data;
  },

  update: async (id: number, data: AdminCategoryFormData) => {
    const response = await apiClient.put(`/api/categories/${id}`, data);
    return response.data;
  },

  delete: async (id: number) => {
    await apiClient.delete(`/api/categories/${id}`);
  },
};

// ==== ADMIN POSTS ====
export interface AdminPostFormData {
  title: string;
  content: string;
  imageUrl: string | null;
}

export const adminPostsApi = {
  create: async (data: AdminPostFormData) => {
    const response = await apiClient.post('/api/posts', data);
    return response.data;
  },

  update: async (id: number, data: AdminPostFormData) => {
    const response = await apiClient.put(`/api/posts/${id}`, data);
    return response.data;
  },

  delete: async (id: number) => {
    await apiClient.delete(`/api/posts/${id}`);
  },
};


