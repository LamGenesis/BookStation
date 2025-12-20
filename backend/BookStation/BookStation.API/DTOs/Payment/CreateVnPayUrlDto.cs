namespace BookStation.API.DTOs.Payment
{
    /// <summary>
    /// DTO for creating VNPay payment URL
    /// </summary>
    public class CreateVnPayUrlDto
    {
        public int OrderId { get; set; }
    }

    /// <summary>
    /// Response DTO with VNPay payment URL
    /// </summary>
    public class VnPayUrlResponseDto
    {
        public string PaymentUrl { get; set; } = string.Empty;
        public int OrderId { get; set; }
        public int PaymentId { get; set; }
    }
}

