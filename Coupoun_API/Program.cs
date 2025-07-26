using AutoMapper;
using Coupon_API;
using Coupon_API.Data;
using Coupon_API.Models;
using Coupon_API.Models.DTO;
using FluentValidation;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.DependencyInjection;
using System.ComponentModel.DataAnnotations;
using System.Net;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();


builder.Services.AddAutoMapper(cfg =>
{
    cfg.AddProfile<MappingConfig>();
});


builder.Services.AddValidatorsFromAssemblyContaining<Program>();



var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();





// Get All Coupon
app.MapGet("/api/coupon", (IMapper mapper, ILogger<Program> _logger) =>
{
    var coupons = mapper.Map<IEnumerable<CouponDTO>>(
        CouponStore.couponList
        .Where(coupon => coupon.DeleteId == 0)
        );

    APIResponse response = new APIResponse
    {
        Result = coupons,
        IsSuccess = true,
        StatusCode = HttpStatusCode.OK
    };

    _logger.LogInformation("Getting Coupons");
    return Results.Ok(response);
}).WithName("GetCoupons").Produces<APIResponse>(200);





// Get Coupon By ID
app.MapGet("/api/coupon/{id:int}", async (IValidator<int> validator, IMapper mapper, ILogger<Program> _logger, int id) =>
{
    APIResponse response = new APIResponse();
    var validationResult = await validator.ValidateAsync(id);

    if (!validationResult.IsValid)
    {
        response.ErrorMessages = validationResult.Errors.Select(error => error.ErrorMessage).ToList();
        return Results.BadRequest(response);
    }

    var coupon = mapper.Map<IEnumerable<CouponDTO>>(
        CouponStore.couponList
        .FirstOrDefault(coupon => coupon.Id == id && coupon.DeleteId == 0)
    );

    response.Result = coupon;
    response.IsSuccess = true;
    response.StatusCode = HttpStatusCode.OK;

    _logger.Log(LogLevel.Warning, "Just for Fun");
    return Results.Ok(response);
}).WithName("GetCoupon").Produces<APIResponse>(200);






// Add Coupon
app.MapPost("/api/coupon", async (IMapper _mapper, IValidator<CouponCreateDTO> _validator, [FromBody] CouponCreateDTO _CouponCreateDTO) =>
{
    var validationResult = await _validator.ValidateAsync(_CouponCreateDTO);

    APIResponse response = new APIResponse();

    if (!validationResult.IsValid)
    {
        response.ErrorMessages = validationResult.Errors.Select(error => error.ErrorMessage).ToList();
        return Results.BadRequest(response);
    }

    if (CouponStore.couponList.Exists(c => c.Name == _CouponCreateDTO.Name))
    {
        response.ErrorMessages = new List<string>
        {
            "Coupon Name already Exists"
        };
        response.StatusCode = HttpStatusCode.Conflict;
        return Results.BadRequest(response);
    }

    Coupon coupon = _mapper.Map<Coupon>(_CouponCreateDTO);
    coupon.Id = CouponStore.couponList.OrderByDescending(prop => prop.Id).FirstOrDefault().Id + 1;

    CouponStore.couponList.Add(coupon);

    response.Result = _mapper.Map<CouponDTO>(coupon);

    return Results.CreatedAtRoute("GetCoupon", new { id = coupon.Id }, response);

}).WithName("CreateCoupons")
.Produces<APIResponse>(201)
.Produces(400)
.Accepts<CouponCreateDTO>(contentType: "application/json");





// Update Coupon
app.MapPut("/api/coupon", async (IMapper mapper, IValidator<CouponUpdateDTO> _validator, [FromBody] CouponUpdateDTO couponUpdate) =>
{
    var validationResult = await _validator.ValidateAsync(couponUpdate);

    APIResponse response = new APIResponse();

    if (!validationResult.IsValid)
    {
        response.ErrorMessages = validationResult.Errors.Select(error => error.ErrorMessage).ToList();
        return Results.BadRequest(response);
    }


    if (CouponStore.couponList.Exists(c => c.Name == couponUpdate.Name && c.Id != couponUpdate.Id))
    {
        response.ErrorMessages = new List<string>
        {
            "Coupon Name already Exists"
        };
        response.StatusCode = HttpStatusCode.Conflict;
        return Results.BadRequest(response);
    }

    var coupon = CouponStore.couponList.FirstOrDefault(prop => prop.Id == couponUpdate.Id);
    coupon.Name = couponUpdate.Name;
    coupon.ExpireDate = couponUpdate.ExpireDate;
    coupon.Percentage = couponUpdate.Percentage;
    coupon.IsActive = couponUpdate.IsActive;
    coupon.ModifyId = 1;
    coupon.ModifyDate = DateTime.Now;

    var resultCoupon = mapper.Map<CouponDTO>(coupon);

    response.Result = resultCoupon;

    return Results.CreatedAtRoute("GetCoupon", new { id = coupon.Id }, response);
}).Produces<APIResponse>(200)
.Produces(400)
.Accepts<CouponUpdateDTO>(contentType: "application/json")
.WithName("UpdateCoupons");



// Delete Coupon
app.MapDelete("/api/coupon{id:int}", async (IMapper mapper, IValidator<int> validator, int id) =>
{
    APIResponse response = new APIResponse();

    var validationResult = await validator.ValidateAsync(id);

    if (!validationResult.IsValid)
    {
        response.ErrorMessages = validationResult.Errors.Select(error => error.ErrorMessage).ToList();
        return Results.BadRequest(response);
    }


    var coupon = CouponStore.couponList.FirstOrDefault(prop => prop.Id == id);
    coupon.DeleteId = 1;
    coupon.DeleteDate = DateTime.Now;

    var coupons = CouponStore.couponList.Where(prop => prop.DeleteId == 0);

    response.Result = mapper.Map<IEnumerable<CouponDTO>>(coupons);
    response.IsSuccess = true;
    response.StatusCode = HttpStatusCode.OK;

    return Results.CreatedAtRoute("GetCoupon", new { id }, response);

}).WithName("DeleteCoupon")
.Produces<APIResponse>(200)
.Produces(400);


app.Run();
