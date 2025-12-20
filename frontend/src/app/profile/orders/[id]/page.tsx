'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { ordersApi } from '@/lib/api';
import { formatCurrency, formatDateTime, getImageUrl } from '@/lib/utils';
import { useAuthStore } from '@/store';
import { LoadingPage } from '@/components/shared/Loading';

const statusColors: Record<string, string> = {
  Pending: 'bg-yellow-100 text-yellow-800',
  Processing: 'bg-blue-100 text-blue-800',
  Shipped: 'bg-purple-100 text-purple-800',
  Delivered: 'bg-green-100 text-green-800',
  Cancelled: 'bg-red-100 text-red-800',
};

const paymentStatusColors: Record<string, string> = {
  Pending: 'bg-yellow-100 text-yellow-800',
  Paid: 'bg-green-100 text-green-800',
  Failed: 'bg-red-100 text-red-800',
};

const statusLabels: Record<string, string> = {
  Pending: 'Chờ xác nhận',
  Processing: 'Đang xử lý',
  Shipped: 'Đang giao',
  Delivered: 'Đã giao',
  Cancelled: 'Đã hủy',
};

const paymentStatusLabels: Record<string, string> = {
  Pending: 'Chờ thanh toán',
  Paid: 'Đã thanh toán',
  Failed: 'Thanh toán thất bại',
};

export default function OrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const orderId = parseInt(params.id as string);
  const { isAuthenticated, isLoading: isAuthLoading, checkAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const { data: order, isLoading, error } = useQuery({
    queryKey: ['order', orderId],
    queryFn: () => ordersApi.getById(orderId),
    enabled: isAuthenticated && !isNaN(orderId),
  });

  useEffect(() => {
    if (!isAuthLoading && !isAuthenticated) {
      router.push('/login?redirect=/profile/orders');
    }
  }, [isAuthenticated, isAuthLoading, router]);

  if (isAuthLoading || isLoading) {
    return <LoadingPage />;
  }

  if (error || !order) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Không tìm thấy đơn hàng</h2>
          <p className="text-gray-500 mb-4">Đơn hàng bạn tìm kiếm không tồn tại.</p>
          <Link href="/profile/orders" className="text-blue-600 hover:text-blue-700 font-medium">
            ← Quay lại danh sách đơn hàng
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen py-6">
      <div className="container mx-auto px-4">
        {/* Breadcrumb */}
        <nav className="mb-6 text-sm text-gray-500">
          <Link href="/" className="hover:text-blue-600">Trang chủ</Link>
          <span className="mx-2">/</span>
          <Link href="/profile" className="hover:text-blue-600">Tài khoản</Link>
          <span className="mx-2">/</span>
          <Link href="/profile/orders" className="hover:text-blue-600">Đơn hàng</Link>
          <span className="mx-2">/</span>
          <span className="text-gray-800">#{orderId}</span>
        </nav>

        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-800">
            Chi tiết đơn hàng #{orderId}
          </h1>
          <div className="flex gap-2">
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusColors[order.status] || 'bg-gray-100 text-gray-800'}`}>
              {statusLabels[order.status] || order.status}
            </span>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${paymentStatusColors[order.paymentStatus] || 'bg-gray-100 text-gray-800'}`}>
              {paymentStatusLabels[order.paymentStatus] || order.paymentStatus}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Order Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Items */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-bold text-gray-800 mb-4">
                Sản phẩm ({order.items.length})
              </h2>
              <div className="divide-y">
                {order.items.map((item) => (
                  <div key={item.id} className="py-4 first:pt-0 last:pb-0 flex gap-4">
                    <Link href={`/products/${item.productId}`}>
                      <div className="relative w-20 h-20 rounded-lg overflow-hidden bg-gray-100 shrink-0">
                        <Image
                          src={getImageUrl(item.productImageUrl)}
                          alt={item.productName}
                          fill
                          className="object-cover"
                          sizes="80px"
                        />
                      </div>
                    </Link>
                    <div className="flex-1">
                      <Link href={`/products/${item.productId}`}>
                        <h3 className="font-medium text-gray-800 hover:text-blue-600">
                          {item.productName}
                        </h3>
                      </Link>
                      <p className="text-sm text-gray-500 mt-1">
                        {formatCurrency(item.unitPrice)} x {item.quantity}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-gray-800">
                        {formatCurrency(item.subtotal)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Shipping Info */}
            {order.shippingInfo && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-lg font-bold text-gray-800 mb-4">
                  Thông tin giao hàng
                </h2>
                <div className="space-y-2">
                  <div className="flex">
                    <span className="text-gray-500 w-32">Người nhận:</span>
                    <span className="text-gray-800 font-medium">{order.shippingInfo.receiverName}</span>
                  </div>
                  <div className="flex">
                    <span className="text-gray-500 w-32">Số điện thoại:</span>
                    <span className="text-gray-800">{order.shippingInfo.phone}</span>
                  </div>
                  <div className="flex">
                    <span className="text-gray-500 w-32">Địa chỉ:</span>
                    <span className="text-gray-800">{order.shippingInfo.address}</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-24">
              <h2 className="text-lg font-bold text-gray-800 mb-4">
                Tổng đơn hàng
              </h2>

              <div className="space-y-3">
                <div className="flex justify-between text-gray-600">
                  <span>Ngày đặt hàng</span>
                  <span>{formatDateTime(order.createdAt)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Số lượng sản phẩm</span>
                  <span>{order.items.length}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Phí vận chuyển</span>
                  <span className="text-green-600">Miễn phí</span>
                </div>
                <hr />
                <div className="flex justify-between text-lg font-bold">
                  <span>Tổng cộng</span>
                  <span className="text-red-600">{formatCurrency(order.totalAmount)}</span>
                </div>
              </div>

              <Link href="/profile/orders">
                <button className="w-full mt-6 px-4 py-2 border border-gray-300 text-gray-600 rounded-lg hover:bg-gray-50">
                  ← Quay lại danh sách đơn hàng
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

