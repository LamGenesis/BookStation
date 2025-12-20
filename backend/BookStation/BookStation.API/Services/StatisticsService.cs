using BookStation.API.Data;
using BookStation.API.DTOs.Admin;
using Microsoft.EntityFrameworkCore;

namespace BookStation.API.Services
{
    public class StatisticsService : IStatisticsService
    {
        private readonly ApplicationDbContext _context;

        public StatisticsService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<SalesStatisticResponseDto> GetSalesStatisticsAsync(DateTime from, DateTime to)
        {
            // Normalize dates to start/end of day and ensure UTC kind for PostgreSQL timestamp with time zone
            var fromDateLocal = from.Date;
            var toDateLocal = to.Date.AddDays(1).AddTicks(-1);

            var fromDate = DateTime.SpecifyKind(fromDateLocal, DateTimeKind.Utc);
            var toDate = DateTime.SpecifyKind(toDateLocal, DateTimeKind.Utc);

            // Query orders within the date range
            var orders = await _context.Orders
                .Where(o => o.CreatedAt >= fromDate && o.CreatedAt <= toDate)
                .ToListAsync();

            // Group by date and calculate statistics
            var dailyStats = orders
                .GroupBy(o => o.CreatedAt.Date)
                .Select(g => new SalesStatisticPointDto
                {
                    Date = g.Key,
                    TotalSales = g.Sum(o => o.TotalAmount),
                    OrdersCount = g.Count()
                })
                .OrderBy(s => s.Date)
                .ToList();

            // Fill in missing dates with zero values
            var allDates = new List<SalesStatisticPointDto>();
            for (var date = fromDateLocal; date <= to.Date; date = date.AddDays(1))
            {
                var existingStat = dailyStats.FirstOrDefault(s => s.Date == date);
                if (existingStat != null)
                {
                    allDates.Add(existingStat);
                }
                else
                {
                    allDates.Add(new SalesStatisticPointDto
                    {
                        Date = date,
                        TotalSales = 0,
                        OrdersCount = 0
                    });
                }
            }

            // Tổng số khách hàng đã mua trong khoảng thời gian (theo userId khác null, không tính khách vãng lai)
            var totalCustomers = orders
                .Where(o => o.UserId.HasValue)
                .Select(o => o.UserId!.Value)
                .Distinct()
                .Count();

            return new SalesStatisticResponseDto
            {
                From = fromDateLocal,
                To = to.Date,
                TotalRevenue = orders.Sum(o => o.TotalAmount),
                TotalOrders = orders.Count,
                TotalCustomers = totalCustomers,
                DailyStatistics = allDates
            };
        }
    }
}

