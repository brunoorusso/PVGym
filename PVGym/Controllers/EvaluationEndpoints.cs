using Microsoft.EntityFrameworkCore;
using PVGym.Data;
using PVGym.Models;
namespace PVGym.Controllers;

/*
 * Author: Bernardo Botelho
 */
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

        /**
        * Description: This code sets up a route to retrieve a list of evaluations based on the staff member who created them.
        * The route is a HTTP GET request to "/api/Evaluation/StaffId/{CreatedBy}" and is defined using the MapGet method of the route builder.
        * It takes a Guid parameter called CreatedBy to specify the ID of the staff member who created the evaluations.
        * The route retrieves all evaluations where the CreatedBy field matches the CreatedBy parameter passed in.
        * The result is returned as a list of evaluations with a status code of 200 OK.
        */
        routes.MapGet("api/Evaluation/StaffId/{CreatedBy}", async (Guid CreatedBy, PVGymContext db) =>
        {
            return await db.Evaluation.Where(m => m.CreatedBy == CreatedBy).ToListAsync();
        })
        .WithName("GetEvaluationByCreatedBy")
        .Produces<List<Evaluation>>(StatusCodes.Status200OK);

        /**
        * Description: This code sets up a route to retrieve a list of evaluations for a specific member by their MemberId.
        * The route is a HTTP GET request to "/api/Evaluation/MemberId/{MemberId}" and is defined using the MapGet method of the route builder.
        * The MemberId is passed as a parameter in the route, and is used to filter the evaluations based on the matching MemberId in the database.
        * The route returns a list of evaluations for the specified member, and is set to produce a HTTP response with a 200 OK status code
        * and a content type of application/json that contains a list of Evaluation objects.
        */
        routes.MapGet("api/Evaluation/MemberId/{MemberId}", async (Guid MemberId, PVGymContext db) =>
        {
            return await db.Evaluation.Where(m => m.MemberId == MemberId).ToListAsync();
        })
        .WithName("GetEvaluationByMemberId")
        .Produces<List<Evaluation>>(StatusCodes.Status200OK);

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
