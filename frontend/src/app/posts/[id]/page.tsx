'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { postsApi } from '@/lib/api';
import { formatDateTime, getImageUrl } from '@/lib/utils';
import { LoadingPage } from '@/components/shared/Loading';

export default function PostDetailPage() {
  const params = useParams();
  const postId = parseInt(params.id as string);

  const { data: post, isLoading, error } = useQuery({
    queryKey: ['post', postId],
    queryFn: () => postsApi.getById(postId),
    enabled: !isNaN(postId),
  });

  if (isLoading) {
    return <LoadingPage />;
  }

  if (error || !post) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Không tìm thấy bài viết</h2>
          <p className="text-gray-500 mb-4">Bài viết bạn tìm kiếm không tồn tại hoặc đã bị xóa.</p>
          <Link href="/posts" className="text-blue-600 hover:text-blue-700 font-medium">
            ← Quay lại danh sách bài viết
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen py-6">
      <div className="container mx-auto px-4">
        {/* Breadcrumb */}
        <nav className="mb-6 text-sm text-gray-500">
          <Link href="/" className="hover:text-blue-600">Trang chủ</Link>
          <span className="mx-2">/</span>
          <Link href="/posts" className="hover:text-blue-600">Góc đọc sách</Link>
          <span className="mx-2">/</span>
          <span className="text-gray-800 truncate">{post.title}</span>
        </nav>

        <article className="max-w-3xl mx-auto">
          {/* Header */}
          <header className="mb-8">
            <h1 className="text-3xl lg:text-4xl font-bold text-gray-800 mb-4">
              {post.title}
            </h1>
            <div className="flex items-center gap-3 text-gray-500">
              {post.authorName && (
                <>
                  <span className="font-medium text-gray-700">{post.authorName}</span>
                  <span>•</span>
                </>
              )}
              <span>{formatDateTime(post.publishedAt)}</span>
            </div>
          </header>

          {/* Featured Image */}
          {post.imageUrl && (
            <div className="relative aspect-video rounded-lg overflow-hidden mb-8 bg-gray-100">
              <Image
                src={getImageUrl(post.imageUrl)}
                alt={post.title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 768px"
                priority
              />
            </div>
          )}

          {/* Content */}
          <div className="bg-white rounded-lg shadow-sm p-6 lg:p-8">
            <div 
              className="prose prose-blue max-w-none prose-headings:text-gray-800 prose-p:text-gray-600 prose-a:text-blue-600"
              dangerouslySetInnerHTML={{ 
                __html: post.content.replace(/\n/g, '<br/>') 
              }}
            />
          </div>

          {/* Navigation */}
          <div className="mt-8 flex justify-between">
            <Link href="/posts" className="text-blue-600 hover:text-blue-700 font-medium">
              ← Quay lại danh sách bài viết
            </Link>
          </div>
        </article>
      </div>
    </div>
  );
}

