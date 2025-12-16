namespace BookStation.API.DTOs.Product
{
    /// <summary>
    /// Query parameters cho GET /api/products (pagination, filter, search, sort)
    /// </summary>
    public class ProductQueryParams
    {
        public int Page { get; set; } = 1;
        public int PageSize { get; set; } = 10;
        public string? Search { get; set; }
        public int? CategoryId { get; set; }
        public string? Sort { get; set; } // Ví dụ: "price_asc", "price_desc", "name_asc", "newest"
    }

    /// <summary>
    /// Response cho danh sách sản phẩm có phân trang
    /// </summary>
    public class PagedProductResponse
    {
        public List<ProductDto> Items { get; set; } = new List<ProductDto>();
        public int TotalItems { get; set; }
        public int TotalPages { get; set; }
        public int CurrentPage { get; set; }
        public int PageSize { get; set; }
    }
}

