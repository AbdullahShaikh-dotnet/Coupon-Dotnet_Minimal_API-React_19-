namespace Coupon_API.Models.DTO
{
    public class CouponDTO
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string CouponCode { get; set; }
        public int Percentage { get; set; }
        public DateOnly ExpireDate { get; set; }
        public DateTime CreateDate { get; set; }
        public bool IsActive { get; set; } = true;
    }
}
