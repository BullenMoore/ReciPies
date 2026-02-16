using Core.Recipes;

namespace Core.RecipeIngredients;

public class RecipeIngredient : IEntity
{
    public Guid Id { get; set; }
    public DateTimeOffset UpdatedAt { get; set; }
    public DateTimeOffset CreatedAt { get; set; }
    public Guid RecipeId { get; set; }
    
    public string Name { get; set; }
    public double Amount { get; set; }
    public string Unit { get; set; }

    public Recipe Recipe { get; set; }
}