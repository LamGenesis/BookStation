'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { productsApi } from '@/lib/api';
import { formatCurrency, calculateDiscount, getImageUrl } from '@/lib/utils';
import { Button } from '@/components/shared/Button';
import { LoadingPage, LoadingSkeleton } from '@/components/shared/Loading';
import { useCart } from '@/hooks/useCart';

export default function ProductDetailPage() {
  const params = useParams();
  const productId = parseInt(params.id as string);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const { addItem, isAddingItem } = useCart();

  const { data: product, isLoading, error } = useQuery({
    queryKey: ['product', productId],
    queryFn: () => productsApi.getById(productId),
    enabled: !isNaN(productId),
  });

  if (isLoading) {
    return <LoadingPage />;
  }

  if (error || !product) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Không tìm thấy sản phẩm</h2>
          <p className="text-gray-500 mb-4">Sản phẩm bạn tìm kiếm không tồn tại hoặc đã bị xóa.</p>
          <Link href="/products" className="text-blue-600 hover:text-blue-700 font-medium">
            ← Quay lại danh sách sản phẩm
          </Link>
        </div>
      </div>
    );
  }

  const discount = calculateDiscount(product.price, product.discountPrice);
  const isOutOfStock = product.quantity <= 0 || product.status !== 1;
  const images = product.images.length > 0 ? product.images : [{ id: 0, url: '', isPrimary: true }];

  const handleAddToCart = () => {
    addItem({ productId: product.id, quantity });
  };

  return (
    <div className="bg-gray-50 min-h-screen py-6">
      <div className="container mx-auto px-4">
        {/* Breadcrumb */}
        <nav className="mb-6 text-sm text-gray-500">
          <Link href="/" className="hover:text-blue-600">Trang chủ</Link>
          <span className="mx-2">/</span>
          <Link href="/products" className="hover:text-blue-600">Sản phẩm</Link>
          {product.categoryName && (
            <>
              <span className="mx-2">/</span>
              <Link 
                href={`/products?categoryId=${product.categoryId}`}
                className="hover:text-blue-600"
              >
                {product.categoryName}
              </Link>
            </>
          )}
          <span className="mx-2">/</span>
          <span className="text-gray-800 truncate">{product.name}</span>
        </nav>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Images */}
            <div>
              {/* Main Image */}
              <div className="relative aspect-square rounded-lg overflow-hidden bg-gray-100 mb-4">
                <Image
                  src={getImageUrl(images[selectedImage]?.url)}
                  alt={product.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  priority
                />
                {discount > 0 && (
                  <div className="absolute top-4 left-4 bg-red-500 text-white text-sm font-bold px-3 py-1 rounded">
                    -{discount}%
                  </div>
                )}
              </div>

              {/* Thumbnails */}
              {images.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-2">
                  {images.map((image, index) => (
                    <button
                      key={image.id}
                      onClick={() => setSelectedImage(index)}
                      className={`relative w-20 h-20 rounded-lg overflow-hidden shrink-0 border-2 transition-colors ${
                        selectedImage === index ? 'border-blue-600' : 'border-transparent hover:border-gray-300'
                      }`}
                    >
                      <Image
                        src={getImageUrl(image.url)}
                        alt={`${product.name} ${index + 1}`}
                        fill
                        className="object-cover"
                        sizes="80px"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Info */}
            <div>
              {/* Category */}
              {product.categoryName && (
                <Link
                  href={`/products?categoryId=${product.categoryId}`}
                  className="text-sm text-blue-600 hover:text-blue-700 uppercase tracking-wide"
                >
                  {product.categoryName}
                </Link>
              )}

              {/* Name */}
              <h1 className="text-2xl lg:text-3xl font-bold text-gray-800 mt-2">
                {product.name}
              </h1>

              {/* Price */}
              <div className="mt-4 flex items-center gap-3">
                {product.discountPrice ? (
                  <>
                    <span className="text-3xl font-bold text-red-600">
                      {formatCurrency(product.discountPrice)}
                    </span>
                    <span className="text-xl text-gray-400 line-through">
                      {formatCurrency(product.price)}
                    </span>
                  </>
                ) : (
                  <span className="text-3xl font-bold text-blue-600">
                    {formatCurrency(product.price)}
                  </span>
                )}
              </div>

              {/* Stock */}
              <div className="mt-4">
                {isOutOfStock ? (
                  <span className="inline-flex items-center gap-1 text-red-600">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                    Hết hàng
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-green-600">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Còn {product.quantity} sản phẩm
                  </span>
                )}
              </div>

              {/* Quantity & Add to Cart */}
              <div className="mt-6 flex flex-col sm:flex-row gap-4">
                {/* Quantity */}
                <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-4 py-2 text-gray-600 hover:bg-gray-100 transition-colors"
                    disabled={quantity <= 1}
                  >
                    -
                  </button>
                  <input
                    type="number"
                    min="1"
                    max={product.quantity}
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, Math.min(product.quantity, parseInt(e.target.value) || 1)))}
                    className="w-16 text-center border-x border-gray-300 py-2 focus:outline-none"
                  />
                  <button
                    onClick={() => setQuantity(Math.min(product.quantity, quantity + 1))}
                    className="px-4 py-2 text-gray-600 hover:bg-gray-100 transition-colors"
                    disabled={quantity >= product.quantity}
                  >
                    +
                  </button>
                </div>

                {/* Add to Cart Button */}
                <Button
                  onClick={handleAddToCart}
                  disabled={isOutOfStock || isAddingItem}
                  isLoading={isAddingItem}
                  size="lg"
                  className="flex-1 sm:flex-none sm:px-12"
                >
                  {isOutOfStock ? 'Hết hàng' : 'Thêm vào giỏ hàng'}
                </Button>
              </div>

              {/* Policies */}
              <div className="mt-8 grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Sách chính hãng 100%
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                  </svg>
                  Thanh toán an toàn
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Đổi trả trong 7 ngày
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                  </svg>
                  Freeship từ 300K
                </div>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="mt-10 pt-8 border-t">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Mô tả sản phẩm</h2>
            <div className="prose prose-blue max-w-none text-gray-600">
              {product.description ? (
                <div dangerouslySetInnerHTML={{ __html: product.description.replace(/\n/g, '<br/>') }} />
              ) : (
                <p className="text-gray-400 italic">Chưa có mô tả cho sản phẩm này.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

