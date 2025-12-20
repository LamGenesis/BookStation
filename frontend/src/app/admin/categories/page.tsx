'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { categoriesApi } from '@/lib/api';
import { adminCategoriesApi } from '@/lib/api/admin';
import type { Category } from '@/types';
import { Button } from '@/components/shared/Button';
import { useToast } from '@/components/shared/Toast';

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');
}

export default function AdminCategoriesPage() {
  const queryClient = useQueryClient();
  const { addToast } = useToast();

  const { data: categories = [], isLoading, isError } = useQuery({
    queryKey: ['categories'],
    queryFn: categoriesApi.getAll,
  });

  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingName, setEditingName] = useState('');
  const [editingSlug, setEditingSlug] = useState('');

  const createMutation = useMutation({
    mutationFn: () => adminCategoriesApi.create({ name, slug: slug || slugify(name) }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      setName('');
      setSlug('');
      addToast('Thêm danh mục thành công', 'success');
    },
    onError: () => {
      addToast('Thêm danh mục thất bại', 'error');
    },
  });

  const updateMutation = useMutation({
    mutationFn: () =>
      adminCategoriesApi.update(editingId!, {
        name: editingName,
        slug: editingSlug || slugify(editingName),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      setEditingId(null);
      addToast('Cập nhật danh mục thành công', 'success');
    },
    onError: () => {
      addToast('Cập nhật danh mục thất bại', 'error');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => adminCategoriesApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      addToast('Đã xóa danh mục', 'success');
    },
    onError: () => {
      addToast('Xóa danh mục thất bại', 'error');
    },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Quản lý danh mục</h2>
          <p className="text-sm text-gray-600 mt-1">
            Thêm, sửa, xóa danh mục sản phẩm.
          </p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 space-y-4">
        <h3 className="text-sm font-semibold text-gray-800">Thêm danh mục mới</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 items-end">
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">
              Tên danh mục
            </label>
            <input
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ví dụ: Sách thiếu nhi"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">
              Slug (tùy chọn)
            </label>
            <input
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              placeholder="sach-thieu-nhi"
            />
          </div>
          <div className="flex gap-2 justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setName('');
                setSlug('');
              }}
            >
              Xóa
            </Button>
            <Button
              type="button"
              isLoading={createMutation.isPending}
              onClick={() => {
                if (!name.trim()) {
                  addToast('Tên danh mục không được để trống', 'warning');
                  return;
                }
                createMutation.mutate();
              }}
            >
              Thêm
            </Button>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr className="text-left text-gray-600">
                <th className="px-4 py-2">ID</th>
                <th className="px-4 py-2">Tên</th>
                <th className="px-4 py-2">Slug</th>
                <th className="px-4 py-2 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {isLoading && (
                <tr>
                  <td colSpan={4} className="px-4 py-6 text-center text-gray-500">
                    Đang tải danh sách danh mục...
                  </td>
                </tr>
              )}
              {isError && !isLoading && (
                <tr>
                  <td colSpan={4} className="px-4 py-6 text-center text-red-600">
                    Không tải được danh sách danh mục.
                  </td>
                </tr>
              )}
              {!isLoading && !isError && categories.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-4 py-6 text-center text-gray-500">
                    Chưa có danh mục nào.
                  </td>
                </tr>
              )}
              {!isLoading &&
                !isError &&
                categories.map((c: Category) => (
                  <tr key={c.id} className="border-t border-gray-100 hover:bg-gray-50">
                    <td className="px-4 py-2 text-gray-700">{c.id}</td>
                    <td className="px-4 py-2 text-gray-900">
                      {editingId === c.id ? (
                        <input
                          className="w-full border border-gray-300 rounded-md px-2 py-1 text-sm"
                          value={editingName}
                          onChange={(e) => setEditingName(e.target.value)}
                        />
                      ) : (
                        c.name
                      )}
                    </td>
                    <td className="px-4 py-2 text-gray-700">
                      {editingId === c.id ? (
                        <input
                          className="w-full border border-gray-300 rounded-md px-2 py-1 text-sm"
                          value={editingSlug}
                          onChange={(e) => setEditingSlug(e.target.value)}
                        />
                      ) : (
                        c.slug || '-'
                      )}
                    </td>
                    <td className="px-4 py-2 text-right space-x-2">
                      {editingId === c.id ? (
                        <>
                          <Button
                            size="sm"
                            variant="outline"
                            isLoading={updateMutation.isPending}
                            onClick={() => {
                              if (!editingName.trim()) {
                                addToast('Tên danh mục không được để trống', 'warning');
                                return;
                              }
                              updateMutation.mutate();
                            }}
                          >
                            Lưu
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => setEditingId(null)}
                          >
                            Hủy
                          </Button>
                        </>
                      ) : (
                        <>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setEditingId(c.id);
                              setEditingName(c.name);
                              setEditingSlug(c.slug || '');
                            }}
                          >
                            Sửa
                          </Button>
                          <Button
                            size="sm"
                            variant="danger"
                            isLoading={deleteMutation.isPending}
                            onClick={() => {
                              if (
                                confirm(
                                  'Bạn có chắc chắn muốn xóa danh mục này? Các sản phẩm liên quan có thể bị ảnh hưởng.',
                                )
                              ) {
                                deleteMutation.mutate(c.id);
                              }
                            }}
                          >
                            Xóa
                          </Button>
                        </>
                      )}
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


