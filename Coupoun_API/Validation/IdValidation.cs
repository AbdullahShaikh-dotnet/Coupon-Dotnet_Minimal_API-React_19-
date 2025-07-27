using Coupon_API.Data;
using FluentValidation;


namespace Coupon_API.Validation
{
    public class IdValidation : AbstractValidator<int>
    {
        public IdValidation(ApplicationDbContext _db)
        {
            RuleFor(id => id)
                .GreaterThan(0).WithMessage("Id must be greater than 0.")
                .Must(id => _db.Coupons.Any(prop => prop.Id == id))
                .WithMessage("Id does not exist in the store.");
        }
    }
}
