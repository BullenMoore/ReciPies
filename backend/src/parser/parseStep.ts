import type { RecipeStep } from "../model/RecipeStep.ts";
import { parseLine } from "./parseLine.ts";

export function parseStep (step: string, line: number):
    { steps: RecipeStep[], newLine: number } {

    // The text provided is only the section that the steps exist within. Position 0 is thus the beginning of the section

    let steps: RecipeStep[] = [];
    let position = 0;

    while (position < step.length) {
        const newlinePosition = step.indexOf("\n", position);
        line++;

        // If there is no more newline, this is the final line
        const endPosition =
            newlinePosition === -1
                ? step.length
                : newlinePosition;

        const text = step.slice(position, endPosition);

        const content = parseLine(text, line);

        if (content.length > 0) {
            const step: RecipeStep = {
                content
            };
            steps.push(step);
        }

        // Move past the newline
        position = newlinePosition === -1
            ? endPosition
            : newlinePosition + 1;
    }

    return {
        steps: steps,
        newLine: line
    };
}
