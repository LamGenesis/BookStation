using BookStation.API.Models;

namespace BookStation.API.Repositories
{
    // Định nghĩa các methods cần thiết cho User Repository
    public interface IUserRepository
    {
        Task<User?> GetByEmailAsync(string email);
        Task<User?> GetByIdAsync(int id); 
        Task<User> CreateAsync(User user);
        Task<bool> ExistsByEmailAsync(string email);
    }
}
