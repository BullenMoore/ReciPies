using Core.Recipes;
using Markdig;

namespace Contracts.Requests;

public class RecipeViewRequest
{
    public Recipe Recipe { get; set; } = null!;
    public string InstructionsHtml => Markdown.ToHtml(Recipe.Instructions ?? "", MarkdownPipeline);
        
    private static readonly MarkdownPipeline MarkdownPipeline =
        new MarkdownPipelineBuilder()
            .DisableHtml()
            .Build();
}