# BookStation - Hệ thống bán sách trực tuyến

BookStation là một hệ thống website bán sách trực tuyến được xây dựng theo kiến trúc Client-Server (Headless Architecture), cho phép khách hàng mua sách và quản trị viên quản lý sản phẩm, đơn hàng, thống kê doanh thu.

## 📋 Mục lục

- [Tính năng chính](#tính-năng-chính)
- [Tech Stack](#tech-stack)
- [Cấu trúc dự án](#cấu-trúc-dự-án)
- [Yêu cầu hệ thống](#yêu-cầu-hệ-thống)
- [Cài đặt và chạy dự án](#cài-đặt-và-chạy-dự-án)
- [Cấu hình môi trường](#cấu-hình-môi-trường)
- [Truy cập ứng dụng](#truy-cập-ứng-dụng)
- [Tài liệu](#tài-liệu)

## ✨ Tính năng chính

### Cho khách hàng
- **Xem sản phẩm**: Duyệt danh sách sách, tìm kiếm, lọc theo danh mục
- **Chi tiết sản phẩm**: Xem thông tin, hình ảnh, giá cả, mô tả
- **Giỏ hàng**: Thêm/sửa/xóa sản phẩm, lưu trữ tạm thời
- **Đặt hàng**: Thanh toán COD hoặc VNPay
- **Quản lý đơn hàng**: Xem lịch sử và trạng thái đơn hàng
- **Quản lý tài khoản**: Cập nhật thông tin cá nhân
- **Đọc blog**: Xem các bài viết về sách

### Cho quản trị viên
- **Dashboard**: Thống kê doanh thu, đơn hàng, khách hàng theo thời gian
- **Quản lý sản phẩm**: Thêm/sửa/xóa sản phẩm, upload nhiều ảnh
- **Quản lý danh mục**: Tạo và quản lý các danh mục sách
- **Quản lý đơn hàng**: Xem chi tiết và cập nhật trạng thái đơn hàng
- **Quản lý bài viết**: Tạo và chỉnh sửa các bài viết blog

## 🛠 Tech Stack

### Frontend
- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **UI Library**: React 19
- **Styling**: Tailwind CSS 4
- **State Management**: Zustand
- **Data Fetching**: TanStack Query (React Query)
- **Form Handling**: React Hook Form + Zod
- **Charts**: Recharts

### Backend
- **Framework**: ASP.NET Core 8.0
- **Language**: C#
- **ORM**: Entity Framework Core
- **Database**: PostgreSQL 15
- **Authentication**: JWT (Access Token + Refresh Token)
- **Password Hashing**: BCrypt
- **Validation**: FluentValidation
- **Payment Gateway**: VNPay

### DevOps & Tools
- **Containerization**: Docker & Docker Compose
- **Database Management**: Adminer
- **Version Control**: Git (Gitflow workflow)
- **API Documentation**: Swagger/OpenAPI

## 📝 License

Dự án này được phát triển cho mục đích học tập và thực tập tốt nghiệp.

## 👥 Đóng góp

Dự án này là một phần của khóa thực tập tốt nghiệp. Mọi đóng góp và phản hồi đều được chào đón!
