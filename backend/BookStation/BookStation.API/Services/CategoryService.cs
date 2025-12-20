using AutoMapper;
using BookStation.API.DTOs.Category;
using BookStation.API.Models;
using BookStation.API.Repositories;

namespace BookStation.API.Services
{
    public class CategoryService : ICategoryService
    {
        private readonly ICategoryRepository _categoryRepository;
        private readonly IMapper _mapper;

        public CategoryService(ICategoryRepository categoryRepository, IMapper mapper)
        {
            _categoryRepository = categoryRepository;
            _mapper = mapper;
        }

        public async Task<IEnumerable<CategoryDto>> GetAllAsync()
        {
            var categories = await _categoryRepository.GetAllAsync();
            return _mapper.Map<IEnumerable<CategoryDto>>(categories);
        }

        public async Task<CategoryDto?> GetByIdAsync(int id)
        {
            var category = await _categoryRepository.GetByIdAsync(id);
            if (category == null) return null;

            return _mapper.Map<CategoryDto>(category);
        }

        public async Task<CategoryDto> CreateAsync(CreateCategoryDto dto)
        {
            var category = _mapper.Map<Category>(dto);
            category.Slug = dto.Slug ?? GenerateSlug(dto.Name);

            var createdCategory = await _categoryRepository.CreateAsync(category);

            return _mapper.Map<CategoryDto>(createdCategory);
        }

        public async Task<CategoryDto> UpdateAsync(int id, UpdateCategoryDto dto)
        {
            var category = await _categoryRepository.GetByIdAsync(id);
            if (category == null)
            {
                throw new Exception($"Category with id {id} not found");
            }

            // Update fields manually or using mapper
            category.Name = dto.Name;
            category.Slug = dto.Slug ?? GenerateSlug(dto.Name);

            var updatedCategory = await _categoryRepository.UpdateAsync(category);

            return _mapper.Map<CategoryDto>(updatedCategory);
        }

        public async Task DeleteAsync(int id)
        {
            await _categoryRepository.DeleteAsync(id);
        }

        // Helper method: Generate slug from name
        private string GenerateSlug(string name)
        {
            return name.ToLower()
                .Replace(" ", "-")
                .Replace("đ", "d");
        }
    }
}