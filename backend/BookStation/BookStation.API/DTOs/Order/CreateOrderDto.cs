namespace BookStation.API.DTOs.Order
{
    /// <summary>
    /// DTO để tạo đơn hàng (checkout)
    /// </summary>
    public class CreateOrderDto
    {
        public ShippingInfoDto ShippingInfo { get; set; } = new ShippingInfoDto();
        public string PaymentMethod { get; set; } = "COD"; // COD, Banking, etc.
    }
}

