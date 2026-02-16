using Core.RecipeIngredients;
using Core.RecipeImages;
using Core.RecipeTags;

namespace Core.Recipes;

public class Recipe : IEntity
{
    public Recipe()
    {
        Id = Guid.NewGuid();
        UpdatedAt = DateTimeOffset.UtcNow;
        CreatedAt = DateTimeOffset.UtcNow;
        
    } // The constructor only needs what is necessary to create a recipe 
    
    // Add ranges
    public Guid Id { get; set; }
    public DateTimeOffset UpdatedAt { get; set; }
    public DateTimeOffset CreatedAt { get; set; }
    
    public string? Title { get; set; }
    public string? Description { get; set; }

    public int? Portions { get; set; }
    public int? TimeMinutes { get; set; }

    public string? Instructions { get; set; }
    public string? Nutrition { get; set; }
    public string? Source { get; set; }
    public string? SourceUrl { get; set; }

    public List<RecipeIngredient>? Ingredients { get; set; } = new();
    public List<RecipeImage>? Images { get; set; } = new();
    public List<RecipeTag>? RecipeTags { get; set; } = new();
    
    public void Update(
        string? title,
        string? description,
        int? portions,
        int? timeMinutes,
        string? instructions,
        string? nutrition,
        string? source,
        string? sourceUrl)
    {
        Title = title;
        Description = description;
        Portions = portions;
        TimeMinutes = timeMinutes;
        Instructions = instructions;
        Nutrition = nutrition;
        Source = source;
        SourceUrl = sourceUrl;
        UpdatedAt = DateTimeOffset.UtcNow;
    }
}