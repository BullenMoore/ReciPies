using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Service.Database.Migrations
{
    /// <inheritdoc />
    public partial class UpdatedCorev3 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropPrimaryKey(
                name: "PK_RecipeTags",
                table: "RecipeTags");

            migrationBuilder.DropIndex(
                name: "IX_RecipeTags_RecipeId",
                table: "RecipeTags");

            migrationBuilder.DropColumn(
                name: "Id",
                table: "RecipeTags");

            migrationBuilder.AddPrimaryKey(
                name: "PK_RecipeTags",
                table: "RecipeTags",
                columns: new[] { "RecipeId", "TagId" });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropPrimaryKey(
                name: "PK_RecipeTags",
                table: "RecipeTags");

            migrationBuilder.AddColumn<Guid>(
                name: "Id",
                table: "RecipeTags",
                type: "TEXT",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"));

            migrationBuilder.AddPrimaryKey(
                name: "PK_RecipeTags",
                table: "RecipeTags",
                column: "Id");

            migrationBuilder.CreateIndex(
                name: "IX_RecipeTags_RecipeId",
                table: "RecipeTags",
                column: "RecipeId");
        }
    }
}
