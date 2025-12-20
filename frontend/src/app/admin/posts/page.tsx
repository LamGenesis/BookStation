'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { postsApi } from '@/lib/api';
import { adminPostsApi } from '@/lib/api/admin';
import type { Post } from '@/types';
import { Button } from '@/components/shared/Button';
import { useToast } from '@/components/shared/Toast';

export default function AdminPostsPage() {
  const queryClient = useQueryClient();
  const { addToast } = useToast();
  const [postToDelete, setPostToDelete] = useState<Post | null>(null);

  const { data: posts = [], isLoading, isError } = useQuery({
    queryKey: ['admin-posts'],
    queryFn: postsApi.getAll,
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => adminPostsApi.delete(id),
    onSuccess: () => {
      setPostToDelete(null);
      queryClient.invalidateQueries({ queryKey: ['admin-posts'] });
      addToast('Đã xóa bài viết', 'success');
    },
    onError: () => {
      addToast('Xóa bài viết thất bại', 'error');
    },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Quản lý bài viết</h2>
          <p className="text-sm text-gray-600 mt-1">
            Tin tức, bài viết blog hiển thị trên trang khách.
          </p>
        </div>
        <Link href="/admin/posts/new">
          <Button size="sm">+ Thêm bài viết</Button>
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr className="text-left text-gray-600">
                <th className="px-4 py-2">ID</th>
                <th className="px-4 py-2">Tiêu đề</th>
                <th className="px-4 py-2">Tác giả</th>
                <th className="px-4 py-2">Ngày đăng</th>
                <th className="px-4 py-2 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {isLoading && (
                <tr>
                  <td colSpan={5} className="px-4 py-6 text-center text-gray-500">
                    Đang tải danh sách bài viết...
                  </td>
                </tr>
              )}
              {isError && !isLoading && (
                <tr>
                  <td colSpan={5} className="px-4 py-6 text-center text-red-600">
                    Không tải được danh sách bài viết.
                  </td>
                </tr>
              )}
              {!isLoading && !isError && posts.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-6 text-center text-gray-500">
                    Chưa có bài viết nào.
                  </td>
                </tr>
              )}
              {!isLoading &&
                !isError &&
                posts.map((p: Post) => (
                  <tr key={p.id} className="border-t border-gray-100 hover:bg-gray-50">
                    <td className="px-4 py-2 text-gray-700">{p.id}</td>
                    <td className="px-4 py-2 text-gray-900 max-w-[260px] truncate">
                      {p.title}
                    </td>
                    <td className="px-4 py-2 text-gray-700">
                      {p.authorName || 'N/A'}
                    </td>
                    <td className="px-4 py-2 text-gray-700">
                      {new Date(p.publishedAt).toLocaleString('vi-VN')}
                    </td>
                    <td className="px-4 py-2 text-right space-x-2">
                      <Link href={`/admin/posts/${p.id}`}>
                        <Button size="sm" variant="outline">
                          Sửa
                        </Button>
                      </Link>
                      <Button
                        size="sm"
                        variant="danger"
                        isLoading={deleteMutation.isPending}
                        onClick={() => setPostToDelete(p)}
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

      {postToDelete && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-xl shadow-lg max-w-sm w-full mx-4 p-6 space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Xóa bài viết</h3>
            <p className="text-sm text-gray-700">
              Bạn có chắc chắn muốn xóa bài viết{' '}
              <span className="font-medium">#{postToDelete.id} - {postToDelete.title}</span>?
            </p>
            <div className="flex justify-end gap-3 pt-2">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setPostToDelete(null)}
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
                  if (postToDelete) {
                    deleteMutation.mutate(postToDelete.id);
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


