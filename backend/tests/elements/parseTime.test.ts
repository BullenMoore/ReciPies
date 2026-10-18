import { describe, expect, it } from "vitest";
import { parseTime } from "../../src/parser/elements/parseTime"

describe("parseTime - correct syntax testing", () => {

    it("time with only hour (1)", () => {
        const result = parseTime(
            "~{1}",
            1
        );

        expect(result).toEqual(
            {
                type: "time",
                minSeconds: 3600,
                maxSeconds: 3600
            }
        );
    });

    it("time with only hour (01)", () => {
        const result = parseTime(
            "~{01}",
            1
        );

        expect(result).toEqual(
            {
                type: "time",
                minSeconds: 3600,
                maxSeconds: 3600
            }
        );
    });

    it("time with hour and minutes", () => {
        const result = parseTime(
            "~{01:30}",
            1
        );

        expect(result).toEqual(
            {
                type: "time",
                minSeconds: 3600 + 30 * 60,
                maxSeconds: 3600 + 30 * 60
            }
        );
    });

    it("time with hour, minutes and seconds", () => {
        const result = parseTime(
            "~{01:30:15}",
            1
        );

        expect(result).toEqual(
            {
                type: "time",
                minSeconds: 3600 + 30 * 60 + 15,
                maxSeconds: 3600 + 30 * 60 + 15
            }
        );
    });

    it("time with range", () => {
        const result = parseTime(
            "~{00:20-01:00:15}",
            1
        );

        expect(result).toEqual(
            {
                type: "time",
                minSeconds: 20 * 60,
                maxSeconds: 3600 + 15
            }
        );
    });
});

describe("parseTime - incorrect syntax testing / error handling", () => {

    it("time with no numbering", () => {

        expect(() => parseTime(
            "~{}",
            1
        )).toThrow("Empty number.");
    });

    it("time with incorrect numbering", () => {

        expect(() => parseTime(
            "~{45tsk}",
            1
        )).toThrow("Invalid number: 45tsk");
    });

    it("time with incorrect range amount", () => {

        expect(() => parseTime(
            "~{00:20-00:30-00:40}",
            1
        )).toThrow("Invalid time range. 00:20-00:30-00:40");
    });

    it("time with incorrect range comparison", () => {

        expect(() => parseTime(
            "~{00:40-00:30}",
            1
        )).toThrow("Invalid time amounts: 2400-1800"); // 2400 sec = 40 min, 1800 sec = 30 min
    });

    it("time with incorrect structure", () => {

        expect(() => parseTime(
            "~{01:30:00:500}",
            1
        )).toThrow("Invalid time struture.");
    });

    it("time with incorrect semantics (unrealistic time)", () => {

        expect(() => parseTime(
            "~{01:60}",
            1
        )).toThrow("Semantic time error:");

        expect(() => parseTime(
            "~{100:30}",
            1
        )).toThrow("Semantic time error:");
    });
});
