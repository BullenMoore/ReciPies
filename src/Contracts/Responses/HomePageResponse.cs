using Contracts.DTOs;
using Core.Tags;

namespace Contracts.Responses;

public class HomePageResponse
{
    public Status Status { get; set; }
    public Content? Content { get; set; }
}

public partial class Content
{
    public List<RecipeCardDto> RecipeCards { get; set; } = new();
    public List<Tag> Tags { get; set; } = new();
}