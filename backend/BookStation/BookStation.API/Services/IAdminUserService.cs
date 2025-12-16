using BookStation.API.DTOs.Admin;

namespace BookStation.API.Services
{
    public interface IAdminUserService
    {
        Task<IEnumerable<UserSummaryDto>> GetAllUsersWithStatsAsync();
        Task<UserDetailDto?> GetUserWithStatsByIdAsync(int id);
    }
}

