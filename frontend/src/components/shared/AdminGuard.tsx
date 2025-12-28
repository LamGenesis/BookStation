'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store';

interface AdminGuardProps {
  children: React.ReactNode;
}

/**
 * Component to redirect admin users away from customer pages
 * Admin should only access /admin routes
 */
export function AdminGuard({ children }: AdminGuardProps) {
  const router = useRouter();
  const { user, isLoading, checkAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  useEffect(() => {
    if (!isLoading && user?.role === 'Admin') {
      router.replace('/admin');
    }
  }, [user, isLoading, router]);

  // Don't render children if user is admin
  if (!isLoading && user?.role === 'Admin') {
    return null;
  }

  return <>{children}</>;
}

