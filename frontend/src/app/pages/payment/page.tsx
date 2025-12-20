import Link from 'next/link';

export default function PaymentPage() {
  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Phương thức thanh toán</h1>
        <div className="bg-white rounded-lg shadow-sm p-8 space-y-6">
          <section>
            <h2 className="text-xl font-semibold text-gray-800 mb-3">1. Thanh toán khi nhận hàng (COD)</h2>
            <p className="text-gray-600 leading-relaxed">
              Bạn có thể thanh toán bằng tiền mặt khi nhận hàng. Nhân viên giao hàng sẽ thu tiền và giao sách cho bạn. 
              Phương thức này phù hợp cho các đơn hàng trong nội thành.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-800 mb-3">2. Thanh toán qua VNPay</h2>
            <p className="text-gray-600 leading-relaxed">
              Thanh toán trực tuyến qua cổng thanh toán VNPay. Bạn có thể sử dụng thẻ ATM, thẻ tín dụng, 
              hoặc ví điện tử để thanh toán một cách an toàn và nhanh chóng.
            </p>
            <ul className="list-disc list-inside text-gray-600 space-y-2 mt-2 ml-4">
              <li>Thẻ ATM nội địa (Vietcombank, BIDV, Techcombank, v.v.)</li>
              <li>Thẻ tín dụng/ghi nợ quốc tế (Visa, Mastercard)</li>
              <li>Ví điện tử (MoMo, ZaloPay, v.v.)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-800 mb-3">3. Bảo mật thanh toán</h2>
            <p className="text-gray-600 leading-relaxed">
              Tất cả các giao dịch thanh toán đều được mã hóa và bảo mật theo tiêu chuẩn quốc tế. 
              BookStation không lưu trữ thông tin thẻ tín dụng của khách hàng.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-800 mb-3">4. Hỗ trợ</h2>
            <p className="text-gray-600 leading-relaxed">
              Nếu bạn gặp vấn đề trong quá trình thanh toán, vui lòng liên hệ hotline 1900 1234 hoặc 
              email support@bookstation.vn để được hỗ trợ.
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

