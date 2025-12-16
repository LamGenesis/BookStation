using BookStation.API.Data;
using BookStation.API.DTOs.Payment;
using BookStation.API.Models;
using Microsoft.EntityFrameworkCore;
using System.Globalization;
using System.Net;
using System.Security.Cryptography;
using System.Text;

namespace BookStation.API.Services
{
    public class VnPayService : IVnPayService
    {
        private readonly IConfiguration _configuration;
        private readonly ApplicationDbContext _context;
        private readonly ILogger<VnPayService> _logger;

        public VnPayService(
            IConfiguration configuration,
            ApplicationDbContext context,
            ILogger<VnPayService> logger)
        {
            _configuration = configuration;
            _context = context;
            _logger = logger;
        }

        public async Task<VnPayUrlResponseDto> CreatePaymentUrlAsync(int orderId, int userId, HttpContext httpContext)
        {
            var vnpayConfig = _configuration.GetSection("VNPay");
            
            // Get order
            var order = await _context.Orders
                .FirstOrDefaultAsync(o => o.Id == orderId && o.UserId == userId);

            if (order == null)
                throw new Exception("Order not found");

            if (order.PaymentStatus == "Paid")
                throw new Exception("Order already paid");

            // Create payment record
            var payment = new Payment
            {
                OrderId = orderId,
                Amount = order.TotalAmount,
                Method = "VNPay",
                Status = "Pending",
                TransactionId = Guid.NewGuid().ToString(),
                CreatedAt = DateTime.UtcNow
            };

            _context.Payments.Add(payment);
            await _context.SaveChangesAsync();

            // Build VNPay parameters
            var vnpParams = new SortedDictionary<string, string>
            {
                { "vnp_Version", vnpayConfig["Version"]! },
                { "vnp_Command", vnpayConfig["Command"]! },
                { "vnp_TmnCode", vnpayConfig["TmnCode"]! },
                { "vnp_Amount", ((long)(order.TotalAmount * 100)).ToString() }, // VNPay requires amount in VND * 100
                { "vnp_CurrCode", vnpayConfig["CurrCode"]! },
                { "vnp_TxnRef", payment.Id.ToString() }, // Use payment ID as transaction reference
                { "vnp_OrderInfo", $"Thanh toan don hang #{orderId}" },
                { "vnp_OrderType", "other" },
                { "vnp_Locale", vnpayConfig["Locale"]! },
                { "vnp_ReturnUrl", vnpayConfig["ReturnUrl"]! },
                { "vnp_IpAddr", GetIpAddress(httpContext) },
                { "vnp_CreateDate", DateTime.Now.ToString("yyyyMMddHHmmss") },
                { "vnp_ExpireDate", DateTime.Now.AddMinutes(15).ToString("yyyyMMddHHmmss") }
            };

            // Build query string
            var queryString = BuildQueryString(vnpParams);
            
            // Create secure hash
            var hashSecret = vnpayConfig["HashSecret"]!;
            var secureHash = ComputeHmacSha512(hashSecret, queryString);
            
            // Build final URL
            var paymentUrl = $"{vnpayConfig["BaseUrl"]}?{queryString}&vnp_SecureHash={secureHash}";

            _logger.LogInformation("Created VNPay payment URL for Order {OrderId}, Payment {PaymentId}", orderId, payment.Id);

            return new VnPayUrlResponseDto
            {
                PaymentUrl = paymentUrl,
                OrderId = orderId,
                PaymentId = payment.Id
            };
        }

        public async Task<VnPayReturnDto> ProcessReturnAsync(IQueryCollection query)
        {
            var vnpayConfig = _configuration.GetSection("VNPay");
            
            // Get all VNPay parameters
            var vnpParams = query
                .Where(q => q.Key.StartsWith("vnp_"))
                .ToDictionary(q => q.Key, q => q.Value.ToString());

            // Validate secure hash
            if (!vnpParams.TryGetValue("vnp_SecureHash", out var receivedHash))
            {
                return new VnPayReturnDto
                {
                    Success = false,
                    Message = "Missing secure hash"
                };
            }

            // Remove hash from params for verification
            vnpParams.Remove("vnp_SecureHash");
            vnpParams.Remove("vnp_SecureHashType");

            // Sort and build query string
            var sortedParams = new SortedDictionary<string, string>(vnpParams);
            var queryString = BuildQueryString(sortedParams);
            
            // Compute expected hash
            var hashSecret = vnpayConfig["HashSecret"]!;
            var expectedHash = ComputeHmacSha512(hashSecret, queryString);

            if (!string.Equals(expectedHash, receivedHash, StringComparison.OrdinalIgnoreCase))
            {
                _logger.LogWarning("VNPay return: Invalid signature");
                return new VnPayReturnDto
                {
                    Success = false,
                    Message = "Invalid signature"
                };
            }

            // Parse response
            var responseCode = vnpParams.GetValueOrDefault("vnp_ResponseCode", "");
            var txnRef = vnpParams.GetValueOrDefault("vnp_TxnRef", "");
            var transactionId = vnpParams.GetValueOrDefault("vnp_TransactionNo", "");
            var amountStr = vnpParams.GetValueOrDefault("vnp_Amount", "0");

            if (!int.TryParse(txnRef, out var paymentId))
            {
                return new VnPayReturnDto
                {
                    Success = false,
                    Message = "Invalid transaction reference"
                };
            }

            var payment = await _context.Payments
                .Include(p => p.Order)
                .FirstOrDefaultAsync(p => p.Id == paymentId);

            if (payment == null)
            {
                return new VnPayReturnDto
                {
                    Success = false,
                    Message = "Payment not found"
                };
            }

            var amount = decimal.Parse(amountStr) / 100; // Convert back from VND * 100

            if (responseCode == "00")
            {
                return new VnPayReturnDto
                {
                    Success = true,
                    Message = "Payment successful",
                    OrderId = payment.OrderId,
                    PaymentId = paymentId,
                    TransactionId = transactionId,
                    Amount = amount,
                    ResponseCode = responseCode
                };
            }

            return new VnPayReturnDto
            {
                Success = false,
                Message = GetResponseMessage(responseCode),
                OrderId = payment.OrderId,
                PaymentId = paymentId,
                TransactionId = transactionId,
                Amount = amount,
                ResponseCode = responseCode
            };
        }

        public async Task<VnPayIpnResponseDto> ProcessIpnAsync(IQueryCollection query)
        {
            var vnpayConfig = _configuration.GetSection("VNPay");
            
            // Get all VNPay parameters
            var vnpParams = query
                .Where(q => q.Key.StartsWith("vnp_"))
                .ToDictionary(q => q.Key, q => q.Value.ToString());

            // Validate secure hash
            if (!vnpParams.TryGetValue("vnp_SecureHash", out var receivedHash))
            {
                return new VnPayIpnResponseDto { RspCode = "97", Message = "Missing checksum" };
            }

            // Remove hash from params for verification
            vnpParams.Remove("vnp_SecureHash");
            vnpParams.Remove("vnp_SecureHashType");

            // Sort and build query string
            var sortedParams = new SortedDictionary<string, string>(vnpParams);
            var queryString = BuildQueryString(sortedParams);
            
            // Compute expected hash
            var hashSecret = vnpayConfig["HashSecret"]!;
            var expectedHash = ComputeHmacSha512(hashSecret, queryString);

            if (!string.Equals(expectedHash, receivedHash, StringComparison.OrdinalIgnoreCase))
            {
                _logger.LogWarning("VNPay IPN: Invalid checksum");
                return new VnPayIpnResponseDto { RspCode = "97", Message = "Invalid checksum" };
            }

            // Parse response
            var responseCode = vnpParams.GetValueOrDefault("vnp_ResponseCode", "");
            var txnRef = vnpParams.GetValueOrDefault("vnp_TxnRef", "");
            var transactionId = vnpParams.GetValueOrDefault("vnp_TransactionNo", "");
            var amountStr = vnpParams.GetValueOrDefault("vnp_Amount", "0");

            if (!int.TryParse(txnRef, out var paymentId))
            {
                return new VnPayIpnResponseDto { RspCode = "01", Message = "Order not found" };
            }

            var payment = await _context.Payments
                .Include(p => p.Order)
                .FirstOrDefaultAsync(p => p.Id == paymentId);

            if (payment == null)
            {
                return new VnPayIpnResponseDto { RspCode = "01", Message = "Order not found" };
            }

            // Check if already processed
            if (payment.Status == "Success" || payment.Status == "Failed")
            {
                return new VnPayIpnResponseDto { RspCode = "02", Message = "Order already confirmed" };
            }

            // Verify amount
            var vnpAmount = decimal.Parse(amountStr) / 100;
            if (vnpAmount != payment.Amount)
            {
                _logger.LogWarning("VNPay IPN: Amount mismatch. Expected {Expected}, Got {Got}", payment.Amount, vnpAmount);
                return new VnPayIpnResponseDto { RspCode = "04", Message = "Invalid amount" };
            }

            // Update payment status
            if (responseCode == "00")
            {
                payment.Status = "Success";
                payment.TransactionId = transactionId;
                
                if (payment.Order != null)
                {
                    payment.Order.PaymentStatus = "Paid";
                }

                _logger.LogInformation("VNPay IPN: Payment {PaymentId} successful, Order {OrderId} marked as Paid", 
                    paymentId, payment.OrderId);
            }
            else
            {
                payment.Status = "Failed";
                payment.TransactionId = transactionId;
                
                _logger.LogInformation("VNPay IPN: Payment {PaymentId} failed with code {Code}", 
                    paymentId, responseCode);
            }

            await _context.SaveChangesAsync();

            return new VnPayIpnResponseDto { RspCode = "00", Message = "Confirm Success" };
        }

        private static string BuildQueryString(SortedDictionary<string, string> parameters)
        {
            var sb = new StringBuilder();
            foreach (var kv in parameters)
            {
                if (sb.Length > 0)
                    sb.Append('&');
                sb.Append(WebUtility.UrlEncode(kv.Key));
                sb.Append('=');
                sb.Append(WebUtility.UrlEncode(kv.Value));
            }
            return sb.ToString();
        }

        private static string ComputeHmacSha512(string key, string data)
        {
            using var hmac = new HMACSHA512(Encoding.UTF8.GetBytes(key));
            var hashBytes = hmac.ComputeHash(Encoding.UTF8.GetBytes(data));
            return BitConverter.ToString(hashBytes).Replace("-", "").ToLower();
        }

        private static string GetIpAddress(HttpContext context)
        {
            var ipAddress = context.Connection.RemoteIpAddress?.ToString();
            if (string.IsNullOrEmpty(ipAddress) || ipAddress == "::1")
                ipAddress = "127.0.0.1";
            return ipAddress;
        }

        private static string GetResponseMessage(string responseCode)
        {
            return responseCode switch
            {
                "00" => "Giao dịch thành công",
                "07" => "Trừ tiền thành công. Giao dịch bị nghi ngờ (liên quan tới lừa đảo, giao dịch bất thường)",
                "09" => "Giao dịch không thành công do: Thẻ/Tài khoản của khách hàng chưa đăng ký dịch vụ InternetBanking tại ngân hàng",
                "10" => "Giao dịch không thành công do: Khách hàng xác thực thông tin thẻ/tài khoản không đúng quá 3 lần",
                "11" => "Giao dịch không thành công do: Đã hết hạn chờ thanh toán. Xin quý khách vui lòng thực hiện lại giao dịch",
                "12" => "Giao dịch không thành công do: Thẻ/Tài khoản của khách hàng bị khóa",
                "13" => "Giao dịch không thành công do Quý khách nhập sai mật khẩu xác thực giao dịch (OTP)",
                "24" => "Giao dịch không thành công do: Khách hàng hủy giao dịch",
                "51" => "Giao dịch không thành công do: Tài khoản của quý khách không đủ số dư để thực hiện giao dịch",
                "65" => "Giao dịch không thành công do: Tài khoản của Quý khách đã vượt quá hạn mức giao dịch trong ngày",
                "75" => "Ngân hàng thanh toán đang bảo trì",
                "79" => "Giao dịch không thành công do: KH nhập sai mật khẩu thanh toán quá số lần quy định",
                "99" => "Lỗi không xác định",
                _ => $"Giao dịch thất bại với mã lỗi: {responseCode}"
            };
        }
    }
}

