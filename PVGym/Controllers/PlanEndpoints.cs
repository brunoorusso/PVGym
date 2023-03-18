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
            return await db.Plan.ToListAsync();
        })
        .WithName("GetAllPlans")
        .Produces<List<Plan>>(StatusCodes.Status200OK);

        routes.MapGet("/api/Plan/{id}", async (Guid PlanId, PVGymContext db) =>
        {
            return await db.Plan.FindAsync(PlanId)
                is Plan model
                    ? Results.Ok(model)
                    : Results.NotFound();
        })
        .WithName("GetPlanById")
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
