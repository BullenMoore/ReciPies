namespace Core.Recipes;

public interface IRecipeRepository
{
    Recipe? GetRecipeById(Guid id);
    
    Guid Create();

    void Update(Recipe updatedRecipe);

    void Delete(Guid id);
    
    List<Guid> GetRecipeIds();

    List<Recipe> GetAll();

}