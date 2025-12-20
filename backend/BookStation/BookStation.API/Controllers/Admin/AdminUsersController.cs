using BookStation.API.DTOs.Admin;
using BookStation.API.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace BookStation.API.Controllers.Admin
{
    [Route("api/admin/users")]
    [ApiController]
    [Authorize(Roles = "Admin")]
    public class AdminUsersController : ControllerBase
    {
        private readonly IAdminUserService _adminUserService;

        public AdminUsersController(IAdminUserService adminUserService)
        {
            _adminUserService = adminUserService;
        }

        /// <summary>
        /// Get all users with statistics (Admin only)
        /// </summary>
        [HttpGet]
        public async Task<ActionResult<IEnumerable<UserSummaryDto>>> GetAllUsers()
        {
            var users = await _adminUserService.GetAllUsersWithStatsAsync();
            return Ok(users);
        }

        /// <summary>
        /// Get user by ID with statistics (Admin only)
        /// </summary>
        [HttpGet("{id}")]
        public async Task<ActionResult<UserDetailDto>> GetUserById(int id)
        {
            var user = await _adminUserService.GetUserWithStatsByIdAsync(id);
            if (user == null)
                return NotFound(new { message = "User not found" });

            return Ok(user);
        }
    }
}

