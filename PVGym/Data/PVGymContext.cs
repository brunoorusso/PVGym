using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using PVGym.Areas.Identity.Data;
using PVGym.Models;

namespace PVGym.Data
{
    public class PVGymContext : IdentityDbContext<ApplicationUser>
    {
        public PVGymContext (DbContextOptions<PVGymContext> options)
            : base(options)
        {
        }

        public DbSet<Member>? Member { get; set; }
        public DbSet<Exercise>? Exercise { get; set; }

        public DbSet<Workout>? Workout { get; set; }

        public DbSet<Plan>? Plan { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<Member>()
            .HasMany(p => p.Plans)
            .WithMany(w => w.Member)
            .UsingEntity(j => j.ToTable("MemberPlan"));

            modelBuilder.Entity<Plan>()
            .HasMany(p => p.Workouts)
            .WithMany(w => w.Plans)
            .UsingEntity(j => j.ToTable("PlanWorkout"));

            modelBuilder.Entity<Workout>()
            .HasMany(p => p.Exercises)
            .WithMany(w => w.Workouts)
            .UsingEntity(j => j.ToTable("ExerciseWorkout"));
        }
    }
}
