using Core.Recipes;

namespace Core.RecipeImages;

public class RecipeImage : IEntity
{
    public Guid Id { get; set; }
    public DateTimeOffset UpdatedAt { get; set; }
    public DateTimeOffset CreatedAt { get; set; }
    public Guid RecipeId { get; set; } = default!;
    
    public string Path { get; set; } = "";
    public bool IsMain { get; set; }

    public Recipe Recipe { get; set; } = default!;
}