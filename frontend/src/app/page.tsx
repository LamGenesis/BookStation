import { HeroSection } from '@/components/home/HeroSection';
import { PolicyBar } from '@/components/layout/PolicyBar';
import { NewArrivals } from '@/components/home/NewArrivals';
import { BlogSection } from '@/components/home/BlogSection';

export default function HomePage() {
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
