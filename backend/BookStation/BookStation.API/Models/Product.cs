using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BookStation.API.Models
{
    [Table("products")]
    public class Product
    {
        [Key]
        [Column("id")]
        public int Id { get; set; }

        [Column("category_id")]
        public int? CategoryId { get; set; }

        [Required]
        [Column("name")]
        [MaxLength(500)]
        public string Name { get; set; } = string.Empty;

        [Column("description")]
        public string? Description { get; set; }

        [Required]
        [Column("price", TypeName = "decimal(10,2)")]
        public decimal Price { get; set; }

        [Column("discount_price", TypeName = "decimal(10,2)")]
        public decimal? DiscountPrice { get; set; }

        [Required]
        [Column("quantity")]
        public int Quantity { get; set; } = 0;

        [Column("status")]
        public int Status { get; set; } = 1;

        [Column("created_at")]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        // Navigation Properties
        // Foreign Key
        [ForeignKey("CategoryId")]
        public Category? Category { get; set; }

        // Một Product có nhiều Images
        public ICollection<ProductImage> ProductImages { get; set; } = new List<ProductImage>();

        // Một Product xuất hiện trong nhiều CartItems
        public ICollection<CartItem> CartItems { get; set; } = new List<CartItem>();

        // Một Product xuất hiện trong nhiều OrderItems
        public ICollection<OrderItem> OrderItems { get; set; } = new List<OrderItem>();
    }
}