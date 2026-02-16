namespace Core.RecipeImages;

public interface IRecipeImageRepository
{
    string SaveImage(string fileName, byte[] fileContent);

    void LinkImage(Guid recipeId, string path, bool isMain);
}