using BookStation.API.Models;

namespace BookStation.API.Repositories
{
    public interface IPostRepository
    {
        Task<IEnumerable<Post>> GetAllAsync();
        Task<Post?> GetByIdAsync(int id);
        Task<Post> CreateAsync(Post post);
        Task<Post?> UpdateAsync(Post post);
        Task<bool> DeleteAsync(int id);
    }
}

