using Coupon_API.Data;

namespace Coupon_API.Models.DTO
{
    public class CouponCreateDTO
    {
        public string Name { get; set; }
        public int Percentage { get; set; }

        public DateOnly ExpireDate { get; set; }

        public bool IsActive { get; set; } = true;
    }
}
