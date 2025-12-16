using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BookStation.API.Models
{
    [Table("orders")]
    public class Order
    {
        [Key]
        [Column("id")]
        public int Id { get; set; }

        [Column("user_id")]
        public int? UserId { get; set; }

        [Required]
        [Column("total_amount", TypeName = "decimal(10,2)")]
        public decimal TotalAmount { get; set; }

        [Column("status")]
        [MaxLength(50)]
        public string Status { get; set; } = "Pending";

        [Column("payment_status")]
        [MaxLength(50)]
        public string PaymentStatus { get; set; } = "Unpaid";

        [Column("shipping_info", TypeName = "json")]
        public string? ShippingInfo { get; set; }

        [Column("created_at")]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        // Navigation Properties
        [ForeignKey("UserId")]
        public User? User { get; set; }

        // Một Order có nhiều OrderItems
        public ICollection<OrderItem> OrderItems { get; set; } = new List<OrderItem>();

        // Một Order có thể có nhiều Payments (retry payment)
        public ICollection<Payment> Payments { get; set; } = new List<Payment>();
    }
}