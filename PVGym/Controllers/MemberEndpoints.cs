using Microsoft.EntityFrameworkCore;
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
}
