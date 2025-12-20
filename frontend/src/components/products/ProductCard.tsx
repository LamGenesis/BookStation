'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Product } from '@/types';
import { formatCurrency, calculateDiscount, getImageUrl } from '@/lib/utils';
import { Button } from '@/components/shared/Button';
import { useCart } from '@/hooks/useCart';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addItem, isAddingItem } = useCart();
  const discount = calculateDiscount(product.price, product.discountPrice);
  const isOutOfStock = product.quantity <= 0 || product.status !== 1;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem({ productId: product.id, quantity: 1 });
  };

  return (
    <Link href={`/products/${product.id}`} className="group">
      <div className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-200">
        {/* Image */}
        <div className="relative aspect-[3/4] overflow-hidden bg-gray-100">
          <Image
            src={getImageUrl(product.primaryImageUrl)}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />
          {discount > 0 && (
            <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
              -{discount}%
            </div>
          )}
          {isOutOfStock && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <span className="text-white font-bold text-sm">Hết hàng</span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-3">
          {/* Category */}
          {product.categoryName && (
            <span className="text-xs text-gray-500 uppercase tracking-wide">
              {product.categoryName}
            </span>
          )}

          {/* Name */}
          <h3 className="mt-1 font-medium text-gray-800 line-clamp-2 min-h-[2.5rem] text-sm sm:text-base">
            {product.name}
          </h3>

          {/* Price */}
          <div className="mt-2 flex items-center gap-2">
            {product.discountPrice ? (
              <>
                <span className="text-red-600 font-bold">
                  {formatCurrency(product.discountPrice)}
                </span>
                <span className="text-gray-400 text-sm line-through">
                  {formatCurrency(product.price)}
                </span>
              </>
            ) : (
              <span className="text-blue-600 font-bold">
                {formatCurrency(product.price)}
              </span>
            )}
          </div>

          {/* Add to cart button */}
          <Button
            onClick={handleAddToCart}
            disabled={isOutOfStock || isAddingItem}
            isLoading={isAddingItem}
            variant="primary"
            size="sm"
            className="w-full mt-3"
          >
            {isOutOfStock ? 'Hết hàng' : 'Thêm vào giỏ'}
          </Button>
        </div>
      </div>
    </Link>
  );
}

