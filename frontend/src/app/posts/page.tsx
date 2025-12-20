'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useQuery } from '@tanstack/react-query';
import { postsApi } from '@/lib/api';
import { formatDate, getImageUrl } from '@/lib/utils';
import { LoadingPage, LoadingSkeleton } from '@/components/shared/Loading';

export default function PostsPage() {
  const { data: posts = [], isLoading } = useQuery({
    queryKey: ['posts'],
    queryFn: postsApi.getAll,
  });

  return (
    <div className="bg-gray-50 min-h-screen py-6">
      <div className="container mx-auto px-4">
        {/* Breadcrumb */}
        <nav className="mb-6 text-sm text-gray-500">
          <Link href="/" className="hover:text-blue-600">Trang chủ</Link>
          <span className="mx-2">/</span>
          <span className="text-gray-800">Góc đọc sách</span>
        </nav>

        <h1 className="text-2xl font-bold text-gray-800 mb-6">
          Góc đọc sách
        </h1>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="bg-white rounded-lg overflow-hidden shadow-sm">
                <LoadingSkeleton className="h-48 w-full" />
                <div className="p-4 space-y-3">
                  <LoadingSkeleton className="h-6 w-3/4" />
                  <LoadingSkeleton className="h-4 w-full" />
                  <LoadingSkeleton className="h-4 w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : posts.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <svg
              className="mx-auto h-16 w-16 text-gray-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
              />
            </svg>
            <h2 className="mt-4 text-xl font-semibold text-gray-800">
              Chưa có bài viết
            </h2>
            <p className="mt-2 text-gray-500">
              Chưa có bài viết nào được đăng tải. Hãy quay lại sau!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => (
              <Link key={post.id} href={`/posts/${post.id}`} className="group">
                <article className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow h-full">
                  {/* Image */}
                  <div className="relative h-48 bg-gray-100">
                    <Image
                      src={getImageUrl(post.imageUrl)}
                      alt={post.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                  </div>

                  {/* Content */}
                  <div className="p-5">
                    <h2 className="text-lg font-bold text-gray-800 group-hover:text-blue-600 transition-colors line-clamp-2">
                      {post.title}
                    </h2>
                    <div className="mt-3 flex items-center gap-2 text-sm text-gray-500">
                      {post.authorName && (
                        <>
                          <span className="font-medium">{post.authorName}</span>
                          <span>•</span>
                        </>
                      )}
                      <span>{formatDate(post.publishedAt)}</span>
                    </div>
                    <p className="mt-3 text-blue-600 text-sm font-medium">
                      Đọc thêm →
                    </p>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

