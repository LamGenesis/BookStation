using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BookStation.API.Models
{
    [Table("categories")]
    public class Category
    {
        [Key]
        [Column("id")]
        public int Id { get; set; }

        [Required]
        [Column("name")]
        [MaxLength(255)]
        public string Name { get; set; } = string.Empty;

        [Column("slug")]
        [MaxLength(255)]
        public string? Slug { get; set; }

        // Navigation Property
        // Một Category có nhiều Products
        public ICollection<Product> Products { get; set; } = new List<Product>();
    }
}