using System.Net;

namespace Coupon_API.Models
{
    public class APIResponse
    {
        public APIResponse()
        {
            ErrorMessages = new List<string>();
        }

        public bool IsSuccess { get; set; } = false;
        public object Result { get; set; } = null;
        public HttpStatusCode StatusCode { get; set; } = HttpStatusCode.BadRequest;
        public List<string> ErrorMessages { get; set; } = null;
    }
}
