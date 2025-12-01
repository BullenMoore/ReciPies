using System;
using System.Collections.Generic;

namespace ReciPies.Utilities
{
    public class SystemFunctions
    {
        private readonly Random _random = new();
        private readonly string _recipesPath;

        public SystemFunctions(IHostEnvironment env)
        {
            _recipesPath = Path.Combine(env.ContentRootPath, "Recipes");
        }

        // Remove files that have no values, for example if a recipe is created (directory and content file) but nothing of value is written in it, remove the dir and file on startup
        public void CleanupFiles()
        {
            foreach (var dir in Directory.GetDirectories(_recipesPath))
            {
                // Check if content file has value
                // All values?
            }
        }

        public string GenerateRandomRecipeNumber()
        {
            string id;
            HashSet<string> existingIds = GenerateRecipeHash();
            
            do
            {
                id = _random.Next(10000000, 99999999).ToString();
            }
            while (existingIds.Contains(id));
            
            return id;
        }

        private HashSet<string> GenerateRecipeHash()
        {
            HashSet<string> existingIds = new HashSet<string>();
            foreach (var dir in Directory.GetDirectories(_recipesPath))
            {
                string id = new DirectoryInfo(dir).Name;
                existingIds.Add(id);
            }
            return existingIds;
        }
    }
}