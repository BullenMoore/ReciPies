using Contracts.DTOs;
using Core.Tags;

namespace Contracts.Requests;

public class HomePageRequest
{
    public List<RecipeCardDto> RecipeCards { get; set; } = new();
    public List<Tag> Tags { get; set; } = new();
}