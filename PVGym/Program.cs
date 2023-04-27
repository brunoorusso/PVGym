using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using PVGym.Areas.Identity.Data;
using PVGym.Data;
using PVGym.Controllers;
using System.Text.Json.Serialization;
using System.Text.Json;
using System.Drawing.Text;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using PVGym.Models;
using System.Threading;

using Microsoft.Extensions.Logging;
using Newtonsoft.Json.Linq;
using PVGym.Models;
using NuGet.ProjectModel;

var builder = WebApplication.CreateBuilder(args);
var connectionString = builder.Configuration.GetConnectionString("PVGymContextConnection") ?? throw new InvalidOperationException("Connection string 'ApplicationDbContextConnection' not found.");

builder.Services.AddDbContext<PVGymContext>(options =>
    options.UseSqlServer(connectionString));

builder.Services.AddDefaultIdentity<ApplicationUser>(options => options.SignIn.RequireConfirmedAccount = true)
    .AddRoles<IdentityRole>()
    .AddEntityFrameworkStores<PVGymContext>()
    .AddDefaultTokenProviders();


// Add services to the container.
builder.Services.AddControllersWithViews().AddJsonOptions(options => // Modify this line
{
    options.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.Preserve;
});

builder.Services.AddEndpointsApiExplorer();

builder.Services.AddSwaggerGen();

builder.Services.AddCors();

builder.Services.AddIdentityCore<IdentityUser>(options =>
{
    options.SignIn.RequireConfirmedAccount = false;
    options.User.RequireUniqueEmail = true;
    options.Password.RequireDigit = false;
    options.Password.RequiredLength = 1;
    options.Password.RequireNonAlphanumeric = false;
    options.Password.RequireUppercase = false;
    options.Password.RequireLowercase = false;
}).AddEntityFrameworkStores<PVGymContext>();

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = builder.Configuration.GetSection("Jwt").GetValue<string>("Key"),
            ValidAudience = builder.Configuration.GetSection("Jwt").GetValue<string>("Audience"),
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration.GetSection("Jwt").GetValue<string>("Key")))
        };
    });

//builder.Logging.ClearProviders();
//builder.Logging.AddDebug();

var app = builder.Build();

/*
 * Garante a existência do utilizador Admin e a existência de 3 roles sempre que a aplicação é iniciada
 * Atribui também, de forma instantânea, a role admin ao utilizador admin.
 */
using (var scope = app.Services.CreateScope())
{
    var userManager = scope.ServiceProvider.GetService<UserManager<ApplicationUser>>();
    var roleManager = scope.ServiceProvider.GetService<RoleManager<IdentityRole>>();

    string[] roles = { "admin", "member", "staff" };

    foreach(var role in roles)
    {
        if(await roleManager.FindByNameAsync(role) == null)
        {
            var newRole = new IdentityRole
            {
                Name = role
            };

            await roleManager.CreateAsync(newRole);
        }
    }

    var adminUser = await userManager.FindByNameAsync("admin");
    if (adminUser == null)
    {
        var newAdminUser = new ApplicationUser
        {
            UserName = "admin",
            Email = "admin@admin.com",
            EmailConfirmed = true
        };
        var createAdminUserResult = await userManager.CreateAsync(newAdminUser, "12345Admin.");
        await userManager.AddToRoleAsync(newAdminUser, "admin");
    }


    /**
    * Author: Ismael Lourenço
    */
    // Check if the table is empty and execute the code
    var context = scope.ServiceProvider.GetService<PVGymContext>();
    var isTableEmpty = await context.IsTableEmptyAsync();

    if (isTableEmpty)
    {
        var client = new HttpClient();
        var request = new HttpRequestMessage
        {
            Method = HttpMethod.Get,
            RequestUri = new Uri("https://exercisedb.p.rapidapi.com/exercises"),
            Headers =
        {
            { "X-RapidAPI-Key", "4513d9c6c1msh1cc9cd160f50ee5p147151jsn04d3af1bef2a" },
            { "X-RapidAPI-Host", "exercisedb.p.rapidapi.com" },
        },
        };
        using (var response = await client.SendAsync(request))
        {
            response.EnsureSuccessStatusCode();
            var body = await response.Content.ReadAsStringAsync();

            JArray jArray = JArray.Parse(body);

            foreach (var obj in jArray)
            {
                var exercise = new Exercise
                {
                    ExerciseId = Guid.NewGuid(),
                    Name = obj.GetValue<string>("name"),
                    Description = obj.GetValue<string>("description"),
                    target = obj.GetValue<string>("target"),
                    gifUrl = obj.GetValue<string>("gifUrl"),
                    equipment = obj.GetValue<string>("equipment"),
                    bodyPart = obj.GetValue<string>("bodyPart")
                };

                // Add the exercise to the DbSet before saving changes
                context.Exercise.Add(exercise);
                await context.SaveChangesAsync();
                Console.WriteLine("Created Exercice: " + obj.GetValue<string>("name"));
            }
        }
    } else {
        Console.WriteLine("Exercice already populated");
    }
}
// Configure the HTTP request pipeline.
if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Home/Error");
    // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
    app.UseHsts();
}

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
};

app.UseHttpsRedirection();
app.UseStaticFiles();

app.UseRouting();

app.UseCors(builder => builder
    .AllowAnyOrigin()
    .AllowAnyMethod() // permite todos os métodos HTTP
    .AllowAnyHeader() // permite todos os cabeçalhos
);

app.UseAuthentication();

app.UseAuthorization();

app.MapControllerRoute(
    name: "default",
    pattern: "{controller=Home}/{action=Index}/{id?}");

app.MapRazorPages();

app.MapPlanEndpoints();

app.MapWorkoutEndpoints();

app.MapExerciseEndpoints();

app.MapMemberEndpoints();

app.MapEvaluationEndpoints();

app.MapNotificationEndpoints();

app.MapStaffEndpoints();

app.MapAvailableClassEndpoints();

app.MapClassEndpoints();

app.Run();

public class IgnoreCircularReferenceConverter : JsonConverter<object>
{
    public override bool CanConvert(Type typeToConvert) => true;

    public override object Read(ref Utf8JsonReader reader, Type typeToConvert, JsonSerializerOptions options)
    {
        return JsonSerializer.Deserialize(ref reader, typeToConvert, options);
    }

    public override void Write(Utf8JsonWriter writer, object value, JsonSerializerOptions options)
    {
        JsonSerializer.Serialize(writer, value, value.GetType(), options);
    }
}
