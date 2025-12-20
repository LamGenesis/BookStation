using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BookStation.API.Models
{
    [Table("order_items")]
    public class OrderItem
    {
        [Key]
        [Column("id")]
        public int Id { get; set; }

        [Column("order_id")]
        public int? OrderId { get; set; }

        [Column("product_id")]
        public int? ProductId { get; set; }

        [Required]
        [Column("quantity")]
        public int Quantity { get; set; }

        [Required]
        [Column("unit_price", TypeName = "decimal(10,2)")]
        public decimal UnitPrice { get; set; }

        // Navigation Properties
        [ForeignKey("OrderId")]
        public Order? Order { get; set; }

        [ForeignKey("ProductId")]
        public Product? Product { get; set; }
    }
}