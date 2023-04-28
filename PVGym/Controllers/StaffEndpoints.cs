using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using PVGym.Areas.Identity.Data;
using PVGym.Data;
using PVGym.Models;
namespace PVGym.Controllers;

/*
 * Autor: Bruno Russo
 * Co-Autor: Bernardo Botelho
 */
public static class StaffEndpoints
{
    public static void MapStaffEndpoints (this IEndpointRouteBuilder routes)
    {
        routes.MapGet("/api/Staff", async (PVGymContext db) =>
        {
            return await db.Staff.ToListAsync();
        })
        .WithName("GetAllStaffs")
        .Produces<List<Staff>>(StatusCodes.Status200OK);

        routes.MapGet("/api/Staff/{id}", async (Guid Id, PVGymContext db) =>
        {
            return await db.Staff.FindAsync(Id)
                is Staff model
                    ? Results.Ok(model)
                    : Results.NotFound();
        })
        .WithName("GetStaffById")
        .Produces<Staff>(StatusCodes.Status200OK)
        .Produces(StatusCodes.Status404NotFound);

        /**
        * Description: This code sets up a route to retrieve a staff member by their user ID.
        * The route is a HTTP GET request to "/api/Staff/UserId/{UserId}" and is defined using the MapGet method of the route builder.
        * The route handler is an asynchronous lambda function that takes in the user ID and a database context as parameters.
        * The function then searches for the staff member in the database with the given user ID using the FirstOrDefaultAsync method.
        * If a staff member is found, it is returned as an Ok result with a status code of 200.
        */
        routes.MapGet("/api/Staff/UserId/{UserId}", async (string UserId, PVGymContext db) =>
        {
            var staff = await db.Staff.FirstOrDefaultAsync(s => s.UserId == UserId.ToString());
            return staff != null ? Results.Ok(staff) : Results.NotFound();
        })
        .WithName("GetStaffByUserId")
        .Produces<Staff>(StatusCodes.Status200OK)
        .Produces(StatusCodes.Status404NotFound);

        routes.MapPut("/api/Staff/{id}", async (Guid Id, Staff staff, PVGymContext db) =>
        {
            var foundModel = await db.Staff.FindAsync(Id);

            if (foundModel is null)
            {
                return Results.NotFound();
            }

            db.Update(staff);

            await db.SaveChangesAsync();
            
            return Results.NoContent();
        })
        .WithName("UpdateStaff")
        .Produces(StatusCodes.Status404NotFound)
        .Produces(StatusCodes.Status204NoContent);

        routes.MapPost("/api/Staff/", async (Staff staff, PVGymContext db, UserManager<ApplicationUser> userManager) =>
        {
            db.Staff.Add(staff);
            await db.SaveChangesAsync();
            var user = await userManager.FindByIdAsync(staff.UserId);
            await userManager.AddToRoleAsync(user, "staff");
            if(staff.IsAdmin)
            {
                await userManager.AddToRoleAsync(user, "admin");
            }
            return Results.Created($"/Staffs/{staff.Id}", staff);
        })
        .WithName("CreateStaff")
        .Produces<Staff>(StatusCodes.Status201Created);

        routes.MapDelete("/api/Staff/{id}", async (Guid Id, PVGymContext db) =>
        {
            if (await db.Staff.FindAsync(Id) is Staff staff)
            {
                db.Staff.Remove(staff);
                await db.SaveChangesAsync();
                return Results.Ok(staff);
            }

            return Results.NotFound();
        })
        .WithName("DeleteStaff")
        .Produces<Staff>(StatusCodes.Status200OK)
        .Produces(StatusCodes.Status404NotFound);
    }
}
