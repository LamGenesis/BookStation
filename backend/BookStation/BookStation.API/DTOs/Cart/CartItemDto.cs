namespace BookStation.API.DTOs.Cart
{
    /// <summary>
    /// DTO cho một item trong giỏ hàng
    /// </summary>
    public class CartItemDto
    {
        public int Id { get; set; }
        public int ProductId { get; set; }
        public string ProductName { get; set; } = string.Empty;
        public decimal UnitPrice { get; set; }
        public decimal? DiscountPrice { get; set; }
        public int Quantity { get; set; }
        public decimal Subtotal { get; set; }
        public string? PrimaryImageUrl { get; set; }
        public int AvailableStock { get; set; }
    }
}

