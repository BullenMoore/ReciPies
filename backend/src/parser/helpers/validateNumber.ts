import {RecipeParseError} from "../../model/Errors.ts";

export function validateNumber(
    value: string,
    line: number
): number {

    value = value.trim()

    if (value === "") {
        throw new RecipeParseError(
            `Empty number.`, //TODO: Update error text
            `A number cannot be empty.`,
            line
        )
    }

    const number = +value;

    if (!Number.isFinite(number)) {
        throw new RecipeParseError(
            `Invalid number: ${value}`,
            "The value must be a valid number.",
            line
        );
    }

    if (number < 0) {
        throw new RecipeParseError(
            `Negative number: ${value}`,
            "The value cannot be negative.",
            line
        );
    }

    return number
}
