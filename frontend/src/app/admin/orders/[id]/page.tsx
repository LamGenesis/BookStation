'use client';

import { useRouter, useParams } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ordersApi } from '@/lib/api';
import { adminOrdersApi, UpdateOrderStatusRequest } from '@/lib/api/admin';
import type { OrderDetail } from '@/types';
import { Button } from '@/components/shared/Button';
import { useToast } from '@/components/shared/Toast';

const ORDER_STATUSES = ['Pending', 'Confirmed', 'Processing', 'Shipping', 'Delivered', 'Cancelled'];

export default function AdminOrderDetailPage() {
  const router = useRouter();
  const params = useParams();
  const queryClient = useQueryClient();
  const { addToast } = useToast();

  const id = Number(params?.id);

  const { data: order, isLoading, isError } = useQuery<OrderDetail | null>({
    queryKey: ['admin-order', id],
    queryFn: () => ordersApi.getById(id),
    enabled: !!id,
  });

  const updateMutation = useMutation({
    mutationFn: (data: UpdateOrderStatusRequest) => adminOrdersApi.updateStatus(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-order', id] });
      queryClient.invalidateQueries({ queryKey: ['admin-orders'] });
      addToast('Cập nhật trạng thái đơn hàng thành công', 'success');
    },
    onError: () => {
      addToast('Cập nhật trạng thái đơn hàng thất bại', 'error');
    },
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-500 text-sm">
        Đang tải chi tiết đơn hàng...
      </div>
    );
  }

  if (isError || !order) {
    return (
      <div className="space-y-4">
        <p className="text-red-600 text-sm">Không tìm thấy đơn hàng.</p>
        <Button variant="outline" size="sm" onClick={() => router.push('/admin/orders')}>
          Quay lại danh sách
        </Button>
      </div>
    );
  }

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newStatus = e.target.value;
    updateMutation.mutate({ status: newStatus });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            Đơn hàng #{order.id}
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            Ngày tạo: {new Date(order.createdAt).toLocaleString('vi-VN')}
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={() => router.push('/admin/orders')}>
          Quay lại
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
            <h3 className="text-sm font-semibold text-gray-800 mb-3">Sản phẩm</h3>
            <div className="divide-y divide-gray-100">
              {order.items.map((item) => (
                <div key={item.id} className="py-3 flex items-center gap-4">
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{item.productName}</p>
                    <p className="text-xs text-gray-500">
                      Đơn giá: {item.unitPrice.toLocaleString('vi-VN')} ₫
                    </p>
                    <p className="text-xs text-gray-500">
                      Số lượng: {item.quantity}
                    </p>
                  </div>
                  <div className="text-right text-sm font-semibold text-gray-900">
                    {item.subtotal.toLocaleString('vi-VN')} ₫
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 space-y-3">
            <h3 className="text-sm font-semibold text-gray-800">Thông tin đơn hàng</h3>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Tổng tiền</span>
              <span className="font-semibold text-gray-900">
                {order.totalAmount.toLocaleString('vi-VN')} ₫
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Trạng thái</span>
              <span className="font-medium text-blue-700">{order.status}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Thanh toán</span>
              <span className="font-medium text-green-700">{order.paymentStatus}</span>
            </div>
            <div className="text-sm">
              <label className="block text-gray-600 mb-1">
                Cập nhật trạng thái đơn hàng
              </label>
              <select
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                value={order.status}
                onChange={handleStatusChange}
              >
                {ORDER_STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 space-y-3">
            <h3 className="text-sm font-semibold text-gray-800">Thông tin giao hàng</h3>
            {order.shippingInfo ? (
              <div className="text-sm text-gray-700 space-y-1">
                <p>
                  <span className="font-medium">Người nhận:</span>{' '}
                  {order.shippingInfo.receiverName}
                </p>
                <p>
                  <span className="font-medium">SĐT:</span> {order.shippingInfo.phone}
                </p>
                <p>
                  <span className="font-medium">Địa chỉ:</span>{' '}
                  {order.shippingInfo.address}
                </p>
              </div>
            ) : (
              <p className="text-sm text-gray-500">Chưa có thông tin giao hàng.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}


