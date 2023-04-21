using System.Linq;
using System.Numerics;
using Microsoft.EntityFrameworkCore;
using PVGym.Data;
using PVGym.Models;
namespace PVGym.Controllers;

public static class PlanEndpoints
{
    public static void MapPlanEndpoints (this IEndpointRouteBuilder routes)
    {
        routes.MapGet("/api/Plan", async (PVGymContext db) =>
        {
            return await db.Plan.Include(p => p.Workouts).ThenInclude(w => w.Exercises).ToListAsync();
        })
        .WithName("GetAllPlans")
        .Produces<List<Plan>>(StatusCodes.Status200OK);

        routes.MapGet("/api/PlanByMemberId/{UserId}", async (string UserId, PVGymContext db) =>
        { 
        
            var foundModel = await db.Member
            .Where(m => m.UserId == UserId)
            .Include(m => m.Plan)
            .ThenInclude(p => p.Workouts)
            .ThenInclude(w => w.Exercises)
            .ToListAsync();

            var member = foundModel.FirstOrDefault();
            if (member is null)
            {
                return Results.NotFound();
            }

            return Results.Ok(member.Plan);
            
        })
        .WithName("GetPlanByMemberId")
        .Produces<Plan>(StatusCodes.Status200OK)
        .Produces(StatusCodes.Status404NotFound);

        routes.MapPut("/api/Plan/{id}", async (Guid PlanId, Plan plan, PVGymContext db) =>
        {
            var foundModel = await db.Plan.FindAsync(PlanId);

            if (foundModel is null)
            {
                return Results.NotFound();
            }

            db.Update(plan);

            await db.SaveChangesAsync();

            return Results.NoContent();
        })
        .WithName("UpdatePlan")
        .Produces(StatusCodes.Status404NotFound)
        .Produces(StatusCodes.Status204NoContent);

        routes.MapPost("/api/Plan/", async (Plan plan, PVGymContext db) =>
        {
            db.Plan.Add(plan);
            await db.SaveChangesAsync();
            return Results.Created($"/Plans/{plan.PlanId}", plan);
        })
        .WithName("CreatePlan")
        .Produces<Plan>(StatusCodes.Status201Created);

        routes.MapDelete("/api/Plan/{id}", async (Guid PlanId, PVGymContext db) =>
        {
            if (await db.Plan.FindAsync(PlanId) is Plan plan)
            {
                db.Plan.Remove(plan);
                await db.SaveChangesAsync();
                return Results.Ok(plan);
            }

            return Results.NotFound();
        })
        .WithName("DeletePlan")
        .Produces<Plan>(StatusCodes.Status200OK)
        .Produces(StatusCodes.Status404NotFound);
    }
}
