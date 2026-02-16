using Core.RecipeImages;
using Core.RecipeIngredients;
using Core.Recipes;
using Core.RecipeTags;
using Core.Tags;
using Microsoft.EntityFrameworkCore;

namespace Service.Database;

public class ServiceDbContext : DbContext
{
    public ServiceDbContext(DbContextOptions<ServiceDbContext> options)
        : base(options) { }

    public DbSet<Recipe> Recipes => Set<Recipe>();
    public DbSet<RecipeIngredient> Ingredients => Set<RecipeIngredient>();
    public DbSet<RecipeImage> RecipeImages => Set<RecipeImage>();
    public DbSet<Tag> Tags => Set<Tag>();
    public DbSet<RecipeTag> RecipeTags => Set<RecipeTag>();
}