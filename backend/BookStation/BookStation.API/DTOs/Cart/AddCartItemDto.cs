namespace BookStation.API.DTOs.Cart
{
    /// <summary>
    /// DTO để thêm sản phẩm vào giỏ hàng
    /// </summary>
    public class AddCartItemDto
    {
        public int ProductId { get; set; }
        public int Quantity { get; set; } = 1;
    }
}

