'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { adminStatisticsApi, SalesStatisticItem } from '@/lib/api/admin';

function getDefaultDateRange() {
  const to = new Date();
  const from = new Date();
  from.setDate(to.getDate() - 6);
  const fmt = (d: Date) => d.toISOString().slice(0, 10);
  return { from: fmt(from), to: fmt(to) };
}

export default function AdminDashboardPage() {
  const initialRange = getDefaultDateRange();
  const [from, setFrom] = useState(initialRange.from);
  const [to, setTo] = useState(initialRange.to);

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['admin-sales', { from, to }],
    queryFn: () => adminStatisticsApi.getSales(from, to),
  });

  const handleApply = (e: React.FormEvent) => {
    e.preventDefault();
    refetch();
  };

  const stats = data;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Dashboard</h2>
        <p className="text-sm text-gray-600 mt-1">
          Tổng quan doanh thu và đơn hàng theo khoảng thời gian.
        </p>
      </div>

      <form onSubmit={handleApply} className="flex flex-wrap items-end gap-4 bg-white p-4 rounded-xl border border-gray-200">
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Từ ngày</label>
          <input
            type="date"
            value={from}
            onChange={(e) => setFrom(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-1.5 text-sm"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Đến ngày</label>
          <input
            type="date"
            value={to}
            onChange={(e) => setTo(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-1.5 text-sm"
          />
        </div>
        <button
          type="submit"
          className="px-4 py-2 rounded-md bg-blue-600 text-white text-sm font-medium hover:bg-blue-700"
        >
          Áp dụng
        </button>
      </form>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <h3 className="text-sm font-medium text-gray-500">Tổng doanh thu</h3>
          <p className="mt-2 text-2xl font-semibold text-gray-900">
            {stats ? stats.totalRevenue.toLocaleString('vi-VN') + ' ₫' : '-'}
          </p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <h3 className="text-sm font-medium text-gray-500">Tổng số đơn</h3>
          <p className="mt-2 text-2xl font-semibold text-gray-900">
            {stats ? stats.totalOrders : '-'}
          </p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <h3 className="text-sm font-medium text-gray-500">Tổng khách hàng</h3>
          <p className="mt-2 text-2xl font-semibold text-gray-900">
            {stats ? stats.totalCustomers : '-'}
          </p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 space-y-6">
        <h3 className="text-base font-semibold text-gray-900">Doanh thu theo ngày</h3>
        {isLoading && <p className="text-sm text-gray-500">Đang tải dữ liệu...</p>}
        {isError && (
          <p className="text-sm text-red-600">
            Không tải được dữ liệu thống kê. Vui lòng thử lại.
          </p>
        )}
        {!isLoading && !isError && (!stats || stats.dailyStatistics.length === 0) && (
          <p className="text-sm text-gray-500">Chưa có dữ liệu trong khoảng thời gian này.</p>
        )}

        {!isLoading && !isError && stats && stats.dailyStatistics.length > 0 && (
          <>
            {/* Biểu đồ đường doanh thu theo ngày */}
            <div className="w-full min-h-[280px] h-72">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={stats.dailyStatistics}>
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#2563eb" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                  <YAxis
                    tickFormatter={(v: number | string) =>
                      typeof v === 'number' ? v.toLocaleString('vi-VN') : v
                    }
                    tick={{ fontSize: 12 }}
                  />
                  <Tooltip
                    formatter={(value?: number | string) =>
                      typeof value === 'number'
                        ? `${value.toLocaleString('vi-VN')} ₫`
                        : value ?? ''
                    }
                    labelFormatter={(label: string) => `Ngày ${label}`}
                  />
                  <Area
                    type="monotone"
                    dataKey="totalSales"
                    stroke="#2563eb"
                    strokeWidth={2}
                    fill="url(#colorRevenue)"
                    name="Doanh thu"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Bảng chi tiết dưới biểu đồ */}
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200 text-gray-600">
                    <th className="text-left py-2 pr-4">Ngày</th>
                    <th className="text-right py-2 pr-4">Doanh thu</th>
                    <th className="text-right py-2 pr-4">Số đơn</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.dailyStatistics.map((item: SalesStatisticItem) => (
                    <tr key={item.date} className="border-b border-gray-100 last:border-0">
                      <td className="py-2 pr-4">{item.date}</td>
                      <td className="py-2 pr-4 text-right">
                        {item.totalSales.toLocaleString('vi-VN')} ₫
                      </td>
                      <td className="py-2 pr-4 text-right">{item.ordersCount}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  );
}


