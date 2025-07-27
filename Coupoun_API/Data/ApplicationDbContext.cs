using Coupon_API.Models;
using Microsoft.EntityFrameworkCore;

namespace Coupon_API.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
        {
            
        }

        public DbSet<Coupon> Coupons { get; set; }

    }
}
