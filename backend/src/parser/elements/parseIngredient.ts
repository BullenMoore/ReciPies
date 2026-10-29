import type { IngredientElement } from "../../model/RecipeElements.ts";
import { RecipeParseError } from "../../model/Errors.ts";
import { validateNumber } from "../helpers/validateNumber.ts";

export function parseIngredient(
    text: string,
    line: number
): IngredientElement
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

    let nameStart = 1;
    const nameEnd = openBracket;
    const percentIndex = text.indexOf("%");
    let swapStart = text.indexOf("[");

    let swapEnd;
    let amountStart;
    let amountEnd;
    let unitStart;
    let unitEnd;

    // Check if there is a unit present, set indexes accordingly
    if (percentIndex !== -1) {
        amountStart = openBracket + 1;
        amountEnd = percentIndex;
        unitStart = percentIndex + 1;
        unitEnd = closeBracket;
    }
    else {
        amountStart = openBracket + 1;
        amountEnd = closeBracket;
        unitStart = 0;
        unitEnd = 0; // Doesn't matter what the number is, they just need to be the same
    }

    // Check if the ingredient has a swappable trait, set indexes accordingly
     if (swapStart !== -1) {
         swapEnd = text.indexOf("]")
         if (swapEnd === -1) {
             throw new RecipeParseError(
                 `Invalid swap structure.`,
                 `The structure for a swappable ingredient needs a closing "]"`,
                 line
             );
         }
         swapStart++;
         nameStart = swapEnd + 1;
     }
     else {
         swapStart = 0;
         swapEnd = 0; // Doesn't matter what the number is, they just need to be the same
     }


    const swapNumber = parseSwapNumber(text.slice(swapStart, swapEnd), line);
    const name = parseName(text.slice(nameStart, nameEnd), line);
    const { lowerAmount, upperAmount } = parseAmount(text.slice(amountStart, amountEnd), line);
    const unit = parseUnit(text.slice(unitStart, unitEnd));

    if (percentIndex !== -1 &&
        unit === undefined) {
        throw new RecipeParseError(
            `Invalid unit name.`,
            `A present unit cannot be empty`,
            line
        )
    }

    return {
        type: "ingredient",
        swapNumber,
        name,
        lowerAmount,
        upperAmount,
        unit
    };
}

function parseSwapNumber(swapNumber: string, line: number):
    number | undefined {

    if (swapNumber === "") return undefined;

    swapNumber = swapNumber.trim();

    if (swapNumber === "") {
        throw new RecipeParseError(
            `Missing swap number.`,
            `A swap number cannot be empty, if present.`,
            line
        );
    }

    return validateNumber(swapNumber, line);
}

function parseName(name: string, line: number):
    string {

    name = name.trim()

    if (name === "") {
        throw new RecipeParseError(
            `Missing ingredient name.`,
            `An ingredient needs a name.`,
            line
        );
    }

    return name;
}

function parseAmount(amount: string, line: number):
    { lowerAmount: number | undefined, upperAmount: number | undefined } {

    amount = amount.trim()

    if (amount === "") {
        return {
            lowerAmount: undefined,
            upperAmount: undefined
        }
    }

    const amounts = amount.split("-");

    if (amounts.length > 2) {
        throw new RecipeParseError(
            `Invalid amount of ranges: ${amounts}`,
            `An ingredient can have at most two numbers in its range.`,
            line
        );
    }

    const lowerAmount = validateNumber(amounts[0], line);
    const upperAmount = amounts.length === 2
        ? validateNumber(amounts[1], line)
        : lowerAmount;

    if (lowerAmount !== undefined ||
        upperAmount !== undefined) {

        if (lowerAmount > upperAmount) {
            throw new RecipeParseError(
                `Invalid ingredient amounts: ${lowerAmount}-${upperAmount}`,
                `The lower amount cannot exceed the upper amount.`,
                line
            );
        }
    }

    return {
        lowerAmount: lowerAmount,
        upperAmount: upperAmount
    }
}

function parseUnit(unit: string):
    string | undefined {

    unit = unit.trim()

    if (unit === "") {
        return undefined;
    }

    return unit;
}
