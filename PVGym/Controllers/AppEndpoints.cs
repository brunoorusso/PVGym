using Microsoft.EntityFrameworkCore;
using PVGym.Data;
using PVGym.Models;
namespace PVGym.Controllers;

public static class AppEndpoints
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
	public static void MapMemberEndpoints (this IEndpointRouteBuilder routes)
    {
        routes.MapGet("/api/Member", async (PVGymContext db) =>
        {
            return await db.Member.ToListAsync();
        })
        .WithName("GetAllMembers")
        .Produces<List<Member>>(StatusCodes.Status200OK);

        routes.MapGet("/api/Member/{id}", async (Guid MemberId, PVGymContext db) =>
        {
            return await db.Member.FindAsync(MemberId)
                is Member model
                    ? Results.Ok(model)
                    : Results.NotFound();
        })
        .WithName("GetMemberById")
        .Produces<Member>(StatusCodes.Status200OK)
        .Produces(StatusCodes.Status404NotFound);

        routes.MapPut("/api/Member/{id}", async (Guid MemberId, Member member, PVGymContext db) =>
        {
            var foundModel = await db.Member.FindAsync(MemberId);

            if (foundModel is null)
            {
                return Results.NotFound();
            }

            db.Update(member);

            await db.SaveChangesAsync();

            return Results.NoContent();
        })
        .WithName("UpdateMember")
        .Produces(StatusCodes.Status404NotFound)
        .Produces(StatusCodes.Status204NoContent);

        routes.MapPost("/api/Member/", async (Member member, PVGymContext db) =>
        {
            db.Member.Add(member);
            await db.SaveChangesAsync();
            return Results.Created($"/Members/{member.MemberId}", member);
        })
        .WithName("CreateMember")
        .Produces<Member>(StatusCodes.Status201Created);


        routes.MapDelete("/api/Member/{id}", async (Guid MemberId, PVGymContext db) =>
        {
            if (await db.Member.FindAsync(MemberId) is Member member)
            {
                db.Member.Remove(member);
                await db.SaveChangesAsync();
                return Results.Ok(member);
            }

            return Results.NotFound();
        })
        .WithName("DeleteMember")
        .Produces<Member>(StatusCodes.Status200OK)
        .Produces(StatusCodes.Status404NotFound);
    }
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
