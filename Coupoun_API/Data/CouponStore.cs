using Coupon_API.Models;

namespace Coupon_API.Data
{
    public class CouponStore
    {
        public static List<Coupon> couponList = new List<Coupon>
        {
            new Coupon
            {
                Id = 1,
                Name = "10% Off",
                Percentage = 10,
                ExpireDate = DateTime.Now.AddDays(30),
                IsActive = true,
                CreateId = 1,
                CreateDate = DateTime.Now
            },
            new Coupon
            {
                Id = 2,
                Name = "20% Off",
                Percentage = 20,
                ExpireDate = DateTime.Now.AddDays(60),
                IsActive = true,
                CreateId = 1,
                CreateDate = DateTime.Now
            }
        };
    }
}
