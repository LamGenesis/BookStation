using AutoMapper;
using BookStation.API.DTOs.Product;
using BookStation.API.Models;
using BookStation.API.Repositories;
using Microsoft.AspNetCore.Http;

namespace BookStation.API.Services
{
    public class ProductService : IProductService
    {
        private readonly IProductRepository _productRepository;
        private readonly ICategoryRepository _categoryRepository;
        private readonly IMapper _mapper;
        private readonly IWebHostEnvironment _environment;

        public ProductService(
            IProductRepository productRepository,
            ICategoryRepository categoryRepository,
            IMapper mapper,
            IWebHostEnvironment environment)
        {
            _productRepository = productRepository;
            _categoryRepository = categoryRepository;
            _mapper = mapper;
            _environment = environment;
        }

        public async Task<PagedProductResponse> GetPagedAsync(ProductQueryParams query)
        {
            var (items, totalCount) = await _productRepository.GetPagedAsync(query);

            var productDtos = items.Select(p => new ProductDto
            {
                Id = p.Id,
                Name = p.Name,
                Price = p.Price,
                DiscountPrice = p.DiscountPrice,
                Quantity = p.Quantity,
                Status = p.Status,
                CategoryId = p.CategoryId,
                CategoryName = p.Category?.Name,
                PrimaryImageUrl = p.ProductImages.FirstOrDefault(i => i.IsPrimary)?.Url
                    ?? p.ProductImages.FirstOrDefault()?.Url,
                CreatedAt = p.CreatedAt
            }).ToList();

            return new PagedProductResponse
            {
                Items = productDtos,
                TotalItems = totalCount,
                TotalPages = (int)Math.Ceiling((double)totalCount / query.PageSize),
                CurrentPage = query.Page,
                PageSize = query.PageSize
            };
        }

        public async Task<ProductDetailDto?> GetByIdAsync(int id)
        {
            var product = await _productRepository.GetByIdAsync(id);
            if (product == null) return null;

            return new ProductDetailDto
            {
                Id = product.Id,
                Name = product.Name,
                Description = product.Description,
                Price = product.Price,
                DiscountPrice = product.DiscountPrice,
                Quantity = product.Quantity,
                Status = product.Status,
                CategoryId = product.CategoryId,
                CategoryName = product.Category?.Name,
                CreatedAt = product.CreatedAt,
                Images = product.ProductImages.Select(i => new ProductImageDto
                {
                    Id = i.Id,
                    Url = i.Url,
                    IsPrimary = i.IsPrimary
                }).ToList()
            };
        }

        public async Task<ProductDetailDto> CreateAsync(CreateProductDto dto, IFormFileCollection? images)
        {
            // Validate CategoryId nếu được cung cấp
            if (dto.CategoryId.HasValue)
            {
                var category = await _categoryRepository.GetByIdAsync(dto.CategoryId.Value);
                if (category == null)
                {
                    throw new Exception($"Category with id {dto.CategoryId} not found");
                }
            }

            // Map DTO to Entity
            var product = new Product
            {
                Name = dto.Name,
                Description = dto.Description,
                Price = dto.Price,
                DiscountPrice = dto.DiscountPrice,
                Quantity = dto.Quantity,
                CategoryId = dto.CategoryId,
                Status = dto.Status,
                CreatedAt = DateTime.UtcNow
            };

            // Lưu product trước để có Id
            var createdProduct = await _productRepository.CreateAsync(product);

            // Upload và lưu ảnh
            if (images != null && images.Count > 0)
            {
                await SaveProductImagesAsync(createdProduct.Id, images);
            }

            // Load lại product với images và category
            var result = await _productRepository.GetByIdAsync(createdProduct.Id);
            return await GetByIdAsync(result!.Id) ?? throw new Exception("Failed to create product");
        }

        public async Task<ProductDetailDto> UpdateAsync(int id, UpdateProductDto dto, IFormFileCollection? images)
        {
            var product = await _productRepository.GetByIdAsync(id);
            if (product == null)
            {
                throw new Exception($"Product with id {id} not found");
            }

            // Validate CategoryId nếu được cung cấp
            if (dto.CategoryId.HasValue)
            {
                var category = await _categoryRepository.GetByIdAsync(dto.CategoryId.Value);
                if (category == null)
                {
                    throw new Exception($"Category with id {dto.CategoryId} not found");
                }
            }

            // Update fields
            product.Name = dto.Name;
            product.Description = dto.Description;
            product.Price = dto.Price;
            product.DiscountPrice = dto.DiscountPrice;
            product.Quantity = dto.Quantity;
            product.CategoryId = dto.CategoryId;
            product.Status = dto.Status;

            await _productRepository.UpdateAsync(product);

            // Nếu có ảnh mới, xóa ảnh cũ và thêm ảnh mới
            if (images != null && images.Count > 0)
            {
                // Xóa file ảnh cũ trên disk
                foreach (var oldImage in product.ProductImages)
                {
                    DeleteImageFile(oldImage.Url);
                }
                // Xóa records trong DB
                await _productRepository.DeleteImagesByProductIdAsync(id);
                // Upload ảnh mới
                await SaveProductImagesAsync(id, images);
            }

            return await GetByIdAsync(id) ?? throw new Exception("Failed to update product");
        }

        public async Task SoftDeleteAsync(int id)
        {
            await _productRepository.SoftDeleteAsync(id);
        }

        #region Private Helper Methods

        /// <summary>
        /// Lưu ảnh sản phẩm vào wwwroot/uploads/products/
        /// </summary>
        private async Task SaveProductImagesAsync(int productId, IFormFileCollection images)
        {
            var uploadPath = Path.Combine(_environment.WebRootPath ?? "wwwroot", "uploads", "products");

            // Tạo folder nếu chưa tồn tại
            if (!Directory.Exists(uploadPath))
            {
                Directory.CreateDirectory(uploadPath);
            }

            bool isFirst = true;
            foreach (var image in images)
            {
                if (image.Length > 0)
                {
                    // Tạo filename duy nhất
                    var extension = Path.GetExtension(image.FileName);
                    var fileName = $"{Guid.NewGuid()}{extension}";
                    var filePath = Path.Combine(uploadPath, fileName);

                    // Lưu file
                    using (var stream = new FileStream(filePath, FileMode.Create))
                    {
                        await image.CopyToAsync(stream);
                    }

                    // Tạo ProductImage record
                    var productImage = new ProductImage
                    {
                        ProductId = productId,
                        Url = $"/uploads/products/{fileName}",
                        IsPrimary = isFirst // Ảnh đầu tiên là primary
                    };

                    await _productRepository.AddImageAsync(productImage);
                    isFirst = false;
                }
            }
        }

        /// <summary>
        /// Xóa file ảnh trên disk
        /// </summary>
        private void DeleteImageFile(string imageUrl)
        {
            if (string.IsNullOrEmpty(imageUrl)) return;

            var filePath = Path.Combine(_environment.WebRootPath ?? "wwwroot", imageUrl.TrimStart('/'));
            if (File.Exists(filePath))
            {
                File.Delete(filePath);
            }
        }

        #endregion
    }
}

