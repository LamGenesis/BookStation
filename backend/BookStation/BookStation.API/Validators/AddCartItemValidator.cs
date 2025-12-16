using BookStation.API.DTOs.Cart;
using FluentValidation;

namespace BookStation.API.Validators
{
    public class AddCartItemValidator : AbstractValidator<AddCartItemDto>
    {
        public AddCartItemValidator()
        {
            RuleFor(x => x.ProductId)
                .GreaterThan(0).WithMessage("Invalid product ID");

            RuleFor(x => x.Quantity)
                .GreaterThan(0).WithMessage("Quantity must be greater than 0")
                .LessThanOrEqualTo(100).WithMessage("Quantity cannot exceed 100");
        }
    }
}

