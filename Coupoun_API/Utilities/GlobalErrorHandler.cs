using Microsoft.AspNetCore.Diagnostics;

namespace Coupon_API.Utilities
{
    public static class GlobalErrorHandler
    {
        public static void AddGlobalErrorHandler(this IApplicationBuilder app)
        {
            // Global Exception Handler Middleware
            app.UseExceptionHandler(errorApp =>
            {
                errorApp.Run(async context =>
                {
                    context.Response.StatusCode = 500;
                    context.Response.ContentType = "application/json";

                    var exceptionHandler = context.Features.Get<IExceptionHandlerFeature>();

                    if (exceptionHandler != null)
                    {
                        var ex = exceptionHandler.Error;

                        // Log the error
                        Serilog.Log.Error(ex, "Unhandled exception occurred");

                        // Hide technical details from client (professional API practice)
                        var clientError = new List<string>()
                        {
                            "An unexpected error occurred. Please contact support."
                        };

                        var errorResponse = ApiResponse<List<string>>.Fail(errors: clientError, message: "Internal Server Error", statusCode: 500);
                        await context.Response.WriteAsJsonAsync(errorResponse);
                    }
                });
            });
        }

    }
}
