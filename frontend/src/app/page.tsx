'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store';
import { HeroSection } from '@/components/home/HeroSection';
import { PolicyBar } from '@/components/layout/PolicyBar';
import { NewArrivals } from '@/components/home/NewArrivals';
import { BlogSection } from '@/components/home/BlogSection';

export default function HomePage() {
  const router = useRouter();
  const { user, isLoading, checkAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  useEffect(() => {
    // Redirect admin to admin panel
    if (!isLoading && user?.role === 'Admin') {
      router.replace('/admin');
    }
  }, [user, isLoading, router]);

  // Don't render if admin
  if (!isLoading && user?.role === 'Admin') {
    return null;
  }

  return (
    <>
      {/* 1. Hero Section - Banner + Categories sidebar */}
      <HeroSection />

      {/* 2. Policy Bar - 4 cam kết */}
      <PolicyBar />

      {/* 3. New Arrivals - Sách mới */}
      <NewArrivals />

      {/* 4. Blog Section - Góc đọc sách */}
      <BlogSection />
    </>
  );
}
