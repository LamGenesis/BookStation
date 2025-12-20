'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store';
import { Button } from '@/components/shared/Button';
import { LoadingPage } from '@/components/shared/Loading';

export default function ProfilePage() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading, checkAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login?redirect=/profile');
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading || !isAuthenticated) {
    return <LoadingPage />;
  }

  return (
    <div className="bg-gray-50 min-h-screen py-6">
      <div className="container mx-auto px-4">
        {/* Breadcrumb */}
        <nav className="mb-6 text-sm text-gray-500">
          <Link href="/" className="hover:text-blue-600">Trang chủ</Link>
          <span className="mx-2">/</span>
          <span className="text-gray-800">Tài khoản của tôi</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="text-center mb-6">
                <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-3xl text-blue-600 font-bold">
                    {user?.fullName?.charAt(0) || user?.email?.charAt(0) || 'U'}
                  </span>
                </div>
                <h2 className="font-bold text-gray-800">{user?.fullName || 'Người dùng'}</h2>
                <p className="text-sm text-gray-500">{user?.email}</p>
              </div>

              <nav className="space-y-1">
                <Link
                  href="/profile"
                  className="block px-4 py-2 rounded-lg bg-blue-50 text-blue-600 font-medium"
                >
                  Thông tin tài khoản
                </Link>
                {user?.role !== 'Admin' && (
                  <Link
                    href="/profile/orders"
                    className="block px-4 py-2 rounded-lg text-gray-600 hover:bg-gray-50"
                  >
                    Đơn hàng của tôi
                  </Link>
                )}
              </nav>
            </div>
          </div>

          {/* Content */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h1 className="text-xl font-bold text-gray-800 mb-6">
                Thông tin tài khoản
              </h1>

              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">
                      Họ và tên
                    </label>
                    <p className="text-gray-800">{user?.fullName || 'Chưa cập nhật'}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">
                      Email
                    </label>
                    <p className="text-gray-800">{user?.email}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">
                      Vai trò
                    </label>
                    <p className="text-gray-800">
                      {user?.role === 'Admin' ? 'Quản trị viên' : ''}
                    </p>
                  </div>
                </div>
              </div>

              {/* Quick actions */}
              <div className="mt-8 pt-6 border-t">
                <h2 className="font-bold text-gray-800 mb-4">Hành động nhanh</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {user?.role !== 'Admin' && (
                    <Link href="/profile/orders">
                      <div className="p-4 border rounded-lg hover:border-blue-600 hover:bg-blue-50 transition-colors cursor-pointer">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                            <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                            </svg>
                          </div>
                          <div>
                            <h3 className="font-medium text-gray-800">Đơn hàng của tôi</h3>
                            <p className="text-sm text-gray-500">Xem lịch sử đơn hàng</p>
                          </div>
                        </div>
                      </div>
                    </Link>
                  )}
                  <Link href="/products">
                    <div className="p-4 border rounded-lg hover:border-blue-600 hover:bg-blue-50 transition-colors cursor-pointer">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                          <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                          </svg>
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-800">Mua sắm</h3>
                          <p className="text-sm text-gray-500">Khám phá sản phẩm mới</p>
                        </div>
                      </div>
                    </div>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

