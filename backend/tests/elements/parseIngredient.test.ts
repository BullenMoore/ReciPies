import { describe, expect, it } from "vitest";
import { parseIngredient } from "../../src/parser/elements/parseIngredient";

describe("parseIngredient - correct syntax testing", () => {

    it("ingredient without range and with unit", () => {
        const result = parseIngredient(
            "@Smör{200%g}",
            1);

        expect(result).toEqual(
            {
                type: "ingredient",
                name: "Smör",
                lowerAmount: 200,
                upperAmount: 200,
                unit: "g"
            }
        );
    });






});