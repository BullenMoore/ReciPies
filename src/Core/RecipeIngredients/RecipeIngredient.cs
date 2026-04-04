using System.ComponentModel.DataAnnotations;
using Core.Recipes;

namespace Core.RecipeIngredients;

/*
 * Recipe ingredients will not have update or create times,
 * since they are a part of the recipe,
 * but a recipe will have its updateTime updated if an ingredient changes/is added.
 */
public class RecipeIngredient 
{
    
    public Guid Id { get; set; }
    public Guid RecipeId { get; set; }

    public string Name { get; set; } = "";
    public double? Amount { get; set; }
    public string? Unit { get; set; }

    public Recipe Recipe { get; set; } = default!;
}