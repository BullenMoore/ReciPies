import type { RecipeElements, TextElement } from "../model/RecipeElements.ts";
import { RecipeParseError } from "../model/Errors.ts";
import { parseIngredient } from "./elements/parseIngredient.ts";
import { parseEquipment } from "./elements/parseEquipment.ts";
import { parseTime } from "./elements/parseTime.ts";
import { parseDegrees } from "./elements/parseDegrees.ts";

/* The parser uses certain symbols to determine what type of object is being made.
 * They are the following:
 * @ for ingredients
 * # for equipment
 * ~ for time
 * ¤ for degrees
 */

export function parseLine(text: string, line: number): RecipeElements[] {

    let position = 0;
    let elements: RecipeElements[] = [];

    while (position < text.length) {

        if (text[position] === "@") {

            const end = findElementEnd(text, position, line);
            const element = parseIngredient(text.slice(position, end), line);

            elements.push(element);
            position = end;
        }
        else if (text[position] === "#") {

            const end = findElementEnd(text, position, line);
            const element  = parseEquipment(text.slice(position, end), line);

            elements.push(element);
            position = end;
        }
        else if (text[position] === "~") {

            const end = findElementEnd(text, position, line);
            const element = parseTime(text.slice(position, end), line);

            elements.push(element);
            position = end;
        }
        else if (text[position] === "¤") {

            const end = findElementEnd(text, position, line);
            const element = parseDegrees(text.slice(position, end), line);

            elements.push(element);
            position = end;
        }
        else {
            const {element, nextPosition} = parseText(text, position /*, line*/); // Uncomment "line" if ever needed

            elements.push(element);
            position = nextPosition;
        }
    }
    return elements;
}

function parseText(
    text: string,
    start: number
): {
    element: TextElement;
    nextPosition: number;
} {
    let buffer = "";
    let position = start;

    while (position < text.length) {
        const character = text[position];

        if (
            character === "@" ||
            character === "#" ||
            character === "~" ||
            character === "¤"
        ) {
            break;
        }
        buffer += character;
        position++;
    }

    return {
        element: {
            type: "text",
            value: buffer
        },
        nextPosition : position
    };
}

function findElementEnd (text:string, position: number, line: number): number {

    const end = text.indexOf("}", position);

    if (end === -1) {
        throw new RecipeParseError(
            `Missing closing brace: ${text}`,
            `The ingredient is missing "}".`,
            line
        );
    }

    return end + 1;
}