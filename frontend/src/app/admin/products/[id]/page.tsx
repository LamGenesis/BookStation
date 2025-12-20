'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { useForm, type SubmitHandler, type Resolver } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { categoriesApi, productsApi } from '@/lib/api';
import { adminProductsApi, AdminProductFormData } from '@/lib/api/admin';
import { Button } from '@/components/shared/Button';
import { useToast } from '@/components/shared/Toast';

const productSchema = z.object({
  name: z.string().min(1, 'Tên sản phẩm là bắt buộc'),
  description: z.string().optional(),
  price: z.coerce.number().min(0, 'Giá phải lớn hơn hoặc bằng 0'),
  discountPrice: z.preprocess(
    (v) => {
      if (v === '' || v == null) return null;
      const num = Number(v);
      return Number.isNaN(num) ? null : num;
    },
    z.number().nullable()
  ),
  quantity: z.coerce.number().int().min(0, 'Số lượng phải >= 0'),
  status: z.coerce.number().int(),
  categoryId: z.coerce.number().int().min(1, 'Chọn danh mục'),
  images: z.any().optional(),
});

type ProductFormValues = z.infer<typeof productSchema>;

export default function AdminEditProductPage() {
  const router = useRouter();
  const params = useParams();
  const { addToast } = useToast();

  const id = Number(params?.id);

  const { data: categories = [] } = useQuery({
    queryKey: ['categories'],
    queryFn: categoriesApi.getAll,
  });

  const { data: product, isLoading } = useQuery({
    queryKey: ['admin-product', id],
    queryFn: () => productsApi.getById(id),
    enabled: !!id,
  });

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    watch,
  } = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema) as Resolver<ProductFormValues>,
  });

  // Initialize form when product data is loaded
  // Use an effect to avoid triggering resets during render (which causes re-renders loop)
  useEffect(() => {
    if (product && !isLoading) {
      reset({
        name: product.name,
        description: product.description || '',
        price: product.price,
        discountPrice: product.discountPrice ?? null,
        quantity: product.quantity,
        status: product.status,
        categoryId: product.categoryId || 0,
      });
    }
  }, [product, isLoading, reset]);

  const handleFileButtonClick = () => {
    fileInputRef.current?.click();
  };

  const onSubmit: SubmitHandler<ProductFormValues> = async (values) => {
    const payload: AdminProductFormData = {
      ...values,
      // Nếu categoryId là 0 (từ option rỗng), không gửi để backend giữ nguyên hoặc cho phép null
      categoryId: values.categoryId || null,
      images: (values as any).images,
    };
    try {
      await adminProductsApi.update(id, payload);
      addToast('Cập nhật sản phẩm thành công', 'success');
      router.push('/admin/products');
    } catch (error) {
      console.error(error);
      addToast('Cập nhật sản phẩm thất bại', 'error');
    }
  };

  if (isLoading || !product) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-500 text-sm">
        Đang tải thông tin sản phẩm...
      </div>
    );
  }

  return (
    <div className="max-w-3xl space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Chỉnh sửa sản phẩm</h2>
          <p className="text-sm text-gray-600 mt-1">
            Cập nhật thông tin cho sản phẩm #{product.id}.
          </p>
        </div>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-6"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tên sản phẩm
            </label>
            <input
              type="text"
              {...register('name')}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
            />
            {errors.name && (
              <p className="mt-1 text-xs text-red-600">{errors.name.message}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Danh mục
            </label>
            <select
              {...register('categoryId')}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
            >
              <option value="">-- Chọn danh mục --</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
            {errors.categoryId && (
              <p className="mt-1 text-xs text-red-600">{errors.categoryId.message}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Giá</label>
            <input
              type="number"
              step="1000"
              {...register('price')}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
            />
            {errors.price && (
              <p className="mt-1 text-xs text-red-600">{errors.price.message}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Giá khuyến mãi (nếu có)
            </label>
            <input
              type="number"
              step="1000"
              {...register('discountPrice')}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Số lượng tồn
            </label>
            <input
              type="number"
              {...register('quantity')}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
            />
            {errors.quantity && (
              <p className="mt-1 text-xs text-red-600">{errors.quantity.message}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Trạng thái
            </label>
            <select
              {...register('status')}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
            >
              <option value={1}>Đang bán</option>
              <option value={0}>Ngừng bán</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Ảnh mới (nếu muốn thay)
            </label>
            <input
              type="file"
              multiple
              accept="image/*"
              {...register('images', {
                onChange: (e) => {
                  const files = e.target.files;
                  if (files && files.length > 0) {
                    setSelectedFiles(Array.from(files));
                  } else {
                    setSelectedFiles([]);
                  }
                },
              })}
              ref={(e) => {
                register('images').ref(e);
                if (e) fileInputRef.current = e;
              }}
              className="hidden"
            />
            <div className="space-y-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleFileButtonClick}
                className="w-full"
              >
                <svg
                  className="w-4 h-4 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
                  />
                </svg>
                Chọn ảnh sản phẩm
              </Button>
              {selectedFiles.length > 0 && (
                <div className="text-xs text-gray-600 space-y-1">
                  <p className="font-medium">Đã chọn {selectedFiles.length} ảnh:</p>
                  <ul className="list-disc list-inside space-y-0.5">
                    {selectedFiles.map((file, index) => (
                      <li key={index} className="truncate">
                        {file.name}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Mô tả
          </label>
          <textarea
            rows={4}
            {...register('description')}
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
          />
        </div>

        <div className="flex justify-end gap-3">
          <Button
            type="button"
            variant="ghost"
            onClick={() => router.push('/admin/products')}
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


