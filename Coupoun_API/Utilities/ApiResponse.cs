namespace Coupon_API.Utilities
{
    public class ApiResponse<T>
    {
        public bool Success { get; set; }
        public string Message { get; set; }
        public T Data { get; set; }
        public List<string> Errors { get; set; }
        public int StatusCode { get; set; }

        public ApiResponse(bool success, string message, T data, int statusCode, List<string> errors = null)
        {
            Success = success;
            Message = message;
            Data = data;
            StatusCode = statusCode;
            Errors = errors ?? new List<string>();
        }

        // Success response
        public static ApiResponse<T> Ok(T data, string message = "Request successful", int statusCode = 200)
        {
            return new ApiResponse<T>(true, message, data, statusCode);
        }

        // Failure response
        public static ApiResponse<T> Fail(string message, int statusCode = 400, List<string> errors = null)
        {
            return new ApiResponse<T>(false, message, default, statusCode, errors);
        }

        // Exception response
        public static ApiResponse<T> Error(string message = "An error occurred", int statusCode = 500, Exception ex = null)
        {
            var errors = ex != null ? new List<string> { ex.Message } : null;
            return new ApiResponse<T>(false, message, default, statusCode, errors);
        }

        // Not Found response
        public static ApiResponse<T> NotFound(string message = "Resource not found")
        {
            return new ApiResponse<T>(false, message, default, 404);
        }

        // Unauthorized response
        public static ApiResponse<T> Unauthorized(string message = "Unauthorized")
        {
            return new ApiResponse<T>(false, message, default, 401);
        }
    }
}


