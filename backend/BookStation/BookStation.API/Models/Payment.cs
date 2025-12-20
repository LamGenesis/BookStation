using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BookStation.API.Models
{
    [Table("payments")]
    public class Payment
    {
        [Key]
        [Column("id")]
        public int Id { get; set; }

        [Column("order_id")]
        public int? OrderId { get; set; }

        [Required]
        [Column("amount", TypeName = "decimal(10,2)")]
        public decimal Amount { get; set; }

        [Column("method")]
        [MaxLength(50)]
        public string? Method { get; set; }

        [Column("status")]
        [MaxLength(50)]
        public string? Status { get; set; }

        [Column("transaction_id")]
        [MaxLength(255)]
        public string? TransactionId { get; set; }

        [Column("created_at")]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        // Navigation Property
        [ForeignKey("OrderId")]
        public Order? Order { get; set; }
    }
}