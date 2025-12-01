namespace ReciPies.Models.ViewModels;

public class IndexViewModel
{
    public List<Recipe> Recipes { get; set; } = new();
    public List<string> Tags { get; set; } = new();
}