using AutoMapper;
using BookStation.API.DTOs.Auth;
using BookStation.API.DTOs.Category;
using BookStation.API.DTOs.Post;
using BookStation.API.DTOs.Product;
using BookStation.API.Models;

namespace BookStation.API.Mappings
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            // User mappings
            CreateMap<User, UserInfoDto>();

            // Category mappings
            CreateMap<Category, CategoryDto>();
            CreateMap<CreateCategoryDto, Category>();
            CreateMap<UpdateCategoryDto, Category>();

            // Product mappings
            CreateMap<Product, ProductDto>()
                .ForMember(dest => dest.CategoryName, opt => opt.MapFrom(src => src.Category != null ? src.Category.Name : null))
                .ForMember(dest => dest.PrimaryImageUrl, opt => opt.MapFrom(src => 
                    src.ProductImages.FirstOrDefault(i => i.IsPrimary) != null 
                        ? src.ProductImages.FirstOrDefault(i => i.IsPrimary)!.Url 
                        : src.ProductImages.FirstOrDefault() != null 
                            ? src.ProductImages.FirstOrDefault()!.Url 
                            : null));

            CreateMap<Product, ProductDetailDto>()
                .ForMember(dest => dest.CategoryName, opt => opt.MapFrom(src => src.Category != null ? src.Category.Name : null))
                .ForMember(dest => dest.Images, opt => opt.MapFrom(src => src.ProductImages));

            CreateMap<ProductImage, ProductImageDto>();

            CreateMap<CreateProductDto, Product>();
            CreateMap<UpdateProductDto, Product>();

            // Post mappings
            CreateMap<Post, PostDto>()
                .ForMember(dest => dest.AuthorName, opt => opt.MapFrom(src => src.Author != null ? src.Author.FullName : null));

            CreateMap<Post, PostDetailDto>()
                .ForMember(dest => dest.AuthorName, opt => opt.MapFrom(src => src.Author != null ? src.Author.FullName : null));

            CreateMap<CreatePostDto, Post>();
            CreateMap<UpdatePostDto, Post>();
        }
    }
}
