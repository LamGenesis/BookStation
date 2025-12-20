'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/shared/Button';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Hiện tại backend chưa có API forgot password, nên chỉ hiển thị thông báo UX tối thiểu
    setSubmitted(true);
  };

  return (
    <div className="min-h-[calc(100vh-200px)] flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">Quên mật khẩu</h1>
          <p className="mt-2 text-gray-600">
            Nhập email đã đăng ký để nhận hướng dẫn đặt lại mật khẩu (tính năng sẽ được bổ sung sau).
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          {submitted && (
            <div className="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded-lg text-sm">
              Nếu hệ thống hỗ trợ, hướng dẫn đặt lại mật khẩu sẽ được gửi tới email của bạn.
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 border-gray-300"
                placeholder="your@email.com"
              />
            </div>
          </div>

          <Button type="submit" className="w-full" size="lg">
            Gửi yêu cầu
          </Button>

          <p className="text-center text-gray-600">
            Nhớ mật khẩu rồi?{' '}
            <Link href="/login" className="text-blue-600 hover:text-blue-700 font-medium">
              Quay lại đăng nhập
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}


