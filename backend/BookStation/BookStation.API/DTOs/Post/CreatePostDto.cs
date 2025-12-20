namespace BookStation.API.DTOs.Post
{
    /// <summary>
    /// DTO for creating a new post
    /// </summary>
    public class CreatePostDto
    {
        public string Title { get; set; } = string.Empty;
        public string Content { get; set; } = string.Empty;
        public string? ImageUrl { get; set; }
        public DateTime? PublishedAt { get; set; }
    }
}

