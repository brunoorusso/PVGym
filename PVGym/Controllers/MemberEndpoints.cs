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
public static class MemberEndpoints
{
    public static void MapMemberEndpoints (this IEndpointRouteBuilder routes)
    {
        routes.MapGet("/api/Member", async (PVGymContext db) =>
        {
            return await db.Member.ToListAsync();
        })
        .WithName("GetAllMembers")
        .Produces<List<Member>>(StatusCodes.Status200OK);

        routes.MapGet("/api/Member/{id}", async (Guid Id, PVGymContext db) =>
        {
            return await db.Member.FindAsync(Id)
                is Member model
                    ? Results.Ok(model)
                    : Results.NotFound();
        })
        .WithName("GetMemberById")
        .Produces<Member>(StatusCodes.Status200OK)
        .Produces(StatusCodes.Status404NotFound);

        /**
        * Description: This code sets up a route to retrieve a member object by their user id. The route is a
        * HTTP GET request to "/api/Member/UserId/{UserId}" and is defined using the MapGet method of the route builder.
        * The route takes a Guid UserId as input parameter and returns a member object. The method retrieves the member
        * with the specified UserId from the database and includes the Plan, Workouts and Exercises related to the member.
        * If the member object is found, it returns an Ok result with the member object, otherwise it returns a NotFound result.
        */
        routes.MapGet("/api/Member/UserId/{UserId}", async (Guid UserId, PVGymContext db) =>
        {
            return await db.Member
            .Where(m => m.UserId == UserId.ToString())
            .Include(m => m.Plan)
            .ThenInclude(p => p.Workouts)
            .ThenInclude(w => w.Exercises).FirstAsync()
                is Member model
                    ? Results.Ok(model)
                    : Results.NotFound();
        })
        .WithName("GetMemberByUserId")
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

        routes.MapPost("/api/Member/", async (Member member, PVGymContext db, UserManager<ApplicationUser> userManager) =>
        {
            db.Member.Add(member);
            await db.SaveChangesAsync();
            var user = await userManager.FindByIdAsync(member.UserId);
            await userManager.AddToRoleAsync(user, "member");
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

        routes.MapPost("/api/AssignMemberToPlan", async (AssignMemberToPlanRequest request, PVGymContext db, UserManager<ApplicationUser> userManager) =>
        {
            var user = await userManager.FindByEmailAsync(request.Email);
            var member = await db.Member.Where(m => m.UserId == user.Id).FirstOrDefaultAsync();
            var plan = await db.Plan.FindAsync(request.PlanId);

            if (member is null || plan is null)
            {
                return Results.NotFound();
            }

            member.Plan = plan;
            db.Update(member);
            await db.SaveChangesAsync();

            return Results.NoContent();
        })
        .WithName("AssignMemberToPlan")
        .Produces(StatusCodes.Status404NotFound)
        .Produces(StatusCodes.Status204NoContent);
    }



     public static Plantype GetPlanTypeFromString(int value)
        {
            switch (value)
            {
                case 0:
                    return Plantype.Normal;
                case 1:
                    return Plantype.Premium;
                default:
                    throw new ArgumentException("Invalid plan type string.");
            }
        }
}

public class AssignMemberToPlanRequest
{
    public string Email { get; set; }
    public Guid PlanId { get; set; }
}
