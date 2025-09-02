using System.Runtime.CompilerServices;
using System.Threading.RateLimiting;

namespace Coupon_API.Utilities
{
    public static class RateLimiterConfig
    {
        // Partition by client key (e.g., IP address) (Each user have their own limit)
        public static IServiceCollection AddCustomRateLimiter(this IServiceCollection Services)
        {
            Services.AddRateLimiter(options =>
            {
                options.RejectionStatusCode = StatusCodes.Status429TooManyRequests;

                // Sliding Window Limiter for rate limiting based on client IP address (API's)
                var slidingWindowLimiter = PartitionedRateLimiter.Create<HttpContext, string>(httpContext =>
                {
                    var clientKey = httpContext.Connection.RemoteIpAddress?.ToString() ?? "unknown";

                    return RateLimitPartition.GetSlidingWindowLimiter(
                        partitionKey: clientKey,
                        factory: _ => new SlidingWindowRateLimiterOptions
                        {
                            PermitLimit = 60,
                            Window = TimeSpan.FromSeconds(60),
                            SegmentsPerWindow = 6,
                            QueueProcessingOrder = QueueProcessingOrder.OldestFirst,
                            QueueLimit = 0
                        });
                });

                // Concurrency Limiter for limiting concurrent requests from the same client (Server Resources)
                var concurrencyLimiter = PartitionedRateLimiter.Create<HttpContext, string>(httpContext =>
                {
                    var clientKey = httpContext.Connection.RemoteIpAddress?.ToString() ?? "unknown";

                    return RateLimitPartition.GetConcurrencyLimiter(
                        partitionKey: clientKey,
                        factory: _ => new ConcurrencyLimiterOptions
                        {
                            PermitLimit = 30,
                            QueueProcessingOrder = QueueProcessingOrder.OldestFirst,
                            QueueLimit = 0
                        });
                });

                // Chain both limiters
                options.GlobalLimiter = PartitionedRateLimiter.CreateChained(slidingWindowLimiter, concurrencyLimiter);

                options.OnRejected = async (context, token) =>
                {
                    context.HttpContext.Response.StatusCode = StatusCodes.Status429TooManyRequests;
                    await context.HttpContext.Response.WriteAsync("Too many requests. Try again later.", token);
                };
            });

            return Services;
        }

    }
}
