import type {RecipeStep} from "../model/RecipeStep.ts";
import {parseInline} from "./parseInline.ts";

export function parseStep (text: string): RecipeStep[] {

    // The text provided is only the section that the steps exist within. Position 0 is thus the beginning of the section

    let steps: RecipeStep[] = [];
    let position = 0;

    while (position < text.length) {
        const newlinePosition = text.indexOf("\n", position);

        // If there is no more newline, this is the final line
        const endPosition =
            newlinePosition === -1
                ? text.length
                : newlinePosition;

        const line = text.slice(position, endPosition);

        const content = parseInline(line);

        if (content.length > 0) {
            const step: RecipeStep = {
                content
            };

            steps.push(step);
        }

        // Move past the newline
        position = newlinePosition === -1
            ? text.length
            : newlinePosition + 1;
    }

    return steps
}