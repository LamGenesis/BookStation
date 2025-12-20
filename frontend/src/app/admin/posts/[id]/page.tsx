'use client';

import { useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { postsApi } from '@/lib/api';
import { adminPostsApi, AdminPostFormData } from '@/lib/api/admin';
import type { PostDetail } from '@/types';
import { Button } from '@/components/shared/Button';
import { useToast } from '@/components/shared/Toast';

const postSchema = z.object({
  title: z.string().min(1, 'Tiêu đề là bắt buộc'),
  content: z.string().min(1, 'Nội dung là bắt buộc'),
  imageUrl: z.string().url('URL không hợp lệ').optional().or(z.literal('')),
});

type PostFormValues = z.infer<typeof postSchema>;

export default function AdminEditPostPage() {
  const router = useRouter();
  const params = useParams();
  const { addToast } = useToast();

  const id = Number(params?.id);

  const { data: post, isLoading, isError } = useQuery<PostDetail | null>({
    queryKey: ['admin-post', id],
    queryFn: () => postsApi.getById(id),
    enabled: !!id,
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<PostFormValues>({
    resolver: zodResolver(postSchema),
  });

  // Khởi tạo form khi dữ liệu bài viết đã tải xong
  useEffect(() => {
    if (post && !isLoading) {
      reset({
        title: post.title,
        content: post.content,
        imageUrl: post.imageUrl || '',
      });
    }
  }, [post, isLoading, reset]);

  const onSubmit: SubmitHandler<PostFormValues> = async (values) => {
    const payload: AdminPostFormData = {
      title: values.title,
      content: values.content,
      imageUrl: values.imageUrl || null,
    };
    try {
      await adminPostsApi.update(id, payload);
      addToast('Cập nhật bài viết thành công', 'success');
      router.push('/admin/posts');
    } catch (error) {
      console.error(error);
      addToast('Cập nhật bài viết thất bại', 'error');
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-500 text-sm">
        Đang tải bài viết...
      </div>
    );
  }

  if (isError || !post) {
    return (
      <div className="space-y-4">
        <p className="text-red-600 text-sm">Không tìm thấy bài viết.</p>
        <Button variant="outline" size="sm" onClick={() => router.push('/admin/posts')}>
          Quay lại danh sách
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Chỉnh sửa bài viết</h2>
          <p className="text-sm text-gray-600 mt-1">
            Cập nhật nội dung cho bài viết #{post.id}.
          </p>
        </div>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-6"
      >
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Tiêu đề
          </label>
          <input
            type="text"
            {...register('title')}
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
          />
          {errors.title && (
            <p className="mt-1 text-xs text-red-600">{errors.title.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Nội dung
          </label>
          <textarea
            rows={10}
            {...register('content')}
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm font-mono"
          />
          {errors.content && (
            <p className="mt-1 text-xs text-red-600">{errors.content.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Ảnh bài viết (URL)
          </label>
          <input
            type="text"
            placeholder="https://..."
            {...register('imageUrl')}
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
          />
          {errors.imageUrl && (
            <p className="mt-1 text-xs text-red-600">{errors.imageUrl.message}</p>
          )}
        </div>

        <div className="flex justify-end gap-3">
          <Button
            type="button"
            variant="ghost"
            onClick={() => router.push('/admin/posts')}
          >
            Hủy
          </Button>
          <Button type="submit" isLoading={isSubmitting}>
            Lưu thay đổi
          </Button>
        </div>
      </form>
    </div>
  );
}


