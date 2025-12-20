using BookStation.API.DTOs.Payment;
using BookStation.API.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace BookStation.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PaymentsController : ControllerBase
    {
        private readonly IVnPayService _vnPayService;
        private readonly ILogger<PaymentsController> _logger;

        public PaymentsController(IVnPayService vnPayService, ILogger<PaymentsController> logger)
        {
            _vnPayService = vnPayService;
            _logger = logger;
        }

        /// <summary>
        /// Create VNPay payment URL for an order
        /// </summary>
        [HttpPost("vnpay/create")]
        [Authorize]
        public async Task<ActionResult<VnPayUrlResponseDto>> CreateVnPayUrl([FromBody] CreateVnPayUrlDto dto)
        {
            try
            {
                var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                if (string.IsNullOrEmpty(userIdClaim) || !int.TryParse(userIdClaim, out int userId))
                {
                    return Unauthorized(new { message = "Invalid user" });
                }

                var result = await _vnPayService.CreatePaymentUrlAsync(dto.OrderId, userId, HttpContext);
                return Ok(result);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating VNPay URL for order {OrderId}", dto.OrderId);
                return BadRequest(new { message = ex.Message });
            }
        }

        /// <summary>
        /// VNPay return URL - handles user redirect after payment
        /// </summary>
        [HttpGet("vnpay/return")]
        public async Task<ActionResult<VnPayReturnDto>> VnPayReturn()
        {
            _logger.LogInformation("VNPay return received with query: {Query}", Request.QueryString);
            
            var result = await _vnPayService.ProcessReturnAsync(Request.Query);
            return Ok(result);
        }

        /// <summary>
        /// VNPay IPN URL - handles server-to-server callback from VNPay
        /// </summary>
        [HttpGet("vnpay/ipn")]
        public async Task<ActionResult<VnPayIpnResponseDto>> VnPayIpn()
        {
            _logger.LogInformation("VNPay IPN received with query: {Query}", Request.QueryString);
            
            var result = await _vnPayService.ProcessIpnAsync(Request.Query);
            return Ok(result);
        }
    }
}

