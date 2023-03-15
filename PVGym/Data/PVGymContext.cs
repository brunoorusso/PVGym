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

        public DbSet<Member> Member { get; set; } = default!;
    }
}
