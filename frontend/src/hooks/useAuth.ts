'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useAuthStore, useCartStore } from '@/store';
import { authApi, cartApi } from '@/lib/api';
import type { LoginRequest, RegisterRequest } from '@/types';

export function useAuth() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { user, isAuthenticated, isLoading, setAuth, logout: logoutStore, checkAuth } = useAuthStore();
  const { getLocalItemsForMerge, clearLocalCart, setServerCart } = useCartStore();

  const loginMutation = useMutation({
    mutationFn: (data: LoginRequest) => authApi.login(data),
    onSuccess: async (data) => {
      setAuth(data);
      
      // Merge local cart with server cart
      const localItems = getLocalItemsForMerge();
      if (localItems.length > 0) {
        try {
          const mergedCart = await cartApi.merge(localItems);
          setServerCart(mergedCart);
          clearLocalCart();
        } catch (error) {
          console.error('Failed to merge cart:', error);
        }
      } else {
        // Just fetch the server cart
        try {
          const cart = await cartApi.get();
          setServerCart(cart);
        } catch (error) {
          console.error('Failed to fetch cart:', error);
        }
      }
      
      queryClient.invalidateQueries({ queryKey: ['cart'] });
      router.push('/');
    },
  });

  const registerMutation = useMutation({
    mutationFn: (data: RegisterRequest) => authApi.register(data),
    onSuccess: async (data) => {
      setAuth(data);
      
      // Merge local cart with server cart
      const localItems = getLocalItemsForMerge();
      if (localItems.length > 0) {
        try {
          const mergedCart = await cartApi.merge(localItems);
          setServerCart(mergedCart);
          clearLocalCart();
        } catch (error) {
          console.error('Failed to merge cart:', error);
        }
      }
      
      queryClient.invalidateQueries({ queryKey: ['cart'] });
      router.push('/');
    },
  });

  const logoutMutation = useMutation({
    mutationFn: () => authApi.logout(),
    onSuccess: () => {
      logoutStore();
      queryClient.clear();
      router.push('/');
    },
    onError: () => {
      // Even if logout fails on server, clear local state
      logoutStore();
      queryClient.clear();
      router.push('/');
    },
  });

  return {
    user,
    isAuthenticated,
    isLoading,
    checkAuth,
    login: loginMutation.mutate,
    loginAsync: loginMutation.mutateAsync,
    isLoggingIn: loginMutation.isPending,
    loginError: loginMutation.error,
    register: registerMutation.mutate,
    registerAsync: registerMutation.mutateAsync,
    isRegistering: registerMutation.isPending,
    registerError: registerMutation.error,
    logout: logoutMutation.mutate,
    isLoggingOut: logoutMutation.isPending,
  };
}

