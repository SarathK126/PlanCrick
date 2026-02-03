using System.Collections.Generic;

namespace PlanCrick.Backend.Models;

public class FieldingPlan
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty; // e.g., "Powerplay Aggressive"
    public string Description { get; set; } = string.Empty;
    
    // Navigation property
    public List<PlayerPosition> Positions { get; set; } = new();
}

public class PlayerPosition
{
    public int Id { get; set; }
    
    public int FieldingPlanId { get; set; }
    // We might not enforce PlayerId Foreign Key if it's generic, but user implies "11 player icons".
    // Usually plans are generic (Pos 1, Pos 2...) or specific to players.
    // "drag and drop 11 player icons".
    // "store an array of X, Y coordinates for each of the 11 player IDs."
    // So it links a specific player to a spot? Or just the 11 spots?
    // "Tactical Presets ... 'Bowling Orders'".
    // I'll add PlayerId but make it nullable or handle it. 
    // Actually, a Plan might be a template. If it's a template, it doesn't have specific players.
    // But "saved ... Fielding Plans" might imply "Fielding configuration".
    // I'll associate it with a 'PositionIndex' (1-11) or something. 
    // The user said "database ... FieldingPlans that stores an array of X, Y coordinates for each of the 11 player IDs."
    // Okay, so it seems tied to players.
    public int PlayerId { get; set; }
    
    public double X { get; set; }
    public double Y { get; set; }
}
