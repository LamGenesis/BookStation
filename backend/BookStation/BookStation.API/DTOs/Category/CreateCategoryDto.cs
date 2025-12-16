namespace BookStation.API.DTOs.Category
{
    // DTO dùng để tạo mới Category
    public class CreateCategoryDto
    {
        public string Name { get; set; } = string.Empty;
        public string? Slug { get; set; }
    }
}
