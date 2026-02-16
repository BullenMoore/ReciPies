using Core.Recipes;
using Core.Tags;

namespace Core.RecipeTags;

public class RecipeTag : IEntity
{
    public Guid Id { get; set; }
    public DateTimeOffset UpdatedAt { get; set; }
    public DateTimeOffset CreatedAt { get; set; }
    public Guid RecipeId { get; set; }
    
    public Recipe Recipe { get; set; }
    public Tag Tag { get; set; }
}