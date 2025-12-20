using BookStation.API.DTOs.Cart;
using BookStation.API.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Security.Claims;

namespace BookStation.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize] // Tất cả endpoints yêu cầu đăng nhập
    public class CartController : ControllerBase
    {
        private readonly ICartService _cartService;

        public CartController(ICartService cartService)
        {
            _cartService = cartService;
        }

        /// <summary>
        /// GET: api/cart
        /// Lấy giỏ hàng của user hiện tại
        /// </summary>
        [HttpGet]
        public async Task<IActionResult> GetCart()
        {
            var userId = GetCurrentUserId();
            var cart = await _cartService.GetCartAsync(userId);
            return Ok(cart);
        }

        /// <summary>
        /// POST: api/cart/items
        /// Thêm sản phẩm vào giỏ hàng
        /// </summary>
        [HttpPost("items")]
        public async Task<IActionResult> AddItem([FromBody] AddCartItemDto dto)
        {
            try
            {
                var userId = GetCurrentUserId();
                var cartItem = await _cartService.AddItemAsync(userId, dto);
                return Ok(cartItem);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        /// <summary>
        /// PUT: api/cart/items/{id}
        /// Cập nhật số lượng item trong giỏ hàng
        /// </summary>
        [HttpPut("items/{id}")]
        public async Task<IActionResult> UpdateItem(int id, [FromBody] UpdateCartItemDto dto)
        {
            try
            {
                var userId = GetCurrentUserId();
                var cartItem = await _cartService.UpdateItemAsync(userId, id, dto);
                return Ok(cartItem);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        /// <summary>
        /// DELETE: api/cart/items/{id}
        /// Xóa item khỏi giỏ hàng
        /// </summary>
        [HttpDelete("items/{id}")]
        public async Task<IActionResult> RemoveItem(int id)
        {
            try
            {
                var userId = GetCurrentUserId();
                await _cartService.RemoveItemAsync(userId, id);
                return NoContent();
            }
            catch (UnauthorizedAccessException)
            {
                return Unauthorized(new { message = "User not authenticated" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = ex.Message });
            }
        }

        /// <summary>
        /// DELETE: api/cart
        /// Xóa toàn bộ giỏ hàng
        /// </summary>
        [HttpDelete]
        public async Task<IActionResult> ClearCart()
        {
            var userId = GetCurrentUserId();
            await _cartService.ClearCartAsync(userId);
            return NoContent();
        }

        /// <summary>
        /// POST: api/cart/merge
        /// Merge giỏ hàng tạm (guest) vào giỏ hàng của user sau khi đăng nhập
        /// </summary>
        [HttpPost("merge")]
        public async Task<IActionResult> MergeCart([FromBody] MergeCartRequestDto request)
        {
            var userId = GetCurrentUserId();

            // Nếu không có gì để merge, trả về giỏ hiện tại
            if (request == null || request.Items == null || request.Items.Count == 0)
            {
                var currentCart = await _cartService.GetCartAsync(userId);
                return Ok(currentCart);
            }

            var mergedCart = await _cartService.MergeCartAsync(userId, request.Items);
            return Ok(mergedCart);
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

        #endregion
    }
}

