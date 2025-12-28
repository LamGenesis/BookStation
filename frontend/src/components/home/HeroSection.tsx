'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useQuery } from '@tanstack/react-query';
import { categoriesApi } from '@/lib/api';

const banners = [
  {
    id: 1,
    title: 'Khuyến mãi mùa hè',
    subtitle: 'Giảm đến 50% cho sách văn học',
    bgColor: 'bg-gradient-to-r from-blue-500 to-blue-700',
    link: '/products?categoryId=1',
  },
  {
    id: 2,
    title: 'Sách mới ra mắt',
    subtitle: 'Khám phá bộ sưu tập sách mới nhất',
    bgColor: 'bg-gradient-to-r from-purple-500 to-pink-500',
    link: '/products?sort=newest',
  },
  {
    id: 3,
    title: 'Freeship toàn quốc',
    subtitle: '',
    bgColor: 'bg-gradient-to-r from-green-500 to-teal-500',
    link: '/products',
  },
];

export function HeroSection() {
  const [currentBanner, setCurrentBanner] = useState(0);

  const { data: categories = [] } = useQuery({
    queryKey: ['categories'],
    queryFn: categoriesApi.getAll,
  });

  // Auto rotate banners
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentBanner((prev) => (prev + 1) % banners.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="bg-gray-100 py-4">
      <div className="container mx-auto px-4">
        <div className="flex gap-4">
          {/* Categories Sidebar */}
          <div className="hidden lg:block w-64 shrink-0">
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="bg-blue-600 text-white px-4 py-3 font-semibold">
                <span className="flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                  Danh mục sách
                </span>
              </div>
              <ul className="divide-y divide-gray-100">
                {categories.map((category) => (
                  <li key={category.id}>
                    <Link
                      href={`/products?categoryId=${category.id}`}
                      className="block px-4 py-3 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                    >
                      {category.name}
                    </Link>
                  </li>
                ))}
                <li>
                  <Link
                    href="/products"
                    className="block px-4 py-3 text-blue-600 hover:bg-blue-50 font-medium transition-colors"
                  >
                    Xem tất cả →
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {/* Banner Carousel */}
          <div className="flex-1">
            <div className="relative h-[300px] sm:h-[350px] lg:h-[400px] rounded-lg overflow-hidden">
              {banners.map((banner, index) => (
                <Link
                  key={banner.id}
                  href={banner.link}
                  className={`absolute inset-0 transition-opacity duration-500 ${
                    index === currentBanner ? 'opacity-100 z-10' : 'opacity-0 z-0'
                  }`}
                >
                  <div className={`h-full ${banner.bgColor} flex items-center justify-center`}>
                    <div className="text-center text-white px-4">
                      <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
                        {banner.title}
                      </h2>
                      <p className="text-lg sm:text-xl opacity-90">
                        {banner.subtitle}
                      </p>
                      <span className="inline-block mt-6 bg-white text-blue-600 px-6 py-2 rounded-full font-semibold hover:bg-gray-100 transition-colors">
                        Mua ngay
                      </span>
                    </div>
                  </div>
                </Link>
              ))}

              {/* Banner indicators */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-20">
                {banners.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentBanner(index)}
                    className={`w-3 h-3 rounded-full transition-colors ${
                      index === currentBanner ? 'bg-white' : 'bg-white/50 hover:bg-white/75'
                    }`}
                  />
                ))}
              </div>

              {/* Nav arrows */}
              <button
                onClick={() => setCurrentBanner((prev) => (prev - 1 + banners.length) % banners.length)}
                className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 bg-white/20 hover:bg-white/40 rounded-full flex items-center justify-center text-white transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                onClick={() => setCurrentBanner((prev) => (prev + 1) % banners.length)}
                className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 bg-white/20 hover:bg-white/40 rounded-full flex items-center justify-center text-white transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

