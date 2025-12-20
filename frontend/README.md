# BookStation Frontend

Frontend của hệ thống BookStation được xây dựng bằng Next.js 16 (App Router), React 19, TypeScript và Tailwind CSS.

## 📋 Mục lục

- [Tổng quan](#tổng-quan)
- [Yêu cầu](#yêu-cầu)
- [Cài đặt](#cài-đặt)
- [Cấu hình](#cấu-hình)
- [Chạy ứng dụng](#chạy-ứng-dụng)
- [Cấu trúc dự án](#cấu-trúc-dự-án)
- [Tính năng](#tính-năng)
- [Scripts](#scripts)

## 🎯 Tổng quan

Frontend cung cấp giao diện người dùng cho:
- **Khách hàng**: Duyệt sách, giỏ hàng, đặt hàng, quản lý tài khoản
- **Quản trị viên**: Dashboard, quản lý sản phẩm, đơn hàng, thống kê

## 💻 Yêu cầu

- **Node.js**: Version 20 trở lên
- **npm** hoặc **yarn** hoặc **pnpm**

## 🔧 Cài đặt

### 1. Clone repository và vào thư mục frontend

```bash
cd frontend
```

### 2. Cài đặt dependencies

```bash
npm install
# hoặc
yarn install
# hoặc
pnpm install
```

### 3. Cấu hình môi trường

Tạo file `.env.local` trong thư mục `frontend/`:

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:5074/api
```

**Lưu ý**: Khi chạy với Docker, sử dụng `/api` (relative URL) để đi qua Next.js API proxy.

## ⚙️ Cấu hình

### Environment Variables

| Biến | Mô tả | Giá trị mặc định |
|------|-------|------------------|
| `NEXT_PUBLIC_API_BASE_URL` | Base URL của Backend API | `http://localhost:5074/api` |

### Next.js Config

File `next.config.ts` đã được cấu hình:
- Standalone output cho Docker
- Image domains cho Next.js Image component
- React Strict Mode

## 🚀 Chạy ứng dụng

### Development

```bash
npm run dev
# hoặc
yarn dev
# hoặc
pnpm dev
```

Ứng dụng sẽ chạy tại: http://localhost:3000

### Production Build

```bash
# Build
npm run build

# Chạy production server
npm start
```

### Chạy với Docker

Xem [README.md](../README.md) ở thư mục gốc để chạy toàn bộ stack với Docker Compose.

## 📁 Cấu trúc dự án

```
frontend/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── (auth)/            # Auth routes (login, register)
│   │   ├── admin/             # Admin dashboard
│   │   │   ├── page.tsx       # Dashboard chính
│   │   │   ├── products/      # Quản lý sản phẩm
│   │   │   ├── categories/    # Quản lý danh mục
│   │   │   ├── orders/        # Quản lý đơn hàng
│   │   │   └── posts/         # Quản lý bài viết
│   │   ├── api/               # Next.js API routes (proxy)
│   │   │   ├── [...path]/     # Catch-all proxy to backend
│   │   │   └── uploads/       # Proxy static files
│   │   ├── cart/              # Trang giỏ hàng
│   │   ├── checkout/          # Thanh toán
│   │   ├── products/           # Danh sách & chi tiết sản phẩm
│   │   ├── posts/              # Danh sách & chi tiết bài viết
│   │   ├── profile/             # Quản lý tài khoản
│   │   ├── pages/              # Static pages (about, contact, etc.)
│   │   ├── layout.tsx          # Root layout
│   │   └── page.tsx            # Trang chủ
│   │
│   ├── components/             # React components
│   │   ├── home/              # Components trang chủ
│   │   ├── layout/             # Layout components (Header, Footer)
│   │   ├── products/           # Product components
│   │   └── shared/             # Shared components (Button, Modal, etc.)
│   │
│   ├── lib/                    # Utilities & configurations
│   │   ├── api/               # API clients
│   │   │   ├── admin.ts       # Admin API
│   │   │   ├── auth.ts        # Auth API
│   │   │   ├── cart.ts        # Cart API
│   │   │   ├── products.ts    # Products API
│   │   │   └── ...
│   │   ├── providers.tsx      # React Query & Toast providers
│   │   ├── queryClient.ts      # TanStack Query client
│   │   ├── utils.ts            # Utility functions
│   │   └── validations/        # Zod schemas
│   │
│   ├── store/                  # Zustand stores
│   │   ├── authStore.ts       # Authentication state
│   │   └── cartStore.ts       # Cart state (localStorage)
│   │
│   ├── hooks/                  # Custom React hooks
│   │   ├── useAuth.ts         # Auth hook
│   │   └── useCart.ts         # Cart hook
│   │
│   └── types/                  # TypeScript type definitions
│       └── index.ts
│
├── public/                     # Static assets
│   └── images/                 # Images
│
├── Dockerfile                  # Docker image
├── next.config.ts             # Next.js configuration
├── tailwind.config.ts          # Tailwind CSS configuration
├── tsconfig.json               # TypeScript configuration
└── package.json                # Dependencies
```

## ✨ Tính năng

### Trang chủ
- Hero section với banner và danh mục
- Sách mới về
- Bài viết/blog nổi bật
- Policy bar (cam kết dịch vụ)

### Sản phẩm
- Danh sách sản phẩm với phân trang
- Tìm kiếm theo tên
- Lọc theo danh mục
- Sắp xếp (giá, tên)
- Chi tiết sản phẩm với carousel ảnh

### Giỏ hàng
- Thêm/sửa/xóa sản phẩm
- Lưu trữ tạm thời (localStorage) cho guest
- Đồng bộ với database khi đăng nhập
- Optimistic updates

### Thanh toán
- Form nhập thông tin giao hàng
- Chọn phương thức thanh toán (COD/VNPay)
- Tích hợp VNPay gateway
- Trang thành công/trả về từ VNPay

### Quản lý tài khoản
- Xem thông tin cá nhân
- Xem lịch sử đơn hàng
- Chi tiết đơn hàng

### Admin Dashboard
- Thống kê doanh thu, đơn hàng, khách hàng
- Biểu đồ doanh thu theo ngày (Recharts)
- Quản lý sản phẩm (CRUD, upload ảnh)
- Quản lý danh mục
- Quản lý đơn hàng
- Quản lý bài viết

## 📦 Dependencies chính

### Core
- `next`: 16.0.10 - React framework
- `react`: 19.2.1 - UI library
- `react-dom`: 19.2.1 - React DOM
- `typescript`: ^5 - Type safety

### State & Data
- `zustand`: ^5.0.9 - State management
- `@tanstack/react-query`: ^5.90.12 - Data fetching & caching
- `axios`: ^1.13.2 - HTTP client

### Forms & Validation
- `react-hook-form`: ^7.68.0 - Form handling
- `@hookform/resolvers`: ^5.2.2 - Form validation resolvers
- `zod`: ^4.2.1 - Schema validation

### UI & Styling
- `tailwindcss`: ^4 - CSS framework
- `@headlessui/react`: ^2.2.9 - UI components

### Charts
- `recharts`: ^3.6.0 - Chart library

## 🛠 Scripts

```bash
# Development server
npm run dev

# Production build
npm run build

# Start production server
npm start

# Lint code
npm run lint
```

## 🔐 Authentication

### Flow
1. User đăng nhập → Nhận JWT tokens
2. Tokens được lưu trong `localStorage`
3. `AccessToken` được gửi kèm mỗi request (header `Authorization`)
4. Khi `AccessToken` hết hạn → Tự động refresh bằng `RefreshToken`
5. State được quản lý bằng Zustand với persistence

### Protected Routes
- `/cart` - Yêu cầu đăng nhập
- `/checkout` - Yêu cầu đăng nhập
- `/profile/*` - Yêu cầu đăng nhập
- `/admin/*` - Yêu cầu đăng nhập + role Admin

## 🎨 Styling

### Tailwind CSS
Dự án sử dụng Tailwind CSS 4 với:
- Utility-first approach
- Custom color scheme
- Responsive design (mobile-first)

### Components
- Reusable components trong `src/components/shared/`
- Button, Modal, Loading, Toast notifications

## 📡 API Communication

### API Client
- Base URL: `/api` (relative, đi qua Next.js proxy)
- Axios instance với interceptors cho JWT refresh
- Error handling tự động

### Next.js API Proxy
- Route: `/api/[...path]` - Proxy tất cả requests đến backend
- Route: `/api/uploads/[...path]` - Proxy static files
- Backend URL: `http://backend:8080` (Docker) hoặc `http://localhost:5074` (local)

## 🐳 Docker

Xem [Dockerfile](./Dockerfile) để build Docker image:

```bash
docker build -t bookstation-frontend .
```

Hoặc chạy với Docker Compose (xem [README.md](../README.md)).

## 🐛 Troubleshooting

### Lỗi kết nối API

- Kiểm tra `NEXT_PUBLIC_API_BASE_URL` trong `.env.local`
- Đảm bảo backend đã chạy
- Kiểm tra CORS settings trên backend

### Lỗi build

```bash
# Xóa .next và node_modules, cài lại
rm -rf .next node_modules
npm install
npm run build
```

### Lỗi TypeScript

```bash
# Kiểm tra types
npm run type-check
```

## 📝 Notes

- File `.env.local` không được commit vào Git
- Images được optimize bởi Next.js Image component
- API proxy giúp tránh CORS issues và cho phép server-side rendering
- State persistence với Zustand + localStorage
