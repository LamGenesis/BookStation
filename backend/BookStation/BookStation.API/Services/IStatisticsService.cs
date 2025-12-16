using BookStation.API.DTOs.Admin;

namespace BookStation.API.Services
{
    public interface IStatisticsService
    {
        Task<SalesStatisticResponseDto> GetSalesStatisticsAsync(DateTime from, DateTime to);
    }
}

