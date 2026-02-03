using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace PlanCrick.Backend.Migrations
{
    /// <inheritdoc />
    public partial class AddTeamColumn : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "TeamName",
                table: "Players",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "TeamName",
                table: "Players");
        }
    }
}
