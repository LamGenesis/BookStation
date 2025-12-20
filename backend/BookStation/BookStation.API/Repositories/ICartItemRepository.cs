using BookStation.API.Models;

namespace BookStation.API.Repositories
{
    public interface ICartItemRepository
    {
        /// <summary>
        /// Lấy tất cả cart items của user (bao gồm Product và ProductImages)
        /// </summary>
        Task<IEnumerable<CartItem>> GetByUserIdAsync(int userId);

        /// <summary>
        /// Lấy cart item theo id và userId (đảm bảo user chỉ truy cập cart của mình)
        /// </summary>
        Task<CartItem?> GetByIdAsync(int id, int userId);

        /// <summary>
        /// Lấy cart item theo userId và productId (để check trùng lặp)
        /// </summary>
        Task<CartItem?> GetByUserAndProductAsync(int userId, int productId);

        /// <summary>
        /// Thêm item vào giỏ hàng
        /// </summary>
        Task<CartItem> AddAsync(CartItem cartItem);

        /// <summary>
        /// Cập nhật cart item
        /// </summary>
        Task<CartItem> UpdateAsync(CartItem cartItem);

        /// <summary>
        /// Xóa cart item
        /// </summary>
        Task DeleteAsync(int id);

        /// <summary>
        /// Xóa tất cả cart items của user (dùng khi checkout)
        /// </summary>
        Task ClearCartAsync(int userId);
    }
}

