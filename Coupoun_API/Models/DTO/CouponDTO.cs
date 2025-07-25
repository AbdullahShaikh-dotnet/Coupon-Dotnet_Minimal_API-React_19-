namespace Coupon_API.Models.DTO
{
    public class CouponDTO
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string CouponCode { get; set; }
        public int Percentage { get; set; }
        public DateTime ExpireDate { get; set; }

        public int ValidDays
        {
            get
            {
                return (ExpireDate - CreateDate).Days;
            }
        }

        public bool IsActive { get; set; } = true;

        public DateTime CreateDate { get; set; }

        public bool isValid
        {
            get
            {
                return ExpireDate > DateTime.Now && IsActive;
            }
        }
    }
}
