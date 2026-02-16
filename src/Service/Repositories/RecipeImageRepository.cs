using Contracts.DTOs;
using Core.RecipeImages;
using Service.Database;

namespace Service.Repositories;

public class RecipeImageRepository : IRecipeImageRepository
{
    private readonly ServiceDbContext _db;

    public RecipeImageRepository(ServiceDbContext db)
    {
        _db = db;
    }

    public string SaveImage(string fileName, byte[] fileContent)
    {
        var solutionRoot = Path.GetFullPath("..");
        
        var storageRoot = Path.Combine(solutionRoot, "Service", "Database", "Storage", "Images");
        Directory.CreateDirectory(storageRoot);

        var extension = Path.GetExtension(fileName);
        var newFileName = Guid.NewGuid() + extension;
        var filePath = Path.Combine(storageRoot, newFileName);

        File.WriteAllBytes(filePath, fileContent);
        
        return "/images/" + newFileName;
    }
    
    public void LinkImage(Guid recipeId, string path, bool isMain)
    {
        _db.RecipeImages.Add(new RecipeImage
        {
            RecipeId = recipeId,
            Path = path,
            IsMain = isMain
        });
        _db.SaveChanges();
    }
}