'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuthStore, useCartStore } from '@/store';
import { cartApi } from '@/lib/api';
import type { AddCartItemRequest, UpdateCartItemRequest } from '@/types';

export function useCart() {
  const queryClient = useQueryClient();
  const { isAuthenticated } = useAuthStore();
  const {
    serverCart,
    localItems,
    totalQuantity,
    isLoading,
    setServerCart,
    addLocalItem,
    updateLocalItem,
    removeLocalItem,
    clearLocalCart,
    setLoading,
  } = useCartStore();

  // Fetch cart from server when authenticated
  const { data: cart, refetch } = useQuery({
    queryKey: ['cart'],
    queryFn: async () => {
      const data = await cartApi.get();
      setServerCart(data);
      return data;
    },
    enabled: isAuthenticated,
    staleTime: 30000, // 30 seconds
  });

  const addItemMutation = useMutation({
    mutationFn: (data: AddCartItemRequest) => {
      if (isAuthenticated) {
        return cartApi.addItem(data);
      }
      // For guest, just update local state
      addLocalItem(data.productId, data.quantity);
      return Promise.resolve(null);
    },
    onSuccess: () => {
      if (isAuthenticated) {
        queryClient.invalidateQueries({ queryKey: ['cart'] });
      }
    },
  });

  const updateItemMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateCartItemRequest }) => {
      if (isAuthenticated) {
        return cartApi.updateItem(id, data);
      }
      // For guest, update local state (id is productId in this case)
      updateLocalItem(id, data.quantity);
      return Promise.resolve(null);
    },
    onSuccess: () => {
      if (isAuthenticated) {
        queryClient.invalidateQueries({ queryKey: ['cart'] });
      }
    },
  });

  const removeItemMutation = useMutation({
    mutationFn: (id: number) => {
      if (isAuthenticated) {
        return cartApi.removeItem(id);
      }
      // For guest, remove from local state (id is productId in this case)
      removeLocalItem(id);
      return Promise.resolve();
    },
    onSuccess: () => {
      if (isAuthenticated) {
        queryClient.invalidateQueries({ queryKey: ['cart'] });
      }
    },
  });

  const clearCartMutation = useMutation({
    mutationFn: () => {
      if (isAuthenticated) {
        return cartApi.clear();
      }
      clearLocalCart();
      return Promise.resolve();
    },
    onSuccess: () => {
      if (isAuthenticated) {
        queryClient.invalidateQueries({ queryKey: ['cart'] });
      }
    },
  });

  // Get cart items based on auth state
  const items = isAuthenticated ? (cart?.items || serverCart?.items || []) : [];
  const total = isAuthenticated
    ? (cart?.totalAmount || serverCart?.totalAmount || 0)
    : 0;

  return {
    items,
    localItems,
    totalQuantity,
    totalAmount: total,
    isLoading,
    refetch,
    addItem: addItemMutation.mutate,
    addItemAsync: addItemMutation.mutateAsync,
    isAddingItem: addItemMutation.isPending,
    updateItem: (id: number, quantity: number) =>
      updateItemMutation.mutate({ id, data: { quantity } }),
    isUpdatingItem: updateItemMutation.isPending,
    removeItem: removeItemMutation.mutate,
    isRemovingItem: removeItemMutation.isPending,
    clearCart: clearCartMutation.mutate,
    isClearingCart: clearCartMutation.isPending,
  };
}

