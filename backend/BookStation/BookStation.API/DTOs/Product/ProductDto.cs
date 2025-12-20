namespace BookStation.API.DTOs.Product
{
    /// <summary>
    /// DTO dùng cho danh sách sản phẩm (GET /api/products)
    /// </summary>
    public class ProductDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public decimal Price { get; set; }
        public decimal? DiscountPrice { get; set; }
        public int Quantity { get; set; }
        public int Status { get; set; }
        public string? CategoryName { get; set; }
        public int? CategoryId { get; set; }
        public string? PrimaryImageUrl { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}

