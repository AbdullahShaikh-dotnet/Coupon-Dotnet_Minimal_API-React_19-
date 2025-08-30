using AutoMapper;
using Coupon_API.Data;
using Coupon_API.Models;
using Coupon_API.Models.DTO;
using Coupon_API.Repository.IRepository;
using Coupon_API.Services.Interfaces;
using FluentValidation;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Win32;
using System.Net;

namespace Coupon_API.EndPoints
{
    public static class Auth_EndPoints
    {
        public static void MapAuthEndpoints(this IEndpointRouteBuilder app)
        {
            app.MapPost("/api/login", SecureLogin).WithName("Login")
            .Produces<APIResponse>(201)
            .Produces(400)
            .Accepts<UserLoginDTO>(contentType: "application/json");


            app.MapPost("/api/register", Register).WithName("register")
            .Produces<APIResponse>(201)
            .Produces(400)
            .Accepts<UserRegisterDTO>(contentType: "application/json");

            app.MapPost("/api/logout", Logout)
            .WithName("Logout")
            .Produces<ApiResponse<bool>>()
            .Produces(400)
            .WithOpenApi()
            .AllowAnonymous();


            app.MapPost("/api/auth/refresh", RefreshToken)
            .WithName("RefreshToken")
            .WithOpenApi()
            .AllowAnonymous();

        }
        private static async Task<IResult> Login(IAuthRepository authRepository, [FromBody] UserLoginDTO userLogin)
        {
            APIResponse response = new APIResponse();

            var LoginResponse = await authRepository.Login(userLogin);

            if(LoginResponse is null)
            {
                response.ErrorMessages.Add("Username or Password is incorrect");
                response.IsSuccess = false;
                response.Result = null;
                return Results.BadRequest(response);
            }

            response.Result = LoginResponse;
            response.StatusCode = HttpStatusCode.OK;
            response.IsSuccess = true;

            return Results.Ok(response);
        }
        private static async Task<IResult> Register(IAuthRepository authRepository, [FromBody] UserRegisterDTO userRegister)
        {
            APIResponse response = new APIResponse();

            if (!authRepository.IsUniqueUser(userRegister.UserName))
            {
                response.ErrorMessages.Add("Username already exists");
                response.IsSuccess = false;
                response.Result = null;
                return Results.BadRequest(response);
            }

            var RegisterResponse = await authRepository.Register(userRegister);

            response.Result = "User Created Successfull";
            response.StatusCode = HttpStatusCode.OK;
            response.IsSuccess = true;

            return Results.Ok(response);
        }


        private static async Task<IResult> SecureLogin(IAuthRepository authRepository, [FromBody] UserLoginDTO userLogin)
        {
            var loginResponse = await authRepository.LoginAsync(userLogin);

            return loginResponse.Success ? Results.Ok(loginResponse) : Results.BadRequest(loginResponse);
        }

        private static async Task<IResult> Logout(IAuthRepository authRepository, string refreshToken)
        {
            var response = await authRepository.LogoutAsync(refreshToken);
            return response.Success ? Results.Ok(response) : Results.BadRequest(response);
        }

        private static async Task<IResult> RefreshToken(RefreshTokenDto refreshTokenDto, IAuthService authService, IValidator<RefreshTokenDto> validator)
        {
            var validationResult = await validator.ValidateAsync(refreshTokenDto);
            if (!validationResult.IsValid)
            {
                var errors = validationResult.Errors.Select(e => e.ErrorMessage);
                return Results.BadRequest(new APIResponse()
                {
                    ErrorMessages = errors.ToList(),
                    IsSuccess = false,
                    Result = "Validation failed",
                    StatusCode = HttpStatusCode.Unauthorized
                });
            }

            var result = await authService.RefreshTokenAsync(refreshTokenDto);

            return result.Success
                ? Results.Ok(result)
                : Results.BadRequest(result);
        }



    }
}
