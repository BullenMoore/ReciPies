using Contracts.DTOs;
using Contracts.Responses;
using Core.Recipes;
using Core.Tags;
using Service;

namespace Contracts;

public class RecipeContracts
{

    private readonly RecipeService _service;
    
    public RecipeContracts(RecipeService service)
    {
        _service = service;
    }

    public HomePageResponse GetFrontPageRecipes()
    {
        var allRecipes = _service.GetAllRecipes();

        var RecipeCards = allRecipes.Select(r => new RecipeCardDto
            {
                Id = r.Id,
                Title = r.Title,
                Description = r.Description,
                ImagePath = r.Images?
                    .FirstOrDefault(i => i.IsMain)?.Path,
                TagIds = r.RecipeTags
                    .Select(rt => rt.TagId)
                    .ToList()
            })
            .ToList();

        return new HomePageResponse
        {
            Status = Status.Ok,
            Content = new Content 
            {
                RecipeCards = RecipeCards,
                Tags = _service.GetTags()
            }
        };
    }

    public ViewRecipeResponse GetRecipeViewById(Guid id)
    {
        var recipe = _service.GetRecipeById(id);
        
        if (recipe == null)
        {
            return new ViewRecipeResponse
            {
                Status = Status.NotFound,
                Content = null
            };
        }
        
        return new ViewRecipeResponse
        {
            Status = Status.Ok,
            Content = new Content
            {
                Recipe = recipe
            }
        };
    }

    public EditRecipeResponse GetRecipeEditById(Guid id)
    {
        var recipe = _service.GetRecipeById(id);

        if (recipe == null)
        {
            return new EditRecipeResponse
            {
                Status = Status.NotFound,
                Content = null
            };
        }

        return new EditRecipeResponse
        {
            Status = Status.Ok,
            Content = new Content
            {
                Recipe = recipe
            }
        };
    }

    public CreateRecipeResponse CreateRecipe()
    {
        return new CreateRecipeResponse
        {
            Status = Status.Ok,
            Id = _service.Create()
        };
    }


    public List<Tag> GetTags()
    {
        return _service.GetTags();
    }
}