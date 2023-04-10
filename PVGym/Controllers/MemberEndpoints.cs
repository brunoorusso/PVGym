using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using PVGym.Areas.Identity.Data;
using PVGym.Data;
using PVGym.Models;
namespace PVGym.Controllers;

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

        routes.MapGet("/api/Member/{MemberId}", async (Guid MemberId, PVGymContext db) =>
        {
            return await db.Member.FindAsync(MemberId)
                is Member model
                    ? Results.Ok(model)
                    : Results.NotFound();
        })
        .WithName("GetMemberById")
        .Produces<Member>(StatusCodes.Status200OK)
        .Produces(StatusCodes.Status404NotFound);

        routes.MapGet("/api/Member/UserId/{UserId}", async (Guid UserId, PVGymContext db) =>
        {
            return await db.Member.FirstOrDefaultAsync(m => m.UserId == UserId.ToString())
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
