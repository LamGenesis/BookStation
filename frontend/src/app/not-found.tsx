import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-[calc(100vh-200px)] flex items-center justify-center px-4">
      <div className="text-center">
        <h1 className="text-9xl font-bold text-blue-600">404</h1>
        <h2 className="mt-4 text-3xl font-bold text-gray-800">
          Không tìm thấy trang
        </h2>
        <p className="mt-2 text-gray-500 max-w-md mx-auto">
          Trang bạn đang tìm kiếm không tồn tại hoặc đã được di chuyển.
        </p>
        <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/"
            className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            Về trang chủ
          </Link>
          <Link
            href="/products"
            className="inline-block px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
          >
            Xem sản phẩm
          </Link>
        </div>
      </div>
    </div>
  );
}

