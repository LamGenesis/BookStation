'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { productsApi } from '@/lib/api';
import { adminProductsApi } from '@/lib/api/admin';
import type { Product } from '@/types';
import { Button } from '@/components/shared/Button';
import { useToast } from '@/components/shared/Toast';

export default function AdminProductsPage() {
  const queryClient = useQueryClient();
  const { addToast } = useToast();
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);

  const { data, isLoading, isError } = useQuery({
    queryKey: ['admin-products'],
    queryFn: () => productsApi.getAll({ page: 1, pageSize: 50 }),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => adminProductsApi.delete(id),
    onSuccess: () => {
      setProductToDelete(null);
      queryClient.invalidateQueries({ queryKey: ['admin-products'] });
      addToast('Đã xóa sản phẩm', 'success');
    },
    onError: () => {
      addToast('Xóa sản phẩm thất bại', 'error');
    },
  });

  const products = data?.items || [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Quản lý sản phẩm</h2>
          <p className="text-sm text-gray-600 mt-1">
            Danh sách sản phẩm hiện có trong hệ thống.
          </p>
        </div>
        <Link href="/admin/products/new">
          <Button size="sm">+ Thêm sản phẩm</Button>
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr className="text-left text-gray-600">
                <th className="px-4 py-2">ID</th>
                <th className="px-4 py-2">Tên</th>
                <th className="px-4 py-2">Danh mục</th>
                <th className="px-4 py-2 text-right">Giá</th>
                <th className="px-4 py-2 text-right">Tồn kho</th>
                <th className="px-4 py-2 text-center">Trạng thái</th>
                <th className="px-4 py-2 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {isLoading && (
                <tr>
                  <td colSpan={7} className="px-4 py-6 text-center text-gray-500">
                    Đang tải danh sách sản phẩm...
                  </td>
                </tr>
              )}
              {isError && !isLoading && (
                <tr>
                  <td colSpan={7} className="px-4 py-6 text-center text-red-600">
                    Không tải được danh sách sản phẩm.
                  </td>
                </tr>
              )}
              {!isLoading && !isError && products.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-4 py-6 text-center text-gray-500">
                    Chưa có sản phẩm nào.
                  </td>
                </tr>
              )}
              {!isLoading &&
                !isError &&
                products.map((p: Product) => (
                  <tr key={p.id} className="border-t border-gray-100 hover:bg-gray-50">
                    <td className="px-4 py-2 text-gray-700">{p.id}</td>
                    <td className="px-4 py-2 text-gray-900 max-w-[220px] truncate">{p.name}</td>
                    <td className="px-4 py-2 text-gray-700">{p.categoryName || '-'}</td>
                    <td className="px-4 py-2 text-right text-gray-900">
                      {p.price.toLocaleString('vi-VN')} ₫
                    </td>
                    <td className="px-4 py-2 text-right text-gray-700">{p.quantity}</td>
                    <td className="px-4 py-2 text-center">
                      <span
                        className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          p.status === 1
                            ? 'bg-green-50 text-green-700'
                            : 'bg-gray-100 text-gray-600'
                        }`}
                      >
                        {p.status === 1 ? 'Đang bán' : 'Ngừng bán'}
                      </span>
                    </td>
                    <td className="px-4 py-2 text-right space-x-2">
                      <Link href={`/admin/products/${p.id}`}>
                        <Button variant="outline" size="sm">
                          Sửa
                        </Button>
                      </Link>
                      <Button
                        variant="danger"
                        size="sm"
                        isLoading={deleteMutation.isPending}
                        onClick={() => setProductToDelete(p)}
                      >
                        Xóa
                      </Button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>

      {productToDelete && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-xl shadow-lg max-w-sm w-full mx-4 p-6 space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Xóa sản phẩm</h3>
            <p className="text-sm text-gray-700">
              Bạn có chắc chắn muốn xóa sản phẩm{' '}
              <span className="font-medium">#{productToDelete.id} - {productToDelete.name}</span>?
            </p>
            <div className="flex justify-end gap-3 pt-2">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setProductToDelete(null)}
                disabled={deleteMutation.isPending}
              >
                Hủy
              </Button>
              <Button
                type="button"
                variant="danger"
                size="sm"
                isLoading={deleteMutation.isPending}
                onClick={() => {
                  if (productToDelete) {
                    deleteMutation.mutate(productToDelete.id);
                  }
                }}
              >
                Xóa
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


