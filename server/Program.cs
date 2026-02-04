using Microsoft.EntityFrameworkCore;
using PlanCrick.Backend.Data;
using PlanCrick.Backend.Models;
using Scalar.AspNetCore;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();

// Handle Railway's DATABASE_URL format
var databaseUrl = Environment.GetEnvironmentVariable("DATABASE_URL");
if (!string.IsNullOrEmpty(databaseUrl))
{
    // Railway provides DATABASE_URL in postgresql:// format
    // Convert to Npgsql connection string format
    if (databaseUrl.StartsWith("postgresql://") || databaseUrl.StartsWith("postgres://"))
    {
        try
        {
            var uri = new Uri(databaseUrl);
            var userInfo = uri.UserInfo.Split(':');
            var connectionString = $"Host={uri.Host};Port={uri.Port};Database={uri.AbsolutePath.Trim('/')};Username={userInfo[0]};Password={userInfo[1]};SSL Mode=Require;Trust Server Certificate=true";
            builder.Configuration["ConnectionStrings:DefaultConnection"] = connectionString;
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Warning: Could not parse DATABASE_URL: {ex.Message}");
        }
    }
    else
    {
        // Already in correct format
        builder.Configuration["ConnectionStrings:DefaultConnection"] = databaseUrl;
    }
}

builder.Services.AddDbContext<CricketContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

// Configure CORS - Allow origins from environment or default to localhost
var corsOrigins = builder.Configuration["CORS_ORIGINS"]?.Split(',') 
    ?? new[] { "http://localhost:5173", "http://localhost:5174" };

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
    {
        policy.WithOrigins(corsOrigins)
              .AllowAnyMethod()
              .AllowAnyHeader();
    });
});

var app = builder.Build();

// Auto-run migrations in production
if (app.Environment.IsProduction())
{
    using (var scope = app.Services.CreateScope())
    {
        var db = scope.ServiceProvider.GetRequiredService<CricketContext>();
        db.Database.Migrate();
    }
}

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
    app.MapScalarApiReference();
}

app.UseHttpsRedirection();
app.UseCors("AllowAll");

// Minimal API Endpoints

// Players
app.MapGet("/api/players", async (CricketContext db) =>
    await db.Players.ToListAsync());

app.MapGet("/api/players/{id}", async (int id, CricketContext db) =>
    await db.Players.FindAsync(id)
        is Player player
            ? Results.Ok(player)
            : Results.NotFound());

app.MapPost("/api/players", async (Player player, CricketContext db) =>
{
    db.Players.Add(player);
    await db.SaveChangesAsync();
    return Results.Created($"/api/players/{player.Id}", player);
});

app.MapPut("/api/players/{id}", async (int id, Player inputPlayer, CricketContext db) =>
{
    var player = await db.Players.FindAsync(id);
    if (player is null) return Results.NotFound();

    player.Name = inputPlayer.Name;
    player.Role = inputPlayer.Role;
    player.BowlingStyle = inputPlayer.BowlingStyle;
    player.Handedness = inputPlayer.Handedness;
    player.TeamName = inputPlayer.TeamName;

    await db.SaveChangesAsync();
    return Results.NoContent();
});

app.MapDelete("/api/players/{id}", async (int id, CricketContext db) =>
{
    if (await db.Players.FindAsync(id) is Player player)
    {
        db.Players.Remove(player);
        await db.SaveChangesAsync();
        return Results.NoContent();
    }
    return Results.NotFound();
});

// Fielding Plans
app.MapGet("/api/plans", async (CricketContext db) =>
    await db.FieldingPlans.Include(p => p.Positions).ToListAsync());

app.MapGet("/api/plans/{id}", async (int id, CricketContext db) =>
    await db.FieldingPlans.Include(p => p.Positions).FirstOrDefaultAsync(p => p.Id == id)
        is FieldingPlan plan
            ? Results.Ok(plan)
            : Results.NotFound());

app.MapPost("/api/plans", async (FieldingPlan plan, CricketContext db) =>
{
    db.FieldingPlans.Add(plan);
    await db.SaveChangesAsync();
    return Results.Created($"/api/plans/{plan.Id}", plan);
});

// Health check endpoint
app.MapGet("/health", () => Results.Ok(new { status = "healthy", timestamp = DateTime.UtcNow }));

// Get port from environment variable (Railway/Render use PORT)
var port = Environment.GetEnvironmentVariable("PORT") ?? "5017";
app.Run($"http://0.0.0.0:{port}");

