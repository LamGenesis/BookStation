namespace BookStation.API.DTOs.Admin
{
    /// <summary>
    /// DTO for a single data point in sales statistics
    /// </summary>
    public class SalesStatisticPointDto
    {
        public DateTime Date { get; set; }
        public decimal TotalSales { get; set; }
        public int OrdersCount { get; set; }
    }

    /// <summary>
    /// DTO for sales statistics response
    /// </summary>
    public class SalesStatisticResponseDto
    {
        public DateTime From { get; set; }
        public DateTime To { get; set; }
        public decimal TotalRevenue { get; set; }
        public int TotalOrders { get; set; }
        public List<SalesStatisticPointDto> DailyStatistics { get; set; } = new();
    }
}

