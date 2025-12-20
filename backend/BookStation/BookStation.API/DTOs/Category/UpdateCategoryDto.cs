namespace BookStation.API.DTOs.Category
{
    // DTO dùng để cập nhật Category
    public class UpdateCategoryDto
    {
        public string Name { get; set; } = string.Empty;
        public string? Slug { get; set; }
    }
}
