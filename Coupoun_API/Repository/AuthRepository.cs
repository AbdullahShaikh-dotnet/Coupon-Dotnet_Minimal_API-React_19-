using AutoMapper;
using Coupon_API.Data;
using Coupon_API.Models;
using Coupon_API.Models.DTO;
using Coupon_API.Repository.IRepository;
using Coupon_API.Services.Interfaces;
using Coupon_API.Utilities;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace Coupon_API.Repository
{
    public class AuthRepository : IAuthRepository
    {
        private readonly ApplicationDbContext _db;
        private readonly IMapper _mapper;
        private readonly IConfiguration _configuration;
        private readonly IJwtService _jwtService;
        private readonly ILogger<AuthRepository> _logger;
        private readonly string secretKey;

        public AuthRepository(ApplicationDbContext db, IMapper mapper, IConfiguration configuration, IJwtService jwtService, ILogger<AuthRepository> logger)
        {
            _db = db;
            _mapper = mapper;
            _configuration = configuration;
            secretKey = _configuration.GetValue<string>("Auth:secret");
            _jwtService = jwtService;
            _logger = logger;
        }

        public bool IsUniqueUser(string userName)
        {
            var user = _db.Users.FirstOrDefault(u => u.UserName.ToLower() == userName.ToLower());
            return user == null;
        }

        public async Task<UserLoginResponseDTO> Login(UserLoginDTO LoginObject)
        {
            var user = await _db.Users.SingleOrDefaultAsync(u => 
            u.UserName.ToLower() == LoginObject.UserName.ToLower()
            && u.Password == LoginObject.Password);


            if (user == null)
                return null;

            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.ASCII.GetBytes(secretKey);
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new Claim[]
                {
                    new Claim(ClaimTypes.Name, user.UserName),
                    new Claim(ClaimTypes.Role, user.Role),
                }),

                Expires = DateTime.Now.AddDays(7),
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
            };

            var token = tokenHandler.CreateToken(tokenDescriptor);

            UserLoginResponseDTO loginResponseObject = new UserLoginResponseDTO
            {
                User = _mapper.Map<UserDTO>(user),
                Token = new JwtSecurityTokenHandler().WriteToken(token)
            };

            return loginResponseObject;
        }

        public async Task<UserDTO> Register(UserRegisterDTO RegisterObject)
        {
            var User = _mapper.Map<User>(RegisterObject);
            User.Role = "user"; // Default role for new users

            await _db.Users.AddAsync(User);
            _db.SaveChanges();

            User.Password = string.Empty; // Clear password before returning

            return _mapper.Map<UserDTO>(User);
        }

        public async Task<ApiResponse<AuthResponseDto>> LoginAsync(UserLoginDTO loginDto)
        {
            try
            {
                var user = await _db.Users.SingleOrDefaultAsync(u =>
                u.UserName.ToLower() == loginDto.UserName.ToLower()
                && u.Password == loginDto.Password);


                if (user == null)
                {
                    return ApiResponse<AuthResponseDto>.Fail("Invalid username or password");
                }

                // Generate tokens
                var jwtToken = _jwtService.GenerateJwtToken(user);
                var refreshToken = _jwtService.GenerateRefreshToken();

                // Save refresh token to database
                var refreshTokenEntity = new RefreshToken
                {
                    Token = refreshToken,
                    ExpiryDate = DateTime.UtcNow.AddDays(7), // 7 days expiry
                    UserId = user.Id,
                    CreatedDate = DateTime.UtcNow
                };

                _db.RefreshTokens.Add(refreshTokenEntity);
                await _db.SaveChangesAsync();

                var authResponse = new AuthResponseDto
                {
                    Token = jwtToken,
                    RefreshToken = refreshToken,
                    ExpiresAt = DateTime.UtcNow.AddHours(24),
                    User =  user
                };

                return ApiResponse<AuthResponseDto>.Ok(authResponse, "Login successful");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error during login");
                return ApiResponse<AuthResponseDto>.Fail("An error occurred during login");
            }
        }



        public async Task<ApiResponse<string>> LogoutAsync(string refreshToken)
        {
            try
            {
                var tokenEntity = await _db.RefreshTokens
                    .FirstOrDefaultAsync(rt => rt.Token == refreshToken);

                if (tokenEntity == null)
                {
                    return ApiResponse<string>.Fail("Invalid refresh token");
                }
                tokenEntity.ExpiryDate = DateTime.UtcNow;
                _db.RefreshTokens.Update(tokenEntity);

                await _db.SaveChangesAsync();

                return ApiResponse<string>.Ok("Logout successful", "User logged out");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error during logout");
                return ApiResponse<string>.Fail("An error occurred while logging out");
            }
        }

    }
}
