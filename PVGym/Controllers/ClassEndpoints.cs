using Microsoft.EntityFrameworkCore;
using PVGym.Data;
using PVGym.Models;
namespace PVGym.Controllers;

public static class ClassEndpoints
{

    /*
     * Autor: Alexandre Oliveira
     * Co-autor: Bernardo Botelho
    */
    public static void MapClassEndpoints(this IEndpointRouteBuilder routes)
    {
        routes.MapGet("/api/Class", async (PVGymContext db) =>
        {
            return await db.Class.ToListAsync();
        })
        .WithName("GetAllClasss")
        .Produces<List<Class>>(StatusCodes.Status200OK);

        routes.MapGet("/api/Class/Tomorrow", async (PVGymContext db) =>
        {
            var tomorrow = DateTime.Today.AddDays(1);
            return await db.Class.Include(c => c.Members).Where(m => m.StartDate >= tomorrow && m.NotificationSend == false).ToListAsync();
        })
        .WithName("GetAllTomorrowClasss")
        .Produces<List<Class>>(StatusCodes.Status200OK);

        routes.MapGet("/api/Class/{id}", async (Guid Id, PVGymContext db) =>
        {
            return await db.Class.FindAsync(Id)
                is Class model
                    ? Results.Ok(model)
                    : Results.NotFound();
        })
        .WithName("GetClassById")
        .Produces<Class>(StatusCodes.Status200OK)
        .Produces(StatusCodes.Status404NotFound);

        routes.MapGet("/api/Class/{id}/Members", async (Guid Id, PVGymContext db) =>
        {
            var aulas = await db.Class
                                .Include(c => c.Members)
                                .Where(c => c.Id == Id)
                                .Select(c => c.Members)
                                .FirstOrDefaultAsync();

            return aulas != null
                    ? Results.Ok(aulas)
                    : Results.NoContent();
        })
        .WithName("GetMembersOfClass")
        .Produces<List<Member>>(StatusCodes.Status200OK)
        .Produces(StatusCodes.Status204NoContent);

        routes.MapGet("/api/Class/ByName/{name}", async (string name, PVGymContext db) =>
        {
            var classes = await db.Class
                .Include(c => c.Members)
                .Where(c => c.Name == name && c.StartDate >= DateTime.Now)
                .OrderBy(c => c.StartDate)
                .ToListAsync();

            return classes.Count > 0
                ? Results.Ok(classes)
                : Results.NoContent();
        })
        .WithName("GetClassByName")
        .Produces<List<Class>>(StatusCodes.Status200OK)
        .Produces(StatusCodes.Status204NoContent);


        routes.MapPut("/api/Class/{id}", async (Guid Id, Class @class, PVGymContext db) =>
        {
            var foundModel = await db.Class.FindAsync(Id);

            if (foundModel is null)
            {
                return Results.NotFound();
            }

            db.Entry(foundModel).State = EntityState.Detached;

            foundModel.NotificationSend = @class.NotificationSend;

            db.Class.Update(foundModel);

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

        routes.MapDelete("/api/Class/{id}", async (Guid Id, PVGymContext db) =>
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

        routes.MapPost("/api/ExistingMemberClass/", async (MemberIdClassIdRequest request, PVGymContext db) =>
        {
            var member = db.Member.Include(c => c.Classes).Where(m => m.MemberId == Guid.Parse(request.MemberId)).FirstOrDefault();
            var aula = db.Class.Include(c => c.Members).Where(m => m.Id == Guid.Parse(request.ClassId)).FirstOrDefault();
            if (member != null && aula != null)
            {
                member.Classes.Add(aula);
                aula.Members.Add(member);
            }
            else
            {
                return Results.NotFound();
            }
            await db.SaveChangesAsync();
            return Results.Created($"/Class/{request.ClassId}", aula);
        })
        .WithName("CreateExistingMemberWithClassId")
        .Produces<Class>(StatusCodes.Status201Created)
        .Produces(StatusCodes.Status404NotFound);

        routes.MapPost("/api/RemoveMemberFromClass/", async (MemberIdClassIdRequest request, PVGymContext db) =>
        {
            var member = db.Member.Include(c => c.Classes).Where(m => m.MemberId == Guid.Parse(request.MemberId)).FirstOrDefault();
            var aula = db.Class.Include(c => c.Members).Where(m => m.Id == Guid.Parse(request.ClassId)).FirstOrDefault();
            if (member != null && aula != null)
            {
                member.Classes.Remove(aula);
                aula.Members.Remove(member);
            }
            else
            {
                return Results.NotFound();
            }
            await db.SaveChangesAsync();
            return Results.NoContent();
        })
        .WithName("RemoveMemberFromClass")
        .Produces(StatusCodes.Status204NoContent)
        .Produces(StatusCodes.Status404NotFound);

        routes.MapGet("/api/Class/Member/{id}", async (string Id, PVGymContext db) =>
        {
            var memberClasses = await db.Class
                .Include(c => c.Members)
                .Where(c => c.Members.Any(m => m.UserId == Id) && c.StartDate >= DateTime.Now)
                .OrderBy(c => c.StartDate)
                .ToListAsync();

            return memberClasses.Count > 0
                ? Results.Ok(memberClasses)
                : Results.NoContent();
        })
        .WithName("GetClassesByMemberId")
        .Produces<List<Class>>(StatusCodes.Status200OK)
        .Produces(StatusCodes.Status204NoContent);

        routes.MapGet("/api/Class/Old/Member/{id}", async (string Id, PVGymContext db) =>
        {
            var memberClasses = await db.Class
                .Include(c => c.Members)
                .Where(c => c.Members.Any(m => m.UserId == Id) && c.StartDate < DateTime.Now)
                .OrderBy(c => c.StartDate)
                .ToListAsync();

            return memberClasses.Count > 0
                ? Results.Ok(memberClasses)
                : Results.NoContent();
        })
        .WithName("GetOldClassesByMemberId")
        .Produces<List<Class>>(StatusCodes.Status200OK)
        .Produces(StatusCodes.Status204NoContent);

    }
}

public class MemberIdClassIdRequest
{
    public string? MemberId { get; set; }
    public string? ClassId { get; set; }
}