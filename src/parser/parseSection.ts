import type {RecipeSection} from "../model/RecipeSection.ts";
import {parseStep} from "./parseStep.ts";

export function parseSection (text: string): RecipeSection[] {

    // The text provided is the entire recipe except the metadata, including the =Section part

    let sections: RecipeSection[] = [];
    let position = 0;

    let sectionTitle = "";

    while (position < text.length) {

        // Finding the title of the section, if it exists
        const titleStart = text.indexOf("=", position);
        let titleEnd = text.indexOf("\n", position);

        // Check if there even is a section starter
        if (titleStart !== -1) {
            // If, for some reason, there is a section title but no section steps
            titleEnd =
                titleEnd === -1
                    ? text.length
                    : titleEnd;

            sectionTitle = text.slice(titleStart + 1, titleEnd).trim();
        }


        // Finding the steps in the section
        const sectionStart =
            titleEnd === -1
                ? position
                : titleEnd + 1;

        // Find section end
        let sectionEnd = text.indexOf("=", sectionStart);

        sectionEnd =
            sectionEnd === -1
                ? text.length
                : sectionEnd;

        const sectionText = text.slice(sectionStart, sectionEnd);

        const section: RecipeSection = {
            title : sectionTitle === "" ? undefined : sectionTitle,
            steps : parseStep(sectionText)
        };

        sections.push(section);

        // Update the postition to be after the previous sectionEnd
        position = sectionEnd;
        sectionTitle = "";

    }
    return sections;
}