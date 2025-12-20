import Link from 'next/link';

export default function TermsPage() {
  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Điều khoản sử dụng</h1>
        <div className="bg-white rounded-lg shadow-sm p-8 space-y-6">
          <section>
            <h2 className="text-xl font-semibold text-gray-800 mb-3">1. Chấp nhận điều khoản</h2>
            <p className="text-gray-600 leading-relaxed">
              Bằng việc truy cập và sử dụng website BookStation, bạn đồng ý tuân thủ các điều khoản và điều kiện này. 
              Nếu bạn không đồng ý, vui lòng không sử dụng dịch vụ của chúng tôi.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-800 mb-3">2. Sử dụng dịch vụ</h2>
            <p className="text-gray-600 leading-relaxed">
              Bạn được phép sử dụng website BookStation cho mục đích mua sắm hợp pháp. Bạn không được:
            </p>
            <ul className="list-disc list-inside text-gray-600 space-y-2 mt-2 ml-4">
              <li>Sử dụng website cho mục đích bất hợp pháp</li>
              <li>Xâm phạm quyền sở hữu trí tuệ</li>
              <li>Can thiệp vào hoạt động của hệ thống</li>
              <li>Truyền tải virus hoặc mã độc</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-800 mb-3">3. Đơn hàng và thanh toán</h2>
            <p className="text-gray-600 leading-relaxed">
              Khi đặt hàng, bạn đồng ý cung cấp thông tin chính xác và đầy đủ. BookStation có quyền từ chối hoặc hủy 
              đơn hàng nếu phát hiện thông tin không chính xác hoặc có dấu hiệu gian lận.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-800 mb-3">4. Quyền sở hữu</h2>
            <p className="text-gray-600 leading-relaxed">
              Tất cả nội dung trên website BookStation, bao gồm logo, hình ảnh, văn bản, đều thuộc quyền sở hữu của BookStation 
              và được bảo vệ bởi luật bản quyền.
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

