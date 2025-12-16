using BookStation.API.DTOs.Order;
using BookStation.API.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace BookStation.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize] // Tất cả endpoints yêu cầu đăng nhập
    public class OrdersController : ControllerBase
    {
        private readonly IOrderService _orderService;

        public OrdersController(IOrderService orderService)
        {
            _orderService = orderService;
        }

        /// <summary>
        /// POST: api/orders
        /// Checkout - Tạo đơn hàng từ giỏ hàng
        /// </summary>
        [HttpPost]
        public async Task<IActionResult> Checkout([FromBody] CreateOrderDto dto)
        {
            try
            {
                var userId = GetCurrentUserId();
                var order = await _orderService.CheckoutAsync(userId, dto);
                return CreatedAtAction(nameof(GetOrderById), new { id = order.Id }, order);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        /// <summary>
        /// GET: api/orders
        /// Lấy danh sách đơn hàng
        /// - User thường: Chỉ xem đơn của mình
        /// - Admin: Xem tất cả đơn hàng
        /// </summary>
        [HttpGet]
        public async Task<IActionResult> GetOrders()
        {
            var userId = GetCurrentUserId();
            var isAdmin = IsCurrentUserAdmin();

            if (isAdmin)
            {
                var allOrders = await _orderService.GetAllOrdersAsync();
                return Ok(allOrders);
            }
            else
            {
                var userOrders = await _orderService.GetOrdersByUserAsync(userId);
                return Ok(userOrders);
            }
        }

        /// <summary>
        /// GET: api/orders/{id}
        /// Xem chi tiết đơn hàng
        /// - User thường: Chỉ xem đơn của mình
        /// - Admin: Xem được tất cả
        /// </summary>
        [HttpGet("{id}")]
        public async Task<IActionResult> GetOrderById(int id)
        {
            var userId = GetCurrentUserId();
            var isAdmin = IsCurrentUserAdmin();

            var order = await _orderService.GetOrderDetailAsync(id, userId, isAdmin);
            if (order == null)
            {
                return NotFound(new { message = "Order not found or access denied" });
            }

            return Ok(order);
        }

        /// <summary>
        /// PUT: api/orders/{id}/status
        /// Admin cập nhật trạng thái đơn hàng
        /// </summary>
        [HttpPut("{id}/status")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> UpdateOrderStatus(int id, [FromBody] UpdateOrderStatusDto dto)
        {
            try
            {
                var order = await _orderService.UpdateOrderStatusAsync(id, dto);
                return Ok(order);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        #region Private Helpers

        private int GetCurrentUserId()
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userIdClaim))
            {
                throw new UnauthorizedAccessException("User not authenticated");
            }
            return int.Parse(userIdClaim);
        }

        private bool IsCurrentUserAdmin()
        {
            return User.IsInRole("Admin");
        }

        #endregion
    }
}

