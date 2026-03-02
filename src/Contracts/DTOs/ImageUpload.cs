namespace Contracts.DTOs;

public class ImageUpload
{
    public Guid? RelationId { get; set; }
    
    public string Path { get; set; } = "";
    public bool IsMain { get; set; }
}