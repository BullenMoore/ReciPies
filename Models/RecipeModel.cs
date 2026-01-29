using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace ReciPies.Models
{
    public class Recipe
    {
        public string Id { get; set; } = default!;
        public string? Title { get; set; } = "";
        public string? Description { get; set; } = "";

        public int? Portions { get; set; }
        public int? TimeMinutes { get; set; }

        public string? Instructions { get; set; } = "";
        public string? Nutrition { get; set; } = "";

        public string? Source { get; set; } = "";
        public string? SourceUrl { get; set; } = "";

        public List<Ingredient>? Ingredients { get; set; } = new();
        public List<RecipeImage>? Images { get; set; } = new();
        public List<RecipeTag>? RecipeTags { get; set; } = new();
    }
    public class Ingredient
    {
        public int Id { get; set; }
        public string RecipeId { get; set; } = default!;
        
        //[Required(ErrorMessage = "Ingredient name is required")]
        public string Name { get; set; } = ""; 
        public double Amount { get; set; } // Make nullable
        public string Unit { get; set; } = ""; // Make nullable

        public Recipe Recipe { get; set; } = default!;
    }
    public class RecipeImage
    {
        public int Id { get; set; }
        public string RecipeId { get; set; } = default!;
        public string Path { get; set; } = "";
        public bool IsMain { get; set; }

        public Recipe Recipe { get; set; } = default!;
    }
    public class Tag
    {
        public int Id { get; set; }
        public string Name { get; set; } = "";

        public ICollection<RecipeTag> RecipeTags { get; set; } = new List<RecipeTag>();
    }
    public class RecipeTag
    {
        public string RecipeId { get; set; } = default!;
        public int TagId { get; set; }

        public Recipe Recipe { get; set; } = default!;
        public Tag Tag { get; set; } = default!;
    }
}