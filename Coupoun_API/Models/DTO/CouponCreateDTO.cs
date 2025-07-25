namespace Coupon_API.Models.DTO
{
    public class CouponCreateDTO
    {
        public string Name { get; set; }
        public string CouponCode { get; set; }
        public int Percentage { get; set; }
        public DateTime ExpireDate { get; set; }
    }
}
