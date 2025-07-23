using System.ComponentModel.DataAnnotations;

namespace Coupoun_API.Models
{
    public class Coupon
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public int Percentage { get; set; }
        public DateTime ExpireDate { get; set; }

        public int ValidDays
        {
            get
            {
                return (ExpireDate - CreateDate).Days;
            }
        }

        public bool IsActive { get; set; }
        public int CreateId { get; set; }
        public DateTime CreateDate { get; set; } = DateTime.Now;
        public int ModifyId { get; set; }
        public DateTime ModifyDate { get; set; }
        public int DeleteId { get; set; }
        public DateTime DeleteDate { get; set; }
    }
}
