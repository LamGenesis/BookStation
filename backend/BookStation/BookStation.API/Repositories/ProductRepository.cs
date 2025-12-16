using BookStation.API.Data;
using BookStation.API.DTOs.Product;
using BookStation.API.Models;
using Microsoft.EntityFrameworkCore;

namespace BookStation.API.Repositories
{
    public class ProductRepository : IProductRepository
    {
        private readonly ApplicationDbContext _context;

        public ProductRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<(IEnumerable<Product> Items, int TotalCount)> GetPagedAsync(ProductQueryParams query)
        {
            // Bắt đầu với query cơ bản - chỉ lấy sản phẩm active (Status = 1)
            var queryable = _context.Products
                .Include(p => p.Category)
                .Include(p => p.ProductImages)
                .Where(p => p.Status == 1)
                .AsQueryable();

            // Filter theo CategoryId
            if (query.CategoryId.HasValue)
            {
                queryable = queryable.Where(p => p.CategoryId == query.CategoryId.Value);
            }

            // Search theo tên
            if (!string.IsNullOrWhiteSpace(query.Search))
            {
                var searchTerm = query.Search.ToLower();
                queryable = queryable.Where(p => p.Name.ToLower().Contains(searchTerm));
            }

            // Sort
            queryable = query.Sort?.ToLower() switch
            {
                "price_asc" => queryable.OrderBy(p => p.DiscountPrice ?? p.Price),
                "price_desc" => queryable.OrderByDescending(p => p.DiscountPrice ?? p.Price),
                "name_asc" => queryable.OrderBy(p => p.Name),
                "name_desc" => queryable.OrderByDescending(p => p.Name),
                "newest" => queryable.OrderByDescending(p => p.CreatedAt),
                "oldest" => queryable.OrderBy(p => p.CreatedAt),
                _ => queryable.OrderByDescending(p => p.CreatedAt) // Default: newest first
            };

            // Đếm tổng số bản ghi (trước khi phân trang)
            var totalCount = await queryable.CountAsync();

            // Phân trang
            var items = await queryable
                .Skip((query.Page - 1) * query.PageSize)
                .Take(query.PageSize)
                .ToListAsync();

            return (items, totalCount);
        }

        public async Task<Product?> GetByIdAsync(int id)
        {
            return await _context.Products
                .Include(p => p.Category)
                .Include(p => p.ProductImages)
                .FirstOrDefaultAsync(p => p.Id == id);
        }

        public async Task<Product> CreateAsync(Product product)
        {
            _context.Products.Add(product);
            await _context.SaveChangesAsync();
            return product;
        }

        public async Task<Product> UpdateAsync(Product product)
        {
            _context.Products.Update(product);
            await _context.SaveChangesAsync();
            return product;
        }

        public async Task SoftDeleteAsync(int id)
        {
            var product = await _context.Products.FindAsync(id);
            if (product != null)
            {
                product.Status = 0; // 0 = Inactive/Deleted
                await _context.SaveChangesAsync();
            }
        }

        public async Task<ProductImage> AddImageAsync(ProductImage image)
        {
            _context.ProductImages.Add(image);
            await _context.SaveChangesAsync();
            return image;
        }

        public async Task DeleteImagesByProductIdAsync(int productId)
        {
            var images = await _context.ProductImages
                .Where(pi => pi.ProductId == productId)
                .ToListAsync();

            if (images.Any())
            {
                _context.ProductImages.RemoveRange(images);
                await _context.SaveChangesAsync();
            }
        }
    }
}

