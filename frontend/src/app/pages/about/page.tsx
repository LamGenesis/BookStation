import Link from 'next/link';

export default function AboutPage() {
  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Giới thiệu về BookStation</h1>
        <div className="bg-white rounded-lg shadow-sm p-8 space-y-6">
          <section>
            <h2 className="text-xl font-semibold text-gray-800 mb-3">Về chúng tôi</h2>
            <p className="text-gray-600 leading-relaxed">
              BookStation là nhà sách trực tuyến hàng đầu Việt Nam, chuyên cung cấp các loại sách với đa dạng thể loại 
              từ văn học, kinh tế, công nghệ đến sách thiếu nhi. Chúng tôi cam kết mang đến cho khách hàng những cuốn sách 
              chất lượng với giá cả hợp lý và dịch vụ giao hàng nhanh chóng.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-800 mb-3">Sứ mệnh</h2>
            <p className="text-gray-600 leading-relaxed">
              Sứ mệnh của BookStation là lan tỏa văn hóa đọc và tri thức đến mọi người dân Việt Nam, 
              góp phần xây dựng một xã hội học tập và phát triển.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-800 mb-3">Giá trị cốt lõi</h2>
            <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4">
              <li><strong>Chất lượng:</strong> Chỉ cung cấp sách chính hãng, chất lượng cao</li>
              <li><strong>Uy tín:</strong> Đặt khách hàng làm trung tâm, phục vụ tận tâm</li>
              <li><strong>Tiện lợi:</strong> Mua sắm dễ dàng, giao hàng nhanh chóng</li>
              <li><strong>Giá cả:</strong> Giá tốt nhất thị trường với nhiều chương trình khuyến mãi</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-800 mb-3">Liên hệ</h2>
            <div className="text-gray-600 space-y-2">
              <p><strong>Địa chỉ:</strong> 02 Võ Oanh, P.25, Q.Bình Thạnh, TP.HCM</p>
              <p><strong>Điện thoại:</strong> 1900 1234</p>
              <p><strong>Email:</strong> support@bookstation.vn</p>
            </div>
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

