import type {
    RecipeElements,
    IngredientElement,
    EquipmentElement,
    TimeElement,
    DegreeElement,
    TextElement} from "../model/RecipeElements.ts";
import {RecipeParseError} from "../model/Errors.ts";

/* The parser uses certain symbols to determine what type of object is being made.
 * They are the following:
 * @ for ingredients
 * # for equipment
 * ~ for time
 * ¤ for degrees
 */

export function parseInline(text: string): RecipeElements[] {

    let position = 0;
    let elements: RecipeElements[] = [];

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
        else if (text[position] === "¤") {
            const {element, nextPosition} = parseDegree(text, position, line);

            elements.push(element);
            position = nextPosition;
        }
        else {
            const {element, nextPosition} = parseText(text, position, /*line*/); // Uncomment "line" if ever needed

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
    let amountStrings = ["", ""]
    let amountIndex = 0;
    let hasRange = false;
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

        if (character === "}" &&
            text[position - 1] === "{" ) { // No amount

            position++;
            return {
                element: {
                    type: "ingredient",
                    name: name
                },
                nextPosition : position
            };
        }

        else if (character === "%") {
            position++;
            break;
        }

        else if (character === "-") {
            position++;
            amountIndex++;
            hasRange = true;
            if (amountIndex > 1) {
                throw new RecipeParseError(
                    `Invalid range in ingredient structure.`,
                    `The ingredient format cannot have more than one range.`,
                    line
                )
            }
        }
        else {
            amountStrings[amountIndex] += character;
            position++;
        }
    }

    const lowerAmount = parseInt(amountStrings[0], 10);
    let upperAmount = parseInt(amountStrings[1], 10);

    if (Number.isNaN(lowerAmount)) {
        throw new RecipeParseError(
            `Invalid amount: ${amountStrings[0]} ${amountStrings[1]}`,
            `The lower amount needs to be a number.`,
            line);
    }

    if (hasRange) {
        if (Number.isNaN(upperAmount)) {
            throw new RecipeParseError(
                `Invalid amount: ${amountString}`,
                `The upper amount needs to be a number.`,
                line);
        }
    }
    else {
        upperAmount = lowerAmount;
    }

    if (text[position] === undefined) { //TODO: Should this work?
        return {
            element: {
                type: "ingredient",
                name: name,
                lowerAmount: lowerAmount,
                upperAmount: upperAmount
            },
            nextPosition : position
        };
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
            lowerAmount: lowerAmount,
            upperAmount: upperAmount,
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
        if (character === "¤") break;

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
                    `Invalid time struture.` , //TODO: Add why?
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
                    `Invalid range in time struture.`, //TODO: Add why?
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

        if ( hours < 0 || hours > 99 ||
            minutes < 0 || minutes > 59 ||
            seconds < 0 || seconds > 59) {
            // Time doesn't make sense
            throw new RecipeParseError(
                `Semantic time error: ${hours}:${minutes}:${seconds}` ,
                "Time needs to be realistic. Minutes and seconds cannot be bigger than 59, hours cannot be bigger than 99 and numbers cannot be negative.",
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

function parseDegree(
    text: string,
    start: number,
    line: number
): {
    element: DegreeElement;
    nextPosition: number;
} {
    let position = start + 2; // To skip the ¤{ symbols

    let degreesString = "";

    while (position < text.length) {
        const character = text[position];

        if (character === "%") {
            position++;
            break;
        }

        if (character === "}") {
            throw new RecipeParseError(
                `Invalid bracket structure: ${degreesString}`,
                "Brackets needs to have degree numbers and a degree unit to be valid.",
                line
            )
        }
        degreesString += character;
        position++;
    }

    const degrees = parseInt(degreesString, 10);

    if (Number.isNaN(degrees)) {
        throw new RecipeParseError(
            `Invalid degrees number: ${degreesString}`,
            "Degrees needs to be a number.",
            line
        )
    }
    const unit = text[position];
    const afterUnit = text[position + 1];

    if (unit.toUpperCase() !== "C" &&
        unit.toUpperCase() !== "F" &&
        unit.toUpperCase() !== "K") { // Kelvin is a joke unit, remove if causes complications

        throw new RecipeParseError(
            `Invalid degree unit: ${unit}`,
            "Degree unit needs to be C (celsius), F (Fahrenheit) or K (Kelvin).",
            line
        )
    }

    if (afterUnit !== "}") {
        throw new RecipeParseError(
            `Invalid degree element structure: ¤{${degreesString}%${unit}${afterUnit}`,
            "Degree structure is invalid. The unit can only be 1 character long and must end with a closing bracket ( } ).",
            line
        )
    }

    position = position + 2; // If everything is fine, move past unit and afterUnit

    return {
        element: {
            type: "degree",
            degrees: degrees,
            unit: unit
        },
        nextPosition: position
    };
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