using Coupon_API.Data;
using Coupon_API.Models;
using Coupon_API.Models.DTO;
using Coupon_API.Services.Interfaces;
using Coupon_API.Utilities;
using Microsoft.EntityFrameworkCore;
using System;

namespace Coupon_API.Services
{
    public class AuthService : IAuthService
    {
        private readonly ApplicationDbContext _context;
        private readonly IJwtService _jwtService;
        private readonly ILogger<AuthService> _logger;

        public AuthService(
            ApplicationDbContext context,
            IJwtService jwtService,
            ILogger<AuthService> logger)
        {
            _context = context;
            _jwtService = jwtService;
            _logger = logger;
        }

        public async Task<ApiResponse<AuthResponseDto>> RefreshTokenAsync(RefreshTokenDto refreshTokenDto)
        {
            try
            {
                // Validate the expired JWT token
                var principal = _jwtService.GetPrincipalFromExpiredToken(refreshTokenDto.Token);
                if (principal == null)
                {
                    return ApiResponse<AuthResponseDto>.Fail("Invalid access token");
                }

                // Get user ID from token claims
                var userIdClaim = principal.FindFirst("userId")?.Value;
                if (!int.TryParse(userIdClaim, out var userId))
                {
                    return ApiResponse<AuthResponseDto>.Fail("Invalid token claims");
                }

                // Find and validate refresh token
                var refreshToken = await _context.RefreshTokens
                    .Include(rt => rt.User)
                    .FirstOrDefaultAsync(rt => rt.Token == refreshTokenDto.RefreshToken && rt.UserId == userId);

                if (refreshToken == null)
                {
                    _logger.LogWarning("Refresh token not found for user {UserId}", userId);
                    return ApiResponse<AuthResponseDto>.Fail("Invalid refresh token");
                }

                // Validate refresh token
                if (refreshToken.IsUsed)
                {
                    _logger.LogWarning("Attempted use of already used refresh token for user {UserId}", userId);
                    // Revoke all tokens for this user (security measure)
                    await RevokeAllUserTokensAsync(userId);
                    return ApiResponse<AuthResponseDto>.Fail("Invalid refresh token");
                }

                if (refreshToken.IsRevoked)
                {
                    _logger.LogWarning("Attempted use of revoked refresh token for user {UserId}", userId);
                    return ApiResponse<AuthResponseDto>.Fail("Invalid refresh token");
                }

                if (refreshToken.ExpiryDate < DateTime.UtcNow)
                {
                    _logger.LogWarning("Expired refresh token used for user {UserId}", userId);
                    return ApiResponse<AuthResponseDto>.Fail("Refresh token expired");
                }

                // Check if user still exists and is active
                var user = refreshToken.User;
                if (user == null)
                {
                    _logger.LogWarning("Refresh token used for inactive user {UserId}", userId);
                    return ApiResponse<AuthResponseDto>.Fail("User account is inactive");
                }

                // Mark current refresh token as used
                refreshToken.IsUsed = true;


                // Generate new tokens
                var newJwtToken = _jwtService.GenerateJwtToken(user);
                var newRefreshToken = _jwtService.GenerateRefreshToken();

                // Save new refresh token
                var newRefreshTokenEntity = new RefreshToken
                {
                    Token = newRefreshToken,
                    ExpiryDate = DateTime.UtcNow.AddDays(7), // Refresh token valid for 7 days
                    UserId = user.Id,
                    CreatedDate = DateTime.UtcNow
                };

                _context.RefreshTokens.Add(newRefreshTokenEntity);
                await _context.SaveChangesAsync();

                var authResponse = new AuthResponseDto
                {
                    Token = newJwtToken,
                    RefreshToken = newRefreshToken,
                    ExpiresAt = DateTime.UtcNow.AddHours(24), // JWT expires in 24 hours
                    User = user
                };

                _logger.LogInformation("Token refreshed Sucess  for user {UserId}", userId);
                return ApiResponse<AuthResponseDto>.Ok(authResponse, "Token refreshed Okfully");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error refreshing token");
                return ApiResponse<AuthResponseDto>.Fail("An error occurred while refreshing the token");
            }
        }

        public async Task<bool> RevokeAllUserTokensAsync(int userId)
        {
            try
            {
                var userTokens = await _context.RefreshTokens
                    .Where(rt => rt.UserId == userId && !rt.IsRevoked)
                    .ToListAsync();

                foreach (var token in userTokens)
                {
                    token.IsRevoked = true;
                    token.ExpiryDate = DateTime.UtcNow;
                }

                await _context.SaveChangesAsync();
                return true;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error revoking tokens for user {UserId}", userId);
                return false;
            }
        }
    }
}
