'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { cartApi } from '@/lib/api';
import { formatCurrency, getImageUrl } from '@/lib/utils';
import { Button } from '@/components/shared/Button';
import { LoadingPage } from '@/components/shared/Loading';
import { useAuthStore, useCartStore } from '@/store';

export default function CartPage() {
  const router = useRouter();
  const { isAuthenticated, user, checkAuth } = useAuthStore();
  const { setServerCart } = useCartStore();

  const { data: cart, isLoading, refetch } = useQuery({
    queryKey: ['cart'],
    queryFn: async () => {
      const data = await cartApi.get();
      setServerCart(data);
      return data;
    },
    enabled: isAuthenticated,
  });

  const { isLoading: authLoading } = useAuthStore();

  // Kiểm tra auth khi mount để tránh redirect sai khi reload
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  // Redirect to login nếu chắc chắn chưa đăng nhập (sau khi auth state được hydrate)
  // Redirect admin to admin panel
  useEffect(() => {
    // Don't redirect while auth state is still loading
    if (authLoading) return;
    
    if (user?.role === 'Admin') {
      router.replace('/admin');
      return;
    }
    
    if (!isAuthenticated) {
      router.push('/login?redirect=/cart');
    }
  }, [isAuthenticated, user, authLoading, router]);

  // Show loading while checking auth or if not authenticated yet
  if (authLoading || !isAuthenticated) {
    return <LoadingPage />;
  }

  if (isLoading) {
    return <LoadingPage />;
  }

  const items = cart?.items || [];
  const totalAmount = cart?.totalAmount || 0;
  const totalQuantity = cart?.totalQuantity || 0;

  return (
    <div className="bg-gray-50 min-h-screen py-6">
      <div className="container mx-auto px-4">
        {/* Breadcrumb */}
        <nav className="mb-6 text-sm text-gray-500">
          <Link href="/" className="hover:text-blue-600">Trang chủ</Link>
          <span className="mx-2">/</span>
          <span className="text-gray-800">Giỏ hàng</span>
        </nav>

        <h1 className="text-2xl font-bold text-gray-800 mb-6">
          Giỏ hàng của bạn ({totalQuantity} sản phẩm)
        </h1>

        {items.length === 0 ? (
          <EmptyCart />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {items.map((item) => (
                <CartItem key={item.id} item={item} onUpdate={refetch} />
              ))}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-sm p-6 sticky top-24">
                <h2 className="text-lg font-bold text-gray-800 mb-4">
                  Tổng đơn hàng
                </h2>
                
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-gray-600">
                    <span>Tạm tính ({totalQuantity} sản phẩm)</span>
                    <span>{formatCurrency(totalAmount)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Phí vận chuyển</span>
                    <span className="text-green-600">Miễn phí</span>
                  </div>
                  <hr />
                  <div className="flex justify-between text-lg font-bold">
                    <span>Tổng cộng</span>
                    <span className="text-red-600">{formatCurrency(totalAmount)}</span>
                  </div>
                </div>

                <Button
                  onClick={() => router.push('/checkout')}
                  className="w-full"
                  size="lg"
                >
                  Tiến hành thanh toán
                </Button>

                <Link
                  href="/products"
                  className="block text-center text-blue-600 hover:text-blue-700 mt-4"
                >
                  ← Tiếp tục mua sắm
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function EmptyCart() {
  return (
    <div className="bg-white rounded-lg shadow-sm p-12 text-center">
      <svg
        className="mx-auto h-16 w-16 text-gray-300"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
        />
      </svg>
      <h2 className="mt-4 text-xl font-semibold text-gray-800">
        Giỏ hàng trống
      </h2>
      <p className="mt-2 text-gray-500">
        Hãy thêm sản phẩm vào giỏ hàng để tiếp tục mua sắm
      </p>
      <Link href="/products">
        <Button className="mt-6">
          Khám phá sản phẩm
        </Button>
      </Link>
    </div>
  );
}

import { CartItem as CartItemType } from '@/types';
import { useMutation, useQueryClient } from '@tanstack/react-query';

function CartItem({ item, onUpdate }: { item: CartItemType; onUpdate: () => void }) {
  const queryClient = useQueryClient();

  const updateMutation = useMutation({
    mutationFn: ({ id, quantity }: { id: number; quantity: number }) =>
      cartApi.updateItem(id, { quantity }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
      onUpdate();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => cartApi.removeItem(id),
    onMutate: async (id) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['cart'] });

      // Snapshot the previous value
      const previousCart = queryClient.getQueryData(['cart']);

      // Optimistically update the cart by removing the item
      queryClient.setQueryData(['cart'], (oldData: any) => {
        if (!oldData) return oldData;
        return {
          ...oldData,
          items: oldData.items.filter((i: any) => i.id !== id),
          totalQuantity: Math.max(0, oldData.totalQuantity - item.quantity),
          totalAmount: Math.max(0, oldData.totalAmount - item.subtotal),
        };
      });

      // Return a context object with the snapshotted value
      return { previousCart };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
      onUpdate();
    },
    onError: (error, id, context) => {
      // If the mutation fails, use the context returned from onMutate to roll back
      if (context?.previousCart) {
        queryClient.setQueryData(['cart'], context.previousCart);
      }
      queryClient.invalidateQueries({ queryKey: ['cart'] });
      onUpdate();
    },
  });

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity < 1 || newQuantity > item.availableStock) return;
    updateMutation.mutate({ id: item.id, quantity: newQuantity });
  };

  const displayPrice = item.discountPrice || item.unitPrice;

  return (
    <div className="bg-white rounded-lg shadow-sm p-4 flex gap-4">
      {/* Image */}
      <Link href={`/products/${item.productId}`} className="shrink-0">
        <div className="relative w-24 h-24 sm:w-32 sm:h-32 rounded-lg overflow-hidden bg-gray-100">
          <Image
            src={getImageUrl(item.primaryImageUrl)}
            alt={item.productName}
            fill
            className="object-cover"
            sizes="128px"
          />
        </div>
      </Link>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <Link href={`/products/${item.productId}`}>
          <h3 className="font-medium text-gray-800 hover:text-blue-600 line-clamp-2">
            {item.productName}
          </h3>
        </Link>

        <div className="mt-1 flex items-center gap-2">
          <span className="text-red-600 font-bold">
            {formatCurrency(displayPrice)}
          </span>
          {item.discountPrice && (
            <span className="text-gray-400 text-sm line-through">
              {formatCurrency(item.unitPrice)}
            </span>
          )}
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-4">
          {/* Quantity controls */}
          <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
            <button
              onClick={() => handleQuantityChange(item.quantity - 1)}
              disabled={item.quantity <= 1 || updateMutation.isPending}
              className="px-3 py-1 text-gray-600 hover:bg-gray-100 disabled:opacity-50"
            >
              -
            </button>
            <span className="px-4 py-1 border-x border-gray-300">
              {item.quantity}
            </span>
            <button
              onClick={() => handleQuantityChange(item.quantity + 1)}
              disabled={item.quantity >= item.availableStock || updateMutation.isPending}
              className="px-3 py-1 text-gray-600 hover:bg-gray-100 disabled:opacity-50"
            >
              +
            </button>
          </div>

          {/* Remove button */}
          <button
            onClick={() => deleteMutation.mutate(item.id)}
            disabled={deleteMutation.isPending}
            className="text-red-600 hover:text-red-700 text-sm flex items-center gap-1"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            Xóa
          </button>
        </div>

        {/* Stock warning */}
        {item.availableStock < 5 && (
          <p className="mt-2 text-sm text-orange-600">
            Chỉ còn {item.availableStock} sản phẩm
          </p>
        )}
      </div>

      {/* Subtotal */}
      <div className="hidden sm:block text-right">
        <span className="text-lg font-bold text-gray-800">
          {formatCurrency(item.subtotal)}
        </span>
      </div>
    </div>
  );
}

