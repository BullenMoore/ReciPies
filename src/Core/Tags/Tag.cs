using Core.RecipeTags;

namespace Core.Tags;

public class Tag : IEntity
{
    public Tag(string name)
    {
        Id = Guid.NewGuid();
        UpdatedAt = DateTimeOffset.UtcNow;
        CreatedAt = DateTimeOffset.UtcNow;

        Name = name;
    }
    
    public Guid Id { get; set; }
    public DateTimeOffset UpdatedAt { get; set; }
    public DateTimeOffset CreatedAt { get; set; }
    
    public string Name { get; set; }
    public IEnumerable<RecipeTag>? RecipeTags { get; set; }
    
    // Can or should tags be able to be updated? Mistypes?
    public void Update(string newName)
    {
        Name = newName;
        UpdatedAt = DateTimeOffset.UtcNow;
    }
}