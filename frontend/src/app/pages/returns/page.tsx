import Link from 'next/link';

export default function ReturnsPage() {
  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Chính sách đổi trả</h1>
        <div className="bg-white rounded-lg shadow-sm p-8 space-y-6">
          <section>
            <h2 className="text-xl font-semibold text-gray-800 mb-3">1. Điều kiện đổi trả</h2>
            <p className="text-gray-600 leading-relaxed mb-3">
              BookStation chấp nhận đổi trả sách trong các trường hợp sau:
            </p>
            <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4">
              <li>Sách bị lỗi in ấn, thiếu trang, hoặc chất lượng không đảm bảo</li>
              <li>Sách bị hư hỏng trong quá trình vận chuyển</li>
              <li>Giao nhầm sách so với đơn hàng</li>
            </ul>
            <p className="text-gray-600 leading-relaxed mt-3">
              <strong>Lưu ý:</strong> Sách phải còn nguyên vẹn, chưa sử dụng, còn tem niêm phong (nếu có).
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-800 mb-3">2. Thời gian đổi trả</h2>
            <p className="text-gray-600 leading-relaxed">
              Yêu cầu đổi trả phải được gửi trong vòng <strong>7 ngày</strong> kể từ ngày nhận hàng. 
              Sau thời gian này, chúng tôi không thể chấp nhận yêu cầu đổi trả.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-800 mb-3">3. Quy trình đổi trả</h2>
            <ol className="list-decimal list-inside text-gray-600 space-y-2 ml-4">
              <li>Liên hệ hotline 1900 1234 hoặc email support@bookstation.vn để thông báo</li>
              <li>Chuẩn bị sách cần đổi trả (giữ nguyên bao bì nếu có)</li>
              <li>Nhân viên sẽ đến thu sách và giao sách mới (nếu đổi) hoặc hoàn tiền (nếu trả)</li>
            </ol>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-800 mb-3">4. Hoàn tiền</h2>
            <p className="text-gray-600 leading-relaxed">
              Nếu đơn hàng được chấp nhận trả, chúng tôi sẽ hoàn tiền trong vòng 5-7 ngày làm việc. 
              Tiền sẽ được hoàn về phương thức thanh toán ban đầu của bạn.
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

