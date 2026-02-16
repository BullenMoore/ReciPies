using Core.Recipes;
using Microsoft.EntityFrameworkCore;
using Service.Database;
using Contracts.DTOs;

namespace Service.Repositories;

public class RecipeRepository : IRecipeRepository
{
    private readonly ServiceDbContext _db; 
    
    public RecipeRepository(ServiceDbContext db)
    {
        _db = db;
    }
    
    public Recipe? GetRecipeById(Guid id)
    {
        Recipe recipe = _db.Recipes
            .Include(r => r.Images)
            .Include(r => r.Ingredients)
            .Include(r => r.RecipeTags)
            .ThenInclude(rt => rt.Tag)
            .FirstOrDefault(r => r.Id == id);

        if (recipe != null)
        {
            recipe.RecipeTags = recipe.RecipeTags
                .OrderBy(rt => rt.Tag.Name)
                .ToList();
        }
        return recipe;
    }

    public Guid Create()
    {
        var newRecipe = new Recipe();
        
        var result = _db.Recipes.Add(newRecipe);
        _db.SaveChanges();

        return result.Entity.Id;
    }

    public void Update(Recipe updatedRecipe)
    {
        var existingRecipe = _db.Recipes
            .First(r => r.Id == updatedRecipe.Id);
        
        existingRecipe.Update(
            title: updatedRecipe.Title,
            description: updatedRecipe.Description,
            portions: updatedRecipe.Portions,
            timeMinutes: updatedRecipe.TimeMinutes,
            instructions: updatedRecipe.Instructions,
            nutrition: updatedRecipe.Nutrition,
            source: updatedRecipe.Source,
            sourceUrl: updatedRecipe.SourceUrl);

        _db.SaveChanges();
    }

    public void Delete(Guid id)
    {
        var recipe = _db.Recipes.Find(id);
        if (recipe == null) return;

        _db.Recipes.Remove(recipe);
        _db.SaveChanges();
    }
    
    public List<Guid> GetRecipeIds()
    {
        return _db.Recipes
            .Select(r => r.Id)
            .ToList();
    }

    public List<Recipe> GetAll()
    {
        return _db.Recipes
            .AsNoTracking()
            .OrderBy(r => r.Title)
            .Include(r => r.Images)
            .ToList();
    }
}