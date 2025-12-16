using BookStation.API.DTOs.Product;
using FluentValidation;

namespace BookStation.API.Validators
{
    public class UpdateProductValidator : AbstractValidator<UpdateProductDto>
    {
        public UpdateProductValidator()
        {
            RuleFor(x => x.Name)
                .NotEmpty().WithMessage("Product name is required")
                .MaximumLength(500).WithMessage("Product name cannot exceed 500 characters");

            RuleFor(x => x.Price)
                .GreaterThan(0).WithMessage("Price must be greater than 0");

            RuleFor(x => x.DiscountPrice)
                .GreaterThanOrEqualTo(0).When(x => x.DiscountPrice.HasValue)
                .WithMessage("Discount price must be greater than or equal to 0")
                .LessThan(x => x.Price).When(x => x.DiscountPrice.HasValue)
                .WithMessage("Discount price must be less than regular price");

            RuleFor(x => x.Quantity)
                .GreaterThanOrEqualTo(0).WithMessage("Quantity must be greater than or equal to 0");

            RuleFor(x => x.CategoryId)
                .GreaterThan(0).When(x => x.CategoryId.HasValue)
                .WithMessage("Invalid category ID");

            RuleFor(x => x.Status)
                .InclusiveBetween(0, 1).WithMessage("Status must be 0 (inactive) or 1 (active)");
        }
    }
}

