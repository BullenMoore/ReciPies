using Core.Recipes;
using Core.Tags;

namespace Web.ViewModels;

public class EditRecipeDto
{
    public Recipe Recipe { get; set; }
    public List<Tag> AllTags { get; set; } = new();
    public List<string> SelectedTagNames { get; set; } = new();
    public List<IFormFile> Images { get; set; } = new();
}