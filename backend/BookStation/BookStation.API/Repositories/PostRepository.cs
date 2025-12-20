using BookStation.API.Data;
using BookStation.API.Models;
using Microsoft.EntityFrameworkCore;

namespace BookStation.API.Repositories
{
    public class PostRepository : IPostRepository
    {
        private readonly ApplicationDbContext _context;

        public PostRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Post>> GetAllAsync()
        {
            return await _context.Posts
                .Include(p => p.Author)
                .OrderByDescending(p => p.PublishedAt)
                .ToListAsync();
        }

        public async Task<Post?> GetByIdAsync(int id)
        {
            return await _context.Posts
                .Include(p => p.Author)
                .FirstOrDefaultAsync(p => p.Id == id);
        }

        public async Task<Post> CreateAsync(Post post)
        {
            _context.Posts.Add(post);
            await _context.SaveChangesAsync();
            
            // Reload with Author navigation property
            await _context.Entry(post)
                .Reference(p => p.Author)
                .LoadAsync();
            
            return post;
        }

        public async Task<Post?> UpdateAsync(Post post)
        {
            var existingPost = await _context.Posts.FindAsync(post.Id);
            if (existingPost == null)
                return null;

            existingPost.Title = post.Title;
            existingPost.Content = post.Content;
            existingPost.ImageUrl = post.ImageUrl;
            existingPost.PublishedAt = post.PublishedAt;

            await _context.SaveChangesAsync();
            
            // Reload with Author navigation property
            await _context.Entry(existingPost)
                .Reference(p => p.Author)
                .LoadAsync();

            return existingPost;
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var post = await _context.Posts.FindAsync(id);
            if (post == null)
                return false;

            _context.Posts.Remove(post);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}

