namespace Coupon_API.Models.DTO
{
    public class UserLoginResponseDTO
    {
        public UserDTO User { get; set; }

        public string Token { get; set; }
    }
}
// This class represents the response returned after a user logs in, containing the user details and an authentication token.