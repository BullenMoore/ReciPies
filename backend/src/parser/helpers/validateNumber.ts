import {RecipeParseError} from "../../model/Errors.ts";

export function validateNumber(
    value: string,
    line: number
): number {

    value = value.trim()

    if (value === "") {
        throw new RecipeParseError(
            `Invalid number for number "${value}"`, //TODO: Update error text
            `wewe`,
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
