using BookStation.API.DTOs.Cart;
using BookStation.API.Models;
using BookStation.API.Repositories;
using System.Collections.Generic;
using System.Linq;

namespace BookStation.API.Services
{
    public class CartService : ICartService
    {
        private readonly ICartItemRepository _cartItemRepository;
        private readonly IProductRepository _productRepository;

        public CartService(
            ICartItemRepository cartItemRepository,
            IProductRepository productRepository)
        {
            _cartItemRepository = cartItemRepository;
            _productRepository = productRepository;
        }

        public async Task<CartResponseDto> GetCartAsync(int userId)
        {
            var cartItems = await _cartItemRepository.GetByUserIdAsync(userId);

            var itemDtos = cartItems.Select(ci => MapToCartItemDto(ci)).ToList();

            return new CartResponseDto
            {
                Items = itemDtos,
                TotalQuantity = itemDtos.Sum(i => i.Quantity),
                TotalAmount = itemDtos.Sum(i => i.Subtotal)
            };
        }

        public async Task<CartItemDto> AddItemAsync(int userId, AddCartItemDto dto)
        {
            // Validate product tồn tại và active
            var product = await _productRepository.GetByIdAsync(dto.ProductId);
            if (product == null || product.Status != 1)
            {
                throw new Exception("Product not found or unavailable");
            }

            // Validate quantity
            if (dto.Quantity <= 0)
            {
                throw new Exception("Quantity must be greater than 0");
            }

            // Check xem product đã có trong cart chưa
            var existingItem = await _cartItemRepository.GetByUserAndProductAsync(userId, dto.ProductId);

            if (existingItem != null)
            {
                // Cộng dồn quantity
                existingItem.Quantity += dto.Quantity;

                // Validate không vượt quá stock
                if (existingItem.Quantity > product.Quantity)
                {
                    throw new Exception($"Not enough stock. Available: {product.Quantity}");
                }

                await _cartItemRepository.UpdateAsync(existingItem);

                // Load lại để có đầy đủ thông tin
                var updatedItem = await _cartItemRepository.GetByIdAsync(existingItem.Id, userId);
                return MapToCartItemDto(updatedItem!);
            }
            else
            {
                // Validate stock
                if (dto.Quantity > product.Quantity)
                {
                    throw new Exception($"Not enough stock. Available: {product.Quantity}");
                }

                // Tạo mới cart item
                var cartItem = new CartItem
                {
                    UserId = userId,
                    ProductId = dto.ProductId,
                    Quantity = dto.Quantity,
                    PriceAtAdd = product.DiscountPrice ?? product.Price
                };

                var createdItem = await _cartItemRepository.AddAsync(cartItem);

                // Load lại để có đầy đủ thông tin product
                var loadedItem = await _cartItemRepository.GetByIdAsync(createdItem.Id, userId);
                return MapToCartItemDto(loadedItem!);
            }
        }

        public async Task<CartItemDto> UpdateItemAsync(int userId, int cartItemId, UpdateCartItemDto dto)
        {
            var cartItem = await _cartItemRepository.GetByIdAsync(cartItemId, userId);
            if (cartItem == null)
            {
                throw new Exception("Cart item not found");
            }

            if (dto.Quantity <= 0)
            {
                throw new Exception("Quantity must be greater than 0");
            }

            // Validate stock
            var product = await _productRepository.GetByIdAsync(cartItem.ProductId!.Value);
            if (product == null || product.Status != 1)
            {
                throw new Exception("Product not found or unavailable");
            }

            if (dto.Quantity > product.Quantity)
            {
                throw new Exception($"Not enough stock. Available: {product.Quantity}");
            }

            cartItem.Quantity = dto.Quantity;
            await _cartItemRepository.UpdateAsync(cartItem);

            // Load lại để có đầy đủ thông tin
            var updatedItem = await _cartItemRepository.GetByIdAsync(cartItemId, userId);
            return MapToCartItemDto(updatedItem!);
        }

        public async Task RemoveItemAsync(int userId, int cartItemId)
        {
            var cartItem = await _cartItemRepository.GetByIdAsync(cartItemId, userId);
            if (cartItem == null)
            {
                throw new Exception("Cart item not found");
            }

            await _cartItemRepository.DeleteAsync(cartItemId);
        }

        public async Task ClearCartAsync(int userId)
        {
            await _cartItemRepository.ClearCartAsync(userId);
        }

        public async Task<CartResponseDto> MergeCartAsync(int userId, List<AddCartItemDto> items)
        {
            if (items == null || !items.Any())
            {
                // Không có gì để merge -> trả về giỏ hiện tại
                return await GetCartAsync(userId);
            }

            foreach (var item in items)
            {
                try
                {
                    // Tận dụng lại logic AddItemAsync (đã có kiểm tra tồn kho, status, cộng dồn quantity)
                    await AddItemAsync(userId, item);
                }
                catch (Exception)
                {
                    // Tùy bạn: có thể log lại, nhưng thường bỏ qua item lỗi để không chặn toàn bộ merge
                    // Ví dụ: sản phẩm đã bị xóa / hết hàng -> bỏ qua
                }
            }

            // Trả về giỏ hàng sau khi merge
            return await GetCartAsync(userId);
        }

        #region Private Helpers

        private CartItemDto MapToCartItemDto(CartItem cartItem)
        {
            var product = cartItem.Product;
            var effectivePrice = product?.DiscountPrice ?? product?.Price ?? 0;

            return new CartItemDto
            {
                Id = cartItem.Id,
                ProductId = cartItem.ProductId ?? 0,
                ProductName = product?.Name ?? string.Empty,
                UnitPrice = product?.Price ?? 0,
                DiscountPrice = product?.DiscountPrice,
                Quantity = cartItem.Quantity,
                Subtotal = effectivePrice * cartItem.Quantity,
                PrimaryImageUrl = product?.ProductImages
                    .FirstOrDefault(i => i.IsPrimary)?.Url
                    ?? product?.ProductImages.FirstOrDefault()?.Url,
                AvailableStock = product?.Quantity ?? 0
            };
        }

        #endregion
    }
}

