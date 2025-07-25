using Coupon_API.Data;
using Coupon_API.Models;
using Coupon_API.Models.DTO;
using Microsoft.AspNetCore.Mvc;
using Swashbuckle.AspNetCore.Annotations;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();



app.MapGet("/api/coupon", (ILogger<Program> _logger) =>
{
    _logger.LogInformation("Getting Coupons");
    return Results.Ok(CouponStore.couponList);
}).WithName("GetCoupons").Produces<IEnumerable<Coupon>>(200);


app.MapGet("/api/coupon/{id:int}", (ILogger<Program> _logger, int id) =>
{
    _logger.Log(LogLevel.Warning, "Just for Fun");
    return Results.Ok(CouponStore.couponList.FirstOrDefault(coupon => coupon.Id == id));
}).WithName("GetCoupon").Produces<Coupon>(200);


app.MapPost("/api/coupon", ([FromBody] CouponCreateDTO _CouponCreateDTO) =>
{
    if (string.IsNullOrEmpty(_CouponCreateDTO.Name))
    {
        return Results.BadRequest("Invalid Coupon Id or Name");
    }

    if (CouponStore.couponList.Exists(c => c.Name == _CouponCreateDTO.Name))
    {
        return Results.BadRequest("Coupon Name already Exists");
    }


    Coupon coupon = new()
    {
        CouponCode = _CouponCreateDTO.CouponCode,
        Id = CouponStore.couponList.OrderByDescending(c => c.Id).FirstOrDefault().Id + 1,
        Name = _CouponCreateDTO.Name,
        Percentage = _CouponCreateDTO.Percentage,
        ExpireDate = _CouponCreateDTO.ExpireDate,
    };

    CouponStore.couponList.Add(coupon);

    CouponDTO couponDTO = new()
    {
        Id = coupon.Id,
        Name = coupon.Name,
        CouponCode = coupon.CouponCode,
        Percentage = coupon.Percentage,
        ExpireDate = coupon.ExpireDate,
        CreateDate = coupon.CreateDate,
        IsActive = coupon.IsActive
    };



    return Results.CreatedAtRoute("GetCoupon", new { id = coupon.Id }, couponDTO);

}).WithName("CreateCoupons").Produces<CouponDTO>(201).Produces(400).Accepts<CouponCreateDTO>("application/json");


app.Run();
