/**
 * Author: Ismael Lourenço
 */
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
            return await db.Workout.Where(e => e.Name.Contains(searchTerm)).Take(10).Select(e => e).Include(w => w.Exercises).ToListAsync();
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

        routes.MapPut("/api/Workout/{id}", async (Guid id, Workout workout, PVGymContext db) =>
        {
            Console.WriteLine(workout.ToString());
            var foundModel = await db.Workout.FindAsync(id);

            if (foundModel is null)
            {
                return Results.NotFound();
            }

            db.Entry(foundModel).State = EntityState.Detached;
            foundModel.Name = workout.Name;

            db.Workout.Update(foundModel);

            await db.SaveChangesAsync();

            return Results.Created($"/Workouts/{workout.WorkoutId}", workout);
        })
        .WithName("UpdateWorkout")
        .Produces(StatusCodes.Status404NotFound)
        .Produces<Workout>(StatusCodes.Status201Created);

        routes.MapPost("/api/Workout/", async (Workout workout, PVGymContext db) =>
        {
            db.Workout.Add(workout);
            await db.SaveChangesAsync();
            return Results.Created($"/Workouts/{workout.WorkoutId}", workout);
        })
        .WithName("CreateWorkout")
        .Produces<Workout>(StatusCodes.Status201Created);

        routes.MapPost("/api/WorkoutPlan/", async (WorkoutPlanRequest workoutRequest, PVGymContext db) =>
        {
            workoutRequest.Workout.WorkoutId = Guid.NewGuid();

            var plan = db.Plan.Include(p => p.Workouts).Where(p => p.PlanId == Guid.Parse(workoutRequest.Id)).FirstOrDefault();
            if (plan != null)
            {
                workoutRequest.Workout.Plans = new List<Plan>
                {
                    plan
                };
                db.Workout.Add(workoutRequest.Workout);
                plan.Workouts.Add(workoutRequest.Workout);
            }
            else
            {
                return Results.NotFound();
            }

            await db.SaveChangesAsync();
            var workout = db.Workout.Include(p => p.Exercises).Where(p => p.WorkoutId == workoutRequest.Workout.WorkoutId).FirstOrDefault();
            return Results.Created($"/Workouts/{workoutRequest.Workout.WorkoutId}", workout);
        })
        .WithName("CreateWorkoutWithPlanId")
        .Produces<Workout>(StatusCodes.Status201Created)
        .Produces(StatusCodes.Status404NotFound);

        routes.MapPost("/api/ExistingWorkoutPlan/", async (WorkoutIdPlanIdRequest request, PVGymContext db) =>
        {
            var workout = db.Workout.Include(p => p.Plans).Where(p => p.WorkoutId == Guid.Parse(request.WorkoutId)).FirstOrDefault();
            var plan = db.Plan.Include(p => p.Workouts).Where(p => p.PlanId == Guid.Parse(request.PlanId)).FirstOrDefault();
            if (plan != null && workout != null)
            {
                workout.Plans.Add(plan);
                plan.Workouts.Add(workout);
            }
            else
            {
                return Results.NotFound();
            }

            await db.SaveChangesAsync();
            var workoutSend = db.Workout.Include(p => p.Exercises).Where(p => p.WorkoutId == workout.WorkoutId).FirstOrDefault();
            return Results.Created($"/Workouts/{request.WorkoutId}", workoutSend);
        })
        .WithName("CreateExistingWorkoutWithPlanId")
        .Produces<Workout>(StatusCodes.Status201Created)
        .Produces(StatusCodes.Status404NotFound);

        routes.MapPost("/api/DeleteWorkoutFromPlan/", async (WorkoutIdPlanIdRequest request, PVGymContext db) =>
        {
            var workout = db.Workout.Include(p => p.Plans).Where(w => w.WorkoutId == Guid.Parse(request.WorkoutId)).FirstOrDefault();
            var plan = db.Plan.Include(p => p.Workouts).Where(p => p.PlanId == Guid.Parse(request.PlanId)).FirstOrDefault();

            if (plan != null && workout != null)
            {
                workout.Plans.Remove(plan);
                plan.Workouts.Remove(workout);
            }
            else
            {
                return Results.BadRequest();
            }

            await db.SaveChangesAsync();
            return Results.NoContent();
        })
        .WithName("DeleteWorkoutFromPlan")
        .Produces(StatusCodes.Status204NoContent)
        .Produces(StatusCodes.Status400BadRequest);

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
    public Workout? Workout { get; set; }
    public string? Id { get; set; }
}

public class WorkoutIdPlanIdRequest
{
    public string? WorkoutId { get; set; }
    public string? PlanId { get; set; }

    public override string? ToString()
    {
        return WorkoutId + " " + PlanId;
    }
}