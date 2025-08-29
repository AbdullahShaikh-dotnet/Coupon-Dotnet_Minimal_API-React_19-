using Coupon_API;
using Coupon_API.Data;
using Coupon_API.EndPoints;
using Coupon_API.Models.DTO;
using Coupon_API.Repository;
using Coupon_API.Repository.IRepository;
using Coupon_API.Services;
using Coupon_API.Services.Interfaces;
using Coupon_API.Utilities;
using Coupon_API.Validation;
using FluentValidation;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.RateLimiting;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using System.Text;
using System.Threading.RateLimiting;

var builder = WebApplication.CreateBuilder(args);

///<summary>
/// Below chain builds config from multiple sources in this order:
/// appsettings.json, User Secrets, Env Variables
/// UserSecrets Path : C:\Users\[USerName]\AppData\Roaming\Microsoft\UserSecrets\51d0634e-c8b6-4026-94c1-5443f893aadd\Secret.json
/// This GUID(51d0634e-c8b6-4026-94c1-5443f893aadd) Added in .csproj file <UserSecretsId>51d0634e-c8b6-4026-94c1-5443f893aadd</UserSecretsId>
///</summary>
builder.Configuration
    .SetBasePath(Directory.GetCurrentDirectory())
    .AddJsonFile("appsettings.json", optional: false)
    .AddUserSecrets<Program>() // This line is critical
    .AddEnvironmentVariables();


builder.AddServiceDefaults();

// Add services to the container.
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();
builder.Services.AddEndpointsApiExplorer();


// Custom Rate Limiter Configuration
builder.Services.AddCustomRateLimiter();


builder.Services.AddSwaggerGen(option =>
{
    option.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Description = "JWT Authorization header using the Bearer schema. \r\n\r\n" +
        "Enter 'Bearer' [space] and then you Token in the text input below. \r\n\r\n" +
        "Example : \"Bearer sjbvfksbfbse.aelfbeuis.sfbhksejb\"",
        Name = "Authorization",
        In = ParameterLocation.Header,
        Type = SecuritySchemeType.ApiKey,
        Scheme = "Bearer",
        BearerFormat = "JWT"
    });
    option.AddSecurityRequirement(new OpenApiSecurityRequirement()
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id = "Bearer"
                },
                Scheme= "oauth2",
                Name = "Bearer",
                In = ParameterLocation.Header,
            },
            new List<string>()
        }
    });

    option.SwaggerDoc("v1", new OpenApiInfo
    {
        Title = "Coupon Management API",
        Version = "v1",
        Description = "A comprehensive REST API for managing discount coupons and promotions",
        Contact = new OpenApiContact
        {
            Name = "Abdullah Shaikh",
            Email = "shaikhabdullah299@gmail.com.com",
            Url = new Uri("https://github.com/AbdullahShaikh-dotnet")
        },
        License = new OpenApiLicense
        {
            Name = "MIT License",
            Url = new Uri("https://opensource.org/licenses/MIT")
        }
    });
});
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

builder.Services.AddAuthorization(option =>
    option.AddPolicy("adminOnly",
        policy => policy.RequireRole("admin")
    )
);


builder.Services.AddDbContext<ApplicationDbContext>(
    options => options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection"))
);

builder.Services.AddAutoMapper(cfg =>
{
    cfg.AddProfile<MappingConfig>();
    cfg.LicenseKey = builder.Configuration.GetValue<string>("AutoMapper:key");
}
);

builder.Services.AddValidatorsFromAssemblyContaining<Program>();
builder.Services.Configure<Microsoft.AspNetCore.Http.Json.JsonOptions>(options =>
    options.SerializerOptions.Converters.Add(new DateOnlyJsonConverter())
);

// To Use from React (CORS Configuration)
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowViteDev", policy =>
    {
        policy.WithOrigins("http://localhost:59436") // Vite dev server
              .AllowAnyMethod()
              .AllowAnyHeader();
    });
});


builder.Services.AddScoped<IJwtService, JwtService>();
builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<IValidator<RefreshTokenDto>, RefreshTokenDtoValidator>();



var app = builder.Build();

app.MapDefaultEndpoints();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
    app.UseSwagger();
    app.UseSwaggerUI(c =>
    {
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "Coupon Management API v1");
        c.RoutePrefix = "swagger";
        c.DocumentTitle = "Coupon Management API Documentation";
        c.DefaultModelsExpandDepth(-1);
    });
}

// To Use from React (CORS Setup)
app.UseCors("AllowViteDev");


app.UseHttpsRedirection();


app.UseRateLimiter();

app.UseAuthentication();
app.UseAuthorization();


// ENDPOINTS
app.MapCouponsCRUDEndpoints();
app.MapAuthEndpoints();


app.Run();
