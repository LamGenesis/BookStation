import Link from 'next/link';

export default function PrivacyPage() {
  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Chính sách bảo mật</h1>
        <div className="bg-white rounded-lg shadow-sm p-8 space-y-6">
          <section>
            <h2 className="text-xl font-semibold text-gray-800 mb-3">1. Thu thập thông tin</h2>
            <p className="text-gray-600 leading-relaxed">
              BookStation thu thập thông tin cá nhân của bạn khi bạn đăng ký tài khoản, đặt hàng, hoặc liên hệ với chúng tôi. 
              Thông tin thu thập bao gồm: tên, email, số điện thoại, địa chỉ giao hàng.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-800 mb-3">2. Sử dụng thông tin</h2>
            <p className="text-gray-600 leading-relaxed">
              Chúng tôi sử dụng thông tin của bạn để:
            </p>
            <ul className="list-disc list-inside text-gray-600 space-y-2 mt-2 ml-4">
              <li>Xử lý đơn hàng và giao hàng</li>
              <li>Gửi thông báo về đơn hàng</li>
              <li>Cải thiện dịch vụ và trải nghiệm người dùng</li>
              <li>Gửi thông tin khuyến mãi (nếu bạn đồng ý)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-800 mb-3">3. Bảo mật thông tin</h2>
            <p className="text-gray-600 leading-relaxed">
              BookStation cam kết bảo vệ thông tin cá nhân của bạn. Chúng tôi sử dụng các biện pháp bảo mật tiên tiến 
              để bảo vệ dữ liệu khỏi truy cập trái phép, thay đổi, tiết lộ hoặc phá hủy.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-800 mb-3">4. Chia sẻ thông tin</h2>
            <p className="text-gray-600 leading-relaxed">
              Chúng tôi không bán, cho thuê hoặc chia sẻ thông tin cá nhân của bạn cho bên thứ ba, 
              trừ khi được yêu cầu bởi pháp luật hoặc với sự đồng ý của bạn.
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

