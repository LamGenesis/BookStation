namespace BookStation.API.DTOs.Admin
{
    /// <summary>
    /// DTO for detailed user view (admin)
    /// </summary>
    public class UserDetailDto
    {
        public int Id { get; set; }
        public string Email { get; set; } = string.Empty;
        public string? FullName { get; set; }
        public string Role { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; }
        public int TotalOrders { get; set; }
        public decimal TotalSpent { get; set; }
        public List<UserOrderSummaryDto> RecentOrders { get; set; } = new();
    }

    /// <summary>
    /// DTO for order summary in user detail
    /// </summary>
    public class UserOrderSummaryDto
    {
        public int Id { get; set; }
        public DateTime CreatedAt { get; set; }
        public decimal TotalAmount { get; set; }
        public string Status { get; set; } = string.Empty;
        public string PaymentStatus { get; set; } = string.Empty;
    }
}

