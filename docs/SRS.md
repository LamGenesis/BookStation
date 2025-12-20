# SOFTWARE REQUIREMENTS SPECIFICATION (SRS)
**Project:** BookStation
**Version:** 1.0
**Status:** Released

## 1. GIỚI THIỆU (INTRODUCTION)
### 1.1 Mục đích
Tài liệu này mô tả chi tiết các yêu cầu chức năng và phi chức năng cho hệ thống website bán sách BookStation. Hệ thống được xây dựng theo mô hình Client-Server (Headless Architecture).

### 1.2 Phạm vi (Scope)
Hệ thống bao gồm:
- **Client (Frontend):** Website cho khách hàng và trang quản trị (Admin Dashboard).
- **Server (Backend):** RESTful API cung cấp dữ liệu và xử lý nghiệp vụ.

## 2. CÁC TÁC NHÂN (ACTORS)
- **Guest (Khách vãng lai):** Người dùng chưa đăng nhập.
- **Customer (Khách hàng):** Người dùng đã có tài khoản và đăng nhập.
- **Administrator (Quản trị viên):** Người quản lý vận hành hệ thống.

## 3. SƠ ĐỒ USE CASE (USE CASE DIAGRAM)

![Sơ đồ Use Case BookStation](./assets/usecase.png)

## 4. USER STORIES (CÂU CHUYỆN NGƯỜI DÙNG)
Dưới đây là 6 User Stories cốt lõi của hệ thống:

1.  **Là Khách hàng**, tôi muốn **xem danh sách và tìm kiếm sách** để **chọn được cuốn sách cần mua**.
2.  **Là Khách hàng**, tôi muốn **xem chi tiết sách (giá, mô tả, ảnh)** để **ra quyết định mua hàng**.
3.  **Là Khách hàng**, tôi muốn **thêm sách vào giỏ hàng** để **tiếp tục mua sắm hoặc thanh toán sau**.
4.  **Là Khách hàng**, tôi muốn **đặt hàng (Checkout)** để **nhận sách giao về địa chỉ của mình**.
5.  **Là Admin**, tôi muốn **quản lý sách và danh mục** để **cập nhật kho hàng**.
6.  **Là Admin**, tôi muốn **xem thống kê doanh thu** để **nắm bắt tình hình kinh doanh**.

## 5. YÊU CẦU CHỨC NĂNG (FUNCTIONAL REQUIREMENTS)

### 5.1 Phân hệ Public (Guest - Khách vãng lai)
| ID | Tên chức năng | Mô tả chi tiết & Yêu cầu nghiệp vụ | Độ ưu tiên |
|---|---|---|---|
| **F-PUB-01** | Xem danh sách sách | Hiển thị sách mới, sách bán chạy. Hỗ trợ phân trang, lọc theo Danh mục. | MUST |
| **F-PUB-02** | Tìm kiếm sách | Tìm kiếm theo tên sách hoặc tên tác giả. | MUST |
| **F-PUB-03** | Xem chi tiết sách | Hiển thị: Tên, Giá, Giá giảm, Mô tả, Danh sách ảnh (Carousel), Tồn kho, Trạng thái. | MUST |
| **F-PUB-04** | Xem bài viết | Xem danh sách và chi tiết tin tức/blog. | SHOULD |
| **F-PUB-05** | Giỏ hàng (Guest) | Thêm/Sửa/Xóa sản phẩm. Lưu tạm trong Cookie/LocalStorage. | MUST |

### 5.2 Phân hệ Khách hàng (Customer - Đã đăng nhập)
*Bao gồm các quyền của Guest, cộng thêm:*

| ID | Tên chức năng | Mô tả chi tiết & Yêu cầu nghiệp vụ | Độ ưu tiên |
|---|---|---|---|
| **F-CUS-01** | Đăng ký / Đăng nhập | Đăng ký tài khoản mới. Đăng nhập lấy Token (JWT). | MUST |
| **F-CUS-02** | Quản lý giỏ hàng (DB) | Đồng bộ giỏ hàng từ LocalStorage vào Database (bảng CartItems) khi đăng nhập. | MUST |
| **F-CUS-03** | Thanh toán (Checkout) | Nhập thông tin giao hàng (Shipping Info JSON). Chọn phương thức (COD/Banking). Giả lập thanh toán (Mock Payment API). Kiểm tra tồn kho (Transaction). | MUST |
| **F-CUS-04** | Lịch sử đơn hàng | Xem danh sách đơn đã đặt. Xem trạng thái chi tiết. | MUST |
| **F-CUS-05** | Quản lý Profile | Cập nhật thông tin cá nhân. | SHOULD |
| **F-CUS-06** | Tích điểm thưởng | Tính năng mở rộng: Tích điểm dựa trên giá trị đơn hàng. | CAN |

### 5.3 Phân hệ Quản trị (Admin)
| ID | Tên chức năng | Mô tả chi tiết & Yêu cầu nghiệp vụ | Độ ưu tiên |
|---|---|---|---|
| **F-ADM-01** | Dashboard | Biểu đồ doanh thu theo ngày (Recharts). Thống kê tổng đơn, tổng user. | SHOULD |
| **F-ADM-02** | Quản lý Sản phẩm | CRUD Sách. Fields: Tên, Mô tả, Giá, Giá giảm, Số lượng, Status, Upload nhiều ảnh. | MUST |
| **F-ADM-03** | Quản lý Danh mục | CRUD Danh mục (Tên, Slug). | MUST |
| **F-ADM-04** | Quản lý Đơn hàng | Xem danh sách. Cập nhật trạng thái đơn (Duyệt/Giao/Hủy). | MUST |
| **F-ADM-05** | Quản lý Bài viết | CRUD tin tức (Tiêu đề, Nội dung, Ảnh bìa). | SHOULD |
| **F-ADM-06** | Quản lý User | Xem danh sách người dùng. | SHOULD |

## 6. THIẾT KẾ CƠ SỞ DỮ LIỆU (ERD)
Hệ thống bao gồm 9 bảng thực thể chính:
1. `Users` (Người dùng)
2. `Categories` (Danh mục)
3. `Products` (Sản phẩm)
4. `ProductImages` (Ảnh sản phẩm)
5. `CartItems` (Giỏ hàng)
6. `Orders` (Đơn hàng)
7. `OrderItems` (Chi tiết đơn hàng)
8. `Payments` (Thanh toán)
9. `Posts` (Tin tức)

![Sơ đồ ERD Database](./assets/erd-database.png)

## 7. YÊU CẦU PHI CHỨC NĂNG
- **Hiệu năng:** API phản hồi < 500ms. Hình ảnh được tối ưu hóa.
- **Bảo mật:** Password Hash (BCrypt). API Authentication (JWT).
    Sử dụng mô hình Access Token và Refresh Token, Refresh Token được lưu tại server để hỗ trợ duy trì phiên đăng nhập.
- **Database:** PostgreSQL (Dockerized). Dữ liệu tiền tệ dùng kiểu `Decimal`.
- **UI/UX:** Responsive trên Mobile/Desktop.