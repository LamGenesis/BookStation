namespace BookStation.API.DTOs.Cart
{
    /// <summary>
    /// DTO cho toàn bộ giỏ hàng của user
    /// </summary>
    public class CartResponseDto
    {
        public List<CartItemDto> Items { get; set; } = new List<CartItemDto>();
        public int TotalQuantity { get; set; }
        public decimal TotalAmount { get; set; }
    }
}

