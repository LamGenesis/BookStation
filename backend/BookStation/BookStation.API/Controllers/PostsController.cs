using BookStation.API.DTOs.Post;
using BookStation.API.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace BookStation.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PostsController : ControllerBase
    {
        private readonly IPostService _postService;

        public PostsController(IPostService postService)
        {
            _postService = postService;
        }

        /// <summary>
        /// Get all posts (public)
        /// </summary>
        [HttpGet]
        public async Task<ActionResult<IEnumerable<PostDto>>> GetAll()
        {
            var posts = await _postService.GetAllAsync();
            return Ok(posts);
        }

        /// <summary>
        /// Get post by ID (public)
        /// </summary>
        [HttpGet("{id}")]
        public async Task<ActionResult<PostDetailDto>> GetById(int id)
        {
            var post = await _postService.GetByIdAsync(id);
            if (post == null)
                return NotFound(new { message = "Post not found" });

            return Ok(post);
        }

        /// <summary>
        /// Create a new post (Admin only)
        /// </summary>
        [HttpPost]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<PostDetailDto>> Create([FromBody] CreatePostDto dto)
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userIdClaim) || !int.TryParse(userIdClaim, out int authorId))
            {
                return Unauthorized(new { message = "Invalid user" });
            }

            var post = await _postService.CreateAsync(dto, authorId);
            return CreatedAtAction(nameof(GetById), new { id = post.Id }, post);
        }

        /// <summary>
        /// Update an existing post (Admin only)
        /// </summary>
        [HttpPut("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<PostDetailDto>> Update(int id, [FromBody] UpdatePostDto dto)
        {
            var post = await _postService.UpdateAsync(id, dto);
            if (post == null)
                return NotFound(new { message = "Post not found" });

            return Ok(post);
        }

        /// <summary>
        /// Delete a post (Admin only)
        /// </summary>
        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Delete(int id)
        {
            var result = await _postService.DeleteAsync(id);
            if (!result)
                return NotFound(new { message = "Post not found" });

            return NoContent();
        }
    }
}

