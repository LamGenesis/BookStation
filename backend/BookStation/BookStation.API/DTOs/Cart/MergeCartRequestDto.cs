using System.Collections.Generic;

namespace BookStation.API.DTOs.Cart
{
    public class MergeCartRequestDto
    {
        /// <summary>
        /// Danh sách sản phẩm trong giỏ hàng của guest (localStorage)
        /// </summary>
        public List<AddCartItemDto> Items { get; set; } = new List<AddCartItemDto>();
    }
}


