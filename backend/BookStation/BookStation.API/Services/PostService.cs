using AutoMapper;
using BookStation.API.DTOs.Post;
using BookStation.API.Models;
using BookStation.API.Repositories;

namespace BookStation.API.Services
{
    public class PostService : IPostService
    {
        private readonly IPostRepository _postRepository;
        private readonly IMapper _mapper;

        public PostService(IPostRepository postRepository, IMapper mapper)
        {
            _postRepository = postRepository;
            _mapper = mapper;
        }

        public async Task<IEnumerable<PostDto>> GetAllAsync()
        {
            var posts = await _postRepository.GetAllAsync();
            return _mapper.Map<IEnumerable<PostDto>>(posts);
        }

        public async Task<PostDetailDto?> GetByIdAsync(int id)
        {
            var post = await _postRepository.GetByIdAsync(id);
            if (post == null)
                return null;

            return _mapper.Map<PostDetailDto>(post);
        }

        public async Task<PostDetailDto> CreateAsync(CreatePostDto dto, int authorId)
        {
            var post = _mapper.Map<Post>(dto);
            post.AuthorId = authorId;
            
            // Set PublishedAt to now if not provided
            if (!dto.PublishedAt.HasValue)
            {
                post.PublishedAt = DateTime.UtcNow;
            }

            var createdPost = await _postRepository.CreateAsync(post);
            return _mapper.Map<PostDetailDto>(createdPost);
        }

        public async Task<PostDetailDto?> UpdateAsync(int id, UpdatePostDto dto)
        {
            var existingPost = await _postRepository.GetByIdAsync(id);
            if (existingPost == null)
                return null;

            // Update properties
            existingPost.Title = dto.Title;
            existingPost.Content = dto.Content;
            existingPost.ImageUrl = dto.ImageUrl;
            
            if (dto.PublishedAt.HasValue)
            {
                existingPost.PublishedAt = dto.PublishedAt.Value;
            }

            var updatedPost = await _postRepository.UpdateAsync(existingPost);
            return _mapper.Map<PostDetailDto>(updatedPost);
        }

        public async Task<bool> DeleteAsync(int id)
        {
            return await _postRepository.DeleteAsync(id);
        }
    }
}

