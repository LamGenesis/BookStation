'use client';

import { ReactNode, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';

interface AdminLayoutProps {
  children: ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, isAuthenticated, isLoading, checkAuth } = useAuth();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  useEffect(() => {
    if (isLoading) return;

    if (!isAuthenticated || user?.role !== 'Admin') {
      router.replace('/login');
    }
  }, [isAuthenticated, isLoading, user, router]);

  const navItems = [
    { href: '/admin', label: 'Dashboard' },
    { href: '/admin/products', label: 'Sản phẩm' },
    { href: '/admin/categories', label: 'Danh mục' },
    { href: '/admin/orders', label: 'Đơn hàng' },
    { href: '/admin/posts', label: 'Bài viết' },
  ];

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <aside className="hidden md:flex w-64 flex-col bg-white border-r border-gray-200">
        <div className="h-16 flex items-center px-6 border-b border-gray-200">
          <span className="text-lg font-semibold text-blue-700">Admin Panel</span>
        </div>
        <nav className="flex-1 px-3 py-4 space-y-1">
          {navItems.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center px-3 py-2 rounded-lg text-sm font-medium ${
                  active
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-700 hover:bg-blue-50'
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        {/* Topbar */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 md:px-6">
          <div>
            <h1 className="text-lg font-semibold text-gray-900">Khu vực quản trị</h1>
            <p className="text-xs text-gray-500 hidden sm:block">
              Quản lý sản phẩm, đơn hàng, danh mục và bài viết
            </p>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <span className="hidden sm:inline text-gray-700">
              {user?.fullName || user?.email || 'Admin'}
            </span>
            <Link
              href="/"
              className="px-3 py-1.5 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50 text-xs sm:text-sm"
            >
              Về trang khách
            </Link>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 p-4 md:p-6">
          {isLoading ? (
            <div className="flex items-center justify-center h-64 text-gray-500 text-sm">
              Đang kiểm tra phiên đăng nhập...
            </div>
          ) : (
            children
          )}
        </main>
      </div>
    </div>
  );
}


