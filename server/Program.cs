using Microsoft.EntityFrameworkCore;
using PlanCrick.Backend.Data;
using PlanCrick.Backend.Models;
using Scalar.AspNetCore;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();

builder.Services.AddDbContext<CricketContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyMethod()
              .AllowAnyHeader();
    });
});

var app = builder.Build();

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

app.Run();
