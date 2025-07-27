using System.ComponentModel.DataAnnotations;

namespace Coupon_API.Models
{
    public class Coupon
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string CouponCode => Name.ToUpper().Trim() + Percentage.ToString();

        public int Percentage { get; set; }
        public DateTime ExpireDate { get; set; }

        public int ValidDays
        {
            get
            {
                return (ExpireDate - CreateDate).Days;
            }
        }

        public bool IsSpecial { get; set; } = false;

        public bool isValid
        {
            get
            {
                return ExpireDate > DateTime.Now && IsActive;
            }
        }

        public bool IsActive { get; set; }

        public int CreateId { get; set; }

        public DateTime CreateDate { get; set; } = DateTime.Now;

        public int? ModifyId { get; set; } = null;

        public DateTime? ModifyDate { get; set; } = null;

        public int? DeleteId { get; set; } = null;

        public DateTime? DeleteDate { get; set; } = null;
    }
}
