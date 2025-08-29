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
        public DbSet<User> Users { get; set; }

        public DbSet<RefreshToken> RefreshTokens { get; set; } // Add this

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<RefreshToken>(entity =>
            {
                entity.HasKey(rt => rt.Id);
                entity.Property(rt => rt.Token).IsRequired().HasMaxLength(500);
                entity.HasIndex(rt => rt.Token).IsUnique();
                entity.HasOne(rt => rt.User)
                      .WithMany()
                      .HasForeignKey(rt => rt.UserId)
                      .OnDelete(DeleteBehavior.Cascade);
            });
        }

    }
}
