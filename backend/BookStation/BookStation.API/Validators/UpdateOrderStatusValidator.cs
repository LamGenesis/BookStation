using BookStation.API.DTOs.Order;
using FluentValidation;

namespace BookStation.API.Validators
{
    public class UpdateOrderStatusValidator : AbstractValidator<UpdateOrderStatusDto>
    {
        public UpdateOrderStatusValidator()
        {
            RuleFor(x => x.Status)
                .NotEmpty().WithMessage("Status is required")
                .Must(x => new[] { "Pending", "Confirmed", "Processing", "Shipping", "Delivered", "Cancelled" }.Contains(x))
                .WithMessage("Invalid status. Valid values: Pending, Confirmed, Processing, Shipping, Delivered, Cancelled");
        }
    }
}

