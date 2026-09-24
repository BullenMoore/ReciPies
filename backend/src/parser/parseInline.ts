import type {RecipeElement} from "../model/RecipeElement";
import type {TextElement} from "../model/TextElement.ts";
import type {IngredientElement} from "../model/IngredientElement.ts";
import type {EquipmentElement} from "../model/EquipmentElement.ts";
import type {TimeElement} from "../model/TimeElement.ts";
import {RecipeParseError} from "../model/Error";

export function parseInline(text: string): RecipeElement[] {

    let position = 0;
    let elements: RecipeElement[] = [];

    const line = 0

    while (position < text.length) {

        if (text[position] === "@") {
            const {element, nextPosition} = parseIngredient(text, position, line);

            elements.push(element);
            position = nextPosition;

        } else if (text[position] === "#") {
            const {element, nextPosition} = parseEquipment(text, position, line);

            elements.push(element);
            position = nextPosition;
        }
        else if (text[position] === "~") {
            const {element, nextPosition} = parseTime(text, position, line);

            elements.push(element);
            position = nextPosition;
        }
        else {
            const {element, nextPosition} = parseText(text, position, /*line*/);

            elements.push(element);
            position = nextPosition;
        }
    }
    return elements;
}

function parseIngredient(
    text: string,
    start: number,
    line: number
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
            `The amount needs to be a number.`,
            line);
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
    start: number,
    line: number
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
                    line
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
    start: number,
    line: number
): {
    element: TimeElement;
    nextPosition: number;
} {
    let position = start + 2; // To skip the ~{ symbols

    const timeArray: string[][] = [["", "", ""],["", "", ""]] // hours, minutes, seconds, then ranged time
    let timeArrayPosition = 0
    let rangedTimeArrayPosition = 0

    while (position < text.length) {
        const character = text[position];

        if (character === "}") {
            position++;
            break;

        }

        else if (character === ":") {
            position++;
            timeArrayPosition++

            if (timeArrayPosition > 2) {
                throw new RecipeParseError(
                    `Invalid time struture.` ,
                    "The time format cannot be longer than HH:MM:SS.",
                    line
                )
            }
        }

        else if (character === "-") {
            position++;
            rangedTimeArrayPosition++
            timeArrayPosition = 0;
            if (rangedTimeArrayPosition > 1) {
                throw new RecipeParseError(
                    `Invalid range in time struture.`,
                    "The time format cannot have more than one range.",
                    line)
            }
        }
        else {
            timeArray[rangedTimeArrayPosition][timeArrayPosition] += character;
            position++;
        }
    }

    const isAllNumbers = timeArray
        .flat()
        .every(element => !Number.isNaN(Number(element)));

    if (!isAllNumbers) {
        throw new RecipeParseError(
            `Invalid time format: ${timeArray[0].join(":").toString()}-${timeArray[1].join(":").toString()} `,
            "Time needs to be in numbers.",
            line
            )
    }

    const properTimeArray: number[][] = [[0, 0, 0],[0, 0, 0]]

    for (let i = 0; i < 2; i++) {
        const [hours, minutes, seconds] = timeArray[i].map(Number);

        if ( hours < 0 || hours > 100 ||
            minutes < 0 || minutes > 60 ||
            seconds < 0 || seconds > 60) {
            // Time doesn't make sense
            throw new RecipeParseError(
                `Semantic time error: ${hours}:${minutes}:${seconds}` ,
                "Time needs to be realistic. Minutes and seconds cannot be bigger than 59, hours cannot be bigger than 99 and numbers cannot be negative",
                line
            )
        }
        properTimeArray[i][0] = hours;
        properTimeArray[i][1] = minutes;
        properTimeArray[i][2] = seconds
    }

    if (properTimeArray[1][0] == 0 &&
        properTimeArray[1][1] == 0 &&
        properTimeArray[1][2] == 0){

        properTimeArray[1][0] = properTimeArray[0][0];
        properTimeArray[1][1] = properTimeArray[0][1];
        properTimeArray[1][2] = properTimeArray[0][2];
    }

    return {
        element: {
            type: "time",
            minSeconds: properTimeArray[0][0] * 60 * 60 + properTimeArray[0][1] * 60 + properTimeArray[0][2],
            maxSeconds: properTimeArray[1][0] * 60 * 60 + properTimeArray[1][1] * 60 + properTimeArray[1][2]
        },
        nextPosition: position
    }
}

function parseText(
    text: string,
    start: number,
    //line: number
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