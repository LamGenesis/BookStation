namespace BookStation.API.DTOs.Product
{
    /// <summary>
    /// DTO cập nhật sản phẩm (PUT /api/products/{id})
    /// </summary>
    public class UpdateProductDto
    {
        public string Name { get; set; } = string.Empty;
        public string? Description { get; set; }
        public decimal Price { get; set; }
        public decimal? DiscountPrice { get; set; }
        public int Quantity { get; set; }
        public int? CategoryId { get; set; }
        public int Status { get; set; }
    }
}

