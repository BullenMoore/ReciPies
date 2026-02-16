namespace Contracts.DTOs;

public class RecipeCardDto
{
    public Guid Id { get; set; }
    public string? Title { get; set; } = "";
    public string? Description { get; set; } = "";
    public string? ImagePath { get; set; }
}