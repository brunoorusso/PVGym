using Microsoft.EntityFrameworkCore;
using PVGym.Data;
using PVGym.Models;
namespace PVGym.Controllers;

public static class WorkoutEndpoints
{
    public static void MapWorkoutEndpoints (this IEndpointRouteBuilder routes)
    {
        routes.MapGet("/api/Workouts/search", async (String searchTerm, PVGymContext db) =>
        {
            return await db.Workout.Where(e => e.Name.Contains(searchTerm)).Take(10).Select(e => e).ToListAsync();
        })
        .WithName("SearchWorkouts")
        .Produces<List<Workout>>(StatusCodes.Status200OK);

        routes.MapGet("/api/Workout", async (PVGymContext db) =>
        {
            return await db.Workout.ToListAsync();
        })
        .WithName("GetAllWorkouts")
        .Produces<List<Workout>>(StatusCodes.Status200OK);

        routes.MapGet("/api/Workout/{id}", async (Guid WorkoutId, PVGymContext db) =>
        {
            return await db.Workout.FindAsync(WorkoutId)
                is Workout model
                    ? Results.Ok(model)
                    : Results.NotFound();
        })
        .WithName("GetWorkoutById")
        .Produces<Workout>(StatusCodes.Status200OK)
        .Produces(StatusCodes.Status404NotFound);

        routes.MapPut("/api/Workout/{id}", async (Guid WorkoutId, Workout workout, PVGymContext db) =>
        {
            var foundModel = await db.Workout.FindAsync(WorkoutId);

            if (foundModel is null)
            {
                return Results.NotFound();
            }

            db.Update(workout);

            await db.SaveChangesAsync();

            return Results.NoContent();
        })
        .WithName("UpdateWorkout")
        .Produces(StatusCodes.Status404NotFound)
        .Produces(StatusCodes.Status204NoContent);

        routes.MapPost("/api/Workout/", async (Workout workout, PVGymContext db) =>
        {
            db.Workout.Add(workout);
            await db.SaveChangesAsync();
            return Results.Created($"/Workouts/{workout.WorkoutId}", workout);
        })
        .WithName("CreateWorkout")
        .Produces<Workout>(StatusCodes.Status201Created);

        routes.MapPost("/api/WorkoutPlan/", async (WorkoutPlanRequest workoutRequest, string id, PVGymContext db) =>
        {
            workoutRequest.Workout.WorkoutId = Guid.NewGuid();
            db.Workout.Add(workoutRequest.Workout);
            db.Plan.Where(p => p.PlanId == Guid.Parse(workoutRequest.Id)).FirstOrDefault().Workouts.Add(workoutRequest.Workout);

            await db.SaveChangesAsync();
            return Results.Created($"/Workouts/{workoutRequest.Workout.WorkoutId}", workoutRequest.Workout);
        })
        .WithName("CreateWorkoutWithPlanId")
        .Produces<Workout>(StatusCodes.Status201Created);

        routes.MapDelete("/api/Workout/{id}", async (Guid WorkoutId, PVGymContext db) =>
        {
            if (await db.Workout.FindAsync(WorkoutId) is Workout workout)
            {
                db.Workout.Remove(workout);
                await db.SaveChangesAsync();
                return Results.Ok(workout);
            }

            return Results.NotFound();
        })
        .WithName("DeleteWorkout")
        .Produces<Workout>(StatusCodes.Status200OK)
        .Produces(StatusCodes.Status404NotFound);
    }
}

public class WorkoutPlanRequest
{
    public Workout Workout { get; set; }
    public string Id { get; set; }
}
