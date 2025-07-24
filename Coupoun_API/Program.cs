using Coupon_API.Data;
using Coupon_API.Models;
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


app.MapPost("/api/coupon", ([FromBody] Coupon coupon) =>
{
    if (coupon.Id != 0 || string.IsNullOrEmpty(coupon.Name))
    {
        return Results.BadRequest("Invalid Coupon Id or Name");
    }

    if (CouponStore.couponList.Exists(c => c.Name == coupon.Name))
    {
        return Results.BadRequest("Coupon Name already Exists");
    }

    coupon.Id = CouponStore.couponList.OrderByDescending(c => c.Id).FirstOrDefault().Id + 1;

    CouponStore.couponList.Add(coupon);

    //return Results.Ok("Coupon Created Successfully");

    //return Results.Created($"api/coupon/{coupon.Id}", coupon);

    return Results.CreatedAtRoute("GetCoupon", new { id = coupon.Id }, coupon);

}).WithName("CreateCoupons").Produces<Coupon>(201).Produces(400).Accepts<Coupon>("application/json");


app.Run();
