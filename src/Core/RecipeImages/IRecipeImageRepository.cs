namespace Core.RecipeImages;

public interface IRecipeImageRepository
{
    string SaveImage(string fileName, byte[] fileContent);

    Guid LinkImage(Guid recipeId, Guid? relationId, string path, bool isMain);

    void RemoveUnusedImages(Guid recipeId, List<Guid> imageIdsToKeep);
}