namespace Contracts.DTOs;

public class ImageUpload
{
    public string FileName { get; set; } = "";
    public bool IsMain { get; set; }
    public byte[] Content { get; set; } = Array.Empty<byte>();
}