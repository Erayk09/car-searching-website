using Microsoft.EntityFrameworkCore;
using CarListingAPI.Models;

namespace CarListingAPI.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
        {
        }

        public DbSet<User> Users { get; set; }
        public DbSet<CarListing> CarListings { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // User configurations
            modelBuilder.Entity<User>()
                .HasIndex(u => u.Email)
                .IsUnique();

            modelBuilder.Entity<User>()
                .HasIndex(u => u.Username)
                .IsUnique();

            // CarListing configurations
            modelBuilder.Entity<CarListing>()
                .HasOne(c => c.User)
                .WithMany(u => u.CarListings)
                .HasForeignKey(c => c.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<CarListing>()
                .Property(c => c.Price)
                .HasPrecision(18, 2);
        }
    }
}
