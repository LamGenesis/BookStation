import Link from 'next/link';

export default function ShippingPage() {
  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Chính sách vận chuyển</h1>
        <div className="bg-white rounded-lg shadow-sm p-8 space-y-6">
          <section>
            <h2 className="text-xl font-semibold text-gray-800 mb-3">1. Phạm vi giao hàng</h2>
            <p className="text-gray-600 leading-relaxed">
              BookStation giao hàng toàn quốc. Chúng tôi có dịch vụ giao hàng nhanh cho các khu vực nội thành 
              và giao hàng tiêu chuẩn cho các tỉnh thành khác.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-800 mb-3">2. Thời gian giao hàng</h2>
            <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4">
              <li><strong>Nội thành TP.HCM:</strong> 1-2 ngày làm việc</li>
              <li><strong>Các tỉnh thành khác:</strong> 3-5 ngày làm việc</li>
              <li><strong>Vùng sâu, vùng xa:</strong> 5-7 ngày làm việc</li>
            </ul>
            <p className="text-gray-600 leading-relaxed mt-3">
              Thời gian giao hàng được tính từ khi đơn hàng được xác nhận và thanh toán thành công.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-800 mb-3">3. Phí vận chuyển</h2>
            <p className="text-gray-600 leading-relaxed">
              Hiện tại BookStation đang áp dụng chương trình <strong>MIỄN PHÍ VẬN CHUYỂN</strong> cho tất cả các đơn hàng 
              trên toàn quốc. Bạn không cần phải trả thêm bất kỳ khoản phí nào cho dịch vụ giao hàng.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-800 mb-3">4. Theo dõi đơn hàng</h2>
            <p className="text-gray-600 leading-relaxed">
              Sau khi đặt hàng thành công, bạn sẽ nhận được email xác nhận với mã đơn hàng. 
              Bạn có thể theo dõi trạng thái đơn hàng trong mục "Đơn hàng của tôi" trên website hoặc 
              liên hệ hotline 1900 1234 để được hỗ trợ.
            </p>
          </section>

          <div className="pt-6 border-t">
            <Link href="/" className="text-blue-600 hover:text-blue-700">
              ← Quay lại trang chủ
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

