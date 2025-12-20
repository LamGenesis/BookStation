namespace BookStation.API.DTOs.Payment
{
    /// <summary>
    /// DTO for VNPay return/IPN result
    /// </summary>
    public class VnPayReturnDto
    {
        public bool Success { get; set; }
        public string Message { get; set; } = string.Empty;
        public int? OrderId { get; set; }
        public int? PaymentId { get; set; }
        public string? TransactionId { get; set; }
        public decimal? Amount { get; set; }
        public string? ResponseCode { get; set; }
    }

    /// <summary>
    /// DTO for VNPay IPN response (to VNPay server)
    /// </summary>
    public class VnPayIpnResponseDto
    {
        public string RspCode { get; set; } = "00";
        public string Message { get; set; } = "Confirm Success";
    }
}

