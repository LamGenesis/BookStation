namespace BookStation.API.DTOs.Order
{
    /// <summary>
    /// DTO cho thông tin giao hàng
    /// </summary>
    public class ShippingInfoDto
    {
        public string ReceiverName { get; set; } = string.Empty;
        public string Phone { get; set; } = string.Empty;
        public string Address { get; set; } = string.Empty;
    }
}

