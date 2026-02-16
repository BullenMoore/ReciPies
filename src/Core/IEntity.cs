namespace Core;

public interface IEntity
{
    Guid Id { get; set; }
    DateTimeOffset UpdatedAt { get; set; }
    DateTimeOffset CreatedAt { get; set; }
}