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

            modelBuilder.Entity<AvailableClass>().HasData(
                    new AvailableClass
                    {
                        Id = Guid.NewGuid(),
                        Name = "Zumba",
                        Description = "The class is designed to provide a full-body workout while also keeping participants engaged and motivated. Zumba is suitable for people of all fitness levels, as the routines can be modified to suit individual needs.",
                        Limit = 30,
                        Duration = 60,
                        Image = "https://imgmedia.lbb.in/media/2021/01/5ffc657c8cb26612da74e667_1610376572334.jpg"
                    },
                    new AvailableClass
                    {
                        Id = Guid.NewGuid(),
                        Name = "Body Combat",
                        Description = "Body Combat is a high-intensity, cardio-based fitness class that combines various martial arts techniques such as karate, boxing, and kickboxing.",
                        Limit = 20,
                        Duration = 30,
                        Image = "https://www.fitnessfirst.co.uk/media/l2yngpvt/web-version-bodycombat-launch-kit-image-2.jpg?width=1200&height=1200&rnd=132955692406170000"
                    },
                    new AvailableClass
                    {
                        Id = Guid.NewGuid(),
                        Name = "Yoga",
                        Description = "The class is designed to increase flexibility, strength, and balance while also reducing stress and improving mental clarity.",
                        Limit = 30,
                        Duration = 60,
                        Image = "https://i2-prod.nottinghampost.com/whats-on/whats-on-news/article1239433.ece/ALTERNATES/s1200c/yoga-GettyImages-846236570.jpg"
                    },
                    new AvailableClass
                    {
                        Id = Guid.NewGuid(),
                        Name = "Pilates",
                        Description = "Pilates is a low-impact fitness class that focuses on developing core strength, flexibility, and balance.",
                        Limit = 40,
                        Duration = 60,
                        Image = "https://www.clubpilates.com/hubfs/11_studio_reformer-1.jpg"
                    }
                );
        }

        public DbSet<PVGym.Models.Class>? Class { get; set; }

        public DbSet<PVGym.Models.AvailableClass>? AvailableClass { get; set; }
    }
}
