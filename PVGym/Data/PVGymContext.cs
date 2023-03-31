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
            // add your own configuration here
            List<Plan> plans = new();

            plans.Add(new Plan
            {
                PlanId = Guid.NewGuid(),
                Name = "Push Pull Legs",
            });

            //modelBuilder.Entity<Plan>().HasData(plans);

            modelBuilder.Entity<Member>().HasData(
                    new Member
                    {
                        MemberId = Guid.NewGuid(),
                        VAT = 222222213,
                        PlanType = Plantype.Normal,
                        //Plans = plans
                    },
                    new Member
                    {
                        MemberId = Guid.NewGuid(),
                        VAT = 234234586,
                        PlanType = Plantype.Premium
                    }
                );
        }

        public DbSet<PVGym.Models.Evaluation>? Evaluation { get; set; }
    }
}
