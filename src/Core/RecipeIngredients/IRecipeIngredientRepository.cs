using Core.Recipes;

namespace Core.RecipeIngredients;

public interface IRecipeIngredientRepository
{
    void Update(Recipe updatedRecipe);
}