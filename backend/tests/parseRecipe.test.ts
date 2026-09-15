import { describe, expect, it } from "vitest";
import {parseRecipe} from "../src/parser/parseRecipe";

describe("parseRecipe", () => {

    it("metadata is properly structured", () => {
        const result = parseRecipe(
            "---\n" +
            "title: Kärleksmums\n" +
            "description: Kärleksmums, Snoddas, Kramforskaka, Mumsingar. Ja, kärt barn har många namn. Ett gott och enkelt recept för saftig kaka och generöst med glasyr. \n" +
            "source.url: https://fridasbakblogg.se/2018/04/03/karleksmums-recept-med-extra-glasyr/\n" +
            "servings: 20\n" +
            "time.prep: 15 minuter\n" +
            "time.cook: 20 minuter\n" +
            "#cuisine: If applicable\n" +
            "#diet: If applicable\n" +
            "tags: []\n" +
            "---\n" +
            "\n" +
            "= Botten\n" +
            "\n" +
            "Börja med att sätta ugnen på 175°C och klä en #form 30×40 cm{} med #bakplåtspapper."
        , true);

        expect(result).toEqual(
            {
                "category": undefined,
                "cuisine": undefined,
                "description": "Kärleksmums, Snoddas, Kramforskaka, Mumsingar. Ja, kärt barn har många namn. Ett gott och enkelt recept för saftig kaka och generöst med glasyr.",
                "diet": undefined,
                "difficulty": undefined,
                "image": undefined,
                "locale": undefined,
                "sections": [],
                "servings": 20,
                "source": {
                    "url": "https://fridasbakblogg.se/2018/04/03/karleksmums-recept-med-extra-glasyr/",
                },
                "tags": [],
                "time": {
                    "cook": "20 minuter",
                    "prep": "15 minuter",
                },
                "title": "Kärleksmums",
        });
    });
});