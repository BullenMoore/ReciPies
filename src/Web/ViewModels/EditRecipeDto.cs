using Core.Recipes;
using Core.Tags;

namespace Web.ViewModels;

public class EditRecipeDto
{
    public Recipe Recipe { get; set; }
    public List<Tag> AllTags { get; set; } = new();
    public List<string> SelectedTagNames { get; set; } = new();

    public List<ImageEditItem> Images { get; set; } = new();

    public List<IFormFile> NewImages { get; set; } = new();

    public List<string> NewImageClientIds { get; set; } = new();

}

public class ImageEditItem
{
    public Guid? Id { get; set; } // Guid for new images is null
    public string Path { get; set; } = "";
    public bool IsMain { get; set; }
    public string? ClientId { get; set; }
}