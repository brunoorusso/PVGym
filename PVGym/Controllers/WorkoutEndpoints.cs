using Microsoft.EntityFrameworkCore;
using PVGym.Data;
using PVGym.Models;
namespace PVGym.Controllers;

public static class WorkoutEndpoints
{
    public static void MapWorkoutEndpoints (this IEndpointRouteBuilder routes)
    {
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
