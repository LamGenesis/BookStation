import Link from 'next/link';

export default function ContactPage() {
  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Liên hệ với chúng tôi</h1>
        <div className="bg-white rounded-lg shadow-sm p-8 space-y-6">
          <section>
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Thông tin liên hệ</h2>
            <div className="space-y-4 text-gray-600">
              <div className="flex items-start gap-3">
                <svg className="w-6 h-6 mt-1 shrink-0 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <div>
                  <p className="font-semibold text-gray-800">Địa chỉ</p>
                  <p>02 Võ Oanh, P.25, Q.Bình Thạnh, TP.HCM</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <svg className="w-6 h-6 mt-1 shrink-0 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <div>
                  <p className="font-semibold text-gray-800">Điện thoại</p>
                  <p>1900 1234</p>
                  <p className="text-sm text-gray-500">Thứ 2 - Chủ nhật: 8:00 - 22:00</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <svg className="w-6 h-6 mt-1 shrink-0 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <div>
                  <p className="font-semibold text-gray-800">Email</p>
                  <p>support@bookstation.vn</p>
                </div>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Gửi tin nhắn cho chúng tôi</h2>
            <p className="text-gray-600 mb-4">
              Nếu bạn có bất kỳ câu hỏi hoặc góp ý nào, vui lòng gửi email đến support@bookstation.vn. 
              Chúng tôi sẽ phản hồi trong vòng 24 giờ.
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

