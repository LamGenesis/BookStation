namespace BookStation.API.DTOs.Order
{
    /// <summary>
    /// DTO cho danh sách đơn hàng (summary)
    /// </summary>
    public class OrderDto
    {
        public int Id { get; set; }
        public decimal TotalAmount { get; set; }
        public string Status { get; set; } = string.Empty;
        public string PaymentStatus { get; set; } = string.Empty;
        public int ItemCount { get; set; }
        public DateTime CreatedAt { get; set; }

        // Thông tin user (cho admin)
        public int? UserId { get; set; }
        public string? UserEmail { get; set; }
        public string? UserFullName { get; set; }
    }
}

