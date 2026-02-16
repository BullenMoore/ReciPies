using Core.RecipeImages;
using Core.RecipeIngredients;
using Core.Recipes;
using Core.RecipeTags;
using Core.Tags;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Service.Database;
using Service.Repositories;

namespace Service;

public static class DependencyInjection
{
    public static void AddInfrastructure(this IServiceCollection services,
        IConfiguration configuration)
    {
        services.AddScoped<RecipeService>();
        
        services.AddScoped<IRecipeRepository, RecipeRepository>();
        services.AddScoped<IRecipeImageRepository, RecipeImageRepository>();
        services.AddScoped<IRecipeIngredientRepository, RecipeIngredientRepository>();
        services.AddScoped<IRecipeTagRepository,  RecipeTagRepository>();
        services.AddScoped<ITagRepository, TagRepository>();
        
        // Get the path to database
        var solutionRoot = Path.GetFullPath("..");

        var dbDirectory = Path.Combine(solutionRoot, "Service", "Database");
        Directory.CreateDirectory(dbDirectory);

        var dbPath = Path.Combine(dbDirectory, "recipes.db");

        services.AddDbContext<ServiceDbContext>(options =>
            options.UseSqlite($"Data Source={dbPath}")
        );
    }
}