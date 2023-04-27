/**
 * Author: Ismael Lourenço
 */
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

        //Gets plan by member id
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

        routes.MapPut("/api/Plan/{id}", async (Guid id, Plan plan, PVGymContext db) =>
        {
            var foundModel = await db.Plan.FindAsync(id);

            if (foundModel is null)
            {
                return Results.NotFound();
            }

            db.Entry(foundModel).State = EntityState.Detached;

            foundModel.Name = plan.Name;

            db.Plan.Update(foundModel);

            await db.SaveChangesAsync();

            return Results.Created($"/Workouts/{plan.PlanId}", plan);
        })
        .WithName("UpdatePlan")
        .Produces(StatusCodes.Status404NotFound)
        .Produces<Plan>(StatusCodes.Status200OK);

        routes.MapPost("/api/Plan/", async (Plan plan, PVGymContext db) =>
        {
            db.Plan?.Add(plan);
            await db.SaveChangesAsync();
            return Results.Created($"/Plans/{plan.PlanId}", plan);
        })
        .WithName("CreatePlan")
        .Produces<Plan>(StatusCodes.Status201Created);

        routes.MapDelete("/api/Plan/{id}", async (Guid id, PVGymContext db) =>
        {
            var foundModel = db.Plan?
            .Where(p => p.PlanId == id)
            .Include(m => m.Member)
            .FirstOrDefault();

            if (foundModel != null)
            {
                foundModel.Member?.ForEach(async m =>
                {
                    m.Plan = null;
                });
                db.Plan.Remove(foundModel);
                await db.SaveChangesAsync();
                return Results.Ok(foundModel);
            }

            return Results.NotFound();
        })
        .WithName("DeletePlan")
        .Produces<Plan>(StatusCodes.Status200OK)
        .Produces(StatusCodes.Status404NotFound);
    }
}
