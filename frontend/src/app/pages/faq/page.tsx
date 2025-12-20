import Link from 'next/link';

export default function FAQPage() {
  const faqs = [
    {
      question: 'Làm thế nào để đặt hàng?',
      answer: 'Bạn có thể đặt hàng bằng cách: (1) Tìm kiếm sách trên website, (2) Thêm sách vào giỏ hàng, (3) Điền thông tin giao hàng và thanh toán, (4) Xác nhận đơn hàng.'
    },
    {
      question: 'Tôi có thể thanh toán bằng cách nào?',
      answer: 'BookStation hỗ trợ 2 phương thức thanh toán: (1) Thanh toán khi nhận hàng (COD), (2) Thanh toán trực tuyến qua VNPay (thẻ ATM, thẻ tín dụng, ví điện tử).'
    },
    {
      question: 'Phí vận chuyển là bao nhiêu?',
      answer: 'Hiện tại BookStation đang miễn phí vận chuyển cho tất cả các đơn hàng trên toàn quốc.'
    },
    {
      question: 'Thời gian giao hàng là bao lâu?',
      answer: 'Thời gian giao hàng: Nội thành TP.HCM (1-2 ngày), các tỉnh thành khác (3-5 ngày), vùng sâu vùng xa (5-7 ngày).'
    },
    {
      question: 'Tôi có thể đổi trả sách không?',
      answer: 'Có, bạn có thể đổi trả sách trong vòng 7 ngày kể từ ngày nhận hàng nếu sách bị lỗi, hư hỏng, hoặc giao nhầm. Vui lòng liên hệ hotline 1900 1234 để được hỗ trợ.'
    },
    {
      question: 'Làm sao để theo dõi đơn hàng?',
      answer: 'Bạn có thể theo dõi đơn hàng trong mục "Đơn hàng của tôi" sau khi đăng nhập, hoặc liên hệ hotline 1900 1234 với mã đơn hàng của bạn.'
    },
    {
      question: 'Sách có đảm bảo chính hãng không?',
      answer: 'Tất cả sách tại BookStation đều là sách chính hãng, được nhập từ các nhà xuất bản uy tín. Chúng tôi cam kết chất lượng sách 100%.'
    },
    {
      question: 'Tôi quên mật khẩu, làm sao để lấy lại?',
      answer: 'Bạn có thể sử dụng tính năng "Quên mật khẩu" trên trang đăng nhập. Hệ thống sẽ gửi email hướng dẫn đặt lại mật khẩu mới.'
    }
  ];

  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Câu hỏi thường gặp (FAQ)</h1>
        <div className="bg-white rounded-lg shadow-sm p-8 space-y-6">
          {faqs.map((faq, index) => (
            <div key={index} className="border-b border-gray-200 pb-6 last:border-0 last:pb-0">
              <h2 className="text-lg font-semibold text-gray-800 mb-2">
                {index + 1}. {faq.question}
              </h2>
              <p className="text-gray-600 leading-relaxed">
                {faq.answer}
              </p>
            </div>
          ))}

          <div className="pt-6 border-t">
            <p className="text-gray-600 mb-4">
              Không tìm thấy câu trả lời? Vui lòng liên hệ với chúng tôi:
            </p>
            <div className="text-gray-600 space-y-2">
              <p><strong>Hotline:</strong> 1900 1234</p>
              <p><strong>Email:</strong> support@bookstation.vn</p>
            </div>
            <div className="mt-6">
              <Link href="/" className="text-blue-600 hover:text-blue-700">
                ← Quay lại trang chủ
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

