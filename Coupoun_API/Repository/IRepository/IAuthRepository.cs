using Coupon_API.Models.DTO;

namespace Coupon_API.Repository.IRepository
{
    public interface IAuthRepository
    {
        bool IsUniqueUser(string userName);

        Task<UserDTO> Register(UserRegisterDTO RegisterObject);

        Task<UserLoginResponseDTO> Login(UserLoginDTO LoginObject);
    }
}
