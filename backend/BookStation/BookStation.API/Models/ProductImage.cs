using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BookStation.API.Models
{
    [Table("product_images")]
    public class ProductImage
    {
        [Key]
        [Column("id")]
        public int Id { get; set; }

        [Column("product_id")]
        public int? ProductId { get; set; }

        [Required]
        [Column("url")]
        [MaxLength(500)]
        public string Url { get; set; } = string.Empty;

        [Column("is_primary")]
        public bool IsPrimary { get; set; } = false;

        // Navigation Property
        [ForeignKey("ProductId")]
        public Product? Product { get; set; }
    }
}