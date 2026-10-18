import type { EquipmentElement } from "../../model/RecipeElements.ts";
import { RecipeParseError } from "../../model/Errors.ts";

export function parseEquipment(
    text: string,
    line: number
): EquipmentElement
{

    const openBracket = text.indexOf("{");
    const closeBracket = text.indexOf("}");

    if (openBracket === -1) {
        throw new RecipeParseError(
            `Missing opening brace: ${text}`,
            `The ingredient is missing "{".`,
            line
        );
    }

    if (closeBracket === -1) { //TODO: This check my useless as parseLine -> findElementEnd does this.
        throw new RecipeParseError(
            `Missing closing brace: ${text}`,
            `The ingredient is missing "}".`,
            line
        );
    }

    const nameStart = 1;
    const nameEnd = openBracket;

    const name = parseName(text.slice(nameStart, nameEnd), line);
    const insideBrackets = text.slice(openBracket + 1, closeBracket );

    if (insideBrackets !== "") {
        throw new RecipeParseError(
            `Invalid bracket structure: ${text}`,
            `Equipment cannot feature anything inside its brackets.`,
            line
        )
    }

    return {
        type: "equipment",
        name
    };
}

function parseName(name: string, line: number):
    string {

    name = name.trim()

    if (!name) {
        throw new RecipeParseError(
            `Missing equipment name.`,
            `Equipment needs a name.`,
            line
        );
    }

    return name;
}
