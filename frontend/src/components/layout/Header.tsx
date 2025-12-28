'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react';
import { useAuth } from '@/hooks/useAuth';
import { useCart } from '@/hooks/useCart';

export function Header() {
  const router = useRouter();
  const { user, isAuthenticated, logout, checkAuth } = useAuth();
  const { totalQuantity } = useCart();
  const [searchQuery, setSearchQuery] = useState('');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    checkAuth();
  }, [checkAuth]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <header className="bg-blue-600 text-white shadow-md sticky top-0 z-50">
      {/* Top bar */}
      <div className="bg-blue-700 py-1">
        <div className="container mx-auto px-4 flex justify-between items-center text-sm">
          <span>Chào mừng đến với BookStation</span>
          <div className="flex gap-4">
            <span>Hotline: 1900 1234</span>
          </div>
        </div>
      </div>

      {/* Main header */}
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center gap-6">
          {/* Logo */}
          {mounted && user?.role !== 'Admin' ? (
            <Link
              href="/"
              className="flex items-center gap-2 shrink-0 text-white hover:text-white hover:bg-blue-700 px-3 py-2 rounded-lg transition-colors"
            >
              <svg
                className="w-10 h-10"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span className="text-2xl font-bold">BookStation</span>
            </Link>
          ) : (
            <div className="flex items-center gap-2 shrink-0 text-white px-3 py-2">
              <svg
                className="w-10 h-10"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span className="text-2xl font-bold">BookStation</span>
            </div>
          )}

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="flex-1 max-w-2xl">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Tìm kiếm sách..."
                className="w-full px-4 py-2.5 pr-12 rounded-lg border-2 border-gray-300 bg-white text-gray-900 placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-gray-700 hover:text-blue-600"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </button>
            </div>
          </form>

          {/* Cart & Account */}
          <div className="flex items-center gap-4">
            {/* Cart - Hidden for Admin */}
            {mounted && user?.role !== 'Admin' && (
              <Link
                href="/cart"
                className="flex items-center gap-2 text-white hover:text-white hover:bg-blue-700 px-3 py-2 rounded-lg transition-colors"
              >
              <div className="relative">
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
                {mounted && totalQuantity > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {totalQuantity > 99 ? '99+' : totalQuantity}
                  </span>
                )}
              </div>
              <span className="hidden sm:inline">Giỏ hàng</span>
            </Link>
            )}

            {/* Account */}
            {mounted && isAuthenticated ? (
              <Menu as="div" className="relative">
                <MenuButton className="flex items-center gap-2 text-white hover:text-white hover:bg-blue-700 px-3 py-2 rounded-lg transition-colors">
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                  <span className="hidden sm:inline max-w-[100px] truncate">
                    {user?.fullName || user?.email}
                  </span>
                </MenuButton>
                <MenuItems className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-1 text-gray-800 z-50">
                  <MenuItem>
                    {({ focus }) => (
                      <Link
                        href="/profile"
                        className={`block px-4 py-2 ${focus ? 'bg-gray-100' : ''}`}
                      >
                        Tài khoản của tôi
                      </Link>
                    )}
                  </MenuItem>
                  {user?.role !== 'Admin' && (
                  <MenuItem>
                    {({ focus }) => (
                      <Link
                        href="/profile/orders"
                        className={`block px-4 py-2 ${focus ? 'bg-gray-100' : ''}`}
                      >
                        Đơn hàng của tôi
                      </Link>
                    )}
                  </MenuItem>
                  )}
                  {user?.role === 'Admin' && (
                    <MenuItem>
                      {({ focus }) => (
                        <Link
                          href="/admin"
                          className={`block px-4 py-2 ${focus ? 'bg-gray-100' : ''}`}
                        >
                          Quản trị
                        </Link>
                      )}
                    </MenuItem>
                  )}
                  <hr className="my-1" />
                  <MenuItem>
                    {({ focus }) => (
                      <button
                        onClick={() => logout()}
                        className={`block w-full text-left px-4 py-2 text-red-600 ${focus ? 'bg-gray-100' : ''}`}
                      >
                        Đăng xuất
                      </button>
                    )}
                  </MenuItem>
                </MenuItems>
              </Menu>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  href="/login"
                  className="hover:bg-blue-700 px-3 py-2 rounded-lg transition-colors"
                >
                  Đăng nhập
                </Link>
                <Link
                  href="/register"
                  className="bg-yellow-400 text-gray-900 px-4 py-2 rounded-lg font-semibold hover:bg-yellow-300 transition-colors shadow-sm"
                >
                  Đăng ký
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

