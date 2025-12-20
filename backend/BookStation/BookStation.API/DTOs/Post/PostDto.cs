namespace BookStation.API.DTOs.Post
{
    /// <summary>
    /// DTO for post list display (compact)
    /// </summary>
    public class PostDto
    {
        public int Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public DateTime PublishedAt { get; set; }
        public string? AuthorName { get; set; }
        public string? ImageUrl { get; set; }
    }
}

