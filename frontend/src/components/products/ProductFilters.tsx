'use client';

import { Category } from '@/types';

interface ProductFiltersProps {
  categories: Category[];
  selectedCategory: number | null;
  selectedSort: string;
  onCategoryChange: (categoryId: number | null) => void;
  onSortChange: (sort: string) => void;
}

const sortOptions = [
  { value: 'newest', label: 'Mới nhất' },
  { value: 'price_asc', label: 'Giá thấp đến cao' },
  { value: 'price_desc', label: 'Giá cao đến thấp' },
  { value: 'name_asc', label: 'Tên A-Z' },
  { value: 'name_desc', label: 'Tên Z-A' },
];

export function ProductFilters({
  categories,
  selectedCategory,
  selectedSort,
  onCategoryChange,
  onSortChange,
}: ProductFiltersProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm p-4 sticky top-20">
      {/* Categories */}
      <div className="mb-6">
        <h3 className="font-semibold text-gray-800 mb-3">Danh mục</h3>
        <ul className="space-y-2">
          <li>
            <button
              onClick={() => onCategoryChange(null)}
              className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                selectedCategory === null
                  ? 'bg-blue-100 text-blue-600 font-medium'
                  : 'hover:bg-gray-100'
              }`}
            >
              Tất cả
            </button>
          </li>
          {categories.map((category) => (
            <li key={category.id}>
              <button
                onClick={() => onCategoryChange(category.id)}
                className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                  selectedCategory === category.id
                    ? 'bg-blue-100 text-blue-600 font-medium'
                    : 'hover:bg-gray-100'
                }`}
              >
                {category.name}
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Sort */}
      <div>
        <h3 className="font-semibold text-gray-800 mb-3">Sắp xếp theo</h3>
        <ul className="space-y-2">
          {sortOptions.map((option) => (
            <li key={option.value}>
              <button
                onClick={() => onSortChange(option.value)}
                className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                  selectedSort === option.value
                    ? 'bg-blue-100 text-blue-600 font-medium'
                    : 'hover:bg-gray-100'
                }`}
              >
                {option.label}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

