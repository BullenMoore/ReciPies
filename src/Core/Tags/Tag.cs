using Core.RecipeTags;

namespace Core.Tags;

public class Tag : IEntity
{
    public Guid Id { get; set; }
    public DateTimeOffset UpdatedAt { get; set; }
    public DateTimeOffset CreatedAt { get; set; }
    
    public string Name { get; set; } = "";
    public IEnumerable<RecipeTag>? RecipeTags { get; set; }
}