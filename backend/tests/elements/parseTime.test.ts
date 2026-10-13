import { describe, expect, it } from "vitest";
import { parseTime } from "../../src/parser/elements/parseTime";

describe("parseTime - correct syntax testing", () => {

    it("", () => {
        const result = parseTime(
            "",
            1);

        expect(result).toEqual(
            {
                type: "time",
                name:
            }
        );
    });






});