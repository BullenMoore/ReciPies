using System.Collections.Generic;

namespace ReciPies.Models
{
    public class Recipe
    {
        public string Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string ImagePath { get; set; } = string.Empty;
        public List<string> Tags { get; set; } = new();
    }
    public class Ingredient
    {
        public string Name { get; set; } = string.Empty;
        public double Amount { get; set; }
        public string Unit { get; set; } = string.Empty;
    }
    public class RecipeContent : Recipe
    {
        public int Portions { get; set; }
        public int Time { get; set; }
        public string Source {  get; set; } = string.Empty;
        public string SourceURL { get; set; } = string.Empty;
        public List<Ingredient> Ingredients { get; set; } = new();
        public string Instructions { get; set; } = string.Empty;
        public string Nutrition { get; set; } = string.Empty;
    }
}