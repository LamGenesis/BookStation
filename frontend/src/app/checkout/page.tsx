'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { cartApi, ordersApi, paymentsApi } from '@/lib/api';
import { shippingSchema, ShippingFormData } from '@/lib/validations/checkout';
import { formatCurrency, getImageUrl } from '@/lib/utils';
import { Button } from '@/components/shared/Button';
import { LoadingPage } from '@/components/shared/Loading';
import { useAuthStore, useCartStore } from '@/store';
import { AxiosError } from 'axios';

const paymentMethods = [
  { id: 'COD', name: 'Thanh toán khi nhận hàng (COD)', icon: '💵' },
  { id: 'Banking', name: 'Thanh toán qua VNPay (Chuyển khoản ngân hàng)', icon: '💳' },
];

export default function CheckoutPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { isAuthenticated, user, checkAuth } = useAuthStore();
  const { setServerCart, clearServerCart } = useCartStore();
  const [paymentMethod, setPaymentMethod] = useState('COD');
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<ShippingFormData>({
    resolver: zodResolver(shippingSchema),
  });

  // Pre-fill name if available
  useEffect(() => {
    if (user?.fullName) {
      setValue('receiverName', user.fullName);
    }
  }, [user, setValue]);

  // Fetch cart
  const { data: cart, isLoading: isLoadingCart, refetch: refetchCart } = useQuery({
    queryKey: ['cart'],
    queryFn: async () => {
      const data = await cartApi.get();
      setServerCart(data);
      return data;
    },
    enabled: isAuthenticated,
  });

  // Create order mutation
  const createOrderMutation = useMutation({
    mutationFn: ordersApi.create,
    onError: (err: AxiosError<{ message: string }>) => {
      setError(err.response?.data?.message || 'Đặt hàng thất bại. Vui lòng thử lại.');
    },
  });

  // Get VNPay URL mutation
  const getVnPayUrlMutation = useMutation({
    mutationFn: paymentsApi.getVnPayUrl,
  });

  // Kiểm tra auth khi mount để tránh redirect sai khi reload
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  // Check for cancelled payment message and refetch cart
  useEffect(() => {
    const cancelled = new URLSearchParams(window.location.search).get('cancelled');
    if (cancelled === 'true') {
      setError('Bạn đã hủy thanh toán. Vui lòng thử lại.');
      // Remove query param from URL
      window.history.replaceState({}, '', '/checkout');
      // Refetch cart to restore it
      if (isAuthenticated) {
        refetchCart();
      }
    }
  }, [queryClient, isAuthenticated, refetchCart]);

  // Redirect to login nếu chắc chắn chưa đăng nhập (sau khi checkAuth chạy)
  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login?redirect=/checkout');
    }
  }, [isAuthenticated, router]);

  // Redirect to cart if empty
  useEffect(() => {
    if (!isLoadingCart && cart && cart.items.length === 0) {
      router.push('/cart');
    }
  }, [isLoadingCart, cart, router]);

  if (!isAuthenticated || isLoadingCart) {
    return <LoadingPage />;
  }

  const items = cart?.items || [];
  const totalAmount = cart?.totalAmount || 0;

  const onSubmit = async (data: ShippingFormData) => {
    setError(null);
    
    try {
      // Create order
      const order = await createOrderMutation.mutateAsync({
        shippingInfo: data,
        paymentMethod,
      });

      // Clear cart after successful order creation (backend already clears it, but we clear frontend state too)
      clearServerCart();

      // If VNPay (mapped as Banking), redirect to payment
      if (paymentMethod === 'Banking') {
        const { paymentUrl } = await getVnPayUrlMutation.mutateAsync({
          orderId: order.id,
        });
        window.location.href = paymentUrl;
      } else {
        // Redirect to success page
        router.push(`/checkout/success?orderId=${order.id}`);
      }
    } catch {
      // Error is handled by mutation onError
    }
  };

  const isSubmitting = createOrderMutation.isPending || getVnPayUrlMutation.isPending;

  return (
    <div className="bg-gray-50 min-h-screen py-6">
      <div className="container mx-auto px-4">
        {/* Breadcrumb */}
        <nav className="mb-6 text-sm text-gray-500">
          <Link href="/" className="hover:text-blue-600">Trang chủ</Link>
          <span className="mx-2">/</span>
          <Link href="/cart" className="hover:text-blue-600">Giỏ hàng</Link>
          <span className="mx-2">/</span>
          <span className="text-gray-800">Thanh toán</span>
        </nav>

        <h1 className="text-2xl font-bold text-gray-800 mb-6">Thanh toán</h1>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Form Section */}
            <div className="lg:col-span-2 space-y-6">
              {/* Shipping Info */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-lg font-bold text-gray-800 mb-4">
                  Thông tin giao hàng
                </h2>
                <div className="space-y-4">
                  <div>
                    <label htmlFor="receiverName" className="block text-sm font-medium text-gray-700 mb-1">
                      Họ và tên người nhận *
                    </label>
                    <input
                      {...register('receiverName')}
                      type="text"
                      id="receiverName"
                      className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        errors.receiverName ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Nguyễn Văn A"
                    />
                    {errors.receiverName && (
                      <p className="mt-1 text-sm text-red-600">{errors.receiverName.message}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                      Số điện thoại *
                    </label>
                    <input
                      {...register('phone')}
                      type="tel"
                      id="phone"
                      className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        errors.phone ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="0909123456"
                    />
                    {errors.phone && (
                      <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                      Địa chỉ giao hàng *
                    </label>
                    <textarea
                      {...register('address')}
                      id="address"
                      rows={3}
                      className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        errors.address ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Số nhà, tên đường, phường/xã, quận/huyện, tỉnh/thành phố"
                    />
                    {errors.address && (
                      <p className="mt-1 text-sm text-red-600">{errors.address.message}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Payment Method */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-lg font-bold text-gray-800 mb-4">
                  Phương thức thanh toán
                </h2>
                <div className="space-y-3">
                  {paymentMethods.map((method) => (
                    <label
                      key={method.id}
                      className={`flex items-center gap-3 p-4 border rounded-lg cursor-pointer transition-colors ${
                        paymentMethod === method.id
                          ? 'border-blue-600 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <input
                        type="radio"
                        name="paymentMethod"
                        value={method.id}
                        checked={paymentMethod === method.id}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="w-4 h-4 text-blue-600"
                      />
                      <span className="text-2xl">{method.icon}</span>
                      <span className="font-medium">{method.name}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-sm p-6 sticky top-24">
                <h2 className="text-lg font-bold text-gray-800 mb-4">
                  Đơn hàng ({items.length} sản phẩm)
                </h2>

                {/* Items */}
                <div className="max-h-64 overflow-y-auto space-y-3 mb-4">
                  {items.map((item) => (
                    <div key={item.id} className="flex gap-3">
                      <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-gray-100 shrink-0">
                        <Image
                          src={getImageUrl(item.primaryImageUrl)}
                          alt={item.productName}
                          fill
                          className="object-cover"
                          sizes="64px"
                        />
                        <span className="absolute -top-1 -right-1 w-5 h-5 bg-blue-600 text-white text-xs rounded-full flex items-center justify-center">
                          {item.quantity}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-medium text-gray-800 truncate">
                          {item.productName}
                        </h3>
                        <p className="text-sm text-red-600 font-medium">
                          {formatCurrency(item.subtotal)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <hr className="my-4" />

                {/* Totals */}
                <div className="space-y-3">
                  <div className="flex justify-between text-gray-600">
                    <span>Tạm tính</span>
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
                  type="submit"
                  isLoading={isSubmitting}
                  className="w-full mt-6"
                  size="lg"
                >
                  {paymentMethod === 'Banking' ? 'Thanh toán với VNPay' : 'Đặt hàng'}
                </Button>

                <Link
                  href="/cart"
                  className="block text-center text-blue-600 hover:text-blue-700 mt-4"
                >
                  ← Quay lại giỏ hàng
                </Link>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

