'use client';

import { QueryClientProvider } from '@tanstack/react-query';
import { getQueryClient } from './queryClient';
import { ToastProvider } from '@/components/shared/Toast';

export function Providers({ children }: { children: React.ReactNode }) {
  const queryClient = getQueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <ToastProvider>
        {children}
      </ToastProvider>
    </QueryClientProvider>
  );
}
