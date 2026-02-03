using Microsoft.EntityFrameworkCore;
using PlanCrick.Backend.Models;

namespace PlanCrick.Backend.Data;

public class CricketContext : DbContext
{
    public CricketContext(DbContextOptions<CricketContext> options) : base(options) { }

    public DbSet<Player> Players { get; set; }
    public DbSet<FieldingPlan> FieldingPlans { get; set; }
    public DbSet<PlayerPosition> PlayerPositions { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);
        
        // Ensure relationships are clean
        modelBuilder.Entity<FieldingPlan>()
            .HasMany(fp => fp.Positions)
            .WithOne()
            .HasForeignKey(pp => pp.FieldingPlanId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
