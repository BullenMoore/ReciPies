export class RecipeParseError extends Error {
    public readonly line: number;
    public readonly description: string;

    constructor(
        message: string,
        description: string,
        line: number
    ) {
        super(message);
        this.description = description;
        this.line = line;
        this.name = "RecipeParseError";
    }
}