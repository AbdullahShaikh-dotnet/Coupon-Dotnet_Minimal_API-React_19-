using Coupon_API.Models.DTO;
using Coupon_API.Utilities;

namespace Coupon_API.Repository.IRepository
{
    public interface IAuthRepository
    {
        bool IsUniqueUser(string userName);

        Task<UserDTO> Register(UserRegisterDTO RegisterObject);

        Task<UserLoginResponseDTO> Login(UserLoginDTO LoginObject);

        Task<ApiResponse<AuthResponseDto>> LoginAsync(UserLoginDTO loginDto);

        Task<ApiResponse<string>> LogoutAsync(string refreshToken);
    }
}
