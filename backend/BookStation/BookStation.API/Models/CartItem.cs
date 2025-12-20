using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BookStation.API.Models
{
    [Table("cart_items")]
    public class CartItem
    {
        [Key]
        [Column("id")]
        public int Id { get; set; }

        [Column("user_id")]
        public int? UserId { get; set; }

        [Column("product_id")]
        public int? ProductId { get; set; }

        [Required]
        [Column("quantity")]
        public int Quantity { get; set; } = 1;

        [Column("price_at_add", TypeName = "decimal(10,2)")]
        public decimal? PriceAtAdd { get; set; }

        // Navigation Properties
        [ForeignKey("UserId")]
        public User? User { get; set; }

        [ForeignKey("ProductId")]
        public Product? Product { get; set; }
    }
}