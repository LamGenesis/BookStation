using BookStation.API.DTOs.Category;
using FluentValidation;

namespace BookStation.API.Validators
{
    public class CreateCategoryValidator : AbstractValidator<CreateCategoryDto>
    {
        public CreateCategoryValidator()
        {
            RuleFor(x => x.Name)
                .NotEmpty().WithMessage("Category name is required")
                .MaximumLength(200).WithMessage("Category name cannot exceed 200 characters");

            RuleFor(x => x.Slug)
                .MaximumLength(200).WithMessage("Slug cannot exceed 200 characters")
                .Matches("^[a-z0-9-]*$").When(x => !string.IsNullOrEmpty(x.Slug))
                .WithMessage("Slug can only contain lowercase letters, numbers, and hyphens");
        }
    }
}

