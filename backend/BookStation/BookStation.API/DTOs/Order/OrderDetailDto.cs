namespace BookStation.API.DTOs.Order
{
    /// <summary>
    /// DTO chi tiết đơn hàng
    /// </summary>
    public class OrderDetailDto
    {
        public int Id { get; set; }
        public decimal TotalAmount { get; set; }
        public string Status { get; set; } = string.Empty;
        public string PaymentStatus { get; set; } = string.Empty;
        public ShippingInfoDto? ShippingInfo { get; set; }
        public DateTime CreatedAt { get; set; }
        public List<OrderItemDto> Items { get; set; } = new List<OrderItemDto>();

        // Thông tin user (cho admin)
        public int? UserId { get; set; }
        public string? UserEmail { get; set; }
    }
}

