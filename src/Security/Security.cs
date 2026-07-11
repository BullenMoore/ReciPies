using Contracts;
using Core.Recipes;
using Contracts.DTOs;
using Contracts.Responses;

namespace Security;

public class RecipeSecurity
{
    
    private readonly RecipeContracts _contracts;
    
    private bool haveAccess = false; // Placeholder
    
    public RecipeSecurity(RecipeContracts contracts)
    {
        _contracts = contracts;
        // Link to a user database
    }
    
    /* All calls from Controller should go through here to Contracts
     * Only certain calls needs admin access, adjust methods accordingly      
     */

    public HomePageResponse GetIndexContent()
    {
        return _contracts.GetFrontPageRecipes();
    }

    public ViewRecipeResponse GetRecipeViewById(Guid id)
    {
        return _contracts.GetRecipeViewById(id);
    }

    public EditRecipeResponse GetRecipeEditById(Guid id) // Needs admin access
    {
        if (!haveAccess)
        {
            return new EditRecipeResponse
            {
                Status = Status.Forbidden,
                Content = null
            };
        }
        
        return _contracts.GetRecipeEditById(id);
    }

    public CreateRecipeResponse CreateRecipe() // Needs admin
    {
        if (!haveAccess)
        {
            return new CreateRecipeResponse
            {
                Status = Status.Forbidden,
                Id = null
            };
        }

        return _contracts.CreateRecipe();
    }

    public string SaveNewImageToStorage(string fileName, byte[] fileContent) // Needs admin
    {
        
    }

    public Status UpdateRecipe(Recipe updatedRecipe, List<string> selectedTagNames, List<ImageUpload> images) // Needs admin
    {
        if (!haveAccess)
        {
            return Status.Forbidden;
        }
        
        // Do stuff here

        return Status.Ok;
    }

    public Status DeleteRecipe(Guid id) // Needs admin
    {
        if (!haveAccess)
        {
            return Status.Forbidden;
        }
        
        // Do stuff here

        return Status.Ok;
    }
}