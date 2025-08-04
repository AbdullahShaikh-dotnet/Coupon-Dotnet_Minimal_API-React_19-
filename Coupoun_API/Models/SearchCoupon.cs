using System.ComponentModel.DataAnnotations;

namespace Coupon_API.Models
{
    public class SearchCoupon
    {
        public string CouponName { get; set; }

        public int PageSize { get; set; } = 10;

        public int PageNumber { get; set; } = 1;
    }
}
