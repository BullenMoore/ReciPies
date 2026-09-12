import type {RecipeElement} from "../model/RecipeElement";
import type {TextElement} from "../model/TextElement.ts";
import type {IngredientElement} from "../model/IngredientElement.ts";
import type {EquipmentElement} from "../model/EquipmentElement.ts";
import type {TimeElement} from "../model/TimeElement.ts";
import {RecipeParseError} from "../model/Error";

export function parseInline(text: string): RecipeElement[] {

    let position = 0;
    let elements: RecipeElement[] = [];

    while (position < text.length) {

        if (text[position] === "@") {
            const {element, nextPosition} = parseIngredient(text, position);

            elements.push(element);
            position = nextPosition;

        } else if (text[position] === "#") {
            const {element, nextPosition} = parseEquipment(text, position);

            elements.push(element);
            position = nextPosition;
        }
        else if (text[position] === "~") {
            const {element, nextPosition} = parseTime(text, position);

            elements.push(element);
            position = nextPosition;
        }
        else {
            const {element, nextPosition} = parseText(text, position);

            elements.push(element);
            position = nextPosition;
        }
    }
    return elements;
}

function parseIngredient(
    text: string,
    start: number
): {
    element: IngredientElement;
    nextPosition: number;
} {
    let position = start + 1; // To skip the @ symbol

    let name = "";
    let amountString = "";
    let unit = "";

    // Ingredient name
    while (position < text.length) {
        const character = text[position];

        if (character === "{") {
            position++;
            break;
        }

        name += character;
        position++;
    }

    // Ingredient amount
    while (position < text.length) {
        const character = text[position];

        if (character === "}") { // No amount

            position++;
            return {
                element: {
                    type: "ingredient",
                    name: name
                },
                nextPosition : position
            };
        }

        if (character === "%") {
            position++;
            break;
        }

        amountString += character;
        position++;
    }

    const amount = parseInt(amountString, 10);

    if (Number.isNaN(amount)) {
        throw new RecipeParseError(
            `Invalid amount: ${amountString}`,
            `The amount needs to be a number to not break scaling.`,
            12);
    }

    // Ingredient unit
    while (position < text.length) {
        const character = text[position];

        if (character === "}") {
            position++;
            break;
        }

        unit += character;
        position++;
    }

    //TODO: Should it error if the unit is an unrecognizeable one? Warning maybe?

    return {
        element: {
            type: "ingredient",
            name: name,
            amount: amount,
            unit: unit
        },
        nextPosition : position
    };
}

function parseEquipment(
    text: string,
    start: number
): {
    element: EquipmentElement;
    nextPosition: number;
} {
    let position = start + 1; // To skip the # symbol
    let lookahead = position;
    let name = "";
    let isBracket = false;

    while (lookahead < text.length) {
        const character = text[lookahead];

        if (character === "{") {
            isBracket = true
            break;
        }
        if (character === "@") break;
        if (character === "#") break;
        if (character === "~") break;

        lookahead++;
    }

    while (position < text.length) {
        const character = text[position];

        if (character === "{" && isBracket) {
            position++;
            if (text[position] !== "}") {
                throw new RecipeParseError(
                    `Invalid formatting for equipment.` ,
                    `When using brackets for equipment the brackets cannot feature any symbol inside them. Only acceptable variant is "the equipment{}".`,
                    2
                )
            }
            position++; // Double jump since equipment is written as nameOfThing{}
            break;
        }

        if (character === " " && !isBracket) {
            break;
        }

        name += character;
        position++;
    }

    return {
        element: {
            type: "equipment",
            name: name
        },
        nextPosition : position
    };
}

function parseTime(
    text: string,
    start: number
): {
    element: TimeElement;
    nextPosition: number;
} {
    let position = start + 2; // To skip the ~{ symbols
    let hoursString = "";
    let minutesString = "";
    let secondsString = "";
    let unit = "";

    // Hours
    while (position < text.length) {
        const character = text[position];

        if (character === ":") {
            position++;
            break;
        }
        hoursString += character;
        position++;
    }
    let hours = parseInt(hoursString, 10);

    if (Number.isNaN(hours)) {
        throw new RecipeParseError(
            `Invalid number format for hours: ${hoursString}`,
            "Hours needs to be a number.",
            12)
    }

    hours = hours * 60 * 60;

    // If the time element is done by hours, return early
    if (text[position] === "}") {
        position++;
        return
    }

    // Time unit
    while (position < text.length) {
        const character = text[position];

        if (character === "}") {
            position++;
            break;
        }
        unit += character;
        position++;
    }

    return {
        element: {
            type: "time",
            amount: amount,
            unit: unit
        },
        nextPosition: position
    };
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
            character === "~"
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