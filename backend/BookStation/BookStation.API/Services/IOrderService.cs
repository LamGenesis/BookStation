using BookStation.API.DTOs.Order;

namespace BookStation.API.Services
{
    public interface IOrderService
    {
        /// <summary>
        /// Checkout - Tạo đơn hàng từ giỏ hàng của user
        /// </summary>
        Task<OrderDetailDto> CheckoutAsync(int userId, CreateOrderDto dto);

        /// <summary>
        /// Lấy danh sách đơn hàng của user
        /// </summary>
        Task<IEnumerable<OrderDto>> GetOrdersByUserAsync(int userId);

        /// <summary>
        /// Lấy tất cả đơn hàng (cho admin)
        /// </summary>
        Task<IEnumerable<OrderDto>> GetAllOrdersAsync();

        /// <summary>
        /// Lấy chi tiết đơn hàng
        /// </summary>
        Task<OrderDetailDto?> GetOrderDetailAsync(int orderId, int userId, bool isAdmin);

        /// <summary>
        /// Admin cập nhật trạng thái đơn hàng
        /// </summary>
        Task<OrderDetailDto> UpdateOrderStatusAsync(int orderId, UpdateOrderStatusDto dto);

        /// <summary>
        /// Hủy đơn hàng và khôi phục giỏ hàng (khi thanh toán thất bại/hủy)
        /// </summary>
        Task<bool> CancelOrderAndRestoreCartAsync(int orderId, int userId);
    }
}

