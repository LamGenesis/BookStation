'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { adminUsersApi } from '@/lib/api/admin';
import type { UserSummary, UserDetail } from '@/lib/api/admin';

export default function AdminUsersPage() {
  const [selectedUser, setSelectedUser] = useState<UserDetail | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  const { data: users, isLoading, isError } = useQuery({
    queryKey: ['admin-users'],
    queryFn: adminUsersApi.getAll,
  });

  const handleViewDetail = async (userId: number) => {
    try {
      const userDetail = await adminUsersApi.getById(userId);
      setSelectedUser(userDetail);
      setIsDetailModalOpen(true);
    } catch (error) {
      console.error('Failed to fetch user detail:', error);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Quản lý người dùng</h2>
        <p className="text-sm text-gray-600 mt-1">
          Danh sách tất cả người dùng trong hệ thống.
        </p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr className="text-left text-gray-600">
                <th className="px-4 py-3">ID</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Họ tên</th>
                <th className="px-4 py-3">Vai trò</th>
                <th className="px-4 py-3 text-right">Tổng đơn</th>
                <th className="px-4 py-3 text-right">Tổng chi tiêu</th>
                <th className="px-4 py-3">Ngày tạo</th>
                <th className="px-4 py-3 text-center">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {isLoading && (
                <tr>
                  <td colSpan={8} className="px-4 py-6 text-center text-gray-500">
                    Đang tải danh sách người dùng...
                  </td>
                </tr>
              )}
              {isError && !isLoading && (
                <tr>
                  <td colSpan={8} className="px-4 py-6 text-center text-red-600">
                    Không tải được danh sách người dùng.
                  </td>
                </tr>
              )}
              {!isLoading && !isError && (!users || users.length === 0) && (
                <tr>
                  <td colSpan={8} className="px-4 py-6 text-center text-gray-500">
                    Chưa có người dùng nào.
                  </td>
                </tr>
              )}
              {!isLoading &&
                !isError &&
                users &&
                users.map((user: UserSummary) => (
                  <tr key={user.id} className="border-t border-gray-100 hover:bg-gray-50">
                    <td className="px-4 py-3 text-gray-700">{user.id}</td>
                    <td className="px-4 py-3 text-gray-900">{user.email}</td>
                    <td className="px-4 py-3 text-gray-700">{user.fullName || '-'}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          user.role === 'Admin'
                            ? 'bg-purple-100 text-purple-700'
                            : 'bg-blue-100 text-blue-700'
                        }`}
                      >
                        {user.role === 'Admin' ? 'Quản trị viên' : 'Khách hàng'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right text-gray-700">{user.totalOrders}</td>
                    <td className="px-4 py-3 text-right text-gray-900">
                      {user.totalSpent.toLocaleString('vi-VN')} ₫
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      {new Date(user.createdAt).toLocaleDateString('vi-VN')}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <button
                        onClick={() => handleViewDetail(user.id)}
                        className="text-blue-600 hover:text-blue-700 font-medium text-sm"
                      >
                        Xem chi tiết
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail Modal */}
      {isDetailModalOpen && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900">Chi tiết người dùng</h3>
                <button
                  onClick={() => {
                    setIsDetailModalOpen(false);
                    setSelectedUser(null);
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">ID</label>
                    <p className="text-gray-900">{selectedUser.id}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">Email</label>
                    <p className="text-gray-900">{selectedUser.email}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">Họ tên</label>
                    <p className="text-gray-900">{selectedUser.fullName || '-'}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">Vai trò</label>
                    <span
                      className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        selectedUser.role === 'Admin'
                          ? 'bg-purple-100 text-purple-700'
                          : 'bg-blue-100 text-blue-700'
                      }`}
                    >
                      {selectedUser.role === 'Admin' ? 'Quản trị viên' : 'Khách hàng'}
                    </span>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">Ngày tạo</label>
                    <p className="text-gray-900">
                      {new Date(selectedUser.createdAt).toLocaleString('vi-VN')}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">
                      Tổng đơn hàng
                    </label>
                    <p className="text-gray-900">{selectedUser.totalOrders}</p>
                  </div>
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-500 mb-1">
                      Tổng chi tiêu
                    </label>
                    <p className="text-gray-900 text-lg font-semibold">
                      {selectedUser.totalSpent.toLocaleString('vi-VN')} ₫
                    </p>
                  </div>
                </div>

                {selectedUser.recentOrders && selectedUser.recentOrders.length > 0 && (
                  <div className="mt-6">
                    <h4 className="text-sm font-semibold text-gray-900 mb-3">Đơn hàng gần đây</h4>
                    <div className="border border-gray-200 rounded-lg overflow-hidden">
                      <table className="min-w-full text-sm">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-4 py-2 text-left text-gray-600">ID</th>
                            <th className="px-4 py-2 text-left text-gray-600">Ngày đặt</th>
                            <th className="px-4 py-2 text-right text-gray-600">Tổng tiền</th>
                            <th className="px-4 py-2 text-center text-gray-600">Trạng thái</th>
                            <th className="px-4 py-2 text-center text-gray-600">Thanh toán</th>
                          </tr>
                        </thead>
                        <tbody>
                          {selectedUser.recentOrders.map((order) => (
                            <tr key={order.id} className="border-t border-gray-100">
                              <td className="px-4 py-2 text-gray-700">#{order.id}</td>
                              <td className="px-4 py-2 text-gray-700">
                                {new Date(order.createdAt).toLocaleDateString('vi-VN')}
                              </td>
                              <td className="px-4 py-2 text-right text-gray-900">
                                {order.totalAmount.toLocaleString('vi-VN')} ₫
                              </td>
                              <td className="px-4 py-2 text-center">
                                <span
                                  className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                                    order.status === 'Completed'
                                      ? 'bg-green-100 text-green-700'
                                      : order.status === 'Processing'
                                        ? 'bg-yellow-100 text-yellow-700'
                                        : order.status === 'Cancelled'
                                          ? 'bg-red-100 text-red-700'
                                          : 'bg-gray-100 text-gray-700'
                                  }`}
                                >
                                  {order.status}
                                </span>
                              </td>
                              <td className="px-4 py-2 text-center">
                                <span
                                  className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                                    order.paymentStatus === 'Paid'
                                      ? 'bg-green-100 text-green-700'
                                      : 'bg-gray-100 text-gray-700'
                                  }`}
                                >
                                  {order.paymentStatus === 'Paid' ? 'Đã thanh toán' : 'Chưa thanh toán'}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>

              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => {
                    setIsDetailModalOpen(false);
                    setSelectedUser(null);
                  }}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Đóng
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

