namespace Coupon_API.Models.DTO
{
    public class CouponUpdateDTO
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public int Percentage { get; set; }
        public DateTime ExpireDate { get; set; }
        public bool IsActive { get; set; } = true;
    }
}
