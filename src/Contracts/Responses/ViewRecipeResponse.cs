using Core.Recipes;
using Markdig;

namespace Contracts.Responses;

public class ViewRecipeResponse
{
    public Status Status { get; set; }
    public Content? Content { get; set; }
}

public partial class Content {

    public Recipe Recipe { get; set; }
    public string InstructionsHtml => Markdown.ToHtml(Recipe.Instructions ?? "", MarkdownPipeline);
        
    private static readonly MarkdownPipeline MarkdownPipeline =
        new MarkdownPipelineBuilder()
            .DisableHtml()
            .Build();
}