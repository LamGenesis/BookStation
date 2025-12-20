using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BookStation.API.Models
{
    [Table("posts")]
    public class Post
    {
        [Key]
        [Column("id")]
        public int Id { get; set; }

        [Required]
        [Column("title")]
        [MaxLength(500)]
        public string Title { get; set; } = string.Empty;

        [Required]
        [Column("content")]
        public string Content { get; set; } = string.Empty;

        [Column("author_id")]
        public int? AuthorId { get; set; }

        [Column("published_at")]
        public DateTime PublishedAt { get; set; } = DateTime.UtcNow;

        [Column("image_url")]
        [MaxLength(500)]
        public string? ImageUrl { get; set; }

        // Navigation Property
        [ForeignKey("AuthorId")]
        public User? Author { get; set; }
    }
}