using Microsoft.EntityFrameworkCore;
using PVGym.Data;
using PVGym.Models;
namespace PVGym.Controllers;

public static class ExerciseEndpoints
{
    public static void MapExerciseEndpoints (this IEndpointRouteBuilder routes)
    {
        routes.MapGet("/api/Exercise", async (PVGymContext db) =>
        {
            return await db.Exercise.ToListAsync();
        })
        .WithName("GetAllExercises")
        .Produces<List<Exercise>>(StatusCodes.Status200OK);

        routes.MapGet("/api/Exercise/{id}", async (Guid ExerciseId, PVGymContext db) =>
        {
            return await db.Exercise.FindAsync(ExerciseId)
                is Exercise model
                    ? Results.Ok(model)
                    : Results.NotFound();
        })
        .WithName("GetExerciseById")
        .Produces<Exercise>(StatusCodes.Status200OK)
        .Produces(StatusCodes.Status404NotFound);

        routes.MapPut("/api/Exercise/{id}", async (Guid ExerciseId, Exercise exercise, PVGymContext db) =>
        {
            var foundModel = await db.Exercise.FindAsync(ExerciseId);

            if (foundModel is null)
            {
                return Results.NotFound();
            }

            db.Update(exercise);

            await db.SaveChangesAsync();

            return Results.NoContent();
        })
        .WithName("UpdateExercise")
        .Produces(StatusCodes.Status404NotFound)
        .Produces(StatusCodes.Status204NoContent);

        routes.MapPost("/api/Exercise/", async (Exercise exercise, PVGymContext db) =>
        {
            Console.WriteLine(exercise.Name);
            db.Exercise.Add(exercise);
            await db.SaveChangesAsync();
            return Results.Created($"/Exercises/{exercise.ExerciseId}", exercise);
        })
        .WithName("CreateExercise")
        .Produces<Exercise>(StatusCodes.Status201Created);

        routes.MapDelete("/api/Exercise/{id}", async (Guid ExerciseId, PVGymContext db) =>
        {
            if (await db.Exercise.FindAsync(ExerciseId) is Exercise exercise)
            {
                db.Exercise.Remove(exercise);
                await db.SaveChangesAsync();
                return Results.Ok(exercise);
            }

            return Results.NotFound();
        })
        .WithName("DeleteExercise")
        .Produces<Exercise>(StatusCodes.Status200OK)
        .Produces(StatusCodes.Status404NotFound);
    }
}
