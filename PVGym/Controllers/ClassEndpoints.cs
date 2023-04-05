﻿using Microsoft.EntityFrameworkCore;
using PVGym.Data;
using PVGym.Models;
namespace PVGym.Controllers;

public static class ClassEndpoints
{
    public static void MapClassEndpoints (this IEndpointRouteBuilder routes)
    {
        routes.MapGet("/api/Class", async (PVGymContext db) =>
        {
            return await db.Class.ToListAsync();
        })
        .WithName("GetAllClasss")
        .Produces<List<Class>>(StatusCodes.Status200OK);

        routes.MapGet("/api/Class/{id}", async (int Id, PVGymContext db) =>
        {
            return await db.Class.FindAsync(Id)
                is Class model
                    ? Results.Ok(model)
                    : Results.NotFound();
        })
        .WithName("GetClassById")
        .Produces<Class>(StatusCodes.Status200OK)
        .Produces(StatusCodes.Status404NotFound);

        routes.MapPut("/api/Class/{id}", async (int Id, Class @class, PVGymContext db) =>
        {
            var foundModel = await db.Class.FindAsync(Id);

            if (foundModel is null)
            {
                return Results.NotFound();
            }

            db.Update(@class);

            await db.SaveChangesAsync();

            return Results.NoContent();
        })
        .WithName("UpdateClass")
        .Produces(StatusCodes.Status404NotFound)
        .Produces(StatusCodes.Status204NoContent);

        routes.MapPost("/api/Class/", async (Class @class, PVGymContext db) =>
        {
            db.Class.Add(@class);
            await db.SaveChangesAsync();
            return Results.Created($"/Classs/{@class.Id}", @class);
        })
        .WithName("CreateClass")
        .Produces<Class>(StatusCodes.Status201Created);

        routes.MapDelete("/api/Class/{id}", async (int Id, PVGymContext db) =>
        {
            if (await db.Class.FindAsync(Id) is Class @class)
            {
                db.Class.Remove(@class);
                await db.SaveChangesAsync();
                return Results.Ok(@class);
            }

            return Results.NotFound();
        })
        .WithName("DeleteClass")
        .Produces<Class>(StatusCodes.Status200OK)
        .Produces(StatusCodes.Status404NotFound);
    }
}