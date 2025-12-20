using BookStation.API.Models;

namespace BookStation.API.Repositories
{
    // Định nghĩa các methods cần thiết cho Refresh Token Repository
    public interface IRefreshTokenRepository
    {
        Task<RefreshToken> CreateAsync(RefreshToken refreshToken);
        Task<RefreshToken?> GetByTokenAsync(string token);
        Task RevokeAsync(string token);
        Task RevokeAllByUserIdAsync(int userId);
    }
}
