using Microsoft.EntityFrameworkCore;
using ReciPies.Models;

namespace ReciPies.App_Data;

public class RecipeDbContext : DbContext
{
    public RecipeDbContext(DbContextOptions<RecipeDbContext> options)
        : base(options) { }

    public DbSet<Recipe> Recipes => Set<Recipe>();
    public DbSet<Ingredient> Ingredients => Set<Ingredient>();
    public DbSet<RecipeImage> RecipeImages => Set<RecipeImage>();
    public DbSet<Tag> Tags => Set<Tag>();
    public DbSet<RecipeTag> RecipeTags => Set<RecipeTag>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Recipe>()
            .HasKey(r => r.Id);

        modelBuilder.Entity<RecipeTag>()
            .HasKey(rt => new { rt.RecipeId, rt.TagId });

        modelBuilder.Entity<RecipeTag>()
            .HasOne(rt => rt.Recipe)
            .WithMany(r => r.RecipeTags)
            .HasForeignKey(rt => rt.RecipeId);

        modelBuilder.Entity<RecipeTag>()
            .HasOne(rt => rt.Tag)
            .WithMany(t => t.RecipeTags)
            .HasForeignKey(rt => rt.TagId);
    }
}