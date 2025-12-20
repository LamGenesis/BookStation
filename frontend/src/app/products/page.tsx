'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { productsApi, categoriesApi } from '@/lib/api';
import { ProductGrid } from '@/components/products/ProductGrid';
import { ProductFilters } from '@/components/products/ProductFilters';
import { Pagination } from '@/components/shared/Pagination';
import { LoadingPage } from '@/components/shared/Loading';

function ProductsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Get params from URL
  const pageParam = searchParams.get('page');
  const searchParam = searchParams.get('search');
  const categoryParam = searchParams.get('categoryId');
  const sortParam = searchParams.get('sort');

  const [page, setPage] = useState(pageParam ? parseInt(pageParam) : 1);
  const [search, setSearch] = useState(searchParam || '');
  const [categoryId, setCategoryId] = useState<number | null>(
    categoryParam ? parseInt(categoryParam) : null
  );
  const [sort, setSort] = useState(sortParam || 'newest');
  const [showFilters, setShowFilters] = useState(false);

  // Fetch categories
  const { data: categories = [] } = useQuery({
    queryKey: ['categories'],
    queryFn: categoriesApi.getAll,
  });

  // Fetch products
  const { data: productsData, isLoading } = useQuery({
    queryKey: ['products', page, search, categoryId, sort],
    queryFn: () =>
      productsApi.getAll({
        page,
        pageSize: 12,
        search: search || undefined,
        categoryId: categoryId || undefined,
        sort,
      }),
  });

  const products = productsData?.items || [];
  const totalPages = productsData?.totalPages || 1;

  // Update URL when filters change
  useEffect(() => {
    const params = new URLSearchParams();
    if (page > 1) params.set('page', page.toString());
    if (search) params.set('search', search);
    if (categoryId) params.set('categoryId', categoryId.toString());
    if (sort !== 'newest') params.set('sort', sort);

    const queryString = params.toString();
    router.replace(`/products${queryString ? `?${queryString}` : ''}`, { scroll: false });
  }, [page, search, categoryId, sort, router]);

  // Reset page when filters change
  const handleCategoryChange = (id: number | null) => {
    setCategoryId(id);
    setPage(1);
  };

  const handleSortChange = (newSort: string) => {
    setSort(newSort);
    setPage(1);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
  };

  return (
    <div className="bg-gray-50 min-h-screen py-6">
      <div className="container mx-auto px-4">
        {/* Breadcrumb */}
        <nav className="mb-6 text-sm text-gray-500">
          <a href="/" className="hover:text-blue-600">Trang chủ</a>
          <span className="mx-2">/</span>
          <span className="text-gray-800">Sản phẩm</span>
          {categoryId && categories.find(c => c.id === categoryId) && (
            <>
              <span className="mx-2">/</span>
              <span className="text-gray-800">
                {categories.find(c => c.id === categoryId)?.name}
              </span>
            </>
          )}
        </nav>

        <div className="flex gap-6">
          {/* Filters Sidebar - Desktop */}
          <div className="hidden lg:block w-64 shrink-0">
            <ProductFilters
              categories={categories}
              selectedCategory={categoryId}
              selectedSort={sort}
              onCategoryChange={handleCategoryChange}
              onSortChange={handleSortChange}
            />
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Header */}
            <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
              <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                <div>
                  <h1 className="text-xl font-bold text-gray-800">
                    {search ? `Kết quả tìm kiếm: "${search}"` : 'Tất cả sản phẩm'}
                  </h1>
                  <p className="text-gray-500 text-sm mt-1">
                    {productsData?.totalItems || 0} sản phẩm
                  </p>
                </div>

                {/* Search & Filter buttons */}
                <div className="flex gap-3 w-full sm:w-auto">
                  {/* Search input */}
                  <form onSubmit={handleSearch} className="flex-1 sm:flex-none">
                    <div className="relative">
                      <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Tìm kiếm..."
                        className="w-full sm:w-64 px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <button
                        type="submit"
                        className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-blue-600"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                      </button>
                    </div>
                  </form>

                  {/* Mobile filter button */}
                  <button
                    onClick={() => setShowFilters(!showFilters)}
                    className="lg:hidden px-4 py-2 border border-gray-300 rounded-lg flex items-center gap-2 hover:bg-gray-50"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                    </svg>
                    Bộ lọc
                  </button>
                </div>
              </div>

              {/* Mobile Filters */}
              {showFilters && (
                <div className="lg:hidden mt-4 pt-4 border-t">
                  <ProductFilters
                    categories={categories}
                    selectedCategory={categoryId}
                    selectedSort={sort}
                    onCategoryChange={(id) => {
                      handleCategoryChange(id);
                      setShowFilters(false);
                    }}
                    onSortChange={(s) => {
                      handleSortChange(s);
                      setShowFilters(false);
                    }}
                  />
                </div>
              )}
            </div>

            {/* Products Grid */}
            <ProductGrid products={products} isLoading={isLoading} skeletonCount={12} />

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-8">
                <Pagination
                  currentPage={page}
                  totalPages={totalPages}
                  onPageChange={setPage}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<LoadingPage />}>
      <ProductsContent />
    </Suspense>
  );
}
