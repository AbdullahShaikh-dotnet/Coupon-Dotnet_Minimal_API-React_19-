using AutoMapper;
using Coupon_API.Data;
using Coupon_API.Models;
using Coupon_API.Models.DTO;
using Coupon_API.Utilities;
using FluentValidation;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Net;
using System.Net.NetworkInformation;

namespace Coupon_API.EndPoints
{
    public static class CouponsCRUD_EndPoints
    {
        public static void MapCouponsCRUDEndpoints(this IEndpointRouteBuilder app)
        {
            // Get All Coupon
            app.MapGet("/api/coupon", GetAllCoupons)
                .WithName("GetCoupons")
                .Produces<ApiResponse<CouponDTO>>(200);


            // Get Coupon By ID
            app.MapGet("/api/coupon/{id:int}", GetAllCouponByID)
                .WithName("GetCoupon").Produces<ApiResponse<List<CouponDTO>>>(200)
                .AddEndpointFilter(async (context, next) =>
                {
                    int id = context.GetArgument<int>(4);
                    if (id <= 0)
                        return Results.BadRequest("Id must be greater than 0");

                    return await next(context);
                });


            // Add Coupon
            app.MapPost("/api/coupon", AddCoupon).WithName("CreateCoupons")
            .RequireAuthorization("adminOnly")
            .Produces<ApiResponse<CouponCreateDTO>>(201)
            .Produces(400)
            .Accepts<CouponCreateDTO>(contentType: "application/json");


            // Update Coupon
            app.MapPut("/api/coupon", UpdateCoupon)
                .Produces<ApiResponse<CouponDTO>>(200)
                .Produces(400)
                .Accepts<CouponUpdateDTO>(contentType: "application/json")
                .WithName("UpdateCoupons").RequireAuthorization("adminOnly");


            // Delete Coupon
            app.MapDelete("/api/coupon{id:int}", DeleteCoupon)
            .WithName("DeleteCoupon")
            .Produces<ApiResponse<CouponDTO>>(200)
            .Produces(400)
            .RequireAuthorization("adminOnly");


            app.MapGet("/api/coupon/search", SearchCoupon)
            .WithName("SearchCoupon")
            .Produces<ApiResponse<IEnumerable<CouponDTO>>>(200)
            .Produces(400);
        }


        private static async Task<IResult> GetAllCoupons(ApplicationDbContext _db, IMapper mapper, ILogger<Program> _logger)
        {
            var couponDB = await _db.Coupons
                .Where(coupon => coupon.DeleteId == null).ToListAsync();

            var coupons = mapper.Map<IEnumerable<CouponDTO>>(couponDB);
            var response = ApiResponse<IEnumerable<CouponDTO>>.Ok(data: coupons);
            _logger.LogInformation("Getting Coupons");
            return Results.Ok(response);
        }


        private static async Task<IResult> GetAllCouponByID(ApplicationDbContext _db, IValidator<int> validator, IMapper mapper, ILogger<Program> _logger, int id)
        {
            var validationResult = await validator.ValidateAsync(id);

            if (!validationResult.IsValid)
            {
                var badRequest = ApiResponse<List<CouponDTO>>.Fail(errors: validationResult.Errors.Select(error => error.ErrorMessage).ToList(), message: "Validation Error");
                _logger.Log(LogLevel.Error, "Validation Error : Invalid ID");
                return Results.BadRequest(badRequest);
            }

            var couponDB = await _db.Coupons
                .FirstOrDefaultAsync(coupon => coupon.Id == id && coupon.DeleteId == null);

            var coupon = mapper.Map<CouponDTO>(couponDB);
            var response = ApiResponse<List<CouponDTO>>.Ok(data: new List<CouponDTO> { coupon });

            return Results.Ok(response);
        }


        private static async Task<IResult> AddCoupon(ApplicationDbContext _db, IMapper _mapper, IValidator<CouponCreateDTO> _validator, [FromBody] CouponCreateDTO _CouponCreateDTO)
        {
            var validationResult = await _validator.ValidateAsync(_CouponCreateDTO);

            if (!validationResult.IsValid)
            {
                var badRequest = ApiResponse<CouponCreateDTO>.Fail(errors: validationResult.Errors.Select(error => error.ErrorMessage).ToList(), message: "Validation Error");
                return Results.BadRequest(badRequest);
            }

            if (await _db.Coupons.AnyAsync(c => c.Name.ToLower() == _CouponCreateDTO.Name.ToLower() && c.DeleteId == null))
            {
                var alreadyExists = ApiResponse<CouponCreateDTO>
                    .Fail(errors: new List<string>()
                    {
                        "Coupon name already exists"
                    }, message: "Validation Error");
                return Results.BadRequest(alreadyExists);
            }

            Coupon coupon = _mapper.Map<Coupon>(_CouponCreateDTO);

            _db.Coupons.Add(coupon);
            await _db.SaveChangesAsync();

            var response = ApiResponse<CouponDTO>.Ok(data: _mapper.Map<CouponDTO>(coupon));

            return Results.CreatedAtRoute("GetCoupon", new { id = coupon.Id }, response);
        }

        [Authorize(Roles = "admin")]
        private static async Task<IResult> UpdateCoupon(ApplicationDbContext _db, IMapper mapper, IValidator<CouponUpdateDTO> _validator, [FromBody] CouponUpdateDTO couponUpdate)
        {
            var validationResult = await _validator.ValidateAsync(couponUpdate);

            if (!validationResult.IsValid)
            {
                var badRequest = ApiResponse<CouponCreateDTO>.Fail(errors: validationResult.Errors.Select(error => error.ErrorMessage).ToList(), message: "Validation Error");
                return Results.BadRequest(badRequest);
            }

            if (await _db.Coupons.AnyAsync(c => c.Name == couponUpdate.Name && c.Id != couponUpdate.Id))
            {
                var alreadyExists = ApiResponse<CouponCreateDTO>
               .Fail(errors: new List<string>()
               {
                        "Coupon name already exists"
               }, message: "Validation Error");
                return Results.BadRequest(alreadyExists);
            }

            var coupon = await _db.Coupons.FirstOrDefaultAsync(prop => prop.Id == couponUpdate.Id);
            coupon.Name = couponUpdate.Name;
            coupon.ExpireDate = couponUpdate.ExpireDate;
            coupon.Percentage = couponUpdate.Percentage;
            coupon.IsActive = couponUpdate.IsActive;
            coupon.ModifyId = 1;
            coupon.ModifyDate = DateTime.Now;

            await _db.SaveChangesAsync();

            var response = ApiResponse<CouponDTO>.Ok(data: mapper.Map<CouponDTO>(coupon));

            return Results.CreatedAtRoute("GetCoupon", new { id = coupon.Id }, response);
        }


        [Authorize(Roles = "admin")]
        private static async Task<IResult> DeleteCoupon(ApplicationDbContext _db, IMapper mapper, IValidator<int> validator, int id)
        {
            var validationResult = await validator.ValidateAsync(id);

            if (!validationResult.IsValid)
            {
                var badRequest = ApiResponse<CouponDTO>.Fail(errors: validationResult.Errors.Select(error => error.ErrorMessage).ToList(), message:"Validation Error");
                return Results.BadRequest(badRequest);
            }

            var coupon = await _db.Coupons.FirstOrDefaultAsync(prop => prop.Id == id);
            coupon.DeleteId = 1;
            coupon.DeleteDate = DateTime.Now;

            await _db.SaveChangesAsync();

            var response = ApiResponse<CouponDTO>.Ok(data: mapper.Map<CouponDTO>(coupon));
            return Results.CreatedAtRoute("GetCoupon", new { id }, response);
        }


        private static async Task<IResult> SearchCoupon([AsParameters] SearchCoupon search,
            ApplicationDbContext _db, IMapper mapper, IValidator<SearchCoupon> _validator)
        {
            var validationResult = await _validator.ValidateAsync(search);

            if (!validationResult.IsValid)
            {
                var badRequest = ApiResponse<CouponDTO>.Fail(errors: validationResult.Errors.Select(error => error.ErrorMessage).ToList(), message: "Validation Error");
                return Results.BadRequest(badRequest);
            }

            var coupons = await _db.Coupons
                .Where(c => c.Name.Contains(search.CouponName) && c.DeleteId == null)
                .Skip((search.PageNumber - 1) * search.PageSize)
                .Take(search.PageSize)
                .ToListAsync();

            var response = ApiResponse<IEnumerable<CouponDTO>>.Ok(data: mapper.Map<IEnumerable<CouponDTO>>(coupons));

            return Results.Ok(response);
        }
    }
}
