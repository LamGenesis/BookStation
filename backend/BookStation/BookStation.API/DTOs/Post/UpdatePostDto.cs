namespace BookStation.API.DTOs.Post
{
    /// <summary>
    /// DTO for updating an existing post
    /// </summary>
    public class UpdatePostDto
    {
        public string Title { get; set; } = string.Empty;
        public string Content { get; set; } = string.Empty;
        public string? ImageUrl { get; set; }
        public DateTime? PublishedAt { get; set; }
    }
}

