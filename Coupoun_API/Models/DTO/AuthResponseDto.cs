namespace Coupon_API.Models.DTO
{
    public class AuthResponseDto
    {
        public string Token { get; set; } = string.Empty;
        public string RefreshToken { get; set; } = string.Empty;
        public DateTime ExpiresAt { get; set; }
        public UserLoginResponseDTO User { get; set; } = null!;
    }
}
