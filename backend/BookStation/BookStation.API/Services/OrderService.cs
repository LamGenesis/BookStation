using BookStation.API.Data;
using BookStation.API.DTOs.Order;
using BookStation.API.Models;
using BookStation.API.Repositories;
using Microsoft.EntityFrameworkCore;
using System.Text.Json;

namespace BookStation.API.Services
{
    public class OrderService : IOrderService
    {
        private readonly ApplicationDbContext _context;
        private readonly IOrderRepository _orderRepository;
        private readonly ICartItemRepository _cartItemRepository;
        private readonly IProductRepository _productRepository;

        public OrderService(
            ApplicationDbContext context,
            IOrderRepository orderRepository,
            ICartItemRepository cartItemRepository,
            IProductRepository productRepository)
        {
            _context = context;
            _orderRepository = orderRepository;
            _cartItemRepository = cartItemRepository;
            _productRepository = productRepository;
        }

        public async Task<OrderDetailDto> CheckoutAsync(int userId, CreateOrderDto dto)
        {
            // Sử dụng transaction để đảm bảo tính toàn vẹn dữ liệu
            using var transaction = await _context.Database.BeginTransactionAsync();

            try
            {
                // 1. Lấy giỏ hàng của user
                var cartItems = await _context.CartItems
                    .Include(ci => ci.Product)
                    .Where(ci => ci.UserId == userId)
                    .ToListAsync();

                if (!cartItems.Any())
                {
                    throw new Exception("Cart is empty");
                }

                // 2. Validate stock và tính tổng tiền
                decimal totalAmount = 0;
                var orderItems = new List<OrderItem>();

                foreach (var cartItem in cartItems)
                {
                    var product = cartItem.Product;
                    if (product == null || product.Status != 1)
                    {
                        throw new Exception($"Product '{cartItem.Product?.Name ?? "Unknown"}' is not available");
                    }

                    if (product.Quantity < cartItem.Quantity)
                    {
                        throw new Exception($"Not enough stock for '{product.Name}'. Available: {product.Quantity}, Requested: {cartItem.Quantity}");
                    }

                    var effectivePrice = product.DiscountPrice ?? product.Price;
                    var subtotal = effectivePrice * cartItem.Quantity;
                    totalAmount += subtotal;

                    // Tạo OrderItem
                    orderItems.Add(new OrderItem
                    {
                        ProductId = product.Id,
                        Quantity = cartItem.Quantity,
                        UnitPrice = effectivePrice
                    });

                    // 3. Giảm stock (trong transaction)
                    product.Quantity -= cartItem.Quantity;
                }

                // 4. Tạo Order
                var order = new Order
                {
                    UserId = userId,
                    TotalAmount = totalAmount,
                    Status = "Pending",
                    PaymentStatus = dto.PaymentMethod == "COD" ? "Unpaid" : "Pending",
                    ShippingInfo = JsonSerializer.Serialize(dto.ShippingInfo),
                    CreatedAt = DateTime.UtcNow,
                    OrderItems = orderItems
                };

                _context.Orders.Add(order);

                // 5. Xóa cart items
                _context.CartItems.RemoveRange(cartItems);

                // 6. Save tất cả thay đổi
                await _context.SaveChangesAsync();

                // 7. Commit transaction
                await transaction.CommitAsync();

                // Load lại order để có đầy đủ thông tin
                var createdOrder = await _orderRepository.GetByIdAsync(order.Id);
                return MapToOrderDetailDto(createdOrder!);
            }
            catch
            {
                // Rollback nếu có lỗi
                await transaction.RollbackAsync();
                throw;
            }
        }

        public async Task<IEnumerable<OrderDto>> GetOrdersByUserAsync(int userId)
        {
            var orders = await _orderRepository.GetByUserIdAsync(userId);
            return orders.Select(MapToOrderDto);
        }

        public async Task<IEnumerable<OrderDto>> GetAllOrdersAsync()
        {
            var orders = await _orderRepository.GetAllAsync();
            return orders.Select(MapToOrderDto);
        }

        public async Task<OrderDetailDto?> GetOrderDetailAsync(int orderId, int userId, bool isAdmin)
        {
            var order = await _orderRepository.GetByIdAsync(orderId);
            if (order == null) return null;

            // Kiểm tra quyền: user chỉ xem được order của mình, admin xem được tất cả
            if (!isAdmin && order.UserId != userId)
            {
                return null;
            }

            return MapToOrderDetailDto(order);
        }

        public async Task<OrderDetailDto> UpdateOrderStatusAsync(int orderId, UpdateOrderStatusDto dto)
        {
            var order = await _orderRepository.GetByIdAsync(orderId);
            if (order == null)
            {
                throw new Exception($"Order with id {orderId} not found");
            }

            // Validate status transition
            var validStatuses = new[] { "Pending", "Confirmed", "Processing", "Shipping", "Delivered", "Cancelled" };
            if (!validStatuses.Contains(dto.Status))
            {
                throw new Exception($"Invalid status. Valid values: {string.Join(", ", validStatuses)}");
            }

            order.Status = dto.Status;

            // Nếu đơn hàng bị hủy, hoàn lại stock
            if (dto.Status == "Cancelled" && order.Status != "Cancelled")
            {
                foreach (var item in order.OrderItems)
                {
                    if (item.Product != null)
                    {
                        item.Product.Quantity += item.Quantity;
                    }
                }
            }

            await _orderRepository.UpdateAsync(order);

            return MapToOrderDetailDto(order);
        }

        #region Private Helpers

        private OrderDto MapToOrderDto(Order order)
        {
            return new OrderDto
            {
                Id = order.Id,
                TotalAmount = order.TotalAmount,
                Status = order.Status,
                PaymentStatus = order.PaymentStatus,
                ItemCount = order.OrderItems.Sum(oi => oi.Quantity),
                CreatedAt = order.CreatedAt
            };
        }

        private OrderDetailDto MapToOrderDetailDto(Order order)
        {
            ShippingInfoDto? shippingInfo = null;
            if (!string.IsNullOrEmpty(order.ShippingInfo))
            {
                try
                {
                    shippingInfo = JsonSerializer.Deserialize<ShippingInfoDto>(order.ShippingInfo);
                }
                catch
                {
                    // Ignore deserialization errors
                }
            }

            return new OrderDetailDto
            {
                Id = order.Id,
                TotalAmount = order.TotalAmount,
                Status = order.Status,
                PaymentStatus = order.PaymentStatus,
                ShippingInfo = shippingInfo,
                CreatedAt = order.CreatedAt,
                UserId = order.UserId,
                UserEmail = order.User?.Email,
                Items = order.OrderItems.Select(oi => new OrderItemDto
                {
                    Id = oi.Id,
                    ProductId = oi.ProductId ?? 0,
                    ProductName = oi.Product?.Name ?? string.Empty,
                    ProductImageUrl = oi.Product?.ProductImages
                        .FirstOrDefault(i => i.IsPrimary)?.Url
                        ?? oi.Product?.ProductImages.FirstOrDefault()?.Url,
                    UnitPrice = oi.UnitPrice,
                    Quantity = oi.Quantity,
                    Subtotal = oi.UnitPrice * oi.Quantity
                }).ToList()
            };
        }

        #endregion
    }
}

