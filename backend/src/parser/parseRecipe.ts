import {Recipe} from "../model/Recipe.ts";

import {parseSection} from "./parseSection.ts";

//TODO: Fix JSDocs descriptions, currently doesn't grey block variables text and metadataOnly

/**`parseRecipe()` parses a `.cook` file and turns it into a data object for later user.
 * The method can be called to only include the metadata of the recipe to avoid unnecessary parsing of
 * the recipe steps when browsing, searching or filtering recipes.
 *
 * @param text - Path to the `.cook` file to be parsed.
 * @param metadataOnly - Set to `True` if the parser should only return the metadata of the recipe.
 * Useful for when only generic information about the recipe is needed.
 * Should be `False` when the entire recipe is needed (when the steps of the recipe is needed).
 *
 * @returns The recipe object
 */
export function parseRecipe(text: string, metadataOnly: boolean) : Recipe {

    const recipe = new Recipe();

    const startMetadata = text.indexOf("---", 0);
    const endMetadata = text.indexOf("---", startMetadata + 3);

    const metadataText = text.slice(
        startMetadata + 3,
        endMetadata
    );

    // Metadata
    const lines = metadataText.split("\n");

    for (const line of lines) {
        const separator = line.indexOf(":");

        if (separator === -1) {
            continue;
        }

        const key = line.slice(0, separator).trim();
        const value = line.slice(separator + 1).trim();

        // Singular keys
        if (key === "title") recipe.title = value;
        if (key === "description" || key === "introduction") recipe.description = value;
        if (key === "category" || key === "course") recipe.category = value;
        if (key === "difficulty") recipe.difficulty = value;
        if (key === "image" || key === "picture") recipe.image = value;
        if (key === "servings" || key === "serves") recipe.servings = Number.parseInt(value, 10); //TODO: This needs to be split into amount and unit, because scaling. Or use the time syntax like the recipes
        //TODO: yield?
        if (key === "cuisine") recipe.cuisine = value;
        if (key === "diet") recipe.diet = value;

        // Source key
        if (key === "source.url") recipe.source.url = value;
        if (key === "source.name" || key === "source") recipe.source.name = value;
        if (key === "source.author" || key === "author") recipe.source.author = value;

        // Time key
        if (key === "time.prep" || key === "prep time") recipe.time.prep = value;
        if (key === "time.cook" || key === "cook time") recipe.time.cook = value;
        if (key === "time.required" ||
            key === "time required" ||
            key === "time" ||
            key === "duration"
        ) recipe.time.required = value; //TODO: Cook syntax says that required time should be prep + cook time. Calculation instead?

        // Tags
        if (key === "tags") {
            // Tags are special
        }
    }

    // Section(s)
    if (!metadataOnly) {
        const recipeText = text.slice(endMetadata + 3);
        recipe.sections = parseSection(recipeText); //TODO: We need to know what line number the sections start at, so error handling can be proper
    }
    return recipe
}