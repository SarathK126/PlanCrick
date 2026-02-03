namespace PlanCrick.Backend.Models;

public class Player
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Role { get; set; } = string.Empty; // Batsman, Bowler, All-rounder
    public string BowlingStyle { get; set; } = string.Empty; // e.g., Right-arm Fast
    public string Handedness { get; set; } = string.Empty; // Right/Left
    public string TeamName { get; set; } = "Team 1";
}
