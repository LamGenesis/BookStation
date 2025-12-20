using BookStation.API.DTOs.Payment;
using BookStation.API.Models;

namespace BookStation.API.Services
{
    public interface IVnPayService
    {
        /// <summary>
        /// Create VNPay payment URL
        /// </summary>
        Task<VnPayUrlResponseDto> CreatePaymentUrlAsync(int orderId, int userId, HttpContext httpContext);

        /// <summary>
        /// Validate and process VNPay return (user redirect back)
        /// </summary>
        Task<VnPayReturnDto> ProcessReturnAsync(IQueryCollection query);

        /// <summary>
        /// Validate and process VNPay IPN (server-to-server callback)
        /// </summary>
        Task<VnPayIpnResponseDto> ProcessIpnAsync(IQueryCollection query);
    }
}

