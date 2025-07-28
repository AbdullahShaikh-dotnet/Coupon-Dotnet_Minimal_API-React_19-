using Coupon_API.Data;
using Coupon_API.Models.DTO;
using FluentValidation;


namespace Coupon_API.Validation
{
    public class CouponUpdateValidation : AbstractValidator<CouponUpdateDTO>
    {
        public CouponUpdateValidation()
        {
            RuleFor(model => model.Name)
                .NotEmpty().WithMessage("Coupon Name is required.")
                .Length(3, 50).WithMessage("Coupon Name must be between 3 and 50 characters.");

            RuleFor(model => model.Percentage)
                .InclusiveBetween(1, 100).WithMessage("Percentage must be between 1 to 100");

            RuleFor(model => model.ExpireDate)
                .Must(date => date >= DateOnly.FromDateTime(DateTime.Now.Date))
                .WithMessage("Expire date must be today or in the future.");

            RuleFor(model => model.Id).GreaterThan(0).WithMessage("Id must be grater than zero"); ;
        }
    }
}
