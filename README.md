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

## 📁 Cấu trúc dự án

```
BookStation/
├── backend/                    # Backend API (ASP.NET Core)
│   ├── BookStation/
│   │   └── BookStation.API/   # Main API project
│   ├── Dockerfile             # Docker image cho backend
│   ├── sql/                   # SQL scripts
│   └── README.md              # Tài liệu backend
│
├── frontend/                   # Frontend (Next.js)
│   ├── src/
│   │   ├── app/              # Next.js App Router pages
│   │   ├── components/       # React components
│   │   ├── lib/              # Utilities, API clients
│   │   ├── store/            # Zustand stores
│   │   └── types/            # TypeScript types
│   ├── Dockerfile            # Docker image cho frontend
│   └── README.md             # Tài liệu frontend
│
├── docs/                      # Tài liệu dự án
│   ├── SRS.md                # Software Requirements Specification
│   ├── SAD.md                # Software Architecture Document
│   └── API_SPEC.md           # API Specification
│
├── docker-compose.yml         # Docker Compose configuration
├── .env                       # Environment variables 
└── README.md                  # File này
```

## 💻 Yêu cầu hệ thống

- **Docker**: Version 20.10 trở lên
- **Docker Compose**: Version 2.0 trở lên
- **Git**: Để clone repository

**Lưu ý**: Nếu chạy không dùng Docker, xem README trong từng thư mục `backend/` và `frontend/`.

## 🚀 Cài đặt và chạy dự án

### 1. Clone repository

```bash
git clone <repository-url>
cd BookStation
```

### 2. Tạo file `.env`

Tạo file `.env` ở thư mục gốc với nội dung:

```env
# Database
POSTGRES_DB=bookstation
POSTGRES_USER=postgres
POSTGRES_PASSWORD=your_secure_password

# VNPay (Sandbox)
VNPAY_TMN_CODE=your_tmn_code
VNPAY_HASH_SECRET=your_hash_secret
```

### 3. Chạy với Docker Compose

```bash
# Build và khởi động tất cả services
docker-compose up -d --build

# Xem logs
docker-compose logs -f

# Dừng services
docker-compose down

# Dừng và xóa volumes (xóa dữ liệu database)
docker-compose down -v
```

### 4. Khởi tạo database

Database sẽ tự động được tạo và seed dữ liệu mẫu khi backend khởi động lần đầu.

## ⚙️ Cấu hình môi trường

### Biến môi trường trong `.env`

| Biến | Mô tả | Ví dụ |
|------|-------|-------|
| `POSTGRES_DB` | Tên database | `bookstation` |
| `POSTGRES_USER` | Username PostgreSQL | `postgres` |
| `POSTGRES_PASSWORD` | Password PostgreSQL | `your_password` |
| `VNPAY_TMN_CODE` | Mã merchant VNPay | `YOUR_TMN_CODE` |
| `VNPAY_HASH_SECRET` | Secret key VNPay | `YOUR_HASH_SECRET` |

### Ports mặc định

| Service | Port | URL |
|---------|------|-----|
| Frontend | 3000 | http://localhost:3000 |
| Backend API | 5074 | http://localhost:5074 |
| PostgreSQL | 5432 | localhost:5432 |
| Adminer | 8080 | http://localhost:8080 |

## 🌐 Truy cập ứng dụng

- **Frontend (Khách hàng)**: http://localhost:3000
- **Admin Dashboard**: http://localhost:3000/admin
- **Backend API**: http://localhost:5074
- **Swagger UI**: http://localhost:5074/swagger (chỉ trong Development)
- **Adminer (Database UI)**: http://localhost:8080

### Thông tin đăng nhập mặc định

Sau khi seed dữ liệu, bạn có thể tạo tài khoản admin thông qua database hoặc API.

## 📚 Tài liệu

- [Backend README](./backend/README.md) - Hướng dẫn chi tiết về Backend API
- [Frontend README](./frontend/README.md) - Hướng dẫn chi tiết về Frontend
- [API Specification](./docs/API_SPEC.md) - Tài liệu API endpoints
- [SRS](./docs/SRS.md) - Software Requirements Specification
- [SAD](./docs/SAD.md) - Software Architecture Document

## 🔧 Troubleshooting

### Lỗi kết nối database

```bash
# Kiểm tra container database có chạy không
docker-compose ps

# Xem logs database
docker-compose logs db

# Restart database
docker-compose restart db
```

### Lỗi frontend không kết nối được backend

- Kiểm tra `BACKEND_URL` trong `docker-compose.yml`
- Đảm bảo backend đã khởi động hoàn toàn
- Xem logs: `docker-compose logs frontend backend`

### Xóa và tạo lại database

```bash
# Dừng và xóa volumes
docker-compose down -v

# Khởi động lại
docker-compose up -d
```

## 📝 License

Dự án này được phát triển cho mục đích học tập và thực tập tốt nghiệp.

## 👥 Đóng góp

Dự án này là một phần của khóa thực tập tốt nghiệp. Mọi đóng góp và phản hồi đều được chào đón!
