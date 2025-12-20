using BookStation.API.DTOs.Product;
using BookStation.API.Models;

namespace BookStation.API.Repositories
{
    public interface IProductRepository
    {
        /// <summary>
        /// Lấy danh sách sản phẩm có phân trang, filter, search, sort
        /// </summary>
        Task<(IEnumerable<Product> Items, int TotalCount)> GetPagedAsync(ProductQueryParams query);

        /// <summary>
        /// Lấy chi tiết sản phẩm theo ID (bao gồm Category và Images)
        /// </summary>
        Task<Product?> GetByIdAsync(int id);

        /// <summary>
        /// Tạo sản phẩm mới
        /// </summary>
        Task<Product> CreateAsync(Product product);

        /// <summary>
        /// Cập nhật sản phẩm
        /// </summary>
        Task<Product> UpdateAsync(Product product);

        /// <summary>
        /// Xóa mềm sản phẩm (đặt Status = 0)
        /// </summary>
        Task SoftDeleteAsync(int id);

        /// <summary>
        /// Thêm ảnh cho sản phẩm
        /// </summary>
        Task<ProductImage> AddImageAsync(ProductImage image);

        /// <summary>
        /// Xóa tất cả ảnh của sản phẩm
        /// </summary>
        Task DeleteImagesByProductIdAsync(int productId);
    }
}

