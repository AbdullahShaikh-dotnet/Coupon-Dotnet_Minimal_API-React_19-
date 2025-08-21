var builder = DistributedApplication.CreateBuilder(args);

builder.AddProject<Projects.Coupon_API>("coupon-api");

builder.Build().Run();
