using System;
using System.Collections.Generic;
using System.Drawing.Text;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using PVGym.Areas.Identity.Data;
using PVGym.Models;
using Microsoft.AspNetCore.Identity;

namespace PVGym.Data
{
    public class PVGymContext : IdentityDbContext<ApplicationUser>
    {
        public PVGymContext (DbContextOptions<PVGymContext> options)
            : base(options)
        {
          
        }

        public DbSet<ApplicationUser> ApplicationUsers { get; set; }
        public DbSet<Member>? Member { get; set; }
        public DbSet<Exercise>? Exercise { get; set; }

        public DbSet<Workout>? Workout { get; set; }

        public DbSet<Plan>? Plan { get; set; }

        protected override async void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
            // add your own configuration here

            List<Plan> plans = new();

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

        public DbSet<PVGym.Models.Evaluation>? Evaluation { get; set; }

        public DbSet<PVGym.Models.Notification>? Notification { get; set; }

        public DbSet<RoleModel>? RoleModel { get; set; }

        public DbSet<Staff>? Staff { get; set; }
    }
}
