namespace Core.RecipeTags;

public interface IRecipeTagRepository
{
    void Update(Guid recipeId, List<string> selectedRecipeTags);
}