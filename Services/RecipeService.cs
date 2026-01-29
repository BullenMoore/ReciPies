using Microsoft.EntityFrameworkCore;
using ReciPies.App_Data;
using ReciPies.Models;

namespace ReciPies.Services
{
    public class RecipeService
    {
        private static readonly Random _random = new();
        private readonly RecipeDbContext _db;
        
        // Save Recipe numbers here to save time?
        private List<string> existingRecipeIds;
        
        public RecipeService(IHostEnvironment env, RecipeDbContext db)
        {
            _db = db;
            existingRecipeIds = GetRecipeIds();
        }
        
        private string GenerateRecipeNumber()
        {
            string id;

            do
            {
                id = _random.Next(10000000, 99999999).ToString();
            }
            while (existingRecipeIds.Contains(id));
            
            existingRecipeIds.Add(id);
            return id;
        }

        private void RemoveUnusedTags()
        {
            List<Tag> unusedTags = _db.Tags
                .Where(t => !t.RecipeTags.Any())
                .ToList();

            if (unusedTags.Count == 0) return;

            _db.Tags.RemoveRange(unusedTags);
            // Remember to save to db after calling this function
        }

        private List<string> GetRecipeIds()
        {
            return _db.Recipes
                .Select(r => r.Id)
                .ToList();
        }

        public List<DTOs.RecipeCardDto> GetFrontPageRecipes()
        {
            return _db.Recipes
                .AsNoTracking()
                .Select(r => new DTOs.RecipeCardDto
                {
                    Id = r.Id,
                    Title = r.Title,
                    Description = r.Description,
                    ImagePath = r.Images
                        .Where(i => i.IsMain)
                        .Select(i => i.Path)
                        .FirstOrDefault()
                })
                .OrderBy(r => r.Title)
                .ToList();
        }
        public List<Tag> GetTags()
        {
            return _db.Tags
                .AsNoTracking()
                .OrderBy(t => t.Name)
                .ToList();
        }
        public Recipe? GetById(string id)
        {
            return _db.Recipes
                .Include(r => r.Images)
                .Include(r => r.Ingredients)
                .Include(r => r.RecipeTags)
                .ThenInclude(rt => rt.Tag)
                .FirstOrDefault(r => r.Id == id);
        }
        public string Create()
        {
            // Generate an ID
            string id = GenerateRecipeNumber();
            
            // Create an empty recipe with that ID
            Recipe recipe = new Recipe();
            recipe.Id = id;
            _db.Recipes.Add(recipe);
            _db.SaveChanges();
            
            return id;
        }
        public void Update(Recipe updatedRecipe, List<string> selectedTagNames)
        {
            var existingRecipe = _db.Recipes
                .Include(r => r.Ingredients)
                .Include(r => r.Images)
                .Include(r => r.RecipeTags)
                .First(r => r.Id == updatedRecipe.Id);
            
            // Update scalar properties
            existingRecipe.Title = updatedRecipe.Title;
            existingRecipe.Description = updatedRecipe.Description;
            existingRecipe.TimeMinutes = updatedRecipe.TimeMinutes;
            existingRecipe.Portions = updatedRecipe.Portions;
            existingRecipe.Source = updatedRecipe.Source;
            existingRecipe.SourceUrl = updatedRecipe.SourceUrl;
            existingRecipe.Instructions = updatedRecipe.Instructions;
            existingRecipe.Nutrition = updatedRecipe.Nutrition;
            
            // Clears existing ingredients to avoid duplicates and add them back again
            existingRecipe.Ingredients.Clear();

            foreach (var ingredient in updatedRecipe.Ingredients)
            {
                existingRecipe.Ingredients.Add(new Ingredient
                {
                    Name = ingredient.Name,
                    Amount = ingredient.Amount,
                    Unit = ingredient.Unit
                });
            }
            // Remove existing tag links
            existingRecipe.RecipeTags.Clear();

            // Add selected tags back
            foreach (var tagName in selectedTagNames)
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

            //RemoveUnusedTags(); // Not tested properly
            _db.SaveChanges();
        }
        public void Delete(string id)
        {
            var recipe = _db.Recipes.Find(id);
            if (recipe == null) return;

            _db.Recipes.Remove(recipe);
            RemoveUnusedTags();
            _db.SaveChanges();
        }
    }
}