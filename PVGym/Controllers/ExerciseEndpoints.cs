/**
 * Author: Ismael Lourenço
 */
using System.Numerics;
using Microsoft.EntityFrameworkCore;
using PVGym.Data;
using PVGym.Models;
namespace PVGym.Controllers;

public static class ExerciseEndpoints
{
    public static void MapExerciseEndpoints (this IEndpointRouteBuilder routes)
    {
        //Search for exercises by name
        routes.MapGet("/api/Exercise/search", async (String searchTerm, PVGymContext db) =>
        {
            return await db.Exercise.Where(e => e.Name.Contains(searchTerm)).Take(10).Select(e => e).ToListAsync() ;
        })
        .WithName("SearchExercices")
        .Produces<List<Exercise>>(StatusCodes.Status200OK);

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

        //Creates a new exercise and adds it to a workout
        routes.MapPost("/api/ExerciseWorkout/", async (ExerciseWorkoutRequest resquest, PVGymContext db) =>
        {
            resquest.Exercise.ExerciseId = Guid.NewGuid();

            var workout = db.Workout.Where(w => w.WorkoutId == Guid.Parse(resquest.Id)).Include(p => p.Exercises).FirstOrDefault();
            if (workout != null)
            {
                resquest.Exercise.Workouts = new List<Workout>
                {
                    workout
                };
                db.Exercise.Add(resquest.Exercise);
                workout.Exercises.Add(resquest.Exercise);
            }
            else
            {
                return Results.NotFound();
            }


            await db.SaveChangesAsync();
            return Results.Created($"/Exercises/{resquest.Exercise.ExerciseId}", resquest.Exercise);
        })
        .WithName("CreateExerciseWithWorkoutId")
        .Produces<Exercise>(StatusCodes.Status201Created)
        .Produces(StatusCodes.Status404NotFound);

        //Adds an existing exercise to a workout
        routes.MapPost("/api/ExistingExerciseWorkout/", async (ExerciceIdWorkoutIdRequest request, PVGymContext db) =>
        {
            Console.WriteLine(request.ToString());
            var workout = db.Workout.Where(p => p.WorkoutId == Guid.Parse(request.WorkoutId)).Include(p => p.Exercises).FirstOrDefault();
            var exercise = db.Exercise.Where(p => p.ExerciseId == Guid.Parse(request.ExerciseId)).Include(e => e.Workouts).FirstOrDefault();
            if (exercise != null && workout != null)
            {
                workout.Exercises.Add(exercise);
                exercise.Workouts.Add(workout);
            }
            else
            {
                return Results.NotFound();
            }


            await db.SaveChangesAsync();
            return Results.Created($"/Exercises/{request.ExerciseId}", exercise);
        })
        .WithName("CreateExistingExerciseWithWorkoutId")
        .Produces<Exercise>(StatusCodes.Status201Created)
        .Produces(StatusCodes.Status404NotFound);

        //Removes an exercise from a workout
        routes.MapPost("/api/DeleteExerciseFromWorkout/", async (ExerciceIdWorkoutIdRequest request, PVGymContext db) =>
        {
            var workout = db.Workout.Include(p => p.Exercises).Where(p => p.WorkoutId == Guid.Parse(request.WorkoutId)).FirstOrDefault();
            var exercise = db.Exercise.Include(p => p.Workouts).Where(p => p.ExerciseId == Guid.Parse(request.ExerciseId)).FirstOrDefault();
            if (exercise != null && workout != null)
            {
                workout.Exercises.Remove(exercise);
                exercise.Workouts.Add(workout);
            }
            else
            {
                return Results.NotFound();
            }

            await db.SaveChangesAsync();
            return Results.CreatedAtRoute();
        })
        .WithName("DeleteExerciseFromWorkout")
        .Produces(StatusCodes.Status201Created)
        .Produces(StatusCodes.Status404NotFound);

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

public class ExerciseWorkoutRequest
{
    public Exercise? Exercise { get; set; }
    public string? Id { get; set; }
}
public class ExerciceIdWorkoutIdRequest
{
    public string? WorkoutId { get; set; }
    public string? ExerciseId { get; set; }

    public override string? ToString()
    {
        return $"WorkoutId: {WorkoutId}, ExerciceId: {ExerciseId}";
    }
}