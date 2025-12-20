# BookStation Backend API

Backend API của hệ thống BookStation được xây dựng bằng ASP.NET Core 8.0, sử dụng PostgreSQL làm cơ sở dữ liệu và JWT cho xác thực người dùng.

## 📋 Mục lục

- [Tổng quan](#tổng-quan)
- [Yêu cầu](#yêu-cầu)
- [Cài đặt](#cài-đặt)
- [Cấu hình](#cấu-hình)
- [Chạy ứng dụng](#chạy-ứng-dụng)
- [API Endpoints](#api-endpoints)
- [Cấu trúc dự án](#cấu-trúc-dự-án)
- [Database](#database)

## 🎯 Tổng quan

Backend API cung cấp RESTful API cho các chức năng:
- **Authentication**: Đăng ký, đăng nhập, refresh token, đăng xuất
- **Products**: Quản lý sản phẩm (CRUD), upload ảnh
- **Categories**: Quản lý danh mục sách
- **Cart**: Quản lý giỏ hàng
- **Orders**: Đặt hàng, xem lịch sử đơn hàng
- **Payments**: Tích hợp VNPay
- **Posts**: Quản lý bài viết/blog
- **Admin**: Dashboard, thống kê, quản lý người dùng

## 💻 Yêu cầu

- **.NET SDK 8.0** trở lên
- **PostgreSQL 15** (hoặc chạy qua Docker)
- **Visual Studio 2022** hoặc **VS Code** với C# extension

## 🔧 Cài đặt

### 1. Clone repository và vào thư mục backend

```bash
cd backend
```

### 2. Restore packages

```bash
dotnet restore
```

### 3. Cấu hình database

Tạo file `appsettings.Development.json` trong `BookStation/BookStation.API/`:

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Host=localhost;Port=5432;Database=bookstation;Username=postgres;Password=your_password"
  },
  "JwtSettings": {
    "SecretKey": "Your-Secret-Key-Must-Be-At-Least-32-Characters-Long-For-Security",
    "Issuer": "BookStation",
    "Audience": "BookStation",
    "AccessTokenExpirationMinutes": 60,
    "RefreshTokenExpirationDays": 7
  },
  "VNPay": {
    "TmnCode": "YOUR_TMN_CODE",
    "HashSecret": "YOUR_HASH_SECRET",
    "BaseUrl": "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html",
    "ReturnUrl": "http://localhost:3000/checkout/vnpay/return",
    "IpnUrl": "http://localhost:5074/api/payments/vnpay/ipn",
    "Version": "2.1.0",
    "Command": "pay",
    "CurrCode": "VND",
    "Locale": "vn"
  }
}
```

### 4. Tạo database

```bash
# Vào thư mục project
cd BookStation/BookStation.API

# Tạo migration (nếu chưa có)
dotnet ef migrations add InitialCreate

# Cập nhật database
dotnet ef database update
```

## ⚙️ Cấu hình

### Connection String

Cấu hình chuỗi kết nối PostgreSQL trong `appsettings.json` hoặc `appsettings.Development.json`:

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Host=localhost;Port=5432;Database=bookstation;Username=postgres;Password=your_password"
  }
}
```

### JWT Settings

```json
{
  "JwtSettings": {
    "SecretKey": "Your-Secret-Key-At-Least-32-Characters",
    "Issuer": "BookStation",
    "Audience": "BookStation",
    "AccessTokenExpirationMinutes": 60,
    "RefreshTokenExpirationDays": 7
  }
}
```

### VNPay Configuration

Cấu hình VNPay trong `appsettings.json` hoặc environment variables:

```json
{
  "VNPay": {
    "TmnCode": "YOUR_TMN_CODE",
    "HashSecret": "YOUR_HASH_SECRET",
    "BaseUrl": "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html",
    "ReturnUrl": "http://localhost:3000/checkout/vnpay/return",
    "IpnUrl": "http://localhost:5074/api/payments/vnpay/ipn"
  }
}
```

## 🚀 Chạy ứng dụng

### Chạy với Visual Studio

1. Mở `BookStation.sln` trong Visual Studio
2. Set `BookStation.API` làm startup project
3. Nhấn F5 hoặc Ctrl+F5

### Chạy với .NET CLI

```bash
cd BookStation/BookStation.API
dotnet run
```

API sẽ chạy tại: `https://localhost:7076` hoặc `http://localhost:5074`

### Chạy với Docker

Xem [README.md](../README.md) ở thư mục gốc để chạy toàn bộ stack với Docker Compose.

## 📡 API Endpoints

### Authentication

- `POST /api/auth/register` - Đăng ký tài khoản mới
- `POST /api/auth/login` - Đăng nhập (trả về Access Token + Refresh Token)
- `POST /api/auth/refresh` - Làm mới Access Token
- `POST /api/auth/logout` - Đăng xuất

### Categories

- `GET /api/categories` - Lấy danh sách danh mục (Public)
- `POST /api/categories` - [Admin] Tạo danh mục mới
- `PUT /api/categories/{id}` - [Admin] Cập nhật danh mục
- `DELETE /api/categories/{id}` - [Admin] Xóa danh mục

### Products

- `GET /api/products` - Lấy danh sách sản phẩm (có phân trang, tìm kiếm, lọc)
- `GET /api/products/{id}` - Xem chi tiết sản phẩm
- `POST /api/products` - [Admin] Thêm sản phẩm mới (multipart/form-data)
- `PUT /api/products/{id}` - [Admin] Cập nhật sản phẩm
- `DELETE /api/products/{id}` - [Admin] Xóa sản phẩm

### Cart

- `GET /api/cart` - Lấy giỏ hàng của user hiện tại
- `POST /api/cart/items` - Thêm sản phẩm vào giỏ hàng
- `PUT /api/cart/items/{id}` - Cập nhật số lượng
- `DELETE /api/cart/items/{id}` - Xóa item khỏi giỏ hàng
- `POST /api/cart/merge` - Đồng bộ giỏ hàng từ LocalStorage

### Orders

- `GET /api/orders` - Lấy danh sách đơn hàng của user
- `GET /api/orders/{id}` - Xem chi tiết đơn hàng
- `POST /api/orders` - Tạo đơn hàng mới

### Payments

- `POST /api/payments/vnpay/create` - Tạo URL thanh toán VNPay
- `GET /api/payments/vnpay/return` - Callback từ VNPay
- `POST /api/payments/vnpay/ipn` - IPN (Instant Payment Notification) từ VNPay

### Posts

- `GET /api/posts` - Lấy danh sách bài viết
- `GET /api/posts/{id}` - Xem chi tiết bài viết
- `POST /api/posts` - [Admin] Tạo bài viết mới
- `PUT /api/posts/{id}` - [Admin] Cập nhật bài viết
- `DELETE /api/posts/{id}` - [Admin] Xóa bài viết

### Admin

- `GET /api/admin/statistics/sales?from={date}&to={date}` - Thống kê doanh thu
- `GET /api/admin/orders` - Danh sách tất cả đơn hàng
- `GET /api/admin/orders/{id}` - Chi tiết đơn hàng
- `PUT /api/admin/orders/{id}/status` - Cập nhật trạng thái đơn hàng
- `GET /api/admin/users` - Danh sách người dùng

### Swagger UI

Khi chạy ở môi trường Development, truy cập Swagger UI tại:
- `https://localhost:7076/swagger` hoặc `http://localhost:5074/swagger`

## 📁 Cấu trúc dự án

```
BookStation.API/
├── Controllers/          # API Controllers
│   ├── Admin/          # Admin controllers
│   ├── AuthController.cs
│   ├── ProductsController.cs
│   ├── CategoriesController.cs
│   ├── CartController.cs
│   ├── OrdersController.cs
│   ├── PaymentsController.cs
│   └── PostsController.cs
│
├── Services/            # Business logic layer
│   ├── AuthService.cs
│   ├── ProductService.cs
│   ├── CartService.cs
│   ├── OrderService.cs
│   ├── VnPayService.cs
│   └── ...
│
├── Repositories/        # Data access layer
│   ├── IUserRepository.cs
│   ├── UserRepository.cs
│   ├── IProductRepository.cs
│   └── ...
│
├── Models/              # Entity models
│   ├── User.cs
│   ├── Product.cs
│   ├── Category.cs
│   ├── Order.cs
│   └── ...
│
├── DTOs/                # Data Transfer Objects
│   ├── Auth/
│   ├── Product/
│   ├── Order/
│   └── ...
│
├── Validators/          # FluentValidation validators
│
├── Data/                # Database context & seeding
│   ├── ApplicationDbContext.cs
│   └── DbSeeder.cs
│
├── Mappings/            # AutoMapper profiles
│   └── MappingProfile.cs
│
├── Migrations/          # EF Core migrations
│
└── wwwroot/             # Static files (uploaded images)
    └── uploads/
        └── products/
```

## 🗄️ Database

### Entity Framework Core

Dự án sử dụng Entity Framework Core với PostgreSQL:

```bash
# Tạo migration mới
dotnet ef migrations add MigrationName --project BookStation.API

# Cập nhật database
dotnet ef database update --project BookStation.API

# Xóa migration cuối cùng (chưa apply)
dotnet ef migrations remove --project BookStation.API
```

### Seed Data

Dữ liệu mẫu được seed tự động khi ứng dụng khởi động lần đầu (chỉ trong Development).

### Database Schema

Các bảng chính:
- `Users` - Người dùng
- `RefreshTokens` - Refresh tokens
- `Categories` - Danh mục sách
- `Products` - Sản phẩm
- `ProductImages` - Ảnh sản phẩm
- `CartItems` - Giỏ hàng
- `Orders` - Đơn hàng
- `OrderItems` - Chi tiết đơn hàng
- `Payments` - Thanh toán
- `Posts` - Bài viết

## 🔐 Authentication

### JWT Token Flow

1. User đăng nhập → Nhận `AccessToken` (60 phút) và `RefreshToken` (7 ngày)
2. Gửi `AccessToken` trong header: `Authorization: Bearer {token}`
3. Khi `AccessToken` hết hạn → Gọi `/api/auth/refresh` với `RefreshToken`
4. Nhận `AccessToken` mới

### Password Hashing

Mật khẩu được hash bằng BCrypt trước khi lưu vào database.

## 📦 Packages chính

- `Microsoft.EntityFrameworkCore` - ORM
- `Npgsql.EntityFrameworkCore.PostgreSQL` - PostgreSQL provider
- `Microsoft.AspNetCore.Authentication.JwtBearer` - JWT authentication
- `BCrypt.Net-Next` - Password hashing
- `FluentValidation.AspNetCore` - Validation
- `AutoMapper` - Object mapping
- `Swashbuckle.AspNetCore` - Swagger/OpenAPI

## 🐳 Docker

Xem [Dockerfile](./Dockerfile) để build Docker image:

```bash
docker build -t bookstation-backend .
```

Hoặc chạy với Docker Compose (xem [README.md](../README.md)).

## 📝 Notes

- File `appsettings.Development.json` không được commit vào Git (đã thêm vào `.gitignore`)
- Upload ảnh được lưu trong `wwwroot/uploads/products/`
- VNPay hiện đang sử dụng sandbox environment
- CORS được cấu hình cho `http://localhost:3000`

## 🐛 Troubleshooting

### Lỗi kết nối database

- Kiểm tra PostgreSQL đã chạy chưa
- Kiểm tra Connection String trong `appsettings.json`
- Đảm bảo database đã được tạo

### Lỗi migration

```bash
# Xóa tất cả migrations và tạo lại
dotnet ef database drop
dotnet ef migrations add InitialCreate
dotnet ef database update
```

### Lỗi upload file

- Kiểm tra thư mục `wwwroot/uploads/products/` đã tồn tại chưa
- Kiểm tra quyền ghi file
