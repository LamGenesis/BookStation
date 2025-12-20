namespace BookStation.API.DTOs.Admin
{
    /// <summary>
    /// DTO for admin user list (summary view)
    /// </summary>
    public class UserSummaryDto
    {
        public int Id { get; set; }
        public string Email { get; set; } = string.Empty;
        public string? FullName { get; set; }
        public string Role { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; }
        public int TotalOrders { get; set; }
        public decimal TotalSpent { get; set; }
    }
}

