using Core.Tags;
using Microsoft.EntityFrameworkCore;
using Service.Database;

namespace Service.Repositories;

public class TagRepository : ITagRepository
{
    private readonly ServiceDbContext _db; 
    
    public TagRepository(ServiceDbContext db)
    {
        _db = db;
    }
    public List<Tag> GetTags()
    {
        return _db.Tags
            .AsNoTracking()
            .OrderBy(t => t.Name)
            .ToList();
    }
    
    public void RemoveUnusedTags()
    {
        List<Tag> unusedTags = _db.Tags
            .Where(t => !t.RecipeTags.Any())
            .ToList();

        if (unusedTags.Count == 0) return;

        _db.Tags.RemoveRange(unusedTags);
        _db.SaveChanges();
    }
}