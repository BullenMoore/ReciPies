import { describe, expect, it } from "vitest";
import { parseDegrees } from "../../src/parser/elements/parseDegrees";

describe("parseDegrees - correct syntax testing", () => {

    it("degrees", () => {
        const result = parseDegrees(
            "¤{200%C}",
            1
        );

        expect(result).toEqual(
            {
                type: "degrees",
                degrees: 200,
                unit: "C",
            }
        );
    });
});

describe("parseDegrees - incorrect syntax testing / error handling", () => {

    it("degrees with incorrect structure", () => {

        expect(() => parseDegrees(
            "¤{200}",
            1
        )).toThrow("Invalid degrees structure: ¤{200}");
    });

    it("degrees with incorrect number", () => {

        expect(() => parseDegrees(
            "¤{12abc34%C}",
            1
        )).toThrow("Invalid number: 12abc34");
    });

    it("degrees with missing unit", () => {

        expect(() => parseDegrees(
            "¤{200%}",
            1
        )).toThrow("Missing degrees unit.");
    });

    it("degrees with incorrect unit", () => {

        expect(() => parseDegrees(
            "¤{200%D}",
            1
        )).toThrow("Invalid degree unit: D");
    });

    it("degrees with incorrect unit structure", () => {

        expect(() => parseDegrees(
            "¤{200%CF}",
            1
        )).toThrow("Invalid unit length: CF");
    });
});