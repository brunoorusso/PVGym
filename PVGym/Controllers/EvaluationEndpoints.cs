using Microsoft.EntityFrameworkCore;
using PVGym.Data;
using PVGym.Models;
namespace PVGym.Controllers;

public static class EvaluationEndpoints
{
    public static void MapEvaluationEndpoints (this IEndpointRouteBuilder routes)
    {
        routes.MapGet("/api/Evaluation", async (PVGymContext db) =>
        {
            return await db.Evaluation.ToListAsync();
        })
        .WithName("GetAllEvaluations")
        .Produces<List<Evaluation>>(StatusCodes.Status200OK);

        routes.MapGet("/api/Evaluation/{id}", async (Guid Id, PVGymContext db) =>
        {
            return await db.Evaluation.FindAsync(Id)
                is Evaluation model
                    ? Results.Ok(model)
                    : Results.NotFound();
        })
        .WithName("GetEvaluationById")
        .Produces<Evaluation>(StatusCodes.Status200OK)
        .Produces(StatusCodes.Status404NotFound);

        routes.MapPut("/api/Evaluation/{id}", async (Guid Id, Evaluation evaluation, PVGymContext db) =>
        {
            var foundModel = await db.Evaluation.FindAsync(Id);

            if (foundModel is null)
            {
                return Results.NotFound();
            }

            db.Update(evaluation);

            await db.SaveChangesAsync();

            return Results.NoContent();
        })
        .WithName("UpdateEvaluation")
        .Produces(StatusCodes.Status404NotFound)
        .Produces(StatusCodes.Status204NoContent);

        routes.MapPost("/api/Evaluation/", async (Evaluation evaluation, PVGymContext db) =>
        {
            db.Evaluation.Add(evaluation);
            await db.SaveChangesAsync();
            return Results.Created($"/Evaluations/{evaluation.Id}", evaluation);
        })
        .WithName("CreateEvaluation")
        .Produces<Evaluation>(StatusCodes.Status201Created);

        routes.MapDelete("/api/Evaluation/{id}", async (Guid Id, PVGymContext db) =>
        {
            if (await db.Evaluation.FindAsync(Id) is Evaluation evaluation)
            {
                db.Evaluation.Remove(evaluation);
                await db.SaveChangesAsync();
                return Results.Ok(evaluation);
            }

            return Results.NotFound();
        })
        .WithName("DeleteEvaluation")
        .Produces<Evaluation>(StatusCodes.Status200OK)
        .Produces(StatusCodes.Status404NotFound);
    }
}
