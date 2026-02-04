using Microsoft.EntityFrameworkCore;
using ReciPies.App_Data;
using ReciPies.Models;

namespace ReciPies.Services
{
    public class RecipeService
    {
        private static readonly Random _random = new();
        private static IWebHostEnvironment _webEnv;
        private readonly RecipeDbContext _db;
        
        
        // Save Recipe numbers here to save time?
        private List<string> existingRecipeIds;
        
        public RecipeService(IWebHostEnvironment webEnv, RecipeDbContext db)
        {
            _webEnv = webEnv;
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
            _db.SaveChanges();
        }

        private void SaveRecipeImage(string id, IFormFile file)
        {
            var uploadsRoot = Path.Combine(
                _webEnv.WebRootPath,
                "images"
            );
            
            var fileName = Path.GetRandomFileName() + Path.GetExtension(file.FileName);
            var filePath = Path.Combine(uploadsRoot, fileName);

            // Add image to "/images/"
            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                file.CopyTo(stream);
            }

            // Create link in db
            _db.RecipeImages.Add(new RecipeImage
            {
                RecipeId = id,
                Path = $"/images/{fileName}",
                IsMain = false
            });
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
        public string Create()
        {
            string id = GenerateRecipeNumber();
            
            // Create an empty recipe with that ID
            Recipe recipe = new Recipe();
            recipe.Id = id;
            _db.Recipes.Add(recipe);
            _db.SaveChanges();
            
            return id;
        }
        public void Update(Recipe updatedRecipe, List<string> selectedTagNames, List<IFormFile> Images)
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
            
            // Clears existing ingredients to avoid duplicates and then add them back again
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
            
            // Add images
            
            foreach (var file in Images)
            {
                if (file.Length == 0)
                    continue;

                SaveRecipeImage(updatedRecipe.Id, file);
            }
            _db.SaveChanges();
            RemoveUnusedTags();
        }
        public void Delete(string id)
        {
            var recipe = _db.Recipes.Find(id);
            if (recipe == null) return;

            _db.Recipes.Remove(recipe);
            _db.SaveChanges();
            RemoveUnusedTags();
        }
    }
}