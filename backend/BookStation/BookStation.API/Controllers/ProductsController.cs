using BookStation.API.DTOs.Product;
using BookStation.API.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace BookStation.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProductsController : ControllerBase
    {
        private readonly IProductService _productService;

        public ProductsController(IProductService productService)
        {
            _productService = productService;
        }

        /// <summary>
        /// GET: api/products (Public)
        /// Lấy danh sách sản phẩm với phân trang, filter, search, sort
        /// </summary>
        [HttpGet]
        public async Task<IActionResult> GetAll([FromQuery] ProductQueryParams query)
        {
            var result = await _productService.GetPagedAsync(query);
            return Ok(result);
        }

        /// <summary>
        /// GET: api/products/{id} (Public)
        /// Lấy chi tiết một sản phẩm
        /// </summary>
        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var product = await _productService.GetByIdAsync(id);
            if (product == null)
            {
                return NotFound(new { message = $"Product with id {id} not found" });
            }
            return Ok(product);
        }

        /// <summary>
        /// POST: api/products (Admin only)
        /// Tạo sản phẩm mới với multipart/form-data (hỗ trợ upload ảnh)
        /// </summary>
        [HttpPost]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Create([FromForm] CreateProductDto dto, [FromForm] IFormFileCollection? images)
        {
            try
            {
                var product = await _productService.CreateAsync(dto, images);
                return CreatedAtAction(nameof(GetById), new { id = product.Id }, product);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        /// <summary>
        /// PUT: api/products/{id} (Admin only)
        /// Cập nhật sản phẩm (có thể kèm ảnh mới)
        /// </summary>
        [HttpPut("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Update(int id, [FromForm] UpdateProductDto dto, [FromForm] IFormFileCollection? images)
        {
            try
            {
                var product = await _productService.UpdateAsync(id, dto, images);
                return Ok(product);
            }
            catch (Exception ex)
            {
                // Trả về thông tin lỗi chi tiết hơn để FE debug
                var message = ex.InnerException?.InnerException?.Message
                              ?? ex.InnerException?.Message
                              ?? ex.Message;
                return BadRequest(new { message });
            }
        }

        /// <summary>
        /// DELETE: api/products/{id} (Admin only)
        /// Xóa mềm sản phẩm (đặt Status = 0)
        /// </summary>
        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Delete(int id)
        {
            try
            {
                await _productService.SoftDeleteAsync(id);
                return NoContent();
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }
    }
}

