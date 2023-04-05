using Microsoft.EntityFrameworkCore;
using PVGym.Data;
using PVGym.Models;
namespace PVGym.Controllers;

public static class AvailableClassEndpoints
{
    public static void MapAvailableClassEndpoints (this IEndpointRouteBuilder routes)
    {
        routes.MapGet("/api/AvailableClass", async (PVGymContext db) =>
        {
            return await db.AvailableClass.ToListAsync();
        })
        .WithName("GetAllAvailableClasss")
        .Produces<List<AvailableClass>>(StatusCodes.Status200OK);

        routes.MapGet("/api/AvailableClass/{id}", async (Guid Id, PVGymContext db) =>
        {
            return await db.AvailableClass.FindAsync(Id)
                is AvailableClass model
                    ? Results.Ok(model)
                    : Results.NotFound();
        })
        .WithName("GetAvailableClassById")
        .Produces<AvailableClass>(StatusCodes.Status200OK)
        .Produces(StatusCodes.Status404NotFound);

        routes.MapPut("/api/AvailableClass/{id}", async (Guid Id, AvailableClass availableClass, PVGymContext db) =>
        {
            var foundModel = await db.AvailableClass.FindAsync(Id);

            if (foundModel is null)
            {
                return Results.NotFound();
            }

            db.Update(availableClass);

            await db.SaveChangesAsync();

            return Results.NoContent();
        })
        .WithName("UpdateAvailableClass")
        .Produces(StatusCodes.Status404NotFound)
        .Produces(StatusCodes.Status204NoContent);

        routes.MapPost("/api/AvailableClass/", async (AvailableClass availableClass, PVGymContext db) =>
        {
            db.AvailableClass.Add(availableClass);
            await db.SaveChangesAsync();
            return Results.Created($"/AvailableClasss/{availableClass.Id}", availableClass);
        })
        .WithName("CreateAvailableClass")
        .Produces<AvailableClass>(StatusCodes.Status201Created);

        routes.MapDelete("/api/AvailableClass/{id}", async (Guid Id, PVGymContext db) =>
        {
            if (await db.AvailableClass.FindAsync(Id) is AvailableClass availableClass)
            {
                db.AvailableClass.Remove(availableClass);
                await db.SaveChangesAsync();
                return Results.Ok(availableClass);
            }

            return Results.NotFound();
        })
        .WithName("DeleteAvailableClass")
        .Produces<AvailableClass>(StatusCodes.Status200OK)
        .Produces(StatusCodes.Status404NotFound);
    }
}
