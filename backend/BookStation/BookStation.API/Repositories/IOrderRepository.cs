using BookStation.API.Models;

namespace BookStation.API.Repositories
{
    public interface IOrderRepository
    {
        /// <summary>
        /// Tạo đơn hàng mới (bao gồm OrderItems)
        /// </summary>
        Task<Order> CreateAsync(Order order);

        /// <summary>
        /// Lấy đơn hàng theo ID (include User, OrderItems, Products)
        /// </summary>
        Task<Order?> GetByIdAsync(int id);

        /// <summary>
        /// Lấy danh sách đơn hàng của user
        /// </summary>
        Task<IEnumerable<Order>> GetByUserIdAsync(int userId);

        /// <summary>
        /// Lấy tất cả đơn hàng (cho admin)
        /// </summary>
        Task<IEnumerable<Order>> GetAllAsync();

        /// <summary>
        /// Cập nhật trạng thái đơn hàng
        /// </summary>
        Task UpdateStatusAsync(int orderId, string status);

        /// <summary>
        /// Cập nhật trạng thái thanh toán
        /// </summary>
        Task UpdatePaymentStatusAsync(int orderId, string paymentStatus);

        /// <summary>
        /// Cập nhật đơn hàng
        /// </summary>
        Task<Order> UpdateAsync(Order order);
    }
}

