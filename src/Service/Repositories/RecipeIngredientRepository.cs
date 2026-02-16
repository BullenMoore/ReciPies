using Core.RecipeIngredients;
using Core.Recipes;
using Microsoft.EntityFrameworkCore;
using Service.Database;

namespace Service.Repositories;

public class RecipeIngredientRepository : IRecipeIngredientRepository
{
    private readonly ServiceDbContext _db;
    
    public RecipeIngredientRepository(ServiceDbContext db)
    {
        _db = db;
    }
    
    public void Update(Recipe updatedRecipe)
    {
        var existingRecipe = _db.Recipes
            .Include(r => r.Ingredients)
            .First(r => r.Id == updatedRecipe.Id);
        
        existingRecipe.Ingredients.Clear();

        foreach (var ingredient in updatedRecipe.Ingredients)
        {
            existingRecipe.Ingredients.Add(new RecipeIngredient
            {
                Name = ingredient.Name,
                Amount = ingredient.Amount,
                Unit = ingredient.Unit
            });
        }
    }
}