using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ReciPies.Migrations
{
    /// <inheritdoc />
    public partial class RemoveSortOrderOnImages : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "SortOrder",
                table: "RecipeImages");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "SortOrder",
                table: "RecipeImages",
                type: "INTEGER",
                nullable: false,
                defaultValue: 0);
        }
    }
}
