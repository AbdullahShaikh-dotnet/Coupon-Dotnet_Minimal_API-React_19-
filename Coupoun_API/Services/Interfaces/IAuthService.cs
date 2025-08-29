using Coupon_API.Models.DTO;
using Coupon_API.Utilities;

namespace Coupon_API.Services.Interfaces
{
    public interface IAuthService
    {
        Task<ApiResponse<AuthResponseDto>> RefreshTokenAsync(RefreshTokenDto refreshTokenDto);
        Task<bool> RevokeAllUserTokensAsync(int userId);
    }
}
