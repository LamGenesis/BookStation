namespace BookStation.API.DTOs.Order
{
    /// <summary>
    /// DTO để admin cập nhật trạng thái đơn hàng
    /// </summary>
    public class UpdateOrderStatusDto
    {
        /// <summary>
        /// Trạng thái đơn hàng: Pending, Confirmed, Processing, Shipping, Delivered, Cancelled
        /// </summary>
        public string Status { get; set; } = string.Empty;
    }
}

