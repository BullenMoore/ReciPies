using Core.RecipeImages;
using Core.RecipeIngredients;
using Core.Recipes;
using Core.RecipeTags;
using Contracts.DTOs;
using Core.Tags;

namespace Service;

public class RecipeService
{
    private readonly IRecipeRepository _recipeRepository;
    private readonly IRecipeImageRepository _recipeImageRepository;
    private readonly IRecipeIngredientRepository _recipeIngredientRepository;
    private readonly IRecipeTagRepository _recipeTagRepository;
    private readonly ITagRepository _tagRepository;

    public RecipeService(
        IRecipeRepository recipeRepository,
        IRecipeImageRepository recipeImageRepository,
        IRecipeIngredientRepository recipeIngredientRepository,
        IRecipeTagRepository recipeTagRepository,
        ITagRepository tagRepository)
    {
        _recipeRepository = recipeRepository;
        _recipeImageRepository = recipeImageRepository;
        _recipeIngredientRepository = recipeIngredientRepository;
        _recipeTagRepository = recipeTagRepository;
        _tagRepository = tagRepository;
    }
    
    public List<Guid> GetRecipeIds() // Isn't used
    {
        return _recipeRepository.GetRecipeIds();
    }
    public List<RecipeCardDto> GetFrontPageRecipes() // Should this return a contract object? How does that affect other presentations?
    {
        var recipes = _recipeRepository.GetAll();

        return recipes.Select(r => new RecipeCardDto
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
    }

    public Recipe? GetRecipeById(Guid id)
    {
        return _recipeRepository.GetRecipeById(id);
    }

    public Guid Create()
    {
        return _recipeRepository.Create();
    }

    public string SaveNewImageToStorage(string fileName, byte[] fileContent)
    {
        return _recipeImageRepository.SaveImage(fileName, fileContent);
    }

    public void Update(Recipe updatedRecipe, List<string> selectedTagNames, List<ImageUpload> images)
    {
        _recipeRepository.Update(updatedRecipe);

        _recipeIngredientRepository.Update(updatedRecipe);

        _recipeTagRepository.Update(updatedRecipe.Id, selectedTagNames);
        
        var imagesToKeep = new List<Guid>();
        foreach (var file in images)
        {
            // Links image to recipe in db
            var imageId = _recipeImageRepository.LinkImage(updatedRecipe.Id, file.RelationId, file.Path, file.IsMain);
            imagesToKeep.Add(imageId);
        }
        _tagRepository.RemoveUnusedTags();
        _recipeImageRepository.RemoveUnusedImages(updatedRecipe.Id, imagesToKeep);
    }

    public void Delete(Guid id)
    {
        _recipeRepository.Delete(id);
        _tagRepository.RemoveUnusedTags();
    }
    
    public List<Tag> GetTags()
    {
        return _tagRepository.GetTags();
    }
}


