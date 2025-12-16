using BookStation.API.DTOs.Order;
using FluentValidation;

namespace BookStation.API.Validators
{
    public class CreateOrderValidator : AbstractValidator<CreateOrderDto>
    {
        public CreateOrderValidator()
        {
            RuleFor(x => x.ShippingInfo)
                .NotNull().WithMessage("Shipping information is required");

            RuleFor(x => x.ShippingInfo.ReceiverName)
                .NotEmpty().WithMessage("Receiver name is required")
                .MaximumLength(200).WithMessage("Receiver name cannot exceed 200 characters");

            RuleFor(x => x.ShippingInfo.Phone)
                .NotEmpty().WithMessage("Phone number is required")
                .Matches(@"^[0-9]{10,11}$").WithMessage("Phone number must be 10-11 digits");

            RuleFor(x => x.ShippingInfo.Address)
                .NotEmpty().WithMessage("Address is required")
                .MaximumLength(500).WithMessage("Address cannot exceed 500 characters");

            RuleFor(x => x.PaymentMethod)
                .NotEmpty().WithMessage("Payment method is required")
                .Must(x => new[] { "COD", "Banking", "Card" }.Contains(x))
                .WithMessage("Invalid payment method. Valid values: COD, Banking, Card");
        }
    }
}

