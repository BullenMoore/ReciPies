import { describe, expect, it } from "vitest";
import { parseIngredient } from "../../src/parser/elements/parseIngredient";

describe("parseIngredient - correct syntax testing", () => {

    it("ingredient without amount and unit", () => {
        const result = parseIngredient(
            "@Smör{}",
            1
        );

        expect(result).toEqual(
            {
                type: "ingredient",
                name: "Smör"
            }
        );
    });

    it("ingredient with only amount (without range)", () => {
        const result = parseIngredient(
            "@Smör{150}",
            1
        );

        expect(result).toEqual(
            {
                type: "ingredient",
                name: "Smör",
                lowerAmount: 150,
                upperAmount: 150
            }
        );
    });

    it("ingredient with only amount (with range)", () => {
        const result = parseIngredient(
            "@Smör{150-200}",
            1
        );

        expect(result).toEqual(
            {
                type: "ingredient",
                name: "Smör",
                lowerAmount: 150,
                upperAmount: 200
            }
        );
    });

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

    it("ingredient with range and unit", () => {
        const result = parseIngredient(
            "@Smör{150-200%g}",
            1
        );

        expect(result).toEqual(
            {
                type: "ingredient",
                name: "Smör",
                lowerAmount: 150,
                upperAmount: 200,
                unit: "g"
            }
        );
    });
});

describe("parseIngredient - incorrect syntax testing / error handling", () => {

    it("ingredient with incorrect numbering", () => {

        expect(() => parseIngredient(
            "@Smör{ab45c%dl}",
            1
        )).toThrow("Invalid number: ab45c");

        expect(() => parseIngredient(
            "@Smör{ab45c-abc67d%dl}",
            1
        )).toThrow("Invalid number: ab45c");

        expect(() => parseIngredient(
            "@Smör{45-abc67d%dl}",
            1
        )).toThrow("Invalid number: abc67d");
    });

    it("ingredient with incorrect range", () => {

        expect(() => parseIngredient(
            "@Smör{150-200-250%dl}",
            1
        )).toThrow("Invalid amount of ranges: 150,200,250");
    });

    it("ingredient with % but no unit name", () => {

        expect(() => parseIngredient(
            "@Smör{150%}",
            1
        )).toThrow("Invalid unit name.");
    })
});