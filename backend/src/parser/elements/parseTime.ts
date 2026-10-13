import type { TimeElement } from "../../model/RecipeElements.ts";
import { RecipeParseError } from "../../model/Errors.ts";
import { validateNumber } from "../helpers/validateNumber.ts";

export function parseTime(
    text: string,
    line: number
): TimeElement
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

    const timeStart = openBracket + 1;
    const timeEnd = closeBracket;

    const time = text.slice(timeStart, timeEnd);

    const timeSections = time.split("-");
    if (timeSections.length > 2) {
        throw new RecipeParseError(
            `Invalid time range. ${time}`,
            `A time can have at most one range.`,
            line
        );
    }

    const minSeconds = parseTimeSection(timeSections[0], line);
    const maxSeconds = timeSections.length === 2
        ? parseTimeSection(timeSections[1], line)
        : minSeconds

    if (minSeconds > maxSeconds) {
        throw new RecipeParseError(
            `Invalid ingredient amounts: ${minSeconds}-${maxSeconds}`,
            `The lower amount cannot exceed the upper amount.`,
            line
        );
    }

    return {
        type: "time",
        minSeconds,
        maxSeconds
    };
}

function parseTimeSection(time: string, line: number):
    number {

    const timeArray = [0, 0, 0];
    const somethings = time.split(":");

    if (somethings.length > 2) {
        throw new RecipeParseError(
            `Invalid time struture.`, //TODO: Add why?
            "The time format cannot be longer than HH:MM:SS.",
            line
        )
    }

    for (let i = 0; i < somethings.length; i++) {
        timeArray[i] = validateNumber(somethings[i], line);
    }

    if (timeArray[0] < 0 || timeArray[0] > 99 ||
        timeArray[1] < 0 || timeArray[1] > 59 ||
        timeArray[2] < 0 || timeArray[2] > 59) {
        // Time doesn't make sense
        throw new RecipeParseError(
            `Semantic time error: ${timeArray[0]}:${timeArray[1]}:${timeArray[2]}`,
            "Time needs to be realistic. Minutes and seconds cannot be bigger than 59, hours cannot be bigger than 99 and numbers cannot be negative.",
            line
        )
    }

    return timeArray[0] * 60 * 60 + timeArray[1] * 60 + timeArray[2]
}
