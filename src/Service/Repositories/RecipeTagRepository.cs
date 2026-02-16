using Core.RecipeTags;
using Core.Tags;
using Microsoft.EntityFrameworkCore;
using Service.Database;

namespace Service.Repositories;

public class RecipeTagRepository : IRecipeTagRepository
{
    private readonly ServiceDbContext _db;

    public RecipeTagRepository(ServiceDbContext db)
    {
        _db = db;
    }
    
    public void Update(Guid recipeId, List<string> selectedRecipeTags)
    {
        var existingRecipe = _db.Recipes
            .Include(r => r.RecipeTags)
            .First(r => r.Id == recipeId);
        
        existingRecipe.RecipeTags.Clear();

        // Add selected tags back
        foreach (var tagName in selectedRecipeTags)
        {
            var tag = _db.Tags.FirstOrDefault(t => t.Name == tagName);

            if (tag == null)
            {
                tag = new Tag { Name = tagName };
                _db.Tags.Add(tag);
            }

            existingRecipe.RecipeTags.Add(new RecipeTag
            {
                Recipe = existingRecipe,
                Tag = tag
            });
        }
        _db.SaveChanges();
    }
}