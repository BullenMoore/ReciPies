import { describe, expect, it } from "vitest";
import { parseDegrees } from "../../src/parser/elements/parseDegrees";

describe("parseDegrees - correct syntax testing", () => {

    it("", () => {
        const result = parseDegrees(
            "",
            1);

        expect(result).toEqual(
            {
                type: "degrees",
                name:
            }
        );
    });






});