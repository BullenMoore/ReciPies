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

        /*
        if (existingRecipe.Ingredients == updatedRecipe.Ingredients) // Does this work as intended?
        {
            return;
        }
        */
        
        existingRecipe.Ingredients.Clear();
        
        for (int i = 0; i < updatedRecipe.Ingredients.Count; i++)
        {
            updatedRecipe.Ingredients[i].Index = i;
        }

        foreach (var ingredient in updatedRecipe.Ingredients)
        {
            existingRecipe.Ingredients.Add(new RecipeIngredient
            {
                Index = ingredient.Index,
                Name = ingredient.Name,
                Amount = ingredient.Amount,
                Unit = ingredient.Unit
            });
        }
        existingRecipe.IngredientUpdate(); // Updates updatedAt time for recipe
        
        _db.SaveChanges();
    }
}
