using BookStation.API.Models;

namespace BookStation.API.Repositories
{
    // Định nghĩa các methods CRUD cho Category Repository
    public interface ICategoryRepository
    {
        Task<IEnumerable<Category>> GetAllAsync();
        Task<Category?> GetByIdAsync(int id);
        Task<Category> CreateAsync(Category category);
        Task<Category> UpdateAsync(Category category);
        Task DeleteAsync(int id);
    }
}
