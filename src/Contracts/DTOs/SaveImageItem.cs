namespace Contracts.DTOs;

public class SaveImageItem
{
    public string FileName { get; set; }
    public byte[] FileContent  { get; set; }
    public string FilePath { get; set; }
}