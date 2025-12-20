'use client';

import { useRouter } from 'next/navigation';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { adminPostsApi, AdminPostFormData } from '@/lib/api/admin';
import { Button } from '@/components/shared/Button';
import { useToast } from '@/components/shared/Toast';

const postSchema = z.object({
  title: z.string().min(1, 'Tiêu đề là bắt buộc'),
  content: z.string().min(1, 'Nội dung là bắt buộc'),
  imageUrl: z.string().url('URL không hợp lệ').optional().or(z.literal('')),
});

type PostFormValues = z.infer<typeof postSchema>;

export default function AdminNewPostPage() {
  const router = useRouter();
  const { addToast } = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<PostFormValues>({
    resolver: zodResolver(postSchema),
  });

  const onSubmit: SubmitHandler<PostFormValues> = async (values) => {
    const payload: AdminPostFormData = {
      title: values.title,
      content: values.content,
      imageUrl: values.imageUrl || null,
    };
    try {
      await adminPostsApi.create(payload);
      addToast('Tạo bài viết thành công', 'success');
      router.push('/admin/posts');
    } catch (error) {
      console.error(error);
      addToast('Tạo bài viết thất bại', 'error');
    }
  };

  return (
    <div className="max-w-3xl space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Thêm bài viết mới</h2>
          <p className="text-sm text-gray-600 mt-1">
            Viết bài cho mục Góc đọc sách / Blog.
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
            Lưu bài viết
          </Button>
        </div>
      </form>
    </div>
  );
}


