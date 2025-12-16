namespace BookStation.API.DTOs.Category
{
    // DTO dùng để trả về thông tin Category
    public class CategoryDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string? Slug { get; set; }
    }
}
