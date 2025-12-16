using BookStation.API.Data;
using BookStation.API.DTOs.Admin;
using Microsoft.EntityFrameworkCore;

namespace BookStation.API.Services
{
    public class AdminUserService : IAdminUserService
    {
        private readonly ApplicationDbContext _context;

        public AdminUserService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<UserSummaryDto>> GetAllUsersWithStatsAsync()
        {
            var users = await _context.Users
                .Include(u => u.Orders)
                .Select(u => new UserSummaryDto
                {
                    Id = u.Id,
                    Email = u.Email,
                    FullName = u.FullName,
                    Role = u.Role,
                    CreatedAt = u.CreatedAt,
                    TotalOrders = u.Orders.Count,
                    TotalSpent = u.Orders.Sum(o => o.TotalAmount)
                })
                .OrderByDescending(u => u.CreatedAt)
                .ToListAsync();

            return users;
        }

        public async Task<UserDetailDto?> GetUserWithStatsByIdAsync(int id)
        {
            var user = await _context.Users
                .Include(u => u.Orders)
                .FirstOrDefaultAsync(u => u.Id == id);

            if (user == null)
                return null;

            return new UserDetailDto
            {
                Id = user.Id,
                Email = user.Email,
                FullName = user.FullName,
                Role = user.Role,
                CreatedAt = user.CreatedAt,
                TotalOrders = user.Orders.Count,
                TotalSpent = user.Orders.Sum(o => o.TotalAmount),
                RecentOrders = user.Orders
                    .OrderByDescending(o => o.CreatedAt)
                    .Take(10)
                    .Select(o => new UserOrderSummaryDto
                    {
                        Id = o.Id,
                        CreatedAt = o.CreatedAt,
                        TotalAmount = o.TotalAmount,
                        Status = o.Status,
                        PaymentStatus = o.PaymentStatus
                    })
                    .ToList()
            };
        }
    }
}

