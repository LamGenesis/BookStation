'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuth } from '@/hooks/useAuth';
import { loginSchema, LoginFormData } from '@/lib/validations/auth';
import { Button } from '@/components/shared/Button';
import { AxiosError } from 'axios';

export default function LoginPage() {
  const { login, isLoggingIn } = useAuth();
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    setError(null);
    try {
      await login(data, {
        onError: (err) => {
          if (err instanceof AxiosError) {
            setError(err.response?.data?.message || 'Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin.');
          } else {
            setError('Đăng nhập thất bại. Vui lòng thử lại.');
          }
        },
      });
    } catch {
      setError('Đăng nhập thất bại. Vui lòng thử lại.');
    }
  };

  return (
    <div className="min-h-[calc(100vh-200px)] flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">Đăng nhập</h1>
          <p className="mt-2 text-gray-600">
            Chào mừng bạn quay trở lại BookStation
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                {...register('email')}
                type="email"
                id="email"
                autoComplete="email"
                className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.email ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="your@email.com"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Mật khẩu
              </label>
              <input
                {...register('password')}
                type="password"
                id="password"
                autoComplete="current-password"
                className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.password ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="••••••••"
              />
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between">
            <label className="flex items-center">
              <input
                type="checkbox"
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-600">Ghi nhớ đăng nhập</span>
            </label>
            <Link href="/forgot-password" className="text-sm text-blue-600 hover:text-blue-700">
              Quên mật khẩu?
            </Link>
          </div>

          <Button
            type="submit"
            isLoading={isLoggingIn}
            className="w-full"
            size="lg"
          >
            Đăng nhập
          </Button>

          <p className="text-center text-gray-600">
            Chưa có tài khoản?{' '}
            <Link href="/register" className="text-blue-600 hover:text-blue-700 font-medium">
              Đăng ký ngay
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}

