using AutoMapper;
using Coupon_API;
using Coupon_API.Data;
using Coupon_API.Models;
using Coupon_API.Models.DTO;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.DependencyInjection;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Register the in-memory data store
builder.Services.AddAutoMapper(cfg =>
{
    cfg.AddProfile<MappingConfig>();
});


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


app.MapPost("/api/coupon", (IMapper _mapper, [FromBody] CouponCreateDTO _CouponCreateDTO) =>
{
    if (string.IsNullOrEmpty(_CouponCreateDTO.Name))
    {
        return Results.BadRequest("Invalid Coupon Id or Name");
    }

    if (CouponStore.couponList.Exists(c => c.Name == _CouponCreateDTO.Name))
    {
        return Results.BadRequest("Coupon Name already Exists");
    }

    Coupon coupon = _mapper.Map<Coupon>(_CouponCreateDTO);

    CouponStore.couponList.Add(coupon);

    CouponDTO couponDTO = _mapper.Map<CouponDTO>(coupon);

    return Results.CreatedAtRoute("GetCoupon", new { id = coupon.Id }, couponDTO);

}).WithName("CreateCoupons")
.Produces<CouponDTO>(201)
.Produces(400)
.Accepts<CouponCreateDTO>("application/json");


app.Run();
