using BookStation.API.DTOs.Cart;

namespace BookStation.API.Services
{
    public interface ICartService
    {
        /// <summary>
        /// Lấy giỏ hàng của user hiện tại
        /// </summary>
        Task<CartResponseDto> GetCartAsync(int userId);

        /// <summary>
        /// Thêm sản phẩm vào giỏ hàng (nếu đã có thì cộng dồn quantity)
        /// </summary>
        Task<CartItemDto> AddItemAsync(int userId, AddCartItemDto dto);

        /// <summary>
        /// Cập nhật số lượng item trong giỏ hàng
        /// </summary>
        Task<CartItemDto> UpdateItemAsync(int userId, int cartItemId, UpdateCartItemDto dto);

        /// <summary>
        /// Xóa item khỏi giỏ hàng
        /// </summary>
        Task RemoveItemAsync(int userId, int cartItemId);

        /// <summary>
        /// Xóa toàn bộ giỏ hàng của user
        /// </summary>
        Task ClearCartAsync(int userId);
    }
}

