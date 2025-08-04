using Coupon_API.Models;
using FluentValidation;

namespace Coupon_API.Validation
{
    public class CouponSearchValidation : AbstractValidator<SearchCoupon>
    {
        public CouponSearchValidation()
        {
            RuleFor(c => c.CouponName)
                .NotEmpty().WithMessage("Coupon name is required.")
                .Length(3, 100).WithMessage("Coupon name must be between 3 and 100 characters.");

            RuleFor(c => c.PageSize)
                .InclusiveBetween(1, int.MaxValue).WithMessage("Page size should be in between 1 to 2147483647");

            RuleFor(c => c.PageNumber)
                .InclusiveBetween(1, int.MaxValue).WithMessage("Page number should be in between 1 to 2147483647");
        }
    }
}
