using System.ComponentModel.DataAnnotations;

namespace Coupon_API.Models
{
    public class Coupon
    {
        public int Id { get; set; }

        public string Name { get; set; }

        public string CouponCode => Name.ToUpper().Trim() + Percentage.ToString();

        public int Percentage { get; set; }

        public DateOnly ExpireDate { get; set; }

        public bool IsSpecial { get; set; } = false;

        public int ValidDays => ExpireDate.DayNumber - DateOnly.FromDateTime(CreateDate).DayNumber;

        public bool IsValid => ExpireDate > DateOnly.FromDateTime(DateTime.Now) && IsActive;

        public bool IsActive { get; set; }

        public int CreateId { get; set; }

        public DateTime CreateDate { get; set; } = DateTime.Now;

        public int? ModifyId { get; set; } = null;

        public DateTime? ModifyDate { get; set; } = null;

        public int? DeleteId { get; set; } = null;

        public DateTime? DeleteDate { get; set; } = null;
    }
}
