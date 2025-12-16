using BookStation.API.DTOs.Post;

namespace BookStation.API.Services
{
    public interface IPostService
    {
        Task<IEnumerable<PostDto>> GetAllAsync();
        Task<PostDetailDto?> GetByIdAsync(int id);
        Task<PostDetailDto> CreateAsync(CreatePostDto dto, int authorId);
        Task<PostDetailDto?> UpdateAsync(int id, UpdatePostDto dto);
        Task<bool> DeleteAsync(int id);
    }
}

