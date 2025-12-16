namespace BookStation.API.DTOs.Product
{
    /// <summary>
    /// DTO tạo sản phẩm mới (POST /api/products)
    /// Không bao gồm file ảnh - ảnh được gửi riêng qua IFormFile
    /// </summary>
    public class CreateProductDto
    {
        public string Name { get; set; } = string.Empty;
        public string? Description { get; set; }
        public decimal Price { get; set; }
        public decimal? DiscountPrice { get; set; }
        public int Quantity { get; set; }
        public int? CategoryId { get; set; }
        public int Status { get; set; } = 1; // Default: Active
    }
}

