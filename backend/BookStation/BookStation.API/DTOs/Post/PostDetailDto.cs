namespace BookStation.API.DTOs.Post
{
    /// <summary>
    /// DTO for detailed post view
    /// </summary>
    public class PostDetailDto
    {
        public int Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Content { get; set; } = string.Empty;
        public DateTime PublishedAt { get; set; }
        public string? AuthorName { get; set; }
        public string? ImageUrl { get; set; }
    }
}

