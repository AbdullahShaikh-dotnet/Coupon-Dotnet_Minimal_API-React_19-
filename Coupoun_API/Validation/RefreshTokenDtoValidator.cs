using Coupon_API.Models.DTO;
using FluentValidation;

namespace Coupon_API.Validation
{
    public class RefreshTokenDtoValidator : AbstractValidator<RefreshTokenDto>
    {
        public RefreshTokenDtoValidator()
        {
            RuleFor(x => x.Token)
                .NotEmpty()
                .WithMessage("Access token is required")
                .MinimumLength(50)
                .WithMessage("Invalid access token format");

            RuleFor(x => x.RefreshToken)
                .NotEmpty()
                .WithMessage("Refresh token is required")
                .MinimumLength(20)
                .WithMessage("Invalid refresh token format");
        }
    }
}
