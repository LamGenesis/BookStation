using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BookStation.API.Models
{
    [Table("refresh_tokens")]
    public class RefreshToken
    {
        [Key]
        [Column("id")]
        public int Id { get; set; }

        [Required]
        [Column("token")]
        [MaxLength(500)]
        public string Token { get; set; } = string.Empty;

        [Required]
        [Column("user_id")]
        public int UserId { get; set; }

        [Column("expires_at")]
        public DateTime ExpiresAt { get; set; }

        [Column("created_at")]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        [Column("is_revoked")]
        public bool IsRevoked { get; set; } = false;

        // Navigation Property
        [ForeignKey("UserId")]
        public User User { get; set; } = null!;

    }
}
