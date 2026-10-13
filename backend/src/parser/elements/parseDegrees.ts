import type { DegreesElement } from "../../model/RecipeElements.ts";
import { RecipeParseError } from "../../model/Errors.ts";
import { validateNumber } from "../helpers/validateNumber.ts";

export function parseDegrees(
    text: string,
    line: number
): DegreesElement
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

    if (closeBracket === -1) { //TODO: This check is useless as parseLine -> findElementEnd does this.
        throw new RecipeParseError(
            `Missing closing brace: ${text}`,
            `The ingredient is missing "}".`,
            line
        );
    }

    const percentIndex = text.indexOf("%");
    if (percentIndex === -1) {
        throw new RecipeParseError(
            `Invalid degrees structure: ${text}`,
            `The structure is missing "%".`,
            line
        )
    }
    const degreesStart = openBracket + 1;
    const degreesEnd = percentIndex;
    const unitStart = percentIndex + 1;
    const unitEnd = closeBracket;

    const degrees = parseDegreesSection(text.slice(degreesStart, degreesEnd), line);
    const unit = parseUnit(text.slice(unitStart, unitEnd), line);

    if (unit.length > 1) {
        throw new RecipeParseError(
            `Invalid unit length: ${unit}`,
            `The unit can only be 1 character long.`,
            line
        )
    }

    if (unit.toUpperCase() !== "C" &&
        unit.toUpperCase() !== "F" &&
        unit.toUpperCase() !== "K") { // Kelvin is a joke unit, remove if causes complications

        throw new RecipeParseError(
            `Invalid degree unit: ${unit}`,
            "Degree unit needs to be C (celsius), F (Fahrenheit) or K (Kelvin).",
            line
        )
    }

    return {
        type: "degrees",
        degrees,
        unit
    };
}

function parseDegreesSection(degrees: string, line: number):
    number {

    return validateNumber(degrees, line);
}

function parseUnit(unit: string, line: number):
    string {

    unit = unit.trim()

    if (unit === "") {
        throw new RecipeParseError(
            `Missing unit name.`,
            `An unit cannot be empty.`,
            line
        );
    }

    return unit;
}
