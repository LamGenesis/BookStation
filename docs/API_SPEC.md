# API SPECIFICATION
**Project:** BookStation
**Version:** 1.0 (MVP)
**Status:** Released

## 1. AUTHENTICATION (Xác thực)
* `POST /api/auth/register`: Đăng ký tài khoản mới.
* `POST /api/auth/login`: Đăng nhập (Trả về JWT Access Token + Refresh Token).
* `POST /api/auth/refresh`: Cấp lại Access Token mới bằng Refresh Token.
* `POST /api/auth/logout`: Đăng xuất (Thu hồi Refresh Token).

## 2. CATEGORIES (Danh mục)
* `GET /api/categories`: Lấy danh sách tất cả danh mục (Public).
* `POST /api/categories`: [Admin] Tạo danh mục mới.
* `PUT /api/categories/{id}`: [Admin] Cập nhật danh mục.
* `DELETE /api/categories/{id}`: [Admin] Xóa danh mục.

## 3. PRODUCTS (Sản phẩm)
* `GET /api/products`: Lấy danh sách sản phẩm.
    * *Query Params:* `page` (trang số mấy), `pageSize` (số lượng/trang), `search` (tìm theo tên), `categoryId` (lọc theo danh mục), `sort` (sắp xếp).
* `GET /api/products/{id}`: Xem chi tiết một sản phẩm.
* `POST /api/products`: [Admin] Thêm sản phẩm mới.
    * *Content-Type:* `multipart/form-data` (Hỗ trợ upload file ảnh).
* `PUT /api/products/{id}`: [Admin] Cập nhật thông tin sản phẩm.
* `DELETE /api/products/{id}`: [Admin] Ẩn hoặc xóa mềm sản phẩm.

## 4. CART (Giỏ hàng)
* `GET /api/cart`: Lấy giỏ hàng hiện tại của User đang đăng nhập.
* `POST /api/cart/items`: Thêm sản phẩm vào giỏ hàng.
    * *Body:* `{ "productId": 1, "quantity": 1 }`
* `PUT /api/cart/items/{id}`: Cập nhật số lượng item trong giỏ.
* `DELETE /api/cart/items/{id}`: Xóa item khỏi giỏ hàng.
* `POST /api/cart/merge`: Đồng bộ giỏ hàng của khách (LocalStorage) vào giỏ hàng người dùng sau khi đăng nhập. Payload gồm danh sách sản phẩm và số lượng. Nếu sản phẩm đã tồn tại trong giỏ hàng của người dùng, hệ thống sẽ cộng dồn số lượng.

## 5. ORDERS (Đơn hàng)
* `POST /api/orders`: Tạo đơn hàng mới (Checkout).
    * *Body:*
        ```json
        {
          "shippingInfo": {
            "receiverName": "Nguyen Van A",
            "phone": "0909123456",
            "address": "123 Đường ABC, TP.HCM"
          },
          "paymentMethod": "COD"
        }
        ```
* `GET /api/orders`: Lấy lịch sử đơn hàng của User đang đăng nhập.
* `GET /api/orders/{id}`: Xem chi tiết đơn hàng (User xem đơn mình, Admin xem tất cả).
* `PUT /api/orders/{id}/status`: [Admin] Cập nhật trạng thái đơn hàng (Duyệt, Giao hàng, Hủy).

## 6. PAYMENTS (Thanh toán)
* `POST /api/payments/mock`: Giả lập thanh toán (Simulation).
* `POST /api/payments/webhook`: Webhook nhận kết quả thanh toán từ cổng giả lập.

## 7. POSTS (Tin tức)
* `GET /api/posts`: Lấy danh sách bài viết tin tức.
* `GET /api/posts/{id}`: Xem chi tiết bài viết.
* `POST /api/posts`: [Admin] Đăng bài viết mới.
* `PUT /api/posts/{id}`: [Admin] Cập nhật bài viết.
* `DELETE /api/posts/{id}`: [Admin] Xóa bài viết.

## 8. STATISTICS (Thống kê)
* `GET /api/admin/statistics/sales`: Thống kê doanh thu và số lượng đơn hàng.
    * *Query Params:* `from` (ngày bắt đầu), `to` (ngày kết thúc).

## 9. ADMIN USERS
* `GET /api/admin/users`: [Admin] Lấy danh sách người dùng (hỗ trợ phân trang nếu cần).
* `GET /api/admin/users/{id}`: [Admin] Xem thông tin chi tiết của một người dùng.
