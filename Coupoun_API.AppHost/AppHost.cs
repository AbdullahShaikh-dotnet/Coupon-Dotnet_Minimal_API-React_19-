var builder = DistributedApplication.CreateBuilder(args);

builder.AddProject<Projects.Coupon_API>("Coupon-API");

builder.Build().Run();
