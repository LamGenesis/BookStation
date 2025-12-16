using BookStation.API.DTOs.Product;
using Microsoft.AspNetCore.Http;

namespace BookStation.API.Services
{
    public interface IProductService
    {
        /// <summary>
        /// Lấy danh sách sản phẩm có phân trang
        /// </summary>
        Task<PagedProductResponse> GetPagedAsync(ProductQueryParams query);

        /// <summary>
        /// Lấy chi tiết sản phẩm theo ID
        /// </summary>
        Task<ProductDetailDto?> GetByIdAsync(int id);

        /// <summary>
        /// Tạo sản phẩm mới (kèm upload ảnh)
        /// </summary>
        Task<ProductDetailDto> CreateAsync(CreateProductDto dto, IFormFileCollection? images);

        /// <summary>
        /// Cập nhật sản phẩm (có thể kèm ảnh mới)
        /// </summary>
        Task<ProductDetailDto> UpdateAsync(int id, UpdateProductDto dto, IFormFileCollection? images);

        /// <summary>
        /// Xóa mềm sản phẩm
        /// </summary>
        Task SoftDeleteAsync(int id);
    }
}

