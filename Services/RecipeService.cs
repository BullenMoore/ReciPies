using System.IO;
using System.Linq;
using System.Text.Json;
using System.Collections.Generic;
using Microsoft.Extensions.Hosting;
using ReciPies.Models;

namespace ReciPies.Services
{
    //TODO: Everytime there is a read/write, use the lock
    public class RecipeService
    {
        private readonly string _recipesPath;
        private readonly string _indexFile;
        private readonly string _tagsFile;

        private static readonly ReaderWriterLockSlim _lock = new();
        
        public RecipeService(IHostEnvironment env)
        {
            _recipesPath = Path.Combine(env.ContentRootPath, "Recipes");
            _indexFile = Path.Combine(_recipesPath, "index.json");
            _tagsFile  = Path.Combine(_recipesPath, "tags.json");
        }

        // Called on startup to generate recipes.json
        public void GenerateRecipeIndex()
        {
            List<Recipe> recipes = new List<Recipe>();
            
            // For each dir in _recipesPath, do a new entry in _indexFile
            foreach (var dir in Directory.GetDirectories(_recipesPath))
            {
                var jsonPath = Path.Combine(dir, "content.json");

                try
                {
                    var content = JsonSerializer.Deserialize<RecipeContent>(File.ReadAllText(jsonPath));
                    if (content != null)
                    {
                        recipes.Add(new Recipe
                        {
                            Id = new DirectoryInfo(dir).Name,
                            Title = content.Title,
                            Description = content.Description,
                            ImagePath = content.ImagePath,
                            Tags = content.Tags
                            
                        });
                    }
                }
                catch
                {
                    // Log errors
                }
            }
            File.WriteAllText(_indexFile, JsonSerializer.Serialize(recipes, new JsonSerializerOptions { WriteIndented = true }));
        }
        public void GenerateTagFile()
        {
            var tags = new HashSet<string>(StringComparer.OrdinalIgnoreCase);

            try
            { 
                var recipes = JsonSerializer.Deserialize<List<Recipe>>(File.ReadAllText(_indexFile));
                if (recipes != null)
                {
                    foreach (var recipe in recipes){
                        if (recipe.Tags != null)
                        {
                            foreach (var tag in recipe.Tags)
                            {
                                if (!string.IsNullOrEmpty(tag))
                                {
                                    tags.Add(tag.Trim());
                                }
                            }
                        }
                    }
                }
            }
            catch
            {
                // Log errors
            }
            // Ensures the file won't be written to while others read/write
            _lock.EnterWriteLock();
            try
            {
                File.WriteAllText(_tagsFile,
                    JsonSerializer.Serialize(tags.OrderBy(t => t).ToList(),
                        new JsonSerializerOptions { WriteIndented = true }));
            }
            finally
            {
                _lock.ExitWriteLock();
            }
        }
        public List<Recipe> LoadIndex()
        {
            // TODO: What if file doesn't exist?
            
            string json;
            _lock.EnterReadLock();
            try
            {
                json = File.ReadAllText(_indexFile);
            }
            finally
            {
                _lock.ExitReadLock();
            }
            return JsonSerializer.Deserialize<List<Recipe>>(json) ?? new List<Recipe>();
        }
        public List<string> LoadTags()
        {
            // TODO: What if file doesn't exist?

            string json;
            _lock.EnterReadLock();
            try
            {
                json = File.ReadAllText(_tagsFile);
            }
            finally
            {
                _lock.ExitReadLock();
            }
            return JsonSerializer.Deserialize<List<string>>(json) ?? new List<string>();
        }
        public RecipeContent? LoadRecipeById(string id)
        {
            var path = Path.Combine(_recipesPath, id, "content.json");
            if (!File.Exists(path)) return null; 
            
            string json;
            _lock.EnterReadLock();
            try
            {
                json = File.ReadAllText(path);
            }
            finally
            {
                _lock.ExitReadLock();
            }
            return JsonSerializer.Deserialize<RecipeContent>(json) ?? new RecipeContent();
        }
        public void NewRecipe(Recipe recipe)
        {
            // Create recipe dir
            var dir = Path.Combine(_recipesPath, recipe.Id);
            Directory.CreateDirectory(dir);

            // Create img dir
            var img = Path.Combine(dir, "img");
            Directory.CreateDirectory(img);

            // content.json is created in SaveRecipe function automatically
            SaveRecipe(recipe);
        }

        public void SaveRecipe(Recipe recipe)
        {
            // Create content.json
            var dir = Path.Combine(_recipesPath, recipe.Id);
            var json = JsonSerializer.Serialize(recipe, new JsonSerializerOptions { WriteIndented = true });
            File.WriteAllText(Path.Combine(dir, "content.json"), json);

            GenerateRecipeIndex(); // update index file
            GenerateTagFile();     // update tag file
        }
    }
}