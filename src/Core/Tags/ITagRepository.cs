namespace Core.Tags;

public interface ITagRepository
{
    public List<Tag> GetTags();

    void RemoveUnusedTags();
}