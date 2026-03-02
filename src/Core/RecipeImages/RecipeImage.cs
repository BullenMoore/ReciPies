using Core.Recipes;

namespace Core.RecipeImages;

public class RecipeImage : IEntity
{
    public RecipeImage(
        Guid recipeId,
        string path,
        bool isMain)
    {
        RecipeId = recipeId;
        Path = path;
        IsMain = isMain;
        
        Id = Guid.NewGuid();
        UpdatedAt = DateTime.UtcNow;
        CreatedAt = DateTime.UtcNow;
    }
    
    public Guid Id { get; set; }
    public DateTimeOffset UpdatedAt { get; set; }
    public DateTimeOffset CreatedAt { get; set; }
    public Guid RecipeId { get; set; }
    
    public string Path { get; set; }
    public bool IsMain { get; set; }

    public Recipe Recipe { get; set; } = default!;

    public void Update(bool isMain)
    {
        IsMain = isMain;
        UpdatedAt = DateTime.UtcNow;
    }
}