import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { User, AuthResponse } from '@/types';
import { getAccessToken, clearTokens } from '@/lib/api/client';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  
  // Actions
  setAuth: (data: AuthResponse) => void;
  logout: () => void;
  setLoading: (loading: boolean) => void;
  checkAuth: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: true,

      setAuth: (data: AuthResponse) => {
        set({
          user: data.user,
          isAuthenticated: true,
          isLoading: false,
        });
      },

      logout: () => {
        clearTokens();
        set({
          user: null,
          isAuthenticated: false,
          isLoading: false,
        });
      },

      setLoading: (loading: boolean) => {
        set({ isLoading: loading });
      },

      checkAuth: () => {
        const token = getAccessToken();
        const currentState = get();
        
        if (!token) {
          set({
            user: null,
            isAuthenticated: false,
            isLoading: false,
          });
        } else {
          // If token exists and user data is persisted, user is authenticated
          set({ 
            isAuthenticated: !!currentState.user,
            isLoading: false 
          });
        }
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
      onRehydrateStorage: () => (state) => {
        // After rehydration, verify token and set loading to false
        if (state) {
          const token = getAccessToken();
          if (token && state.user) {
            state.isAuthenticated = true;
          } else if (!token) {
            state.user = null;
            state.isAuthenticated = false;
          }
          state.isLoading = false;
        }
      },
    }
  )
);

