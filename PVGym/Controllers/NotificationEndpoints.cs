﻿using Microsoft.EntityFrameworkCore;
using PVGym.Data;
using PVGym.Models;
namespace PVGym.Controllers;

/*
 * Author: Bernardo Botelho
 */
public static class NotificationEndpoints
{
    public static void MapNotificationEndpoints(this IEndpointRouteBuilder routes)
    {
        routes.MapGet("/api/Notification", async (PVGymContext db) =>
        {
            return await db.Notification.ToListAsync();
        })
        .WithName("GetAllNotifications")
        .Produces<List<Notification>>(StatusCodes.Status200OK);

        /**
        * Description: This code sets up a route to retrieve a list of notifications for a given user ID.
        * The route is a HTTP GET request to "/api/Notification/UserId/{UserId}" and is defined using the MapGet method of the route builder.
        * The route takes in a user ID as a parameter and uses LINQ to query the database for notifications that have a matching user ID.
        */
        routes.MapGet("api/Notification/UserId/{UserId}", async (Guid UserId, PVGymContext db) =>
        {
            return await db.Notification.Where(m => m.UserId == UserId).ToListAsync();
        })
        .WithName("GetNotificationByUserId")
        .Produces<List<Notification>>(StatusCodes.Status200OK);

        /**
        * Description: This code sets up a route to retrieve a list of unread notifications for a particular user.
        * The route is a HTTP GET request to "/api/Notification/Unread/UserId/{UserId}" and is defined using the MapGet method of the route builder.
        * The {UserId} placeholder is used to specify which user's notifications should be retrieved.
        */
        routes.MapGet("api/Notification/Unread/UserId/{UserId}", async (Guid UserId, PVGymContext db) =>
        {
            return await db.Notification.Where(m => m.UserId == UserId && m.IsRead == false).ToListAsync();
        })
        .WithName("GetUnreadNotificationByUserId")
        .Produces<List<Notification>>(StatusCodes.Status200OK);

        routes.MapGet("/api/Notification/{id}", async (Guid Id, PVGymContext db) =>
        {
            return await db.Notification.FindAsync(Id)
                is Notification model
                    ? Results.Ok(model)
                    : Results.NotFound();
        })
        .WithName("GetNotificationById")
        .Produces<Notification>(StatusCodes.Status200OK)
        .Produces(StatusCodes.Status404NotFound);

        routes.MapPut("/api/Notification/{id}", async (Guid Id, Notification notification, PVGymContext db) =>
        {
            var foundModel = await db.Notification.FindAsync(Id);

            if (foundModel is null)
            {
                return Results.NotFound();
            }

            db.Entry(foundModel).State = EntityState.Detached;

            db.Update(notification);

            await db.SaveChangesAsync();

            return Results.NoContent();
        })
        .WithName("UpdateNotification")
        .Produces(StatusCodes.Status404NotFound)
        .Produces(StatusCodes.Status204NoContent);

        routes.MapPost("/api/Notification/", async (Notification notification, PVGymContext db) =>
        {
            db.Notification.Add(notification);
            await db.SaveChangesAsync();
            return Results.Created($"/Notifications/{notification.Id}", notification);
        })
        .WithName("CreateNotification")
        .Produces<Notification>(StatusCodes.Status201Created);

        routes.MapDelete("/api/Notification/{id}", async (Guid Id, PVGymContext db) =>
        {
            if (await db.Notification.FindAsync(Id) is Notification notification)
            {
                db.Notification.Remove(notification);
                await db.SaveChangesAsync();
                return Results.Ok(notification);
            }

            return Results.NotFound();
        })
        .WithName("DeleteNotification")
        .Produces<Notification>(StatusCodes.Status200OK)
        .Produces(StatusCodes.Status404NotFound);
    }
}
