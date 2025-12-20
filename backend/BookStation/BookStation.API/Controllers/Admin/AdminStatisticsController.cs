using BookStation.API.DTOs.Admin;
using BookStation.API.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace BookStation.API.Controllers.Admin
{
    [Route("api/admin/statistics")]
    [ApiController]
    [Authorize(Roles = "Admin")]
    public class AdminStatisticsController : ControllerBase
    {
        private readonly IStatisticsService _statisticsService;

        public AdminStatisticsController(IStatisticsService statisticsService)
        {
            _statisticsService = statisticsService;
        }

        /// <summary>
        /// Get sales statistics for a date range (Admin only)
        /// </summary>
        /// <param name="from">Start date (yyyy-MM-dd)</param>
        /// <param name="to">End date (yyyy-MM-dd)</param>
        [HttpGet("sales")]
        public async Task<ActionResult<SalesStatisticResponseDto>> GetSalesStatistics(
            [FromQuery] DateTime from,
            [FromQuery] DateTime to)
        {
            if (from > to)
            {
                return BadRequest(new { message = "From date must be before or equal to To date" });
            }

            var statistics = await _statisticsService.GetSalesStatisticsAsync(from, to);
            return Ok(statistics);
        }
    }
}

