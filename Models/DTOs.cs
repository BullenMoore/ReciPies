namespace ReciPies.Models;

public class DTOs
{
    public class RecipeCardDto
    {
        public string Id { get; set; } = "";
        public string Title { get; set; } = "";
        public string Description { get; set; } = "";
        public string? ImagePath { get; set; }
    }
    
    public class HomeViewmodel
    {
        public List<RecipeCardDto> RecipeCards { get; set; } = new();
        public List<Tag> Tags { get; set; } = new();
    }

    public class EditRecipeDto
    {
        public Recipe Recipe { get; set; } = new();
        public List<Tag> Tags { get; set; } = new();
    }
}
