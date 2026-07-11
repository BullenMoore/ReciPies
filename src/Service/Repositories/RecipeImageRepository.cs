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
        var extension = Path.GetExtension(fileName);
        var newFileName = Guid.NewGuid() + extension;
        var filePath = Path.Combine(GetStoragePath(), newFileName);

        File.WriteAllBytes(filePath, fileContent);
        
        return "/images/" + newFileName;
    }
    
    public Guid LinkImage(Guid recipeId, Guid? relationId, string path, bool isMain)
    {
        if (relationId == null) // If relationId is null the relation doesn't exist = create new connection
        {
            _db.RecipeImages.Add(new RecipeImage
            (
                recipeId,
                path,
                isMain
            ));
            _db.SaveChanges();
        }
        else // else update it
        {
            RecipeImage existingRi = _db.RecipeImages
                .FirstOrDefault(ri => ri.Id == relationId);
            if (existingRi.IsMain != isMain) // Check if any meaningful variable has been changed
            {
                existingRi.Update(isMain);
                _db.SaveChanges();
            }
        }
        return _db.RecipeImages
            .First(ri => ri.Path == path)
            .Id;
    }

    public void RemoveUnusedImages(Guid recipeId, List<Guid> imageIdsToKeep)
    {
        // All images
        var imagesToBeRemoved = _db.RecipeImages
            .Where(i => i.RecipeId == recipeId)
            .Select(i => i.Id)
            .ToList();

        // Remove the ones in the form/upload
        foreach (var imageId in imageIdsToKeep)
        {
            if (imageIdsToKeep.Contains(imageId))
            {
                imagesToBeRemoved.Remove(imageId);
            }
        }
        
        // Delete the rest
        foreach (var imageId in imagesToBeRemoved)
        {
            _db.Remove(imageId);
            DeleteImageFile(imageId);
        }
        _db.SaveChanges();
    }
    
    public string GetStoragePath()
    {
        var solutionPath = Path.GetFullPath("..");
        
        var storagePath = Path.Combine(solutionPath, "Service", "Database", "Storage", "images");
        Directory.CreateDirectory(storagePath);
        
        return storagePath;
    }

    public void DeleteImageFile(Guid imageId)
    {
        var imagePath = _db.RecipeImages
            .FirstOrDefault(ri => ri.Id == imageId)
            .Path;
            
        imagePath = Path.Combine(GetStoragePath(), "..", imagePath);
            
        File.Delete(imagePath);
    }
}