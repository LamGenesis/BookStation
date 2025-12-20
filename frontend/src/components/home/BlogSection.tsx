'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useQuery } from '@tanstack/react-query';
import { postsApi } from '@/lib/api';
import { formatDate, getImageUrl, truncateText } from '@/lib/utils';
import { LoadingSkeleton } from '@/components/shared/Loading';

export function BlogSection() {
  const { data: posts = [], isLoading } = useQuery({
    queryKey: ['posts', 'latest'],
    queryFn: () => postsApi.getLatest(4),
  });

  if (isLoading) {
    return (
      <section className="py-10 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            <span className="w-1 h-8 bg-blue-600 rounded"></span>
            Góc Đọc Sách
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="bg-white rounded-lg overflow-hidden shadow-sm">
                <LoadingSkeleton className="h-48 w-full" />
                <div className="p-4 space-y-3">
                  <LoadingSkeleton className="h-4 w-3/4" />
                  <LoadingSkeleton className="h-4 w-full" />
                  <LoadingSkeleton className="h-4 w-1/2" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-10 bg-gray-50">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <span className="w-1 h-8 bg-blue-600 rounded"></span>
            Góc Đọc Sách
          </h2>
          <Link
            href="/posts"
            className="text-blue-600 hover:text-blue-700 font-medium text-sm"
          >
            Xem tất cả →
          </Link>
        </div>

        {/* Posts Grid */}
        {posts.length === 0 ? (
          <div className="text-center py-12">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">Chưa có bài viết</h3>
            <p className="mt-1 text-sm text-gray-500">
              Các bài viết sẽ được cập nhật sớm nhất
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {posts.map((post) => (
              <Link key={post.id} href={`/posts/${post.id}`} className="group">
                <article className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                  {/* Image */}
                  <div className="relative h-48 bg-gray-100">
                    <Image
                      src={getImageUrl(post.imageUrl)}
                      alt={post.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    />
                  </div>

                  {/* Content */}
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-800 line-clamp-2 group-hover:text-blue-600 transition-colors">
                      {post.title}
                    </h3>
                    <div className="mt-2 flex items-center gap-2 text-sm text-gray-500">
                      {post.authorName && (
                        <>
                          <span>{post.authorName}</span>
                          <span>•</span>
                        </>
                      )}
                      <span>{formatDate(post.publishedAt)}</span>
                    </div>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

