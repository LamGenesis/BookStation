using BookStation.API.DTOs.Cart;
using FluentValidation;

namespace BookStation.API.Validators
{
    public class UpdateCartItemValidator : AbstractValidator<UpdateCartItemDto>
    {
        public UpdateCartItemValidator()
        {
            RuleFor(x => x.Quantity)
                .GreaterThan(0).WithMessage("Quantity must be greater than 0")
                .LessThanOrEqualTo(100).WithMessage("Quantity cannot exceed 100");
        }
    }
}

