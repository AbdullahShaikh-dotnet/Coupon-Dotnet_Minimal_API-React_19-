using AutoMapper;
using Coupon_API;
using Coupon_API.Data;
using Coupon_API.EndPoints;
using Coupon_API.Models;
using Coupon_API.Models.DTO;
using Coupon_API.Repository;
using Coupon_API.Repository.IRepository;
using FluentValidation;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.IdentityModel.Tokens;
using System.Collections;
using System.ComponentModel.DataAnnotations;
using System.Net;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddScoped<IAuthRepository, AuthRepository>();
builder.Services.AddAuthentication(option =>
{
    option.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    option.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
}).AddJwtBearer(option =>
{
    option.RequireHttpsMetadata = false;
    option.SaveToken = true;
    option.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuerSigningKey = true,
        IssuerSigningKey = new SymmetricSecurityKey(
            Encoding.ASCII.GetBytes(
                builder.Configuration.GetValue<string>("Auth:secret")
                )
            ),
        ValidateIssuer = false,
        ValidateAudience = false,
    };
});
builder.Services.AddAuthorization();
builder.Services.AddDbContext<ApplicationDbContext>(
    options => options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection"))
    );

builder.Services.AddAutoMapper(cfg =>
{
    cfg.AddProfile<MappingConfig>();
});

builder.Services.AddValidatorsFromAssemblyContaining<Program>();
builder.Services.Configure<Microsoft.AspNetCore.Http.Json.JsonOptions>(options =>
   {
       options.SerializerOptions.Converters.Add(new DateOnlyJsonConverter());
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


app.UseAuthentication();
app.UseAuthorization();



// ENDPOINTS
app.MapCouponsCRUDEndpoints();
app.MapAuthEndpoints();


app.Run();
