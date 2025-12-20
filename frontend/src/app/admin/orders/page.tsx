'use client';

import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { adminOrdersApi, AdminOrderSummary } from '@/lib/api/admin';

export default function AdminOrdersPage() {
  const { data: orders = [], isLoading, isError } = useQuery({
    queryKey: ['admin-orders'],
    queryFn: adminOrdersApi.getAll,
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Quản lý đơn hàng</h2>
          <p className="text-sm text-gray-600 mt-1">
            Xem và xử lý các đơn hàng của khách.
          </p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr className="text-left text-gray-600">
                <th className="px-4 py-2">ID</th>
                <th className="px-4 py-2">Khách hàng</th>
                <th className="px-4 py-2 text-right">Tổng tiền</th>
                <th className="px-4 py-2">Trạng thái đơn</th>
                <th className="px-4 py-2">Thanh toán</th>
                <th className="px-4 py-2">Ngày tạo</th>
                <th className="px-4 py-2 text-right">Chi tiết</th>
              </tr>
            </thead>
            <tbody>
              {isLoading && (
                <tr>
                  <td colSpan={7} className="px-4 py-6 text-center text-gray-500">
                    Đang tải danh sách đơn hàng...
                  </td>
                </tr>
              )}
              {isError && !isLoading && (
                <tr>
                  <td colSpan={7} className="px-4 py-6 text-center text-red-600">
                    Không tải được danh sách đơn hàng.
                  </td>
                </tr>
              )}
              {!isLoading && !isError && orders.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-4 py-6 text-center text-gray-500">
                    Chưa có đơn hàng nào.
                  </td>
                </tr>
              )}
              {!isLoading &&
                !isError &&
                orders.map((o: AdminOrderSummary) => (
                  <tr key={o.id} className="border-t border-gray-100 hover:bg-gray-50">
                    <td className="px-4 py-2 text-gray-700">#{o.id}</td>
                    <td className="px-4 py-2 text-gray-900">
                      {o.userEmail
                        ? o.userFullName
                          ? `${o.userFullName} (${o.userEmail})`
                          : o.userEmail
                        : 'Khách vãng lai'}
                    </td>
                    <td className="px-4 py-2 text-right text-gray-900">
                      {o.totalAmount.toLocaleString('vi-VN')} ₫
                    </td>
                    <td className="px-4 py-2">
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
                        {o.status}
                      </span>
                    </td>
                    <td className="px-4 py-2">
                      <span
                        className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          o.paymentStatus === 'Paid'
                            ? 'bg-green-50 text-green-700'
                            : 'bg-yellow-50 text-yellow-700'
                        }`}
                      >
                        {o.paymentStatus}
                      </span>
                    </td>
                    <td className="px-4 py-2 text-gray-700">
                      {new Date(o.createdAt).toLocaleString('vi-VN')}
                    </td>
                    <td className="px-4 py-2 text-right">
                      <Link
                        href={`/admin/orders/${o.id}`}
                        className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                      >
                        Xem
                      </Link>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}


