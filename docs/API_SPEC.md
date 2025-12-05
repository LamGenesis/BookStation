# API SPECIFICATION
**Project:** BookStation
**Version:** 1.0 
**Status:** Released

## 1. AUTHENTICATION (Xác thực)
* `POST /api/auth/register`: Đăng ký tài khoản mới.
* `POST /api/auth/login`: Đăng nhập (Trả về JWT Access Token + Refresh Token).
* `POST /api/auth/refresh`: Cấp lại Access Token mới.
* `POST /api/auth/logout`: Đăng xuất.

## 2. CATEGORIES (Danh mục)
* `GET /api/categories`: Lấy danh sách danh mục (Public).
* `POST /api/categories`: [Admin] Tạo danh mục mới.
* `PUT /api/categories/{id}`: [Admin] Cập nhật danh mục.
* `DELETE /api/categories/{id}`: [Admin] Xóa danh mục.

## 3. PRODUCTS (Sản phẩm)
* `GET /api/products`: Lấy danh sách sản phẩm (Filter, Search, Pagination).
* `GET /api/products/{id}`: Xem chi tiết sản phẩm.
* `POST /api/products`: [Admin] Thêm sản phẩm (Multipart file upload).
* `PUT /api/products/{id}`: [Admin] Cập nhật thông tin.
* `DELETE /api/products/{id}`: [Admin] Ẩn/Xóa mềm.

## 4. CART (Giỏ hàng)
* `GET /api/cart`: Lấy giỏ hàng của User hiện tại.
* `POST /api/cart/items`: Thêm item vào giỏ.
* `PUT /api/cart/items/{id}`: Cập nhật số lượng.
* `DELETE /api/cart/items/{id}`: Xóa item khỏi giỏ.

## 5. ORDERS (Đơn hàng)
* `POST /api/orders`: Tạo đơn hàng (Checkout).
    * Body: `shippingInfo` (JSON), `paymentMethod`.
* `GET /api/orders`: Lịch sử đơn hàng (User) / Quản lý đơn (Admin).
* `GET /api/orders/{id}`: Chi tiết đơn hàng.
* `PUT /api/orders/{id}/status`: [Admin] Cập nhật trạng thái (Duyệt/Giao/Hủy).

## 6. PAYMENTS (Thanh toán)
* `POST /api/payments/mock`: Giả lập thanh toán (Simulation).
* `POST /api/payments/webhook`: Webhook nhận kết quả thanh toán.

## 7. POSTS (Tin tức)
* `GET /api/posts`: Lấy danh sách tin tức.
* `GET /api/posts/{id}`: Xem chi tiết tin tức.
* `POST /api/posts`: [Admin] Đăng bài viết mới.

## 8. STATISTICS (Thống kê)
* `GET /api/admin/statistics/sales`: Thống kê doanh thu theo thời gian.