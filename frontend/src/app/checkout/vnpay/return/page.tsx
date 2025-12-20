'use client';

import { Suspense } from 'react';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/shared/Button';
import { LoadingPage } from '@/components/shared/Loading';
import { formatCurrency } from '@/lib/utils';
import { paymentsApi, ordersApi } from '@/lib/api';

function VNPayReturnContent() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<'loading' | 'success' | 'failed' | 'cancelled'>('loading');
  const [paymentInfo, setPaymentInfo] = useState<{
    orderId: number;
    amount: number;
    transactionId: string;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const processReturn = async () => {
      try {
        // Call backend API to process return
        const queryParams = new URLSearchParams();
        searchParams.forEach((value, key) => {
          queryParams.append(key, value);
        });

        const result = await paymentsApi.processReturn(queryParams);

        if (result.success) {
          // Payment successful
          setStatus('success');
          setPaymentInfo({
            orderId: result.orderId,
            amount: result.amount,
            transactionId: result.transactionId,
          });
        } else {
          // Payment failed or cancelled
          // If cancelled (responseCode = "24"), cancel order and restore cart
          if (result.responseCode === '24' && result.orderId) {
            try {
              await ordersApi.cancel(result.orderId);
              // Invalidate and refetch cart to restore it
              queryClient.invalidateQueries({ queryKey: ['cart'] });
              setStatus('cancelled');
              // Redirect to checkout after a short delay to allow cart to refresh
              setTimeout(() => {
                router.push('/checkout?cancelled=true');
              }, 1500);
            } catch (err: any) {
              console.error('Error cancelling order:', err);
              // Even if cancel fails, still try to restore cart and redirect
              queryClient.invalidateQueries({ queryKey: ['cart'] });
              setError(err?.response?.data?.message || 'Không thể hủy đơn hàng. Vui lòng liên hệ hỗ trợ.');
              setStatus('failed');
              // Still redirect to checkout after delay
              setTimeout(() => {
                router.push('/checkout?cancelled=true');
              }, 2000);
            }
          } else {
            setStatus('failed');
            setError(result.message);
          }
        }
      } catch (err) {
        setStatus('failed');
        setError('Có lỗi xảy ra khi xử lý kết quả thanh toán.');
      }
    };

    processReturn();
  }, [searchParams, router]);

  if (status === 'loading') {
    return <LoadingPage />;
  }

  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-md mx-auto bg-white rounded-lg shadow-sm p-8 text-center">
          {status === 'success' ? (
            <>
              {/* Success Icon */}
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg
                  className="w-10 h-10 text-green-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>

              <h1 className="text-2xl font-bold text-gray-800 mb-2">
                Thanh toán thành công!
              </h1>
              <p className="text-gray-600 mb-6">
                Đơn hàng của bạn đã được thanh toán thành công qua VNPay.
              </p>

              {paymentInfo && (
                <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left">
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-500">Mã đơn hàng:</span>
                    <span className="font-bold text-blue-600">#{paymentInfo.orderId}</span>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-500">Số tiền:</span>
                    <span className="font-bold text-red-600">{formatCurrency(paymentInfo.amount)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Mã giao dịch:</span>
                    <span className="font-mono text-sm">{paymentInfo.transactionId}</span>
                  </div>
                </div>
              )}

              <div className="flex flex-col gap-2">
                {paymentInfo && (
                  <Link href={`/profile/orders/${paymentInfo.orderId}`} className="block">
                    <Button className="w-full">Xem chi tiết đơn hàng</Button>
                  </Link>
                )}
                <Link href="/products" className="block">
                  <Button variant="outline" className="w-full">
                    Tiếp tục mua sắm
                  </Button>
                </Link>
              </div>
            </>
          ) : (
            <>
              {/* Failed Icon */}
              <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg
                  className="w-10 h-10 text-red-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </div>

              <h1 className="text-2xl font-bold text-gray-800 mb-2">
                {status === 'cancelled' ? 'Đã hủy thanh toán' : 'Thanh toán thất bại'}
              </h1>
              <p className="text-gray-600 mb-6">
                {status === 'cancelled'
                  ? 'Bạn đã hủy thanh toán. Đang chuyển hướng...'
                  : error || 'Có lỗi xảy ra trong quá trình thanh toán. Vui lòng thử lại hoặc chọn phương thức thanh toán khác.'}
              </p>

              {status !== 'cancelled' && (
                <div className="space-y-3">
                  <Link href="/checkout">
                    <Button className="w-full">Quay lại thanh toán</Button>
                  </Link>
                  <Link href="/cart">
                    <Button variant="outline" className="w-full">
                      Quay lại giỏ hàng
                    </Button>
                  </Link>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default function VNPayReturnPage() {
  return (
    <Suspense fallback={<LoadingPage />}>
      <VNPayReturnContent />
    </Suspense>
  );
}
