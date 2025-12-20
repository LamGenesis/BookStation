'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { productsApi, categoriesApi } from '@/lib/api';
import { ProductGrid } from '@/components/products/ProductGrid';

export function NewArrivals() {
  const [activeTab, setActiveTab] = useState<number | null>(null);

  const { data: categories = [] } = useQuery({
    queryKey: ['categories'],
    queryFn: categoriesApi.getAll,
  });

  const { data: productsData, isLoading } = useQuery({
    queryKey: ['products', 'new-arrivals', activeTab],
    queryFn: () =>
      productsApi.getAll({
        page: 1,
        pageSize: 8,
        categoryId: activeTab || undefined,
        sort: 'newest',
      }),
  });

  const products = productsData?.items || [];
  const tabs = [{ id: null, name: 'Tất cả' }, ...categories.slice(0, 4)];

  return (
    <section className="py-10 bg-white">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <span className="w-1 h-8 bg-blue-600 rounded"></span>
            Sách Mới Nhất
          </h2>

          {/* Tabs */}
          <div className="flex gap-2 overflow-x-auto pb-2 sm:pb-0">
            {tabs.map((tab) => (
              <button
                key={tab.id ?? 'all'}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                  activeTab === tab.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {tab.name}
              </button>
            ))}
          </div>
        </div>

        {/* Products Grid */}
        <ProductGrid products={products} isLoading={isLoading} skeletonCount={8} />

        {/* View All Link */}
        <div className="text-center mt-8">
          <Link
            href="/products"
            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium"
          >
            Xem tất cả sản phẩm
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}

